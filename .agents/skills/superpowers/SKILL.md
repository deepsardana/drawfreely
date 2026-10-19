---
name: superpowers
description: Advanced engineering superpowers for architecture synthesis, vector stencil reverse-engineering, multi-format specification export, zero-token integration bridges, and Figma design system token workflows.
---

# Superpowers: Enterprise Architecture & Systems Engineering

This skill defines the six core superpowers embedded into DrawFreely and the engineering agent workflow.

## Superpower 1: Vector Stencil Reverse-Engineering & Normalization
Extract authentic vector glyphs directly from XML/mxGraph definitions without human intervention.
- **De-framing Algorithm**: Automatically identify and prune outer framing brackets (e.g. AWS 4 bracket corners touching coordinates `y="53.876"`, `x="2.124"`, and GCP hexagon outlines).
- **Multi-Path Parsing**: Extract and merge foreground paths while preserving interior service glyphs (e.g. processor core lines, bucket tiers, engine gears).
- **Opacity Correction**: Identify drop-shadow paths (`fillalpha < 0.2`) and prevent conversion into 100% opaque black shapes.
- **Dynamic Bounding Box**: Calculate tight `[minX - 1, minY - 1, width + 2, height + 2]` viewBoxes to prevent shape clipping when zoomed or centered.

## Superpower 2: Automated Architecture Topology Synthesis
Synthesize production-grade cloud and distributed system architectures from high-level prompts.
- **Enterprise Templates**:
  - AWS 3-Tier Enterprise Web App (Route 53 $\to$ CloudFront $\to$ ALB $\to$ Auto-Scaling EC2 Fleet $\to$ Multi-AZ RDS $\to$ S3)
  - Kubernetes Microservices with NGINX Ingress, ClusterIP services, Pod deployments, and ConfigMaps
  - GCP Serverless Event-Driven Pipeline (Cloud Storage $\to$ Cloud Run $\to$ Pub/Sub $\to$ BigQuery)
  - Azure Hub-and-Spoke Enterprise Network (Firewall $\to$ VPN Gateway $\to$ Spoke VNets $\to$ App Services)
  - OAuth 2.0 / OpenID Connect Flowchart
  - GitOps CI/CD Deployment Pipeline (Git Commit $\to$ CI Pipeline $\to$ Artifact Registry $\to$ ArgoCD $\to$ K8s Cluster)
- **Linear Element Routing**: Automatic connector layout with orthogonal routing and clean arrowheads (`points: [[0, 0], [dx, dy]]`).

## Superpower 3: Zero-Token Enterprise Integration Bridges
Bridge visual architecture diagrams into enterprise productivity platforms with zero authentication hurdles.
- **Direct Notion Bridge**: Export canvas snapshot directly to backend storage (`/uploads/notion-diagram-{timestamp}.png`) and generate a 1-click copyable Notion Embed link.
- **Direct Jira Bridge**: Attach diagram snapshot directly with an issue attachment reference link without requiring user API tokens or passwords.
- **REST Endpoints**: Supported by native backend handlers at `/api/integrations/notion` and `/api/integrations/jira`.

## Superpower 4: Multi-Format Specification & Document Generation
Transform interactive diagrams into formal executive and engineering documentation.
- **Microsoft Word (.doc) Export**:
  - Compiles structured HTML+MIME Word document packages.
  - Formats architectural title, description, and export metadata timestamp.
  - Embeds high-resolution visual snapshot of the canvas.
  - Automatically parses diagram elements to compile a **Component Bill of Materials (BOM)** table (listing component names, cloud provider classifications, and item counts).
- **PDF 1.4 Binary Export**:
  - Compiles standards-compliant PDF 1.4 binary documents directly in the browser without third-party cloud round-trips.

## Superpower 5: Multi-Page Canvas State Virtualization
Enable multi-sheet diagramming across complex systems.
- Bottom sheet tab manager (`DrawioTabsBar`) supporting page addition, real-time tab switching, scene state preservation, double-click rename, duplication, and safe deletion.
- Scene state isolation ensuring each page maintains its own elements, zoom levels, and scroll positions.

## Superpower 6: Figma Design System & Token Synchronization
Enforce high-fidelity UI/UX standards matching modern Figma design systems.
- **DTCG Design Tokens**: Complete palette primitives (Slate, Blue, Indigo, Emerald, Amber, Rose) + semantic mappings for Light/Dark themes in `design-tokens.json`.
- **AutoLayout -> CSS Translation**: Precise mapping of Figma `layoutMode`, `layoutWrap`, `itemSpacing` (`gap`), and alignment.
- **Architectural Precision Rendering**: Enforcement of `roughness: 0`, Helvetica/sans-serif typography (`fontFamily: 2`), and 20px grid background.
