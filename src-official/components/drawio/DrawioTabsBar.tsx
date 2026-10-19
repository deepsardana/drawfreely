import React, { useState, useEffect, useRef } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { randomId } from "@excalidraw/common";
import "./DrawioTabsBar.scss";

export interface WhiteboardPage {
  id: string;
  name: string;
  elements: readonly any[];
  appState?: {
    zoom?: { value: number };
    scrollX?: number;
    scrollY?: number;
  };
  files?: Record<string, any>;
}

const STORAGE_KEY = "drawfreely_pages_v1";

interface DrawioTabsBarProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  onOpenTemplates?: () => void;
  onOpenExport?: () => void;
}

export const DrawioTabsBar: React.FC<DrawioTabsBarProps> = ({
  excalidrawAPI,
  onOpenTemplates,
  onOpenExport,
}) => {
  const [pages, setPages] = useState<WhiteboardPage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load saved pages:", e);
    }
    return [
      {
        id: "page-1",
        name: "Page 1",
        elements: [],
        appState: {},
      },
    ];
  });

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial canvas elements into Page 1 if first page elements are empty
  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }
    const currentElements = excalidrawAPI.getSceneElements();
    if (currentElements.length > 0 && pages[0]?.elements?.length === 0) {
      setPages((prev) => {
        const copy = [...prev];
        copy[0] = {
          ...copy[0],
          elements: currentElements,
          appState: {
            zoom: excalidrawAPI.getAppState().zoom,
            scrollX: excalidrawAPI.getAppState().scrollX,
            scrollY: excalidrawAPI.getAppState().scrollY,
          },
          files: excalidrawAPI.getFiles(),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
        } catch (e) {}
        return copy;
      });
    }
  }, [excalidrawAPI]);

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIndex]);

  const saveCurrentSceneState = (): WhiteboardPage[] => {
    if (!excalidrawAPI) {
      return pages;
    }
    const currentElements = excalidrawAPI.getSceneElements();
    const currentAppState = excalidrawAPI.getAppState();
    const currentFiles = excalidrawAPI.getFiles();

    const updated = [...pages];
    if (updated[activePageIndex]) {
      updated[activePageIndex] = {
        ...updated[activePageIndex],
        elements: currentElements,
        appState: {
          zoom: currentAppState.zoom,
          scrollX: currentAppState.scrollX,
          scrollY: currentAppState.scrollY,
        },
        files: currentFiles,
      };
    }
    return updated;
  };

  const handleSwitchPage = (targetIndex: number) => {
    if (targetIndex === activePageIndex || !excalidrawAPI) {
      return;
    }
    // 1. Save current page state
    const updatedPages = saveCurrentSceneState();
    const targetPage = updatedPages[targetIndex];
    if (!targetPage) {
      return;
    }

    setPages(updatedPages);
    setActivePageIndex(targetIndex);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPages));
    } catch (e) {}

    // 2. Load target page state into canvas
    excalidrawAPI.updateScene({
      elements: targetPage.elements || [],
      appState: {
        zoom: targetPage.appState?.zoom || ({ value: 1 } as any),
        scrollX: targetPage.appState?.scrollX || 0,
        scrollY: targetPage.appState?.scrollY || 0,
      },
    });

    if (targetPage.files) {
      excalidrawAPI.addFiles(Object.values(targetPage.files));
    }
  };

  const handleAddPage = () => {
    const updatedPages = saveCurrentSceneState();
    const newPage: WhiteboardPage = {
      id: `page-${randomId()}`,
      name: `Page ${updatedPages.length + 1}`,
      elements: [],
      appState: { zoom: { value: 1 } as any, scrollX: 0, scrollY: 0 },
    };

    const newPagesList = [...updatedPages, newPage];
    const newIndex = newPagesList.length - 1;

    setPages(newPagesList);
    setActivePageIndex(newIndex);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPagesList));
    } catch (e) {}

    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: [],
        appState: {
          zoom: { value: 1 } as any,
          scrollX: 0,
          scrollY: 0,
        },
      });
    }
  };

  const handleDuplicatePage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const updatedPages = saveCurrentSceneState();
    const sourcePage = updatedPages[index];
    if (!sourcePage) {
      return;
    }

    const clonedPage: WhiteboardPage = {
      id: `page-${randomId()}`,
      name: `${sourcePage.name} (Copy)`,
      elements: JSON.parse(JSON.stringify(sourcePage.elements || [])),
      appState: JSON.parse(JSON.stringify(sourcePage.appState || {})),
      files: sourcePage.files ? JSON.parse(JSON.stringify(sourcePage.files)) : undefined,
    };

    const newPagesList = [...updatedPages];
    newPagesList.splice(index + 1, 0, clonedPage);

    setPages(newPagesList);
    handleSwitchPage(index + 1);
  };

  const handleDeletePage = (e: React.MouseEvent, indexToDelete: number) => {
    e.stopPropagation();
    if (pages.length <= 1) {
      return;
    }

    if (!window.confirm(`Delete page "${pages[indexToDelete].name}"?`)) {
      return;
    }

    const updatedPages = saveCurrentSceneState();
    const filtered = updatedPages.filter((_, idx) => idx !== indexToDelete);

    let nextIndex = activePageIndex;
    if (indexToDelete === activePageIndex) {
      nextIndex = Math.max(0, indexToDelete - 1);
    } else if (indexToDelete < activePageIndex) {
      nextIndex = activePageIndex - 1;
    }

    setPages(filtered);
    setActivePageIndex(nextIndex);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {}

    const targetPage = filtered[nextIndex];
    if (excalidrawAPI && targetPage) {
      excalidrawAPI.updateScene({
        elements: targetPage.elements || [],
        appState: {
          zoom: targetPage.appState?.zoom || ({ value: 1 } as any),
          scrollX: targetPage.appState?.scrollX || 0,
          scrollY: targetPage.appState?.scrollY || 0,
        },
      });
      if (targetPage.files) {
        excalidrawAPI.addFiles(Object.values(targetPage.files));
      }
    }
  };

  const startRename = (index: number) => {
    setEditingIndex(index);
    setEditName(pages[index].name);
  };

  const commitRename = () => {
    if (editingIndex === null) {
      return;
    }
    const trimmed = editName.trim();
    if (trimmed) {
      setPages((prev) => {
        const copy = [...prev];
        if (copy[editingIndex]) {
          copy[editingIndex] = { ...copy[editingIndex], name: trimmed };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
          } catch (e) {}
        }
        return copy;
      });
    }
    setEditingIndex(null);
  };

  return (
    <div className="drawio-tabs-container">
      <div className="drawio-tabs-bar">
        {pages.map((page, idx) => {
          const isActive = idx === activePageIndex;
          const isEditing = idx === editingIndex;

          return (
            <div
              key={page.id}
              className={`drawio-tab-item ${isActive ? "is-active" : ""}`}
              onClick={() => handleSwitchPage(idx)}
              onDoubleClick={() => startRename(idx)}
              title={`${page.name} • Double-click to rename`}
            >
              <svg className="tab-page-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8M8 11h8M8 15h5" />
              </svg>
              {isEditing ? (
                <input
                  ref={inputRef}
                  className="tab-title-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      commitRename();
                    } else if (e.key === "Escape") {
                      setEditingIndex(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="tab-title-text">{page.name}</span>
              )}

              {/* Duplicate page button */}
              <button
                type="button"
                className="tab-action-btn"
                title="Duplicate page"
                onClick={(e) => handleDuplicatePage(e, idx)}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>

              {/* Delete page button (if >1 page) */}
              {pages.length > 1 && (
                <button
                  type="button"
                  className="tab-action-btn delete-btn"
                  title="Delete page"
                  onClick={(e) => handleDeletePage(e, idx)}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          className="drawio-tab-add-btn"
          onClick={handleAddPage}
          title="Add new diagram page / tab"
          aria-label="Add Page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <div className="drawio-tab-divider" />

        {onOpenTemplates && (
          <button
            type="button"
            className="drawio-tab-tool-btn"
            onClick={onOpenTemplates}
            title="Browse Diagram Templates"
          >
            <span>📋</span>
            <span>Templates</span>
          </button>
        )}

        {onOpenExport && (
          <button
            type="button"
            className="drawio-tab-tool-btn"
            onClick={onOpenExport}
            title="Export Diagram as PDF / Word DOC"
          >
            <span>📄</span>
            <span>Export DOC / PDF</span>
          </button>
        )}
      </div>
    </div>
  );
};
