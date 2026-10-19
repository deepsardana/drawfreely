import React, { useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { newElement, newTextElement, newLinearElement } from "@excalidraw/element";
import { randomId } from "@excalidraw/common";
import "./DrawioTemplatesDialog.scss";

interface DrawioTemplatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  onLoadTemplateToNewPage?: (templateName: string, elements: readonly any[]) => void;
}

export interface DiagramTemplateDef {
  id: string;
  title: string;
  category: "cloud" | "k8s" | "flowchart" | "network" | "devops";
  badge: string;
  description: string;
  icon: string;
  buildElements: () => any[];
}

export const TEMPLATES: DiagramTemplateDef[] = [
  {
    id: "aws-3tier",
    title: "AWS 3-Tier Enterprise Architecture",
    category: "cloud",
    badge: "AWS Production",
    icon: "☁️",
    description: "Production-ready AWS architecture with VPC, Internet Gateway, ALB, Auto-scaling EC2 web/app tiers, and Multi-AZ RDS Aurora database.",
    buildElements: () => {
      const els: any[] = [];
      const createBox = (x: number, y: number, w: number, h: number, text: string, bg: string, stroke: string) => {
        const box = newElement({
          type: "rectangle",
          x,
          y,
          width: w,
          height: h,
          backgroundColor: bg,
          strokeColor: stroke,
          strokeWidth: 2,
          roughness: 0,
          fillStyle: "solid",
          roundness: { type: 3 },
        });
        const txt = newTextElement({
          text,
          x: x + 12,
          y: y + h / 2 - 8,
          fontSize: 14,
          fontFamily: 2,
          textAlign: "center",
          verticalAlign: "middle",
          strokeColor: "#0f172a",
        });
        els.push(box, txt);
      };

      const createArrow = (startX: number, startY: number, endX: number, endY: number) => {
        const arrow = newLinearElement({
          type: "arrow",
          x: startX,
          y: startY,
          width: endX - startX,
          height: endY - startY,
          points: [[0, 0], [endX - startX, endY - startY]] as any,
          strokeColor: "#64748b",
          strokeWidth: 2,
          roughness: 0,
          endArrowhead: "arrow",
        } as any);
        els.push(arrow);
      };

      // VPC Container
      els.push(
        newElement({
          type: "rectangle",
          x: 60,
          y: 40,
          width: 860,
          height: 480,
          backgroundColor: "#f8fafc",
          strokeColor: "#8c4fff",
          strokeWidth: 2,
          strokeStyle: "dashed",
          roughness: 0,
          roundness: { type: 3 },
        }),
        newTextElement({
          text: "AWS VPC (10.0.0.0/16) - Production Multi-AZ",
          x: 80,
          y: 56,
          fontSize: 16,
          fontFamily: 2,
          strokeColor: "#8c4fff",
        })
      );

      // Public Subnet
      els.push(
        newElement({
          type: "rectangle",
          x: 100,
          y: 100,
          width: 780,
          height: 100,
          backgroundColor: "#f1f5f9",
          strokeColor: "#cbd5e1",
          strokeWidth: 1.5,
          roughness: 0,
        }),
        newTextElement({
          text: "Public Subnet (DMZ / Ingress Tier)",
          x: 110,
          y: 108,
          fontSize: 12,
          fontFamily: 2,
          strokeColor: "#475569",
        })
      );

      createBox(130, 130, 160, 50, "Route 53 DNS", "#edeefc", "#6965db");
      createBox(350, 130, 180, 50, "Internet Gateway", "#e0f2fe", "#0284c7");
      createBox(590, 130, 240, 50, "Application Load Balancer", "#ffedd5", "#ea580c");

      createArrow(290, 155, 350, 155);
      createArrow(530, 155, 590, 155);

      // Application Subnet
      els.push(
        newElement({
          type: "rectangle",
          x: 100,
          y: 220,
          width: 780,
          height: 120,
          backgroundColor: "#f8fafc",
          strokeColor: "#cbd5e1",
          strokeWidth: 1.5,
          roughness: 0,
        }),
        newTextElement({
          text: "Private App Subnet (Compute Tier - Auto Scaling Group)",
          x: 110,
          y: 228,
          fontSize: 12,
          fontFamily: 2,
          strokeColor: "#475569",
        })
      );

      createBox(140, 260, 190, 54, "EC2 Web Instance AZ-1", "#fef3c7", "#d97706");
      createBox(390, 260, 190, 54, "EC2 Web Instance AZ-2", "#fef3c7", "#d97706");
      createBox(640, 260, 200, 54, "AWS Lambda Serverless", "#fee2e2", "#dc2626");

      createArrow(710, 180, 235, 260);
      createArrow(710, 180, 485, 260);
      createArrow(710, 180, 740, 260);

      // Database Subnet
      els.push(
        newElement({
          type: "rectangle",
          x: 100,
          y: 360,
          width: 780,
          height: 130,
          backgroundColor: "#f1f5f9",
          strokeColor: "#cbd5e1",
          strokeWidth: 1.5,
          roughness: 0,
        }),
        newTextElement({
          text: "Isolated Database Subnet (Storage Tier)",
          x: 110,
          y: 368,
          fontSize: 12,
          fontFamily: 2,
          strokeColor: "#475569",
        })
      );

      createBox(140, 410, 200, 54, "RDS Aurora Primary (RW)", "#dbeafe", "#2563eb");
      createBox(390, 410, 200, 54, "RDS Aurora Replica (RO)", "#dbeafe", "#2563eb");
      createBox(640, 410, 200, 54, "Amazon S3 Assets Bucket", "#dcfce7", "#16a34a");

      createArrow(235, 314, 240, 410);
      createArrow(485, 314, 490, 410);
      createArrow(740, 314, 740, 410);

      return els;
    },
  },
  {
    id: "k8s-ingress",
    title: "Kubernetes Production Microservices",
    category: "k8s",
    badge: "Cloud Native",
    icon: "☸️",
    description: "CNCF Kubernetes architecture showing Ingress Controller, Frontend Deployment, API Gateway, Microservice Pods, Redis Cache, and Stateful DB.",
    buildElements: () => {
      const els: any[] = [];
      const createBox = (x: number, y: number, w: number, h: number, text: string, bg: string, stroke: string) => {
        els.push(
          newElement({
            type: "rectangle",
            x,
            y,
            width: w,
            height: h,
            backgroundColor: bg,
            strokeColor: stroke,
            strokeWidth: 2,
            roughness: 0,
            roundness: { type: 3 },
          }),
          newTextElement({
            text,
            x: x + 10,
            y: y + h / 2 - 8,
            fontSize: 13,
            fontFamily: 2,
            textAlign: "center",
            verticalAlign: "middle",
            strokeColor: "#0f172a",
          })
        );
      };

      const createArrow = (startX: number, startY: number, endX: number, endY: number) => {
        els.push(
          newLinearElement({
            type: "arrow",
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            points: [[0, 0], [endX - startX, endY - startY]] as any,
            strokeColor: "#475569",
            strokeWidth: 2,
            roughness: 0,
            endArrowhead: "arrow",
          } as any)
        );
      };

      createBox(60, 160, 160, 50, "Client Traffic (HTTPS)", "#f1f5f9", "#64748b");
      createBox(270, 160, 180, 50, "NGINX Ingress Controller", "#e0e7ff", "#4338ca");
      createArrow(220, 185, 270, 185);

      createBox(500, 80, 170, 48, "Frontend React Pods (x3)", "#dbeafe", "#1d4ed8");
      createBox(500, 160, 170, 48, "API Gateway / Service", "#fae8ff", "#a21caf");
      createBox(500, 240, 170, 48, "Auth & Identity Pods", "#ffedd5", "#c2410c");

      createArrow(450, 185, 500, 104);
      createArrow(450, 185, 500, 184);
      createArrow(450, 185, 500, 264);

      createBox(730, 110, 160, 48, "Order Service Pods", "#dcfce7", "#15803d");
      createBox(730, 210, 160, 48, "Payment Service Pods", "#fef3c7", "#b45309");

      createArrow(670, 184, 730, 134);
      createArrow(670, 184, 730, 234);

      createBox(940, 110, 150, 48, "Redis In-Memory Cache", "#fee2e2", "#b91c1c");
      createBox(940, 210, 150, 48, "PostgreSQL StatefulSet", "#ede9fe", "#6d28d9");

      createArrow(890, 134, 940, 134);
      createArrow(890, 234, 940, 234);

      return els;
    },
  },
  {
    id: "oauth-flow",
    title: "User Authentication & OAuth 2.0 Flowchart",
    category: "flowchart",
    badge: "Flowchart",
    icon: "📊",
    description: "Standard authentication flowchart showing user login request, credential verification, JWT token issuance, and protected API access.",
    buildElements: () => {
      const els: any[] = [];
      const createStep = (x: number, y: number, w: number, h: number, text: string, type: "rectangle" | "diamond" | "ellipse", bg: string, stroke: string) => {
        els.push(
          newElement({
            type,
            x,
            y,
            width: w,
            height: h,
            backgroundColor: bg,
            strokeColor: stroke,
            strokeWidth: 2,
            roughness: 0,
            roundness: type === "rectangle" ? { type: 3 } : null,
          }),
          newTextElement({
            text,
            x: x + 10,
            y: y + h / 2 - 8,
            fontSize: 13,
            fontFamily: 2,
            textAlign: "center",
            verticalAlign: "middle",
            strokeColor: "#0f172a",
          })
        );
      };

      const createArrow = (startX: number, startY: number, endX: number, endY: number, label?: string) => {
        els.push(
          newLinearElement({
            type: "arrow",
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            points: [[0, 0], [endX - startX, endY - startY]] as any,
            strokeColor: "#334155",
            strokeWidth: 2,
            roughness: 0,
            endArrowhead: "arrow",
          } as any)
        );
        if (label) {
          els.push(
            newTextElement({
              text: label,
              x: startX + (endX - startX) / 2 + 6,
              y: startY + (endY - startY) / 2 - 12,
              fontSize: 12,
              fontFamily: 2,
              strokeColor: "#64748b",
            })
          );
        }
      };

      createStep(380, 40, 160, 44, "User Requests Login", "ellipse", "#e0f2fe", "#0369a1");
      createStep(370, 120, 180, 50, "Submit Credentials", "rectangle", "#f1f5f9", "#475569");
      createArrow(460, 84, 460, 120);

      createStep(350, 205, 220, 70, "Valid Credentials?", "diamond", "#fef3c7", "#b45309");
      createArrow(460, 170, 460, 205);

      createStep(650, 215, 170, 50, "Return 401 Unauthorized", "rectangle", "#fee2e2", "#dc2626");
      createArrow(570, 240, 650, 240, "No");

      createStep(360, 315, 200, 50, "Generate JWT Access Token", "rectangle", "#ede9fe", "#7c3aed");
      createArrow(460, 275, 460, 315, "Yes");

      createStep(360, 400, 200, 50, "Access Protected API", "rectangle", "#dcfce7", "#15803d");
      createArrow(460, 365, 460, 400);

      createStep(380, 485, 160, 44, "Session Established", "ellipse", "#e0f2fe", "#0369a1");
      createArrow(460, 450, 460, 485);

      return els;
    },
  },
  {
    id: "gcp-serverless",
    title: "GCP Event-Driven Serverless Pipeline",
    category: "cloud",
    badge: "Google Cloud",
    icon: "🌐",
    description: "Google Cloud architecture showing Cloud Storage upload trigger, EventArc, Cloud Functions processing, Pub/Sub, and BigQuery analytics data warehouse.",
    buildElements: () => {
      const els: any[] = [];
      const createBox = (x: number, y: number, w: number, h: number, text: string, bg: string, stroke: string) => {
        els.push(
          newElement({
            type: "rectangle",
            x,
            y,
            width: w,
            height: h,
            backgroundColor: bg,
            strokeColor: stroke,
            strokeWidth: 2,
            roughness: 0,
            roundness: { type: 3 },
          }),
          newTextElement({
            text,
            x: x + 10,
            y: y + h / 2 - 8,
            fontSize: 13,
            fontFamily: 2,
            textAlign: "center",
            verticalAlign: "middle",
            strokeColor: "#0f172a",
          })
        );
      };

      const createArrow = (startX: number, startY: number, endX: number, endY: number) => {
        els.push(
          newLinearElement({
            type: "arrow",
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            points: [[0, 0], [endX - startX, endY - startY]] as any,
            strokeColor: "#4285F4",
            strokeWidth: 2,
            roughness: 0,
            endArrowhead: "arrow",
          } as any)
        );
      };

      createBox(60, 160, 170, 54, "User Raw Data Upload", "#f8fafc", "#64748b");
      createBox(270, 160, 180, 54, "GCP Cloud Storage Bucket", "#e8f0fe", "#4285f4");
      createArrow(230, 187, 270, 187);

      createBox(490, 160, 170, 54, "Eventarc Event Trigger", "#fef3c7", "#f59e0b");
      createArrow(450, 187, 490, 187);

      createBox(700, 100, 180, 54, "Cloud Functions (Extract)", "#fee2e2", "#ef4444");
      createBox(700, 220, 180, 54, "Cloud Run (Transform)", "#dbeafe", "#3b82f6");
      createArrow(660, 187, 700, 127);
      createArrow(660, 187, 700, 247);

      createBox(920, 160, 180, 54, "Cloud Pub/Sub Message Bus", "#ede9fe", "#8b5cf6");
      createArrow(880, 127, 920, 187);
      createArrow(880, 247, 920, 187);

      createBox(1140, 160, 190, 54, "GCP BigQuery Data Warehouse", "#dcfce7", "#10b981");
      createArrow(1100, 187, 1140, 187);

      return els;
    },
  },
  {
    id: "azure-hubspoke",
    title: "Azure Enterprise Hub-and-Spoke Network",
    category: "cloud",
    badge: "Microsoft Azure",
    icon: "🔷",
    description: "Enterprise Azure landing zone topology with Central Hub VNet, Azure Firewall, VPN Gateway, and isolated Spoke VNets for workload tiers.",
    buildElements: () => {
      const els: any[] = [];
      const createBox = (x: number, y: number, w: number, h: number, text: string, bg: string, stroke: string) => {
        els.push(
          newElement({
            type: "rectangle",
            x,
            y,
            width: w,
            height: h,
            backgroundColor: bg,
            strokeColor: stroke,
            strokeWidth: 2,
            roughness: 0,
            roundness: { type: 3 },
          }),
          newTextElement({
            text,
            x: x + 10,
            y: y + h / 2 - 8,
            fontSize: 13,
            fontFamily: 2,
            textAlign: "center",
            verticalAlign: "middle",
            strokeColor: "#0f172a",
          })
        );
      };

      const createArrow = (startX: number, startY: number, endX: number, endY: number) => {
        els.push(
          newLinearElement({
            type: "arrow",
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            points: [[0, 0], [endX - startX, endY - startY]] as any,
            strokeColor: "#0078d4",
            strokeWidth: 2,
            roughness: 0,
            endArrowhead: "arrow",
          } as any)
        );
      };

      createBox(60, 180, 170, 54, "On-Premises Datacenter", "#f1f5f9", "#64748b");
      createBox(280, 180, 180, 54, "Azure ExpressRoute / VPN", "#e0f2fe", "#0284c7");
      createArrow(230, 207, 280, 207);

      createBox(510, 180, 200, 54, "Central Hub VNet (Firewall)", "#fee2e2", "#dc2626");
      createArrow(460, 207, 510, 207);

      createBox(760, 100, 220, 54, "Spoke 1: AKS Container Services", "#dbeafe", "#2563eb");
      createBox(760, 260, 220, 54, "Spoke 2: Database & Key Vault", "#ede9fe", "#7c3aed");

      createArrow(710, 207, 760, 127);
      createArrow(710, 207, 760, 287);

      return els;
    },
  },
  {
    id: "gitops-pipeline",
    title: "GitOps CI/CD Deployment Pipeline",
    category: "devops",
    badge: "DevOps & CI/CD",
    icon: "🚀",
    description: "End-to-end continuous delivery pipeline: Git push, automated CI testing, image build, container registry, ArgoCD sync, and cluster rollout.",
    buildElements: () => {
      const els: any[] = [];
      const createBox = (x: number, y: number, w: number, h: number, text: string, bg: string, stroke: string) => {
        els.push(
          newElement({
            type: "rectangle",
            x,
            y,
            width: w,
            height: h,
            backgroundColor: bg,
            strokeColor: stroke,
            strokeWidth: 2,
            roughness: 0,
            roundness: { type: 3 },
          }),
          newTextElement({
            text,
            x: x + 10,
            y: y + h / 2 - 8,
            fontSize: 13,
            fontFamily: 2,
            textAlign: "center",
            verticalAlign: "middle",
            strokeColor: "#0f172a",
          })
        );
      };

      const createArrow = (startX: number, startY: number, endX: number, endY: number) => {
        els.push(
          newLinearElement({
            type: "arrow",
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            points: [[0, 0], [endX - startX, endY - startY]] as any,
            strokeColor: "#2563eb",
            strokeWidth: 2,
            roughness: 0,
            endArrowhead: "arrow",
          } as any)
        );
      };

      createBox(60, 140, 150, 50, "Developer Git Commit", "#f1f5f9", "#475569");
      createBox(250, 140, 170, 50, "GitHub Actions / CI", "#e0e7ff", "#4338ca");
      createArrow(210, 165, 250, 165);

      createBox(460, 140, 180, 50, "Unit Tests & Vulnerability Scan", "#dcfce7", "#16a34a");
      createArrow(420, 165, 460, 165);

      createBox(680, 140, 170, 50, "Docker Container Registry", "#dbeafe", "#0284c7");
      createArrow(640, 165, 680, 165);

      createBox(890, 140, 170, 50, "ArgoCD GitOps Sync", "#ffedd5", "#ea580c");
      createArrow(850, 165, 890, 165);

      createBox(1100, 140, 180, 50, "Production K8s Cluster", "#fef3c7", "#ca8a04");
      createArrow(1060, 165, 1100, 165);

      return els;
    },
  },
];

export const DrawioTemplatesDialog: React.FC<DrawioTemplatesDialogProps> = ({
  isOpen,
  onClose,
  excalidrawAPI,
  onLoadTemplateToNewPage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!isOpen) return null;

  const filteredTemplates = TEMPLATES.filter(
    (t) => selectedCategory === "all" || t.category === selectedCategory,
  );

  const handleApplyTemplate = (template: DiagramTemplateDef, asNewPage: boolean) => {
    const elements = template.buildElements();

    if (asNewPage && onLoadTemplateToNewPage) {
      onLoadTemplateToNewPage(template.title, elements);
      onClose();
      return;
    }

    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements,
        appState: {
          zoom: { value: 0.95 } as any,
          scrollX: 40,
          scrollY: 40,
        },
      });
      onClose();
    }
  };

  return (
    <div className="templates-dialog-overlay" onClick={onClose}>
      <div className="templates-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <div className="dialog-title">
            <span className="icon">📋</span>
            <span>Diagram &amp; Architecture Templates</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="dialog-categories">
          {["all", "cloud", "k8s", "flowchart", "devops"].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill ${selectedCategory === cat ? "is-active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all"
                ? "All Templates"
                : cat === "cloud"
                ? "Cloud Architecture"
                : cat === "k8s"
                ? "Kubernetes"
                : cat === "flowchart"
                ? "Flowcharts"
                : "DevOps & CI/CD"}
            </button>
          ))}
        </div>

        <div className="dialog-body">
          <div className="templates-grid">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="template-card">
                <div className="card-top">
                  <span className="card-icon">{template.icon}</span>
                  <span className="card-badge">{template.badge}</span>
                </div>
                <h3 className="card-title">{template.title}</h3>
                <p className="card-desc">{template.description}</p>
                <div className="card-actions">
                  <button
                    type="button"
                    className="action-btn-primary"
                    onClick={() => handleApplyTemplate(template, false)}
                    title="Load template onto current canvas"
                  >
                    Open in Canvas
                  </button>
                  <button
                    type="button"
                    className="action-btn-secondary"
                    onClick={() => handleApplyTemplate(template, true)}
                    title="Create a new page tab with this template"
                  >
                    + New Page Tab
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dialog-footer">
          <button type="button" className="close-action-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
