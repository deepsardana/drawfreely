# DrawFreely Project Memory & System Architecture

## Overview
**DrawFreely** is a local-first, enterprise-grade architecture diagramming and visual whiteboard platform built upon Excalidraw's core engine, heavily extended with 525+ official cloud/network vector stencils, multi-page canvas workflows, zero-token Notion & Jira bridges, and direct export to Microsoft Word (.doc) and PDF (1.4 binary).

---

## Technical Stack & Runtime Environment

- **Frontend Core**: React 18, TypeScript, Jotai, Sass/SCSS, Vite, Workbox PWA.
- **Rendering Modes**:
  - Architectural Precision Mode: `roughness: 0`, `fontFamily: 2` (Helvetica/sans-serif), `gridSize: 20`.
  - Sketch Mode: Hand-drawn sketchy rendering for casual wireframes.
- **Backend Bridge**: Node.js HTTP/REST service (`excalidraw-app/server.mjs`) running at `http://localhost:3000`.
- **Infrastructure**:
  - Docker: Multi-stage alpine production build (`Dockerfile`).
  - Orchestration: `docker-compose.yml`, Kubernetes deployment & service (`k8s/`), Helm chart (`helm/`).
- **Storage**:
  - Local browser storage for multi-page scene persistence.
  - Local `/uploads/` directory on backend server for zero-token Notion & Jira bridges.

---

## Core Capabilities & Features

### 1. 525+ Official Vector Stencil Library
- **AWS Architecture** (53 official shapes): EC2 (pure microprocessor vector), S3 (cylindrical bucket with data tiers), RDS, Lambda ($\lambda$), DynamoDB, VPC, Route 53, CloudFront, ECS, EKS, API Gateway, SQS, SNS, CloudWatch, etc.
- **Google Cloud Platform (GCP)** (23 shapes): Compute Engine, Cloud Storage, GKE, BigQuery, Cloud Functions, Cloud SQL, Cloud Run, Pub/Sub, Cloud Armor, VPC, etc. (Opaque shadow filtered out for authentic brand colors).
- **Kubernetes / CNCF** (28 shapes): Pod, Deployment, Service, Ingress, StatefulSet, DaemonSet, ConfigMap, Secret, Namespace, Node, Volume.
- **Azure & Microsoft Cloud** (240 shapes): Virtual Machines, Blob Storage, AKS, Cosmos DB, Azure SQL, Functions, Active Directory, Office 365, Defender.
- **Networking & Security** (80 shapes): Cisco routers/switches/firewalls, Fortinet (FortiGate, FortiAnalyzer, FortiWeb), Network racks, Patch panels, Modems.
- **DevOps, CI/CD & IBM** (52 shapes): Docker, Git, GitHub, GitLab, Jenkins, Terraform, Ansible, Prometheus, Grafana, IBM Watson AI.
- **Flowchart & UML** (20 shapes): Process, Decision, Terminator, Data I/O, Document, Subroutine, Database.

### 2. Multi-Page Canvas Support
- Bottom tabs bar (`DrawioTabsBar`):
  - Add unlimited pages (`+ Add Page`).
  - Real-time tab switching with state preservation.
  - Double-click to rename page.
  - Duplicate page with full elements and app state.
  - Delete page with safety confirmation.

### 3. Document & PDF Exporter (`DrawioDocPdfExportDialog`)
- **Vector/Raster PDF 1.4 Binary**: Generates standards-compliant binary PDF 1.4 without requiring third-party cloud services.
- **Microsoft Word (.doc)**: Generates structured HTML+MIME Word documents featuring document header, metadata timestamp, embedded high-res diagram snapshot, and an auto-generated **Component Bill of Materials (BOM)** table.

### 4. Zero-Token Direct Notion & Jira Bridges
- **Notion**: Direct 1-click bridge generates instant embeddable links stored at `/uploads/` without API keys or passwords.
- **Jira**: Direct 1-click attachment bridge generates markdown/HTML links ready to paste into Jira tickets.

### 5. Pre-Built Enterprise Templates
- AWS 3-Tier Enterprise Web App (Route 53 $\to$ ALB $\to$ EC2 Auto-Scaling $\to$ Multi-AZ RDS)
- Kubernetes Microservices with Ingress
- GCP Serverless Event-Driven Pipeline
- Azure Hub-and-Spoke Enterprise Network
- OAuth 2.0 / OpenID Connect Flowchart
- GitOps CI/CD Deployment Pipeline

---

## Key Lessons & Architectural Rules

1. **SVG Sizing in Excalidraw Image Elements**:
   - SVGs rendered via `newImageElement` MUST contain explicit `width` and `height` attributes on the root `<svg>` tag. Without them, browser image rendering (`new Image()`) calculates `naturalWidth === 0`, causing canvas shapes to be completely invisible.
   - Always base64-encode SVGs in Data URLs: `data:image/svg+xml;base64,...`.
2. **Sidebar Preview Container Dimensions**:
   - Preview wrappers in `DrawioSidebar.scss` must have fixed width/height (`width: 48px; height: 48px`) with `display: flex; align-items: center; justify-content: center; background: #f8fafc; border: 1px solid #e2e8f0;`.
   - SVG inside must have `width: 100% !important; height: 100% !important; max-width: 40px !important; max-height: 40px !important;`.
3. **No Outer Framing Boxes on AWS/GCP Icons**:
   - Stripped away outer bracket framing paths (`y="53.876"`, `x="2.124"`, outer hexagons) to leave clean, authentic standalone symbols.
4. **Branding Integrity**:
   - Use **DrawFreely** branding consistently across all user-visible strings, headers, and metadata.
