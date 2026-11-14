# ⚡ Anis Ahmed — DevOps & Cloud Platform Portfolio

[![Production Site](https://img.shields.io/badge/Production-anisahmed.in-00f2fe?style=for-the-badge&logo=google-chrome&logoColor=white)](https://anisahmed.in)
[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/anisahmed01)
[![Multi-Cloud](https://img.shields.io/badge/Multi--Cloud-GCP%20%C2%B7%20AWS%20%C2%B7%20Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com)
[![Orchestration](https://img.shields.io/badge/Kubernetes-GKE%20%C2%B7%20EKS%20%C2%B7%20AKS-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![GitOps](https://img.shields.io/badge/GitOps-ArgoCD-EF6B55?style=for-the-badge&logo=argo&logoColor=white)](https://argoproj.github.io)
[![IaC](https://img.shields.io/badge/IaC-Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](https://terraform.io)

Welcome to the engineering source repository for [anisahmed.in](https://anisahmed.in), personal portfolio and engineering platform of **Anis Ahmed (Senior DevOps & Cloud Infrastructure Engineer)**. Specializing in enterprise multi-cloud architecture across **Google Cloud Platform (GCP)**, **Amazon Web Services (AWS)**, and **Microsoft Azure**.

This repository is designed not only to host a high-performance web experience, but to serve as a **living showcase of production DevOps engineering principles**: GitOps reconciliation, automated security scanning, container hardening, Infrastructure as Code, and CI/CD pipelines.

---

## 🏛️ Architecture Overview

```text
                                      [Developer]
                                           │
                                     (git push main)
                                           ▼
                                 [GitHub Repository]
                                           │
       ┌───────────────────────────────────┼───────────────────────────────────┐
       ▼                                   ▼                                   ▼
[Stage 1: Security Gate]        [Stage 2: IaC & Container CI]       [Stage 3: CD Deployment]
• TruffleHog Secret Scan        • Terraform fmt & validate          • Target: anisahmed.in
• Asset & SEO Integrity Check   • K8s Manifest Dry-Run              • Protocol: Secure FTPS
                                • Docker Hardened Build             • Zero-Downtime Sync
                                           │                                   │
                                           └─────────────────┬─────────────────┘
                                                             ▼
                                                [Hostinger LiteSpeed Edge]
                                                             │
                                                   (Free SSL / HTTPS)
                                                             ▼
                                                   https://anisahmed.in
```

---

## 🚀 Key Features

* **Interactive DevOps CLI**: In-browser Linux & Kubectl terminal emulator supporting commands like `kubectl get nodes`, `helm list`, `terraform state list`, `docker ps`, `deploy --env prod`, and custom DevOps career queries.
* **GitOps Pipeline Simulator**: Visual interactive multi-stage pipeline showing commits flowing through SonarQube, Docker, Trivy, ArgoCD, and Kubernetes with live inspectable logs.
* **Observability HUD**: Real-time simulated Prometheus telemetry and Grafana waveform canvases monitoring request rate, P99 latency, and cluster saturation.
* **Dual Deployment Architecture**:
  * **Production (Live)**: Automated continuous delivery to Hostinger via GitHub Actions on every commit to `main`.
  * **Kubernetes / Cloud Blueprint**: Complete unprivileged Docker containerization, Kubernetes rolling updates (`k8s/`), and Terraform AWS EKS multi-AZ infrastructure (`terraform/`).

---

## 📂 Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # Multi-stage CI/CD: Security gate, IaC validation & FTPS deploy
├── k8s/                        # Production Kubernetes Manifests
│   ├── deployment.yaml         # Namespace, rolling update deployment, probes & pod anti-affinity
│   └── ingress-and-hpa.yaml    # Nginx Ingress with cert-manager TLS + HPA autoscaling
├── terraform/                  # Infrastructure as Code (AWS EKS & Multi-AZ VPC)
│   ├── main.tf                 # EKS 1.30 cluster, worker node groups, remote S3 state
│   ├── variables.tf            # Region and environment configurations
│   ├── outputs.tf              # Cluster endpoints, VPC IDs, and kubeconfig helpers
│   └── terraform.tfvars.example# Parameter blueprint
├── Dockerfile                  # Hardened, unprivileged Alpine Nginx container build (UID 101)
├── nginx.conf                  # Security headers, gzip compression, and caching configuration
├── index.html                  # Cyberpunk / Mission Control Single Page Application
├── styles.css                  # Tailored animations, neon glow, and HUD styles
├── app.js                      # Web Audio synth, canvas particles, terminal & telemetry engine
├── profile.webp / profile.jpg  # Optimized portraits
├── robots.txt / sitemap.xml    # SEO and search indexing configurations
└── README.md                   # Engineering documentation
```

---

## 💻 Local Testing & Docker Preview

### Option A: Immediate Preview (Zero Toolchain)
```bash
# Start a local web server
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

### Option B: Hardened Docker Container Build
```bash
# Build the production unprivileged container
docker build -t anisahmed-portfolio:latest .

# Run container on port 8080
docker run -d -p 8080:8080 --name portfolio anisahmed-portfolio:latest

# Verify health endpoint
curl http://localhost:8080/healthz
```
Then visit `http://localhost:8080` in your browser.

---

## 🔐 GitHub Secrets Configuration (Hostinger CI/CD)

To configure the automated GitHub Actions deployment for your Hostinger plan:

1. In your GitHub repository, navigate to **Settings** &rarr; **Secrets and variables** &rarr; **Actions**.
2. Add the following repository secrets:
   * `HOSTINGER_FTP_HOST`: Your Hostinger FTP hostname or server IP.
   * `HOSTINGER_FTP_USER`: Your Hostinger FTP username.
   * `HOSTINGER_FTP_PASSWORD`: Your Hostinger FTP password.

Every commit pushed to the `main` branch will automatically validate syntax, verify IaC manifests, scan for leaks, and push the updated files to your live website.

---

## 📬 Contact & Socials

* **Website**: [anisahmed.in](https://anisahmed.in)
* **GitHub**: [github.com/anisahmed01](https://github.com/anisahmed01)
* **Direct Email**: [contact@anisahmed.in](mailto:contact@anisahmed.in)
