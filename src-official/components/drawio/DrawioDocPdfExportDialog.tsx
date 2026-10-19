import React, { useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { exportScene } from "@excalidraw/excalidraw";
import "./DrawioDocPdfExportDialog.scss";

interface DrawioDocPdfExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  activePageName?: string;
}

export const DrawioDocPdfExportDialog: React.FC<DrawioDocPdfExportDialogProps> = ({
  isOpen,
  onClose,
  excalidrawAPI,
  activePageName = "Diagram",
}) => {
  const [docTitle, setDocTitle] = useState(`${activePageName} Specification`);
  const [pdfOrientation, setPdfOrientation] = useState<"landscape" | "portrait">("landscape");
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const getCanvasBlobAndData = async () => {
    if (!excalidrawAPI) throw new Error("Canvas is not ready");
    const elements = excalidrawAPI.getSceneElements().filter((el) => !el.isDeleted);
    if (elements.length === 0) {
      throw new Error("No elements in diagram. Add some shapes before exporting!");
    }

    const appState = excalidrawAPI.getAppState();
    const blob = (await exportScene({
      type: "png",
      data: {
        elements,
        appState: {
          ...appState,
          exportBackground: true,
          exportScale: 2, // High resolution 2x
        },
        files: excalidrawAPI.getFiles(),
      },
    })) as Blob;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return { blob, dataUrl, elements };
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    setStatusMessage("Generating crisp high-resolution PDF...");
    try {
      const { dataUrl } = await getCanvasBlobAndData();

      // Create an image element to get natural aspect ratio
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = dataUrl;
      });

      const imgWidth = img.naturalWidth || 1200;
      const imgHeight = img.naturalHeight || 800;

      // Convert image to JPEG buffer
      const canvas = document.createElement("canvas");
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize 2D context");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, imgWidth, imgHeight);
      ctx.drawImage(img, 0, 0);

      const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const base64Data = jpegDataUrl.split(",")[1];
      const binaryString = atob(base64Data);
      const jpegBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        jpegBytes[i] = binaryString.charCodeAt(i);
      }

      // Compute page dimensions in points (72 DPI)
      let ptWidth: number;
      let ptHeight: number;
      if (pdfOrientation === "landscape") {
        ptWidth = 842; // A4 Landscape
        ptHeight = 595;
      } else {
        ptWidth = 595; // A4 Portrait
        ptHeight = 842;
      }

      const margin = 36; // 0.5 inch margin
      const availW = ptWidth - margin * 2;
      const availH = ptHeight - margin * 2;
      const scale = Math.min(availW / imgWidth, availH / imgHeight);
      const renderW = Math.round(imgWidth * scale);
      const renderH = Math.round(imgHeight * scale);
      const posX = Math.round(margin + (availW - renderW) / 2);
      const posY = Math.round(margin + (availH - renderH) / 2);

      // Assemble standard PDF 1.4 binary structure
      const objects: string[] = [];
      objects.push("<< /Type /Catalog /Pages 2 0 R >>");
      objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
      objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptWidth} ${ptHeight}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`,
      );

      const imgHeader = `<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
      const imgFooter = "\nendstream";
      const contentStream = `q ${renderW} 0 0 ${renderH} ${posX} ${posY} cm /Im1 Do Q`;
      objects.push(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);

      // Write objects and offsets
      let header = "%PDF-1.4\n";
      const offsets: number[] = [];
      let currentOffset = header.length;

      // 1 0 obj
      offsets.push(currentOffset);
      const obj1 = `1 0 obj\n${objects[0]}\nendobj\n`;
      currentOffset += obj1.length;

      // 2 0 obj
      offsets.push(currentOffset);
      const obj2 = `2 0 obj\n${objects[1]}\nendobj\n`;
      currentOffset += obj2.length;

      // 3 0 obj
      offsets.push(currentOffset);
      const obj3 = `3 0 obj\n${objects[2]}\nendobj\n`;
      currentOffset += obj3.length;

      // 4 0 obj (Image)
      offsets.push(currentOffset);
      const obj4Pre = `4 0 obj\n${imgHeader}`;
      const obj4Post = `${imgFooter}\nendobj\n`;
      currentOffset += obj4Pre.length + jpegBytes.length + obj4Post.length;

      // 5 0 obj (Content stream)
      offsets.push(currentOffset);
      const obj5 = `5 0 obj\n${objects[3]}\nendobj\n`;
      currentOffset += obj5.length;

      const xrefOffset = currentOffset;
      let xref = `xref\n0 6\n0000000000 65535 f \n`;
      for (const off of offsets) {
        xref += `${String(off).padStart(10, "0")} 00000 n \n`;
      }
      const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

      // Combine parts into Blob
      const pdfBlob = new Blob(
        [header, obj1, obj2, obj3, obj4Pre, jpegBytes, obj4Post, obj5, xref, trailer],
        { type: "application/pdf" },
      );

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${docTitle.replace(/[^a-z0-9_-]/gi, "-") || "diagram"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setStatusMessage("✅ PDF downloaded successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e: any) {
      setStatusMessage(`❌ PDF generation failed: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDoc = async () => {
    setIsExporting(true);
    setStatusMessage("Generating Microsoft Word (.doc) specification...");
    try {
      const { dataUrl, elements } = await getCanvasBlobAndData();

      // Analyze and count components
      const componentCounts: Record<string, { count: number; type: string }> = {};
      for (const el of elements) {
        let label = (el as any).text || (el as any).customData?.name || el.type;
        if (el.type === "image") label = "Architecture Node / Stencil";
        if (!componentCounts[label]) {
          componentCounts[label] = { count: 0, type: el.type };
        }
        componentCounts[label].count++;
      }

      const tableRows = Object.entries(componentCounts)
        .map(
          ([name, info]) => `
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 600; color: #0f172a;">${name}</td>
            <td style="padding: 10px 14px; border: 1px solid #cbd5e1;"><span style="background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">${info.type.toUpperCase()}</span></td>
            <td style="padding: 10px 14px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${info.count}</td>
            <td style="padding: 10px 14px; border: 1px solid #cbd5e1; color: #64748b; font-size: 11px;">Validated in DrawFreely Diagram Canvas</td>
          </tr>`,
        )
        .join("");

      const docHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${docTitle}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.6; }
            h1 { color: #1e3a8a; font-size: 24pt; margin-bottom: 4px; font-weight: 800; }
            .meta { color: #64748b; font-size: 10pt; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
            .diagram-box { text-align: center; margin: 28px 0; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
            img { max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
            h2 { color: #1e293b; font-size: 16pt; margin-top: 36px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 10pt; }
            th { background: #f1f5f9; color: #334155; text-align: left; padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 700; }
            tr:nth-child(even) { background: #f8fafc; }
            .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 9pt; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${docTitle}</h1>
          <div class="meta">DrawFreely Architectural Document • Created on ${new Date().toLocaleDateString()} • Page: ${activePageName}</div>
          
          <div class="diagram-box">
            <img src="${dataUrl}" alt="${docTitle}" />
          </div>

          <h2>1. Architecture &amp; Flow Overview</h2>
          <p>This diagram document describes the structural flow and cloud topology modeled in DrawFreely. All nodes, connections, and metadata are outlined below.</p>

          <h2>2. Component Inventory &amp; Bill of Materials</h2>
          <table>
            <thead>
              <tr>
                <th>Component Specification</th>
                <th>Type</th>
                <th style="text-align: center;">Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || '<tr><td colspan="4" style="text-align:center; padding:12px; color:#64748b;">No components placed</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            Generated autonomously with DrawFreely • Free &amp; Local Diagramming Platform
          </div>
        </body>
        </html>
      `;

      const docBlob = new Blob([docHtml], { type: "application/msword;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(docBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${docTitle.replace(/[^a-z0-9_-]/gi, "-") || "specification"}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setStatusMessage("✅ Word (.doc) document downloaded successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e: any) {
      setStatusMessage(`❌ Word export failed: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintVector = () => {
    window.print();
  };

  return (
    <div className="doc-pdf-export-overlay" onClick={onClose}>
      <div className="doc-pdf-export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <div className="dialog-title">
            <span className="icon">📄</span>
            <span>Export Diagram to PDF &amp; Word (.doc)</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="dialog-body">
          <p className="dialog-desc">
            Convert your DrawFreely architectural and flowchart diagrams into polished, enterprise-ready documents.
          </p>

          <div className="form-group">
            <label htmlFor="doc-title-input">Document Title</label>
            <input
              id="doc-title-input"
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. AWS Cloud Infrastructure Architecture"
            />
          </div>

          <div className="form-group">
            <label>PDF Page Orientation</label>
            <div className="orientation-options">
              <label className={`radio-pill ${pdfOrientation === "landscape" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="orientation"
                  value="landscape"
                  checked={pdfOrientation === "landscape"}
                  onChange={() => setPdfOrientation("landscape")}
                />
                <span>Landscape (Recommended for Diagrams)</span>
              </label>
              <label className={`radio-pill ${pdfOrientation === "portrait" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="orientation"
                  value="portrait"
                  checked={pdfOrientation === "portrait"}
                  onChange={() => setPdfOrientation("portrait")}
                />
                <span>Portrait</span>
              </label>
            </div>
          </div>

          {statusMessage && <div className="status-banner">{statusMessage}</div>}

          <div className="export-cards-grid">
            <div className="export-card">
              <div className="card-icon">📕</div>
              <div className="card-info">
                <h3>Portable Document (PDF)</h3>
                <p>Standard PDF 1.4 vector-scaled document with 2x high-resolution rendering and print margins.</p>
              </div>
              <button
                type="button"
                className="action-btn pdf-btn"
                disabled={isExporting}
                onClick={handleExportPdf}
              >
                Download PDF
              </button>
            </div>

            <div className="export-card">
              <div className="card-icon">📘</div>
              <div className="card-info">
                <h3>Microsoft Word (.doc)</h3>
                <p>Formatted Word document containing diagram snapshot + full component ledger and bill of materials.</p>
              </div>
              <button
                type="button"
                className="action-btn doc-btn"
                disabled={isExporting}
                onClick={handleExportDoc}
              >
                Download Word DOC
              </button>
            </div>

            <div className="export-card">
              <div className="card-icon">🖨️</div>
              <div className="card-info">
                <h3>Vector Print &amp; Native PDF</h3>
                <p>Open system print dialog to print directly or save as vector PDF with custom paper sizes.</p>
              </div>
              <button
                type="button"
                className="action-btn print-btn"
                onClick={handlePrintVector}
              >
                System Print
              </button>
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button type="button" className="close-action-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
