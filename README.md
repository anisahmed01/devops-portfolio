# ⚡ Anis Ahmed — DevOps & Cloud Platform Portfolio

[![Production Site](https://img.shields.io/badge/Production-anisahmed.in-00f2fe?style=for-the-badge&logo=google-chrome&logoColor=white)](https://anisahmed.in)
[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/anisahmed)
[![Orchestration](https://img.shields.io/badge/Kubernetes-K8s%20%26%20K3s-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![GitOps](https://img.shields.io/badge/GitOps-ArgoCD-EF6B55?style=for-the-badge&logo=argo&logoColor=white)](https://argoproj.github.io)
[![IaC](https://img.shields.io/badge/IaC-Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](https://terraform.io)

Welcome to the source repository for [anisahmed.in](https://anisahmed.in), personal portfolio and engineering platform of **Anis Ahmed (Senior DevOps & Cloud Infrastructure Engineer)**.

This repository is designed not only to host a high-performance web experience, but to serve as a **living showcase of production DevOps engineering principles**: GitOps reconciliation, automated security scanning, container hardening, Infrastructure as Code, and CI/CD pipelines.

---

## 🏛️ Architecture Overview

```
                                      [Developer]
                                           │
                                     (git push main)
                                           ▼
                                 [GitHub Repository]
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             [Stage 1: Security & Audit]             [Stage 2: Deployment]
             • TruffleHog Secret Scan                • Target: domains/anisahmed.in/public_html
             • Syntax & Lint Check                   • Protocol: Secure FTPS / SFTP
                        │                                     │
                        └──────────────────┬──────────────────┘
                                           ▼
                                [Hostinger LiteSpeed Edge]
                                           │
                                 (Free SSL / HTTPS)
                                           ▼
                                 https://anisahmed.in
```

---

## 🚀 Key Features

* **Interactive DevOps CLI**: In-browser Linux/Kubectl terminal emulator supporting commands like `kubectl get nodes`, `helm list`, `terraform state list`, `docker ps`, and `deploy --env prod`.
* **GitOps Pipeline Simulator**: Visual interactive multi-stage pipeline showing commits flowing through SonarQube, Docker, Trivy, ArgoCD, and Kubernetes with live inspectable logs.
* **Observability HUD**: Real-time simulated Prometheus metrics and Grafana waveform canvases monitoring request rate, P99 latency, and cluster saturation.
* **Dual Deployment Capability**:
  * **Production**: Deployed automatically to Hostinger via GitHub Actions on every commit to `main`.
  * **Kubernetes/Cloud**: Fully containerized with included production manifests (`k8s/`) and Terraform modules (`terraform/`).

---

## 📂 Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD deployment to anisahmed.in
├── k8s/                        # Production Kubernetes Manifests
│   ├── deployment.yaml         # Rolling update deployment with probes & pod anti-affinity
│   └── ingress-and-hpa.yaml    # Nginx Ingress with cert-manager TLS + HPA autoscaling
├── terraform/                  # Infrastructure as Code (AWS EKS & Multi-AZ VPC)
│   ├── main.tf                 # EKS cluster, worker node groups, remote S3 state
│   └── variables.tf            # Region and environment configurations
├── Dockerfile                  # Hardened, unprivileged Alpine Nginx container build
├── index.html                  # Cyberpunk / Mission Control Single Page Application
├── styles.css                  # Tailored animations, neon glow, and HUD styles
├── app.js                      # Web Audio synth, canvas particles, terminal & telemetry engine
└── README.md                   # Engineering documentation
```

---

## 💻 Local Testing & Preview

Since the portfolio is self-contained with zero required build toolchain, you can preview it immediately using Python's built-in HTTP server:

```bash
# Clone the repository
git clone https://github.com/anisahmed/devops-portfolio.git
cd devops-portfolio

# Start a local web server
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

---

## 🔐 GitHub Secrets Configuration (Hostinger CI/CD)

To configure the automated GitHub Actions deployment for your Hostinger plan:

1. In your GitHub repository, navigate to **Settings** &rarr; **Secrets and variables** &rarr; **Actions**.
2. Add the following repository secrets:
   * `HOSTINGER_FTP_HOST`: Your Hostinger FTP/Server hostname or IP.
   * `HOSTINGER_FTP_USER`: Your Hostinger FTP username.
   * `HOSTINGER_FTP_PASSWORD`: Your Hostinger FTP password.

Every commit pushed to the `main` branch will automatically validate syntax, scan for leaks, and push the updated files to `/domains/anisahmed.in/public_html/`.

---

## 📬 Contact & Socials

* **Website**: [anisahmed.in](https://anisahmed.in)
* **Direct Email**: [contact@anisahmed.in](mailto:contact@anisahmed.in)
* **PGP Key**: `4A8F B2C1 9D7E 04F3 81AA 66CD EF12 3456 7890 ABCD`
