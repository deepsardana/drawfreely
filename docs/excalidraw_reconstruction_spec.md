# Excalidraw Production Reconstruction & Reverse Engineering Specification

## 1. Overview & Provenance
- **Target Site**: [https://excalidraw.com/](https://excalidraw.com/)
- **Upstream Engine & Reference**: [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)
- **Local Application Root**: `excalidraw-app`
- **Local Server**: `http://localhost:3000`

---

## 2. Reverse-Engineered System Architecture

### 2.1 Core Runtime & UI Stack
- **Framework**: React 19 (concurrent mode, hooks, suspense)
- **State Store**: [Jotai](https://jotai.org/) atomic reactive state primitives
- **Rendering Pipeline**: HTML5 Canvas backed by Rough.js procedural sketch algorithms for hand-drawn wobbly aesthetics and hachure / cross-hatch fill patterns.
- **Math & Geometry Engine**: Vector arithmetic, convex hull bounds calculation, fractional indexing for deterministic layering.

### 2.2 Complete Modular Subsystems
1. **Dynamic Diagramming**:
   - Mermaid.js AST converter (`mermaid-to-excalidraw`)
   - Flowcharts, sequence diagrams, ER diagrams, Gantt charts, class diagrams, Git graphs, state machines, pie/quadrant charts, mindmaps, sankey diagrams, and C4 architecture diagrams.
2. **Mathematical Notation**:
   - KaTeX rendering engine (`katex-Cu_Erd72.js`) for LaTeX formula annotations.
3. **Embedded Code Editor**:
   - CodeMirror 6 (`codemirror.chunk`, `@lezer/highlight`) for syntax-highlighted code blocks.
4. **Graph Layout Engines**:
   - Cytoscape (`cytoscape.esm`) and Dagre (`dagre-d3-es`) for automated hierarchical graph layout.
5. **High-Performance Image Processing**:
   - Pica bicubic canvas downsampling (`pica-fTKOVOgy.js`) and blob compression (`image-blob-reduce`).

### 2.3 Offline Font Stack & Internationalization
- **Fonts**: Pre-cached woff2 binaries covering English, Latin, Hebrew, Arabic, Cyrillic, and CJK (Xiaolai):
  - `Excalifont` (regular & variant subsets)
  - `Virgil` (classic hand-drawn look)
  - `Cascadia` (monospace code font)
  - `Nunito` & `Assistant` (clean UI sans-serif)
  - `ComicShanns`
  - `Xiaolai` (handwritten CJK fonts)
- **Locales**: Over 50 localized language chunks lazy-loaded on demand from `/assets/locales/`.

### 2.4 Offline PWA & Storage
- **Service Worker**: Workbox precaching and runtime caching (`sw.js`).
- **IndexedDB & LocalStorage**: Autosave scene persistence via `idb-keyval` and schema versioning.

---

## 3. Running the Application

To launch the 1:1 Excalidraw application locally:

```bash
cd excalidraw-app
npm start
```

Access the interface in your browser at:
`http://localhost:3000`
