// ==========================================
// Anis Ahmed — DevOps Portfolio Interactive Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollObserver();
  initNavScrollTracker();
  initPipelineConsole();
  initTerminalTyping();
});

// ==========================================
// 1. ROCK-SOLID SCROLL REVEAL OBSERVER
// ==========================================
function initScrollObserver() {
  const elements = document.querySelectorAll('.scroll-reveal');

  const checkVisibility = () => {
    const triggerBottom = window.innerHeight * 0.88;

    elements.forEach((el) => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        el.classList.add('is-visible');
      }
    });
  };

  // Run immediately on load and on scroll
  window.addEventListener('scroll', checkVisibility, { passive: true });
  window.addEventListener('resize', checkVisibility, { passive: true });

  // Initial check (slight timeout to allow DOM layout calculation)
  setTimeout(checkVisibility, 50);
}

// ==========================================
// 2. ACTIVE NAVBAR SCROLL TRACKER
// ==========================================
function initNavScrollTracker() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar nav a:not(.nav-contact)');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active-link');
      }
    });
  }, { passive: true });
}

// ==========================================
// 3. INTERACTIVE CI/CD PIPELINE CONSOLE
// ==========================================
function initPipelineConsole() {
  const steps = document.querySelectorAll('.pipeline-step');
  const title = document.getElementById('consoleTitle');
  const output = document.getElementById('consoleOutput');

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

  steps.forEach((step) => {
    step.addEventListener('click', () => {
      steps.forEach((s) => s.classList.remove('active'));
      step.classList.add('active');

      const stepNum = step.getAttribute('data-step');
      if (logs[stepNum] && title && output) {
        title.innerText = logs[stepNum].title;
        output.innerText = logs[stepNum].log;
      }
    });
  });
}

// ==========================================
// 4. ANGLED TERMINAL REAL-TIME SIMULATION
// ==========================================
function initTerminalTyping() {
  const terminal = document.querySelector('.terminal-card');
  if (!terminal) return;

  const terminalBody = document.getElementById('terminalOutputBody');

  const extraLogs = [
    { cmd: 'kubectl get nodes -o wide', res: 'eks-worker-01   Ready   node   v1.30.2   AWS-EKS\naks-worker-01   Ready   node   v1.30.2   Azure-AKS' },
    { cmd: 'terraform state list', res: 'module.vpc.aws_vpc.this[0]\nmodule.eks.aws_eks_cluster.this[0]\naws_s3_bucket.terraform_remote_state' },
    { cmd: 'curl -I https://anisahmed.in', res: 'HTTP/2 200\nserver: LiteSpeed\ncontent-type: text/html\nx-managed-by: github-actions' },
  ];

  let currentIdx = 0;
  terminal.addEventListener('click', () => {
    if (currentIdx < extraLogs.length) {
      const item = extraLogs[currentIdx];
      const pCmd = document.createElement('p');
      pCmd.innerHTML = `<span class="prompt">$</span> ${item.cmd}`;

      const pRes = document.createElement('p');
      pRes.className = 'terminal-output';
      pRes.style.whiteSpace = 'pre-wrap';
      pRes.innerText = item.res;

      terminalBody.appendChild(pCmd);
      terminalBody.appendChild(pRes);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      currentIdx++;
    }
  });
}
