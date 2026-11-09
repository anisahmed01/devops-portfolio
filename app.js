// ==========================================
// Anis Ahmed ΓÇö DevOps Portfolio Interactive Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initIntroSplash();
  initScrollObserver();
  initNavScrollTracker();
  initPipelineConsole();
  initMacTerminal();
  initVisitorAnalytics();
  initSideNavNavigator();
});

// ==========================================
// 0. CINEMATIC INTRO SPLASH (HIGH-PERFORMANCE)
// ==========================================
function initIntroSplash() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  // Returning visitors in same session skip intro instantly
  if (sessionStorage.getItem('anis_intro_viewed')) {
    overlay.remove();
    return;
  }
  sessionStorage.setItem('anis_intro_viewed', '1');

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.add('fade-out');
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 450);
  }

  // Auto-dismiss smoothly after 1.5 seconds
  const autoTimer = setTimeout(dismiss, 1500);

  // Click or keypress dismisses immediately
  overlay.addEventListener('click', () => {
    clearTimeout(autoTimer);
    dismiss();
  });

  window.addEventListener('keydown', () => {
    clearTimeout(autoTimer);
    dismiss();
  }, { once: true });
}

function initScrollObserver() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => el.classList.add('is-visible'));
  }
}

// ==========================================
// 2. UNIFIED HIGH-PERFORMANCE ACTIVE SECTION TRACKER
// ==========================================
function initNavScrollTracker() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar nav a:not(.nav-contact)');
  const sideItems = document.querySelectorAll('.side-nav-item');

  if (!sections.length) return;

  let ticking = false;

  function updateActive() {
    const scrollPos = window.pageYOffset + 140;
    let currentId = '';

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
        break;
      }
    }

    if (currentId) {
      navLinks.forEach((link) => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
      });
      sideItems.forEach((item) => {
        item.classList.toggle('active-slide', item.getAttribute('href') === `#${currentId}`);
      });
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateActive);
      ticking = true;
    }
  }, { passive: true });

  updateActive();
}

function initPipelineConsole() {
  const steps = document.querySelectorAll('.pipeline-step');
  const title = document.getElementById('consoleTitle');
  const output = document.getElementById('consoleOutput');
  const exitCode = document.getElementById('consoleExitCode');
  const runBtn = document.getElementById('runPipelineBtn');
  const rerunBtn = document.getElementById('retriggerConsoleBtn');
  const progress = document.getElementById('pipelineProgress');

  let simulationTimer = null;
  let isSimulating = false;

  const logs = {
    1: {
      title: 'Stage 1: Gitleaks Pre-Commit Secret Scanner',
      log: `[INFO] gitleaks protect --verbose --redact --staged
[INFO] Scanning staged commits against 140+ credential entropy patterns...
[INFO] Checked 24 files & 3,210 lines of code.
[INFO] Private RSA Keys: 0 DETECTED | Cloud API Tokens: 0 DETECTED
[SUCCESS] Secret audit passed. Clean commit approved for CI pipeline.`
    },
    2: {
      title: 'Stage 2: SonarQube SAST & Snyk Dependency Scan',
      log: `[INFO] sonar-scanner -Dsonar.projectKey=devops-platform
[INFO] SonarQube Quality Gate: PASSED (Bugs: 0, Vulns: 0, Code Smells: 0)
[INFO] snyk test --severity-threshold=high
[INFO] Tested 348 dependencies: 0 vulnerable paths found
[SUCCESS] Static analysis and software composition analysis cleared.`
    },
    3: {
      title: 'Stage 3: Docker Multi-Stage Build & Trivy Image Audit',
      log: `[INFO] docker build -t ghcr.io/anisahmed/portfolio:v2.5.0 .
[INFO] Multi-stage build completed: Unprivileged user (UID 101)
[INFO] trivy image --severity HIGH,CRITICAL ghcr.io/anisahmed/portfolio:v2.5.0
[INFO] Scanned OS packages & binaries: 0 Vulnerabilities Detected
[SUCCESS] Pushed signed image digest sha256:8fa2b4 to container registry.`
    },
    4: {
      title: 'Stage 4: Checkov & Open Policy Agent (OPA) IaC Validation',
      log: `[INFO] checkov -d ./terraform --framework terraform
[INFO] Passed checks: 42, Failed: 0, Skipped: 0
[INFO] conftest test --policy ./policy/ terraform.tfplan.json
[INFO] OPA Rego Evaluation: rule 'restrict_public_ssh' - ALLOWED
[SUCCESS] Terraform configuration meets CIS Level 1 compliance.`
    },
    5: {
      title: 'Stage 5: Production Deployment Approval Gate',
      log: `[INFO] Change advisory request #CR-9481 generated for production promotion
[INFO] Webhook sent to Slack #devops-change-advisory with plan summary
[INFO] Digital authorization received from Lead DevOps Engineer (Anis Ahmed)
[INFO] Target Clusters: AWS EKS (ap-south-1) & Azure AKS (Central India)
[SUCCESS] Change approved. Promoting to production GitOps rollout.`
    },
    6: {
      title: 'Stage 6: ArgoCD GitOps Reconciliation & Canary Rollout',
      log: `[INFO] argocd app sync multi-cloud-portfolio --prune
[INFO] Git revision 'main' synchronized across multi-cloud clusters
[INFO] Shifted canary traffic: 10% -> 50% -> 100%
[INFO] Prometheus health probe check: HTTP 200 OK (P99: 14ms)
[SUCCESS] Zero-downtime release completed successfully on https://anisahmed.in`
    }
  };

  function selectStage(stepNum, isRunning) {
    steps.forEach((s) => {
      s.classList.remove('active');
      if (s.getAttribute('data-step') === String(stepNum)) {
        s.classList.add('active');
      }
    });

    if (logs[stepNum] && title && output) {
      title.innerText = logs[stepNum].title;
      output.innerText = logs[stepNum].log;
    }

    if (exitCode) {
      if (isRunning) {
        exitCode.style.color = 'var(--amber)';
        exitCode.innerText = `[STAGE ${stepNum}/6: RUNNING...]`;
      } else {
        exitCode.style.color = 'var(--emerald)';
        exitCode.innerText = '[EXIT CODE: 0]';
      }
    }

    if (progress) {
      progress.style.width = `${(stepNum / 6) * 100}%`;
    }
  }

  function stopSimulation() {
    if (simulationTimer) {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }
    isSimulating = false;
    if (runBtn) {
      runBtn.classList.remove('running');
      runBtn.classList.remove('completed');
      const icon = runBtn.querySelector('.run-btn-icon');
      const text = runBtn.querySelector('.run-btn-text');
      if (icon) icon.innerText = '▶';
      if (text) text.innerText = 'Simulate CI/CD Flow';
    }
  }

  function startSimulation() {
    stopSimulation();
    isSimulating = true;

    let currentStep = 1;
    selectStage(currentStep, true);

    if (runBtn) {
      runBtn.classList.add('running');
      const icon = runBtn.querySelector('.run-btn-icon');
      const text = runBtn.querySelector('.run-btn-text');
      if (icon) icon.innerText = '⟳';
      if (text) text.innerText = 'Simulating... (1/6)';
    }

    simulationTimer = setInterval(() => {
      currentStep++;
      if (currentStep <= 6) {
        selectStage(currentStep, true);
        if (runBtn) {
          const text = runBtn.querySelector('.run-btn-text');
          if (text) text.innerText = `Simulating... (${currentStep}/6)`;
        }
      } else {
        clearInterval(simulationTimer);
        simulationTimer = null;
        isSimulating = false;

        selectStage(6, false);
        if (exitCode) {
          exitCode.style.color = 'var(--emerald)';
          exitCode.innerText = '[DEPLOYED: ALL CHECKS PASSED]';
        }

        if (runBtn) {
          runBtn.classList.remove('running');
          runBtn.classList.add('completed');
          const icon = runBtn.querySelector('.run-btn-icon');
          const text = runBtn.querySelector('.run-btn-text');
          if (icon) icon.innerText = '✔';
          if (text) text.innerText = 'Pipeline Complete!';
        }

        setTimeout(() => {
          if (!isSimulating && runBtn) {
            runBtn.classList.remove('completed');
            const icon = runBtn.querySelector('.run-btn-icon');
            const text = runBtn.querySelector('.run-btn-text');
            if (icon) icon.innerText = '▶';
            if (text) text.innerText = 'Simulate CI/CD Flow';
          }
        }, 3000);
      }
    }, 1100);
  }

  steps.forEach((step) => {
    step.addEventListener('click', () => {
      stopSimulation();
      const stepNum = step.getAttribute('data-step');
      selectStage(stepNum, false);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      startSimulation();
    });
  }

  if (rerunBtn) {
    rerunBtn.addEventListener('click', () => {
      startSimulation();
    });
  }
}

// ==========================================
// 4. LIVE INTERACTIVE MAC-STYLE LINUX TERMINAL & AI ASSISTANT
// ==========================================
function initMacTerminal() {
  const terminal = document.querySelector('.terminal-card');
  const terminalBody = document.getElementById('terminalOutputBody');
  const input = document.getElementById('liveTerminalInput');
  const chips = document.querySelectorAll('.terminal-chip');

  if (!terminal || !input) return;

  const cmdHistory = [];
  let historyIdx = -1;
  let currentDir = '/home/anisahmed';

  // Virtual Filesystem for Linux commands (cat, ls, etc.)
  const virtualFS = {
    'mission.txt': `“Automate everything. Break nothing.”
Enforce DevSecOps · Scale with resilience.`,

    'experience.txt': `<span style="color:var(--blue); font-weight:700;">ANIS AHMED — SENIOR DEVOPS ENGINEER</span>
• Tenure:          5.5 Years (July 2021 — Present)
• Specialization:  Google Cloud Platform (GCP) & AWS, Platform Engineering
• Location:        Gurugram, India (Open to Remote Global)
• Core Focus:      Kubernetes, Terraform, CI/CD Automation (70% Effort Reduction),
                   DevSecOps (SAST/DAST/SCA), AIOps & GenAI/RAG, Site Reliability Engineering (SRE)`,

    'skills.txt': `<span style="color:var(--blue); font-weight:700;">TECHNICAL SKILLS INVENTORY:</span>
• <span style="color:var(--emerald);">Cloud Platforms:</span>  Google Cloud Platform (GCP), AWS
• <span style="color:var(--emerald);">GCP Services:</span>     Compute Engine, GKE, Cloud Storage, Cloud SQL, IAM, VPC, Cloud Monitoring, Cloud Logging
• <span style="color:var(--emerald);">AWS Services:</span>     EC2, S3, IAM, VPC, RDS, CloudWatch, EKS
• <span style="color:var(--emerald);">Containers:</span>       Docker, Kubernetes, Helm, GKE, EKS
• <span style="color:var(--emerald);">IaC:</span>              Terraform, CloudFormation
• <span style="color:var(--emerald);">CI/CD:</span>            Jenkins, GitLab CI/CD, GitHub Actions, Azure DevOps
• <span style="color:var(--emerald);">DevSecOps:</span>        SAST, DAST, SCA, SonarQube, Snyk, Trivy, Gitleaks
• <span style="color:var(--emerald);">AI & AIOps:</span>        GenAI, RAG, Prompt Engineering, GCP AIOps anomaly detection
• <span style="color:var(--emerald);">Scripting:</span>         Python, Bash, Shell, Go
• <span style="color:var(--emerald);">Monitoring:</span>        Prometheus, Grafana, ELK Stack, CloudWatch, GCP Cloud Monitoring
• <span style="color:var(--emerald);">Networking:</span>        VPC, DNS, Load Balancing, Firewalls, VPN, TCP/IP`,

    'achievements.txt': `<span style="color:var(--emerald); font-weight:700;">KEY PRODUCTION ACHIEVEMENTS — ANIS AHMED:</span>
• <span style="color:var(--blue);">CI/CD Optimization:</span>  Reduced manual deployment efforts by <strong style="color:#ffffff;">70%</strong> across pipelines.
• <span style="color:var(--blue);">Shift-Left Security:</span>  Integrated SAST, DAST, and SCA scanning into delivery gates.
• <span style="color:var(--blue);">Generative AI & RAG:</span>  Explored RAG & LLM solutions for operational knowledge & troubleshooting.
• <span style="color:var(--blue);">Cloud Scalability:</span>   Managed resilient, high-availability GCP & AWS infrastructure.
• <span style="color:var(--blue);">IaC Reproducibility:</span>  Engineered reusable Terraform configurations and Ansible playbooks.`,

    'devsecops.json': `{
  "sast": "SonarQube (Static Application Security Testing — Code Quality Gate)",
  "dast": "Dynamic Application Security Testing (Runtime API & Endpoint audit)",
  "sca": "Snyk (Software Composition Analysis for vulnerable dependencies)",
  "secrets": "Gitleaks (Entropy credential detection & pre-commit blocking)",
  "container": "Trivy (Container Image CVE & SBOM auditor)",
  "iac_policy": ["Checkov (CIS benchmarks)", "Open Policy Agent (Rego rules)"],
  "aiops": "GCP Cloud Monitoring & Anomaly Detection"
}`,

    'contact.txt': `<span style="color:var(--blue); font-weight:700;">DIRECT CONTACT CHANNELS:</span>
• Email:    <a href="mailto:contact@anisahmed.in" style="color:var(--blue); text-decoration:underline;">contact@anisahmed.in</a>
• LinkedIn: <a href="https://www.linkedin.com/in/webanis" target="_blank" style="color:var(--blue); text-decoration:underline;">linkedin.com/in/webanis</a>
• GitHub:   <a href="https://github.com/anisahmed01" target="_blank" style="color:var(--blue); text-decoration:underline;">github.com/anisahmed01</a>
• Website:  https://anisahmed.in`,

    'projects.txt': `<span style="color:var(--blue); font-weight:700;">FLAGSHIP MULTI-CLOUD PROJECTS:</span>
01. Multi-Cloud Kubernetes Delivery Engine (GKE + EKS + ArgoCD)
02. Automated Shift-Left DevSecOps Pipeline (SonarQube + Snyk + Trivy)
03. Event-Driven Auto-Remediation & SRE Framework (Python + CloudWatch)
04. Modular Multi-Cloud Terraform Framework with OPA Policy as Code
05. Enterprise Observability & Centralized Logging Stack (Prometheus + Grafana + ELK)`
  };

  // Structured commands and simulated Linux CLI
  const commands = {
    help: () => `
<span style="color:var(--blue); font-weight:700;">AVAILABLE TERMINAL COMMANDS & AI QUERIES:</span>

<span style="color:var(--purple); font-weight:700;">[LINUX UTILITIES]</span>
  <span style="color:var(--emerald);">ls</span> | <span style="color:var(--emerald);">ls -la</span>                   List files in current directory
  <span style="color:var(--emerald);">pwd</span>                          Print current working directory
  <span style="color:var(--emerald);">cd &lt;dir&gt;</span>                     Change working directory
  <span style="color:var(--emerald);">cat &lt;file&gt;</span>                   Display file contents (e.g. <code>cat mission.txt</code>)
  <span style="color:var(--emerald);">whoami</span>                       Print current authenticated user
  <span style="color:var(--emerald);">uptime</span>                       Show system uptime and load average
  <span style="color:var(--emerald);">date</span>                         Show current system time
  <span style="color:var(--emerald);">echo &lt;text&gt;</span>                  Print text to console
  <span style="color:var(--emerald);">ping &lt;host&gt;</span>                  Simulate ICMP network ping
  <span style="color:var(--emerald);">curl &lt;url&gt;</span>                   Simulate HTTP GET request
  <span style="color:var(--emerald);">clear</span>                        Clear terminal output

<span style="color:var(--purple); font-weight:700;">[DEVOPS & CLOUD TOOLS]</span>
  <span style="color:var(--emerald);">gcloud container clusters list</span> List GCP GKE clusters
  <span style="color:var(--emerald);">kubectl get nodes</span>            List Kubernetes worker nodes
  <span style="color:var(--emerald);">kubectl get pods</span>             List active container pods
  <span style="color:var(--emerald);">helm list</span>                    List deployed Helm releases
  <span style="color:var(--emerald);">terraform state list</span>          Show managed multi-cloud resources
  <span style="color:var(--emerald);">deploy --env prod</span>            Simulate live zero-downtime canary rollout

<span style="color:var(--purple); font-weight:700;">[AI CHATBOT QUERIES]</span>
  Type keywords or natural questions like:
  <code>experience</code>, <code>skills</code>, <code>projects</code>, <code>email</code>, <code>github</code>, <code>linkedin</code>, <code>certifications</code>, <code>about</code>
`,

    'gcloud container clusters list': () => `
NAME                      LOCATION       MASTER_VERSION  STATUS   NUM_NODES
gke-prod-cluster-asia-s1  asia-south1-a  1.30.2-gke.1    RUNNING  6
gke-rag-aiops-cluster     asia-south1-b  1.30.2-gke.1    RUNNING  4
`,

    'kubectl get nodes': () => `
NAME                             STATUS   ROLES           CLUSTER     VERSION
gke-asia-south1-worker-01        Ready    node,worker     GCP-GKE     v1.30.2
eks-ap-south-1a-worker-01        Ready    node,worker     AWS-EKS     v1.30.2
eks-ap-south-1b-worker-02        Ready    node,worker     AWS-EKS     v1.30.2
`,

    'kubectl get nodes -o wide': () => `
NAME                             STATUS   ROLES           CLUSTER     VERSION   OS-IMAGE
gke-asia-south1-worker-01        Ready    node,worker     GCP-GKE     v1.30.2   Container-Optimized OS
eks-ap-south-1a-worker-01        Ready    node,worker     AWS-EKS     v1.30.2   Amazon Linux 2023
eks-ap-south-1b-worker-02        Ready    node,worker     AWS-EKS     v1.30.2   Amazon Linux 2023
`,

    'kubectl get pods': () => `
NAMESPACE     NAME                                   READY   STATUS    RESTARTS   AGE
production    portfolio-frontend-6b87d89bf5-2zpq7   1/1     Running   0          5d
production    argocd-server-7965448f7f-k9p6q         1/1     Running   0          42d
security      sast-dast-orchestrator-8bc9d-1vqp4     1/1     Running   0          12d
monitoring    prometheus-k8s-0                       2/2     Running   0          42d
`,

    'helm list': () => `
NAME              NAMESPACE     REVISION  STATUS    CHART                    APP VERSION
argo-cd           argocd        3         deployed  argo-cd-6.7.18           v2.11.0
cert-manager      cert-manager  1         deployed  cert-manager-v1.14.4     v1.14.4
ingress-nginx     ingress-nginx 4         deployed  ingress-nginx-4.10.0     1.10.0
kube-prometheus   monitoring    2         deployed  kube-prometheus-58.2.2   v0.73.2
trivy-scanner     security      1         deployed  trivy-operator-0.18.2    0.50.0
`,

    'terraform state list': () => `
google_compute_network.gcp_vpc
google_container_cluster.primary_gke
module.multi_cloud_vpc.aws_vpc.this[0]
module.eks.aws_eks_cluster.this[0]
aws_s3_bucket.terraform_remote_state
aws_dynamodb_table.terraform_state_locks
`,

    whoami: () => `anis-ahmed &mdash; Senior DevOps Engineer (5.5 yrs exp)`,

    pwd: () => `${currentDir}`,

    uptime: () => ` ${new Date().toTimeString().split(' ')[0]} up 142 days, 2 users, load average: 0.08, 0.04, 0.01`,

    date: () => `${new Date().toString()}`,

    'uname -a': () => `Linux cloud-control 6.6.0-devops-platform #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`,
    uname: () => `Linux`,

    deploy: () => commands['deploy --env prod'](),

    'deploy --env prod': () => {
      setTimeout(() => {
        const lines = [
          '⚡ [INIT] Connecting to multi-cloud GCP GKE & AWS EKS production clusters...',
          '🔍 [DEVSECOPS] SAST, DAST, SCA (SonarQube, Snyk, Trivy): PASSED (0 CVEs)',
          '📜 [OPA] Evaluated Terraform & K8s plan against CIS benchmark rules: APPROVED',
          '👤 [SIGN-OFF] Production Approval Gate authorized by Senior DevOps Engineer (Anis Ahmed)',
          '🔄 [GITOPS] ArgoCD syncing canary release across availability zones...',
          '✅ [READY] Health probes 200 OK. Zero-downtime release active on anisahmed.in!',
        ];

        let i = 0;
        const interval = setInterval(() => {
          if (i < lines.length) {
            appendTerminalOutput(`<span style="color:var(--emerald);">${lines[i]}</span>`);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 350);
      }, 100);
      return `<span style="color:var(--amber);">🚀 Initiating multi-cloud GCP & AWS DevSecOps production rollout...</span>`;
    },

    clear: () => {
      const history = document.getElementById('terminalHistory');
      if (history) history.innerHTML = '';
      return '';
    }
  };

  function appendTerminalOutput(htmlContent) {
    const history = document.getElementById('terminalHistory');
    if (!history) return;
    const entry = document.createElement('div');
    entry.style.margin = '4px 0 12px';
    entry.style.color = '#d2dcf6';
    entry.style.lineHeight = '1.6';
    entry.style.whiteSpace = 'pre-wrap';
    entry.innerHTML = htmlContent;
    history.appendChild(entry);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Conversational AI Intent Matcher
  function matchAIQuery(query) {
    const q = query.toLowerCase().trim();

    // Experience queries
    if (/\b(exp|experience|tenure|years|how long|background|work history)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Anis Ahmed brings <strong style="color:#ffffff;">5.5 years of experience</strong> as a Senior DevOps Engineer, specializing in Google Cloud Platform (GCP) and AWS. He is experienced in Kubernetes, Terraform, CI/CD automation (reducing deployment effort by 70%), DevSecOps (SAST/DAST/SCA), and AIOps operational intelligence.`;
    }

    // Skills queries
    if (/\b(skill|skills|tech|technologies|stack|tools|what do you know|capabilities)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Anis's technical core includes:
• <strong style="color:var(--blue);">Cloud:</strong> Google Cloud Platform (GCP) & AWS
• <strong style="color:var(--blue);">Containers:</strong> Kubernetes, Docker, Helm, GKE, EKS
• <strong style="color:var(--blue);">IaC:</strong> Terraform, CloudFormation, Ansible
• <strong style="color:var(--blue);">CI/CD:</strong> Jenkins, GitLab CI/CD, GitHub Actions, Azure DevOps
• <strong style="color:var(--blue);">DevSecOps:</strong> SonarQube (SAST), DAST, Snyk (SCA), Trivy, Gitleaks
• <strong style="color:var(--blue);">AI & AIOps:</strong> Generative AI & RAG for DevOps, GCP AIOps anomaly detection
• <strong style="color:var(--blue);">Scripting:</strong> Python, Bash, Shell, Go
• <strong style="color:var(--blue);">Observability:</strong> Prometheus, Grafana, ELK Stack, CloudWatch`;
    }

    // Email queries
    if (/\b(email|mail|inbox|send email)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> You can contact Anis directly at: <a href="mailto:contact@anisahmed.in" style="color:var(--blue); text-decoration:underline; font-weight:700;">contact@anisahmed.in</a>`;
    }

    // GitHub queries
    if (/\b(github|git|repos|repositories|code)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Explore Anis's open-source repositories and code on GitHub: <a href="https://github.com/anisahmed01" target="_blank" style="color:var(--blue); text-decoration:underline; font-weight:700;">https://github.com/anisahmed01</a>`;
    }

    // LinkedIn queries
    if (/\b(linkedin|profile|network|connect)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Connect with Anis on LinkedIn: <a href="https://www.linkedin.com/in/webanis" target="_blank" style="color:var(--blue); text-decoration:underline; font-weight:700;">https://www.linkedin.com/in/webanis</a>`;
    }

    // Contact / Hire queries
    if (/\b(contact|hire|hiring|reach out|touch|message|talk)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Anis is open to Senior DevOps & Cloud Platform opportunities. Reach out via email at <a href="mailto:contact@anisahmed.in" style="color:var(--blue); text-decoration:underline;">contact@anisahmed.in</a> or on <a href="https://www.linkedin.com/in/webanis" target="_blank" style="color:var(--blue); text-decoration:underline;">LinkedIn</a>.`;
    }

    // Projects queries
    if (/\b(project|projects|portfolio|work|architectures)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Anis has engineered 5 flagship production projects:
1. <strong>Multi-Cloud K8s Delivery Engine</strong> (GKE, EKS, ArgoCD Canary)
2. <strong>Automated Shift-Left DevSecOps Matrix</strong> (SonarQube, Snyk, Trivy)
3. <strong>Event-Driven SRE Auto-Remediation</strong> (Python & CloudWatch)
4. <strong>Modular Multi-Cloud Terraform Framework</strong> with OPA Rego
5. <strong>Enterprise Observability Stack</strong> (Prometheus, Grafana, ELK)
<em>(Run <code>cat projects.txt</code> to read detailed specifications)</em>`;
    }

    // Company / current workplace queries (strict privacy)
    if (/\b(company|employer|where do you work|workplace|current company|organization)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Anis works as a Senior DevOps Engineer based in Gurugram, India, managing enterprise cloud infrastructure across GCP and AWS. (Specific employer details withheld for privacy).`;
    }

    // Location queries
    if (/\b(location|where are you|city|country|based|relocate|remote)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Anis is based in <strong>Gurugram, India</strong>, and is open to remote global opportunities.`;
    }

    // Greetings
    if (/^(hi|hello|hey|yo|greetings|hola|howdy)(\s.*)?$/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Hello! 👋 I am Anis Ahmed's interactive terminal assistant. You can ask me about his <em>experience</em>, <em>skills</em>, <em>projects</em>, or run Linux commands like <code>ls</code>, <code>pwd</code>, <code>cat mission.txt</code>, and <code>kubectl get nodes</code>.`;
    }

    // Certifications
    if (/\b(cert|certs|certification|certifications)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Anis's core proficiencies include Google Cloud Platform (GCP), AWS Architecture, Kubernetes Container Orchestration, Terraform Infrastructure as Code, and Shift-Left DevSecOps.`;
    }

    // About / Bio
    if (/\b(about|who are you|who is anis|bio|summary)\b/.test(q)) {
      return `<span style="color:var(--emerald); font-weight:700;">🤖 AI Assistant:</span> Anis Ahmed is a Senior DevOps Engineer with 5.5 years of experience specializing in GCP and AWS cloud environments, Kubernetes, Terraform, and automated DevSecOps pipelines.`;
    }

    return null;
  }

  function executeCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    cmdHistory.push(raw);
    historyIdx = cmdHistory.length;

    // Display user input prompt
    appendTerminalOutput(`<span style="color:var(--blue); font-weight:600;">$</span> <span style="color:#ffffff;">${raw}</span>`);

    const lower = trimmed.toLowerCase();
    const parts = lower.split(/\s+/);
    const primaryCmd = parts[0];
    const args = parts.slice(1);

    // 1. Direct command match in commands dictionary
    if (commands[lower]) {
      const res = commands[lower]();
      if (res) appendTerminalOutput(res);
      return;
    }

    // 2. Linux 'cat' command parser (e.g. 'cat mission.txt', 'cat experience.txt')
    if (primaryCmd === 'cat') {
      if (args.length === 0) {
        appendTerminalOutput(`<span style="color:var(--amber);">usage: cat &lt;filename&gt;</span>\nTry: <code>cat mission.txt</code> or run <code>ls</code> to see available files.`);
        return;
      }
      let filename = args[0];
      // Normalize filename if .txt was omitted
      if (!virtualFS[filename] && virtualFS[filename + '.txt']) {
        filename = filename + '.txt';
      }
      if (virtualFS[filename]) {
        appendTerminalOutput(virtualFS[filename]);
      } else {
        appendTerminalOutput(`<span style="color:var(--red);">cat: ${args[0]}: No such file or directory</span>\nType <code>ls</code> to view accessible files.`);
      }
      return;
    }

    // 3. Linux 'ls' or 'dir' command parser
    if (primaryCmd === 'ls' || primaryCmd === 'dir') {
      const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
      if (isLong) {
        let output = `total 28\n`;
        output += `drwxr-xr-x 2 anisahmed devops 4096 Nov 09 18:45 .\n`;
        output += `drwxr-xr-x 3 root       root   4096 Nov 09 18:45 ..\n`;
        for (const [name, content] of Object.entries(virtualFS)) {
          const size = content.length;
          output += `-rw-r--r-- 1 anisahmed devops ${String(size).padStart(4, ' ')} Nov 09 18:45 <span style="color:var(--emerald);">${name}</span>\n`;
        }
        appendTerminalOutput(output.trim());
      } else {
        const fileList = Object.keys(virtualFS).map(f => `<span style="color:var(--emerald);">${f}</span>`).join('   ');
        appendTerminalOutput(fileList);
      }
      return;
    }

    // 4. Linux 'cd' command parser
    if (primaryCmd === 'cd') {
      const target = args[0] || '~';
      if (target === '~' || target === '/home/anisahmed' || target === '') {
        currentDir = '/home/anisahmed';
        appendTerminalOutput(`<span style="color:var(--muted);">Switched to ${currentDir}</span>`);
      } else if (target === '..' || target === '/') {
        currentDir = '/';
        appendTerminalOutput(`<span style="color:var(--muted);">Switched to /</span>`);
      } else if (target === '/root') {
        appendTerminalOutput(`<span style="color:var(--red);">bash: cd: /root: Permission denied</span>`);
      } else {
        appendTerminalOutput(`<span style="color:var(--muted);">Switched to /home/anisahmed/${target}</span>`);
      }
      return;
    }

    // 5. Linux 'echo' command parser
    if (primaryCmd === 'echo') {
      const msg = trimmed.substring(5).trim();
      appendTerminalOutput(msg || '');
      return;
    }

    // 6. Linux 'ping' command parser
    if (primaryCmd === 'ping') {
      const host = args[0] || 'anisahmed.in';
      appendTerminalOutput(`PING ${host} (104.21.54.20): 56 data bytes
64 bytes from ${host}: icmp_seq=1 ttl=58 time=14.2 ms
64 bytes from ${host}: icmp_seq=2 ttl=58 time=13.9 ms
64 bytes from ${host}: icmp_seq=3 ttl=58 time=14.1 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss`);
      return;
    }

    // 7. Linux 'curl' command parser
    if (primaryCmd === 'curl') {
      const url = args[0] || 'https://anisahmed.in/api/status';
      appendTerminalOutput(`HTTP/2 200 OK
content-type: application/json; charset=utf-8
server: cloudflare

{
  "status": "UP",
  "author": "Anis Ahmed",
  "role": "Senior DevOps Engineer",
  "experience_years": 5.5,
  "cluster_availability": "99.99%",
  "cloud_providers": ["GCP", "AWS"],
  "kubernetes": "Ready"
}`);
      return;
    }

    // 8. Linux 'sudo' command parser
    if (primaryCmd === 'sudo') {
      appendTerminalOutput(`<span style="color:var(--emerald);">[sudo] privilege granted:</span> User <code>anisahmed</code> already holds Cloud Platform Administrator credentials.`);
      return;
    }

    // 9. AI Chatbot conversational intent handler
    const aiAnswer = matchAIQuery(lower);
    if (aiAnswer) {
      appendTerminalOutput(aiAnswer);
      return;
    }

    // 10. Fallback: command not found with helpful suggestion
    appendTerminalOutput(`
<span style="color:var(--red);">bash: command not found: ${raw}</span>
Type <span style="color:var(--blue); font-weight:700;">help</span> to see all supported DevOps commands and AI queries, or try <code>cat mission.txt</code>.
`);
  }

  // Click on terminal body focuses the input
  terminal.addEventListener('click', () => {
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        input.value = cmdHistory[historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        input.value = cmdHistory[historyIdx] || '';
      } else {
        historyIdx = cmdHistory.length;
        input.value = '';
      }
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const cmd = chip.getAttribute('data-cmd') || chip.innerText.trim();
      executeCommand(cmd);
    });
  });
}

// ==========================================
// 5. VISITOR & PROFILE ANALYTICS TELEMETRY
// ==========================================
function initVisitorAnalytics() {
  const userVisitsElem = document.getElementById('userVisitCount');
  const globalViewsElem = document.getElementById('globalProfileViews');

  // Cooldown window: 10 minutes (600,000 ms)
  // If user returns after 10 mins, 1 hour, or 1 day, it increments genuine visits!
  const COOLDOWN_MS = 10 * 60 * 1000;
  const now = Date.now();

  const lastVisitKey = 'anis_last_visit_timestamp';
  const userVisitsKey = 'anis_user_visits_count';
  const totalViewsKey = 'anis_total_views_count';
  const BASELINE_VIEWS = 1420;

  let lastVisitTime = parseInt(localStorage.getItem(lastVisitKey) || '0', 10);
  let userVisits = parseInt(localStorage.getItem(userVisitsKey) || '0', 10);
  let totalViews = parseInt(localStorage.getItem(totalViewsKey) || '0', 10);

  if (totalViews < BASELINE_VIEWS) {
    totalViews = BASELINE_VIEWS;
  }

  // Check if this visit is outside cooldown (first visit, or returning after 10m / 1hr / 1day)
  if (!lastVisitTime || (now - lastVisitTime) >= COOLDOWN_MS) {
    userVisits += 1;
    totalViews += 1;
    localStorage.setItem(userVisitsKey, userVisits);
    localStorage.setItem(totalViewsKey, totalViews);
    localStorage.setItem(lastVisitKey, now);
  }

  // Update DOM displays (strictly clean numbers, no '+' icon)
  if (userVisitsElem) {
    userVisitsElem.innerText = userVisits <= 1 ? '#1 (First)' : `#${userVisits}`;
  }

  if (globalViewsElem) {
    globalViewsElem.innerText = totalViews.toLocaleString();
  }

  // Live GoatCounter genuine count integration
  if (window.fetch) {
    fetch('https://anisahmed.goatcounter.com/counter//.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.count) {
          const rawCount = parseInt(String(data.count).replace(/[^0-9]/g, ''), 10);
          if (!isNaN(rawCount) && rawCount > 0) {
            const verifiedTotal = BASELINE_VIEWS + rawCount;
            if (verifiedTotal > totalViews) {
              totalViews = verifiedTotal;
              localStorage.setItem(totalViewsKey, totalViews);
              if (globalViewsElem) {
                globalViewsElem.innerText = totalViews.toLocaleString();
              }
            }
          }
        }
      })
      .catch(() => {});
  }

  // Picture download privacy protection (blocks right-click & drag)
  const portraitCapsule = document.querySelector('.hero-portrait-capsule');
  if (portraitCapsule) {
    portraitCapsule.addEventListener('contextmenu', (e) => e.preventDefault());
    portraitCapsule.addEventListener('dragstart', (e) => e.preventDefault());
  }
}

// ==========================================
// 6. FLOATING RIGHT-SIDE HOVER SECTION JUMPER
// ==========================================
function initSideNavNavigator() {
  const wrapper = document.querySelector('.side-nav-wrapper');
  const trigger = document.querySelector('.side-nav-trigger');
  const items = document.querySelectorAll('.side-nav-item');

  if (!wrapper) return;

  // Mobile tap toggle
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      wrapper.classList.toggle('is-open');
    });
  }

  // Fast, jitter-free smooth scroll jumping
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetSec = document.querySelector(targetId);
      if (targetSec) {
        const headerOffset = 70;
        const elementPosition = targetSec.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      wrapper.classList.remove('is-open');
    });
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove('is-open');
    }
  });
}