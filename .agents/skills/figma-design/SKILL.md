---
name: figma-design
description: Complete Figma Design & Code Integration skill. Use when reading, parsing, or converting Figma files, components, and design systems into production code, configuring Figma MCP, integrating design tokens, mapping AutoLayout to Flexbox/Grid, or building high-fidelity responsive UI components.
---

# Figma Design & Code Integration Guide

This skill provides an end-to-end framework and operational standard for integrating Figma designs into production web and mobile codebases. It covers the full pipeline: connecting via the Model Context Protocol (MCP) and REST API, parsing Figma node trees and AutoLayout properties, enforcing design tokens, converting component sets into typed code variants, and ensuring high-fidelity visual and accessibility standards.

---

## 1. System Architecture & Capabilities

```
+-----------------------------------------------------------+
|                       Figma Cloud                         |
|   (Files, Frames, Component Sets, Variables & Styles)     |
+-----------------------------+-----------------------------+
                              |
                     HTTPS / REST / WebSocket
                              |
                              v
+-----------------------------------------------------------+
|                    Figma MCP Server                       |
|   (@modelcontextprotocol/server-figma | figma-mcp-server)  |
|  - get_file / get_file_nodes   - get_image (SVG / PNG)   |
|  - get_local_variables         - get_comments            |
+-----------------------------+-----------------------------+
                              |
               Stdio / JSON-RPC (MCP Protocol)
                              |
                              v
+-----------------------------------------------------------+
|         AI Development Agent (Antigravity / Claude)       |
|                                                           |
|  1. Ingest Tokens (design-tokens.json)                    |
|  2. Inspect Node Tree & AutoLayout Parameters             |
|  3. Extract Icons & Vector Assets (SVG / currentColor)    |
|  4. Translate AutoLayout -> Flexbox / CSS Grid            |
|  5. Generate Typed Components (React / Tailwind / CVA)    |
|  6. Validate High-Fidelity & Accessibility Invariants     |
+-----------------------------------------------------------+
```

---

## 2. Figma MCP Server Integration & Setup

The Model Context Protocol (MCP) enables LLMs to directly read Figma documents, inspect specific frames, retrieve layout properties, and download rendered vector/raster assets.

### 2.1 Personal Access Token (PAT) Generation

1. Open Figma and navigate to **Account Settings** (click your profile avatar in the top-left).
2. Scroll down to the **Personal access tokens** section.
3. Click **Generate new token**.
4. Set the expiration and grant the following minimum required scopes:
   - `file_read` (Read access to files)
   - `file_variables:read` (Read access to local and published variables)
   - `file_comments:read` (Read comments)
5. Copy the generated token string (`figd_...`). Store it securely in your local environment.

### 2.2 Client Configurations

#### Antigravity CLI / Global Agent Config
Add the server entry to `~/.gemini/antigravity-cli/mcp/figma.json` or your project `mcp_config.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-figma"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

#### Claude Desktop (`claude_desktop_config.json`)
Located at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%/Claude/claude_desktop_config.json` on Windows:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-figma"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

#### Cursor IDE (`.cursor/mcp.json` or `~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "figd_YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

### 2.3 Core MCP Operations & Tool Reference

| MCP Tool | Purpose | Key Parameters | Return Value |
| :--- | :--- | :--- | :--- |
| `get_file` | Retrieve document tree overview | `file_key`: Figma file ID, `depth`: traversal depth (recommend `depth: 2` for overview) | Root document schema and page list |
| `get_file_nodes` | Ingest specific component or frame | `file_key`: File ID, `ids`: Array of node IDs (e.g. `["12:345"]`) | Exact geometry, fills, typography, layout |
| `get_image` | Export vector SVG or raster PNG | `file_key`: File ID, `ids`: Node IDs, `format`: `"svg"` \| `"png"`, `scale`: `1 \| 2 \| 3` | Signed URLs pointing to rendered assets |
| `get_local_variables` | Extract native Figma Variables | `file_key`: File ID | Color, number, boolean, string token definitions |

#### Figma URL to Node ID Resolution
Figma share URLs embed the file key and target node ID:
```
https://www.figma.com/design/AbCdEfGh12345/Design-System?node-id=402-1250&m=dev
                              ^                     ^
                           File Key              Node ID
```
- **File Key**: `AbCdEfGh12345`
- **Node ID Parameter**: `402-1250`
- **API Node ID Form**: Replace hyphens with colons: `402:1250`

---

## 3. Design Tokens Architecture

All design parameters (colors, typography, spacing, shadows, radiuses) MUST be anchored to structured design tokens. Do NOT hardcode arbitrary hex colors or pixel values into components.

The complete standard definition is maintained in:
[`./design-tokens.json`](./design-tokens.json)

### 3.1 Token Categories Overview

1. **Colors**:
   - Primitives: Slate, Blue, Indigo, Emerald, Amber, Rose.
   - Semantic Roles (Light & Dark modes): `background`, `foreground`, `border`, `primary`, `secondary`, `success`, `warning`, `danger`.
2. **Typography**:
   - Font Families: `sans` (Inter), `display` (Plus Jakarta Sans), `mono` (JetBrains Mono).
   - Scale: `display` (60px), `h1` (48px), `h2` (36px), `h3` (30px), `h4` (24px), `h5` (20px), `h6` (18px), `bodyLarge` (18px), `bodyMedium` (16px), `bodySmall` (14px), `caption` (12px), `overline` (10px).
3. **Spacing (4px/8px Baseline Grid)**:
   - Standard scale: `0` (0px), `1` (4px), `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px), `12` (48px), `16` (64px), `24` (96px).
4. **Border Radius**:
   - `none` (0px), `sm` (4px), `md` (6px), `lg` (8px), `xl` (12px), `2xl` (16px), `full` (9999px).
5. **Elevation & Shadows**:
   - Multi-layer diffuse shadows (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`) and interactive `focusRing`.
6. **Breakpoints**:
   - `mobile`: 375px (4 cols, 16px gutter/margin)
   - `tablet`: 768px (8 cols, 24px gutter/margin)
   - `laptop`: 1024px (12 cols, 32px gutter/margin)
   - `desktop`: 1440px (12 cols, 32px gutter, 48px margin)

### 3.2 CSS Custom Properties Generation

From `design-tokens.json`, generate the base CSS stylesheet:

```css
:root {
  /* Colors - Light Theme */
  --color-bg-default: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-fg-primary: #0f172a;
  --color-fg-secondary: #475569;
  --color-fg-tertiary: #94a3b8;
  --color-border-subtle: #f1f5f9;
  --color-border-default: #e2e8f0;
  --color-primary-default: #2563eb;
  --color-primary-hover: #1d4ed8;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Shadows */
  --shadow-sm: 0px 1px 3px 0px rgba(15, 23, 42, 0.08), 0px 1px 2px -1px rgba(15, 23, 42, 0.08);
  --shadow-md: 0px 4px 6px -1px rgba(15, 23, 42, 0.08), 0px 2px 4px -2px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0px 10px 15px -3px rgba(15, 23, 42, 0.08), 0px 4px 6px -4px rgba(15, 23, 42, 0.04);

  /* Radiuses */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-full: 9999px;
}

.dark {
  /* Colors - Dark Theme */
  --color-bg-default: #020617;
  --color-bg-secondary: #0f172a;
  --color-bg-tertiary: #1e293b;
  --color-fg-primary: #f8fafc;
  --color-fg-secondary: #cbd5e1;
  --color-fg-tertiary: #64748b;
  --color-border-subtle: #1e293b;
  --color-border-default: #334155;
  --color-primary-default: #3b82f6;
  --color-primary-hover: #60a5fa;
}
```

---

## 4. Production Figma-to-Code Workflow Rules

### 4.1 AutoLayout to CSS Flexbox & Grid Mapping

Figma's AutoLayout engine maps directly to CSS Flexbox with precise rules:

| Figma Property | Figma Value | CSS Property & Value | Tailwind Utility Class |
| :--- | :--- | :--- | :--- |
| `layoutMode` | `HORIZONTAL` | `display: flex; flex-direction: row;` | `flex flex-row` |
| `layoutMode` | `VERTICAL` | `display: flex; flex-direction: column;` | `flex flex-col` |
| `layoutWrap` | `WRAP` | `flex-wrap: wrap;` | `flex-wrap` |
| `layoutWrap` | `NO_WRAP` | `flex-wrap: nowrap;` | `flex-nowrap` |
| `primaryAxisAlignItems` | `MIN` | `justify-content: flex-start;` | `justify-start` |
| `primaryAxisAlignItems` | `CENTER` | `justify-content: center;` | `justify-center` |
| `primaryAxisAlignItems` | `MAX` | `justify-content: flex-end;` | `justify-end` |
| `primaryAxisAlignItems` | `SPACE_BETWEEN` | `justify-content: space-between;` | `justify-between` |
| `counterAxisAlignItems` | `MIN` | `align-items: flex-start;` | `items-start` |
| `counterAxisAlignItems` | `CENTER` | `align-items: center;` | `items-center` |
| `counterAxisAlignItems` | `MAX` | `align-items: flex-end;` | `items-end` |
| `counterAxisAlignItems` | `BASELINE` | `align-items: baseline;` | `items-baseline` |
| `itemSpacing` | `${N}px` | `gap: ${N}px;` | `gap-[${N}px]` or `gap-${scale}` |
| `paddingTop`, etc. | `${T}, ${R}, ${B}, ${L}` | `padding: ${T}px ${R}px ${B}px ${L}px;` | `pt-*, pr-*, pb-*, pl-*` |

#### Sizing Modes (`layoutSizingHorizontal` & `layoutSizingVertical`)
- **`FIXED`**: The frame has an explicit width or height.
  ```css
  width: 320px;
  flex-shrink: 0;
  ```
- **`HUG`**: The frame wraps around its children.
  ```css
  width: fit-content;
  ```
- **`FILL`**: The element expands to consume available space in its parent AutoLayout container.
  ```css
  flex: 1 1 0%;
  align-self: stretch;
  width: 100%; /* When in vertical container */
  ```

#### Absolute Positioning Inside AutoLayout
When a layer inside an AutoLayout frame has `layoutPositioning === "ABSOLUTE"`:
- The parent container MUST have `position: relative;`.
- The child layer receives `position: absolute;` with insets corresponding to Figma's constraint offsets (`top`, `right`, `bottom`, `left`).

### 4.2 Handling Responsive Constraints & Grid Layouts

1. **Repeated Card Patterns -> CSS Grid**:
   When an AutoLayout frame contains an array of uniform child frames wrapping across lines, do NOT keep fragile flex-wraps with manual widths. Convert to CSS Grid:
   ```css
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
   gap: var(--space-6);
   ```
2. **Breakpoints & Layout Adaptation**:
   - In Figma, designers maintain Mobile (375px), Tablet (768px), and Desktop (1440px) artboards.
   - Combine these artboards into single components using mobile-first responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`):
   ```tsx
   <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 md:p-8">
     {/* Mobile: stacked; Desktop: horizontal row with space-between */}
   </div>
   ```

### 4.3 Component Variant Architecture (`cva`)

Figma represents variations of a component (e.g., Button with Type=Primary/Secondary, Size=Sm/Md/Lg, State=Default/Disabled) as a `COMPONENT_SET`.

Translate this directly to TypeScript using `class-variance-authority` (`cva`):

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  // Base styles: interactive layout, font, transitions, focus rings
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100',
        outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:text-slate-200',
        ghost: 'hover:bg-slate-100 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-200',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!isLoading && rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

---

## 5. Realistic High-Fidelity & Accessibility Standards

When converting Figma artboards into code, follow these production quality gates:

### 5.1 Typography Fidelity
- **Font-Smoothing**: Enforce `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` across text bodies.
- **Letter Spacing**: Figma letter spacing is defined in percentages or pixels. Convert percentage tracking to `em` units:
  $$\text{Tracking } -2\% \implies -0.02\text{em}$$
- **Line Heights**: Always bind line-height to unitless ratios or rem values so text scales correctly with user font preferences.

### 5.2 Color & Contrast Standards
- **Contrast Ratios**: Check foreground text against background surfaces to guarantee WCAG 2.1 AA compliance:
  - Normal text ($< 18\text{px}$ bold or $< 24\text{px}$ regular): minimum $4.5:1$.
  - Large text ($\ge 18\text{px}$ bold or $\ge 24\text{px}$ regular): minimum $3:1$.
  - UI components and graphical objects: minimum $3:1$.
- **Alpha vs Element Opacity**: When Figma specifies layer opacity, verify whether only the fill color is translucent or the entire subtree is dimmed. Use `rgba()` / `color-mix()` for background colors to avoid inadvertently dimming child text.

### 5.3 Vector & SVG Extraction Standard
1. **Clean SVGs**: Strip proprietary Figma XML metadata (`xmlns:figma`, `figma:type`).
2. **CurrentColor**: Set fill or stroke on single-color icons to `currentColor` so the icon automatically matches the text color in any state or theme:
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
     <path d="M5 12h14M12 5l7 7-7 7" />
   </svg>
   ```
3. **Preserve ViewBox**: Never omit `viewBox`. Avoid hardcoded width/height on inner `<path>` elements.

### 5.4 Semantic HTML & Keyboard Navigation
- Never render clickable components as `<div>` or `<span>`. Use `<button type="button">`, `<a href="...">`, or `<input>`.
- Provide accessible names via `aria-label` for icon-only buttons.
- Visible focus rings: Never remove `outline: none` without providing a high-contrast replacement like `focus-visible:ring-2 focus-visible:ring-blue-500`.

---

## 6. End-to-End Implementation Runbook

Follow this 5-phase procedure when converting any Figma design into production code:

```
[Phase 1: Ingest]       --> Call Figma MCP get_file_nodes to fetch frame JSON
[Phase 2: Tokens]       --> Map extracted colors, typography, gaps to design-tokens.json
[Phase 3: Assets]       --> Export SVGs via get_image(format="svg") & sanitize paths
[Phase 4: Architecture] --> Identify Component Sets & model variants with CVA
[Phase 5: Code & Audit] --> Implement React/CSS, test responsiveness & verify WCAG
```

1. **Fetch Node Data**:
   ```bash
   # Retrieve target node structure via MCP
   get_file_nodes(file_key="...", ids=["402:1250"])
   ```
2. **Examine AutoLayout Hierarchy**:
   Identify root containers, layout directions, gaps, and padding values.
3. **Export Assets**:
   For any vector icons or brand logos, call `get_image` with `format="svg"`, download the raw SVG, and convert to an accessible SVG component.
4. **Draft Component with Tokens**:
   Write the component using the token variables (`var(--...)`) or corresponding Tailwind classes.
5. **Visual Audit**:
   Verify layout matches at 375px, 768px, and 1440px viewports. Confirm dark mode toggle behaves correctly.
