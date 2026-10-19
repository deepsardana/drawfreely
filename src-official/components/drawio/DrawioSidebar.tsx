import React, { useState, useMemo } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import {
  DRAWIO_CATEGORIES,
  insertShapeToCanvas,
  type DrawioShapeDef,
} from "./drawioShapesData";
import "./DrawioSidebar.scss";

interface DrawioSidebarProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  isOpen: boolean;
  onToggle: () => void;
}

const FILTER_PILLS = [
  { id: "all", label: "All" },
  { id: "aws", label: "AWS" },
  { id: "gcp", label: "GCP" },
  { id: "azure", label: "Azure" },
  { id: "k8s", label: "K8s" },
  { id: "network", label: "Network" },
  { id: "flowchart", label: "Flowchart" },
  { id: "devops", label: "DevOps" },
  { id: "fortinet", label: "Security" },
] as const;

export const DrawioSidebar: React.FC<DrawioSidebarProps> = ({
  excalidrawAPI,
  isOpen,
  onToggle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    flowchart: true,
    aws: true,
    gcp: false,
    azure: false,
    k8s: false,
    network: false,
    fortinet: false,
    devops: false,
    ibm: false,
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSelectPill = (categoryId: string) => {
    if (selectedCategory === categoryId && categoryId !== "all") {
      setSelectedCategory("all");
    } else {
      setSelectedCategory(categoryId);
      if (categoryId !== "all") {
        setExpandedCategories((prev) => ({
          ...prev,
          [categoryId]: true,
        }));
      }
    }
  };

  const filteredCategories = useMemo(() => {
    let cats = DRAWIO_CATEGORIES;
    if (selectedCategory !== "all") {
      cats = cats.filter((cat) => cat.id === selectedCategory);
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return cats;
    }

    return cats
      .map((cat) => ({
        ...cat,
        shapes: cat.shapes.filter(
          (shape) =>
            shape.name.toLowerCase().includes(q) ||
            shape.tags.some((t) => t.toLowerCase().includes(q)),
        ),
      }))
      .filter((cat) => cat.shapes.length > 0);
  }, [searchQuery, selectedCategory]);

  const handleShapeClick = (shape: DrawioShapeDef) => {
    if (!excalidrawAPI) {
      return;
    }
    insertShapeToCanvas(excalidrawAPI as any, shape as any);
  };

  const handleDragStart = (e: React.DragEvent, shape: DrawioShapeDef) => {
    e.dataTransfer.setData("application/drawio-shape", JSON.stringify(shape));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="drawio-sidebar-container">
      {!isOpen && (
        <button
          type="button"
          className="drawio-sidebar-toggle-btn"
          onClick={onToggle}
          title="Open DrawFreely Shapes & Cloud Library"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="2 2" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
            <polygon points="16,6 18,10 14,10" fill="currentColor" />
            <rect x="12" y="14" width="6" height="4" fill="currentColor" />
          </svg>
          <span>500+ Shapes</span>
        </button>
      )}

      <div className={`drawio-sidebar-panel ${!isOpen ? "is-collapsed" : ""}`}>
        <div className="drawio-sidebar-header">
          <div className="header-title">
            <span>DrawFreely Shapes</span>
            <span className="badge">500+ Shapes</span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onToggle}
            title="Close sidebar"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="drawio-sidebar-search">
          <div className="search-input-wrapper">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search 500+ shapes, AWS, GCP, Azure, K8s..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="category-filter-pills" role="tablist" aria-label="Shape category filters">
            {FILTER_PILLS.map((pill) => {
              const isActive = selectedCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`filter-pill ${isActive ? "is-active" : ""}`}
                  onClick={() => handleSelectPill(pill.id)}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="drawio-sidebar-content">
          {filteredCategories.length === 0 ? (
            <div style={{ padding: "24px 12px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
              No shapes matching &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isExpanded =
                selectedCategory !== "all" ||
                searchQuery.trim().length > 0 ||
                !!expandedCategories[cat.id];

              return (
                <div key={cat.id} className="drawio-accordion-group">
                  <button
                    type="button"
                    className="drawio-accordion-header"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <div className="accordion-title">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <div className="accordion-meta">
                      <span className="count-pill">{cat.shapes.length}</span>
                      <svg
                        className={`chevron ${isExpanded ? "is-expanded" : ""}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="drawio-shapes-grid">
                      {cat.shapes.map((shape) => (
                        <div
                          key={shape.id}
                          className="drawio-shape-card"
                          draggable
                          onDragStart={(e) => handleDragStart(e, shape)}
                          onClick={() => handleShapeClick(shape)}
                          title={`${shape.name} (Click or Drag to canvas)`}
                        >
                          <div
                            className="shape-icon-preview shape-preview"
                            dangerouslySetInnerHTML={{ __html: shape.svg }}
                          />
                          <span className="shape-card-label shape-label">{shape.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
