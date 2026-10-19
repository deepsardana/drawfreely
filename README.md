# DrawFreely 🖋️

**DrawFreely** is a modern, 100% free, and local-first virtual whiteboard for sketching diagrams, wireframes, architectures, and hand-drawn notes.

- **Zero Subscriptions & Paywalls**: Fully open-source and independent.
- **Local-First & Private**: Your diagrams stay on your device and are never sent to external servers.
- **Dedicated Save Button**: Save `.drawfreely` (and `.excalidraw` compatible) files directly to your local disk at any time (`Cmd+S` / `Ctrl+S` or click **Save**).
- **DrawFreely Shapes Sidebar**: Collapsible left sidebar with instant search and 120+ authentic vector shape libraries:
  - **Flowcharts & General**: Decisions, Processes, Terminators, Databases, Clouds, Documents, Actors, Storage, Queues.
  - **Amazon AWS**: EC2, S3, RDS, Lambda, DynamoDB, API Gateway, CloudFront, VPC, Route 53, IAM, ECS, EKS, SQS, SNS, CloudWatch, EventBridge, Beanstalk, Kinesis, ElastiCache, Step Functions, Redshift, Fargate, Cognito, KMS, Secrets Manager, WAF, Aurora, Athena, OpenSearch, Glue.
  - **Google Cloud (GCP)**: Compute Engine, Cloud Storage, GKE, BigQuery, Cloud Functions, Cloud Run, Pub/Sub, Cloud SQL, Spanner, Load Balancing, Cloud Armor, IAM, VPC, Firestore, Bigtable, CDN, Tasks, Monitoring, Vertex AI, Looker.
  - **Microsoft Azure**: Virtual Machines, Blob Storage, Azure Functions, App Service, AKS, Virtual Network, Cosmos DB, SQL Database, DevOps, Application Gateway, Entra ID, Front Door, Key Vault, Event Hubs, Service Bus, Synapse, Monitor, Firewall, ACI, OpenAI/Cognitive.
  - **Fortinet (Fortijet)**: FortiGate Next-Gen Firewall, FortiAnalyzer, FortiManager, FortiClient, FortiSwitch, FortiAP, FortiMail, FortiWeb, FortiSandbox, FortiSIEM.
  - **Kubernetes & Cloud Native**: Pods, Services, Ingress, Deployments, ConfigMaps, Secrets, PersistentVolumes, Namespaces, Docker, Helm, Prometheus, Grafana, Envoy, Istio, ArgoCD.
  - **Networking & Infrastructure**: Routers, Switches, Firewalls, Load Balancers, Server Racks, Database Servers, Wi-Fi APs, Fiber Links, VPN Gateways, Internet WAN, CCTV, Workstations.
- **Multi-Page Whiteboard Tabs**: Full multi-page support with bottom tab bar (`Page 1`, `Page 2`, `+` add, rename, duplicate, delete), preserved in local storage.
- **Enterprise Vendor Presentation Mode**: One-click presentation mode with zen clean layout, auto-fitting, and high-impact framing for vendor reviews.
- **Word (.doc) & PDF 1.4 Export**: Export complete multi-page architecture dossiers with embedded bill-of-materials tables and metadata.
- **525+ Official Vector Stencils**: AWS, Google Cloud (GCP), Microsoft Azure, Kubernetes, Cisco, Fortinet, and IBM Enterprise architecture libraries.
- **Custom Branding**: Clean visual identity featuring the modern enterprise aesthetic.
- **Production-Ready**: Comes with optimized Docker containerization, Docker Compose, Kubernetes manifests, and a Helm chart.

---

## Table of Contents

- [DrawFreely Architecture & Whiteboard Superpowers](#drawfreely-architecture--whiteboard-superpowers)
  - [Cloud & Architecture Shapes](#cloud--architecture-shapes)
  - [Multi-Page Tabs Bar](#multi-page-tabs-bar)
  - [Vendor Presentation Mode](#vendor-presentation-mode)
  - [DOC & PDF Export](#doc--pdf-export)
- [Quickstart (Local Node.js)](#quickstart-local-nodejs)
- [Docker](#docker)
  - [Build the Image](#build-the-image)
  - [Run the Container](#run-the-container)
- [Docker Compose](#docker-compose)
- [Kubernetes Manifests](#kubernetes-manifests)
  - [Deploy via Kustomize](#deploy-via-kustomize-recommended)
  - [Deploy Manifests Individually](#deploy-manifests-individually)
  - [Verify & Port-Forward](#verify--port-forward)
- [Helm Chart](#helm-chart)
  - [Install Chart](#install-chart)
  - [Customize Configuration](#customize-configuration)
  - [Configuration Values Reference](#configuration-values-reference)
  - [Upgrade or Uninstall](#upgrade-or-uninstall)
- [Architecture & Health Checks](#architecture--health-checks)

---

## DrawFreely Architecture & Whiteboard Superpowers

DrawFreely integrates rich enterprise architecture diagramming and whiteboard superpowers directly into the canvas:

### Cloud & Architecture Shapes
Click the **🔷 Shapes** button in the top header or press the sidebar icon on the left edge to open the shape library.
- **Search Shapes**: Type to filter across 120+ cloud and diagram shapes instantaneously (e.g. `s3`, `firewall`, `pod`, `gateway`, `gke`).
- **Drag & Drop**: Drag any shape directly from the sidebar onto your whiteboard canvas to place it at that exact position.
- **Click to Insert**: Clicking any shape immediately drops it in the center of your active view.
- **Authentic Transparent Vector Icons**: All icons feature pure vector geometry with transparent backgrounds—no unsightly square background tiles.
- **Categorized Libraries**:
  - **Flowcharts & General**: Process, Decision, Terminator, Cylinder/DB, Cloud, Actor, Subroutine, Document, Storage, Queue, Merge, Note.
  - **Amazon AWS**: EC2, S3, RDS, Lambda, DynamoDB, API Gateway, CloudFront, VPC, Route 53, IAM, ECS, EKS, SQS, SNS, CloudWatch, EventBridge, Beanstalk, Kinesis, ElastiCache, Step Functions, Redshift, Fargate, Cognito, KMS, Secrets Manager, WAF, Aurora, Athena, OpenSearch, Glue.
  - **Google Cloud Platform (GCP)**: Compute Engine, Cloud Storage, GKE, BigQuery, Cloud Functions, Cloud Run, Pub/Sub, Cloud SQL, Spanner, Load Balancing, Cloud Armor, IAM, VPC, Firestore, Bigtable, CDN, Tasks, Monitoring, Vertex AI, Looker.
  - **Microsoft Azure**: Virtual Machine, Blob Storage, Azure Functions, App Service, AKS, Virtual Network, Cosmos DB, SQL Database, DevOps, Application Gateway, Entra ID, Front Door, Key Vault, Event Hubs, Service Bus, Synapse, Monitor, Firewall, ACI, OpenAI/Cognitive.
  - **Fortinet (Fortijet)**: FortiGate Next-Gen Firewall, FortiAnalyzer, FortiManager, FortiClient, FortiSwitch, FortiAP, FortiMail, FortiWeb, FortiSandbox, FortiSIEM.
  - **Kubernetes & Cloud Native**: Pods, Services, Ingress, Deployments, ConfigMaps, Secrets, PersistentVolumes, Namespaces, Docker, Helm, Prometheus, Grafana, Envoy, Istio, ArgoCD.
  - **Networking & Infrastructure**: Core Router, Switch, Firewall, Load Balancer, Server Rack, DB Server, Wi-Fi AP, Fiber Link, VPN Gateway, WAN Cloud, CCTV, Workstation.

### Multi-Page Tabs Bar
Located at the bottom of the canvas, the page tabs bar enables multi-page whiteboards:
- **Add New Pages**: Click the **`+`** button to create a clean new canvas page.
- **Rename Pages**: Double-click any page tab to rename it inline.
- **Switch Pages**: Click any tab to seamlessly switch between different diagrams in your project.
- **Tab Context Options**: Click the small down chevron `▾` on any active page to:
  - **Duplicate Page**: Make an exact copy of the current diagram.
  - **Delete Page**: Remove the page from the project.
- **Local Storage Persistence**: All pages, element states, and active tabs are automatically persisted in local storage (`drawfreely_pages_v1`).

### Notion Integration
Save your diagrams and flowcharts directly into your team's Notion workspace:
1. Click the **🔗 Notion & Jira** button in the header.
2. In the **Notion** tab:
   - Provide your **Internal Integration Secret** (`ntn_...` or `secret_...` from [Notion Developers](https://www.notion.so/my-integrations)).
   - Paste your **Page URL or Page ID** (e.g., `https://notion.so/workspace/Architecture-1234567890abcdef1234567890abcdef`).
   - Click **Test Connection** to verify access.
   - Click **Save to Notion Page** to automatically append a formatted DrawFreely section with diagram metadata, summary, and embedded blocks to your Notion page.
   - Alternatively, click **Copy Markdown** to get a ready-to-paste snippet for your Notion document.

### Jira Integration
Attach diagrams and architecture drawings to Atlassian Jira issues:
1. Click the **🔗 Notion & Jira** button in the header.
2. In the **Jira** tab:
   - Enter your **Jira Host Domain** (e.g. `yourcompany.atlassian.net`).
   - Enter your **Account Email** and **API Token** (from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)).
   - Specify the **Issue Key** (e.g. `PROJ-101`).
   - Click **Test Connection** to check credentials.
   - Click **Attach to Jira Issue** to upload a crisp high-resolution PNG image and the `.drawfreely` source file directly to the issue attachments, plus post an explanatory comment.
   - Or click **Copy Jira Markup** to paste into Jira issue descriptions or comments.

---

## Quickstart (Local Node.js)

If you have Node.js installed, you can run DrawFreely directly without Docker:

```bash
# Start the built production server (defaults to port 3000)
npm start

# Or run on a custom port
PORT=8080 npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Docker

DrawFreely provides an ultra-lightweight (~20MB) Alpine-based Nginx container pre-configured with gzip compression, security headers, immutable caching for static assets, and Single-Page Application (SPA) routing.

### Build the Image

```bash
docker build -t drawfreely:latest .
```

### Run the Container

```bash
docker run -d \
  --name drawfreely \
  -p 3000:80 \
  --restart unless-stopped \
  drawfreely:latest
```

The app will be accessible at [http://localhost:3000](http://localhost:3000).

To view container logs or health status:

```bash
docker ps
docker logs -f drawfreely
```

---

## Docker Compose

For a one-command setup with automatic restarts, resource limits, and health checks:

### Start

```bash
docker compose up -d
```

### Customize Port

By default, Docker Compose maps port `3000` on the host to port `80` in the container. To use another port:

```bash
PORT=8080 docker compose up -d
```

### Stop

```bash
docker compose down
```

---

## Kubernetes Manifests

Ready-to-use Kubernetes YAML files are located in the [`k8s/`](./k8s) directory:

```
k8s/
├── deployment.yaml      # 2-replica rolling update deployment with probes and resource limits
├── service.yaml         # ClusterIP service on port 80
├── ingress.yaml         # Ingress with Nginx annotations and TLS placeholder
└── kustomization.yaml   # Kustomize manifest bundle
```

### Deploy via Kustomize (Recommended)

```bash
kubectl apply -k k8s/
```

### Deploy Manifests Individually

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Verify & Port-Forward

Check deployment status:

```bash
kubectl get deployments,services,pods -l app.kubernetes.io/name=drawfreely
```

Port-forward to test locally:

```bash
kubectl port-forward svc/drawfreely 3000:80
```

Access the app at [http://localhost:3000](http://localhost:3000).

To remove the Kubernetes resources:

```bash
kubectl delete -k k8s/
```

---

## Helm Chart

A Helm v3 chart is provided in [`helm/drawfreely/`](./helm/drawfreely).

```
helm/drawfreely/
├── Chart.yaml
├── values.yaml
├── .helmignore
└── templates/
    ├── _helpers.tpl
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── serviceaccount.yaml
    └── hpa.yaml
```

### Install Chart

Install into your Kubernetes cluster under the release name `drawfreely`:

```bash
helm install drawfreely ./helm/drawfreely
```

Install into a dedicated namespace:

```bash
kubectl create namespace drawfreely
helm install drawfreely ./helm/drawfreely -n drawfreely
```

### Customize Configuration

Override default values via command-line flags or a custom `values-custom.yaml` file:

```bash
# Expose via LoadBalancer
helm install drawfreely ./helm/drawfreely --set service.type=LoadBalancer

# Enable Ingress with custom hostname
helm install drawfreely ./helm/drawfreely \
  --set ingress.enabled=true \
  --set ingress.className=nginx \
  --set ingress.hosts[0].host=whiteboard.yourdomain.com \
  --set ingress.hosts[0].paths[0].path=/ \
  --set ingress.hosts[0].paths[0].pathType=Prefix
```

### Configuration Values Reference

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of pod replicas | `2` |
| `image.repository` | Docker image repository | `drawfreely` |
| `image.tag` | Docker image tag | `""` (uses `Chart.appVersion`) |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Kubernetes Service type | `ClusterIP` |
| `service.port` | Service port | `80` |
| `service.targetPort` | Container target port | `80` |
| `ingress.enabled` | Enable Ingress controller routing | `false` |
| `ingress.className` | Ingress class (e.g. `nginx`) | `""` |
| `ingress.hosts` | Ingress hosts configuration | `[drawfreely.local]` |
| `resources.requests.cpu` | CPU request | `50m` |
| `resources.requests.memory` | Memory request | `64Mi` |
| `resources.limits.cpu` | CPU limit | `250m` |
| `resources.limits.memory` | Memory limit | `128Mi` |
| `livenessProbe.httpGet.path` | Liveness check path | `/healthz` |
| `readinessProbe.httpGet.path` | Readiness check path | `/healthz` |
| `autoscaling.enabled` | Enable Horizontal Pod Autoscaler | `false` |
| `autoscaling.minReplicas` | Minimum HPA replicas | `1` |
| `autoscaling.maxReplicas` | Maximum HPA replicas | `5` |

### Upgrade or Uninstall

```bash
# Upgrade
helm upgrade drawfreely ./helm/drawfreely

# Uninstall
helm uninstall drawfreely
```

---

## Architecture & Health Checks

- **Nginx Web Server**: Serves static HTML/JS/CSS bundles and assets with Gzip compression and security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: origin-when-cross-origin`).
- **Health Check Endpoint**: `/healthz` returns `200 OK` for Docker `HEALTHCHECK`, Kubernetes liveness/readiness probes, and load balancer health monitoring.
- **Cache Strategy**:
  - `/assets/*` and fonts are cached aggressively (`Cache-Control: public, max-age=31536000, immutable`).
  - `index.html`, `sw.js`, and `manifest.webmanifest` are served with `no-cache, no-store` to ensure immediate updates upon new releases.
- **Security**: Rootless/low-privilege execution support, dropped Linux capabilities (`drop: [ALL]`), and zero external telemetry.
