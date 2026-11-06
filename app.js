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
});

// ==========================================
// 0. CINEMATIC INTRO SPLASH DISSOLVE
// ==========================================
function initIntroSplash() {
  /* Prevent running multiple times across script tags or re-entry */
  if (window.__introSplashRan) return;
  window.__introSplashRan = true;

  var overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  var badge  = overlay.querySelector('.intro-badge');
  var wrap   = document.getElementById('introQuoteWrap');
  var author = overlay.querySelector('.intro-author');

  /* hide everything initially */
  [badge, wrap, author].forEach(function(el) {
    if (el) { el.style.opacity = '0'; el.style.transition = 'none'; }
  });

  if (wrap) wrap.innerHTML = '';

  /* 2 Distinct Lines: Eliminates any chance of word-splitting like "brea" / "k" */
  var lines = [
    '\u201cAutomate everything.',
    'Break nothing.\u201d'
  ];

  /* smooth gradient across both lines */
  var totalChars = lines[0].length + lines[1].length;
  function charColor(idx) {
    var t = idx / Math.max(1, totalChars - 1);
    var r, g, b;
    if (t < 0.5) {
      var s = t / 0.5;
      r = Math.round(0x54 + (0xa7 - 0x54) * s);
      g = Math.round(0xc8 + (0x8b - 0xc8) * s);
      b = Math.round(0xff + (0xfa - 0xff) * s);
    } else {
      var s = (t - 0.5) / 0.5;
      r = Math.round(0xa7 + (0x57 - 0xa7) * s);
      g = Math.round(0x8b + (0xe6 - 0x8b) * s);
      b = Math.round(0xfa + (0xa5 - 0xfa) * s);
    }
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  var box = document.createElement('div');
  box.style.cssText = [
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'justify-content:center',
    'padding:0 14px',
    'font-size:clamp(1.4rem, 4.2vw, 3.2rem)',
    'font-weight:850',
    'letter-spacing:-1px',
    'line-height:1.25',
    'text-align:center'
  ].join(';');

  var letters = [];
  var globalIdx = 0;

  lines.forEach(function(lineText) {
    var row = document.createElement('div');
    row.style.cssText = 'display:block;white-space:nowrap;margin:2px 0;';

    for (var ci = 0; ci < lineText.length; ci++) {
      var ch = lineText[ci];
      var col = charColor(globalIdx++);
      var span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00a0' : ch;

      /* Scatter distance scaled safely for mobile & desktop */
      var angle = Math.random() * Math.PI * 2;
      var dist  = Math.min(window.innerWidth || 400, 500) * (0.6 + Math.random() * 0.6);
      var dx    = (Math.cos(angle) * dist).toFixed(0);
      var dy    = (Math.sin(angle) * dist).toFixed(0);

      span.style.cssText = [
        'display:inline-block',
        'color:' + col,
        'text-shadow:0 0 16px ' + col,
        'opacity:0',
        'transform:translate(' + dx + 'px,' + dy + 'px) scale(0.2)',
        'transition:none',
        'will-change:transform,opacity'
      ].join(';');

      row.appendChild(span);
      letters.push(span);
    }

    box.appendChild(row);
  });

  if (wrap) {
    wrap.style.opacity = '1';
    wrap.appendChild(box);
  }

  /* Timing */
  var BADGE_DELAY  = 50;
  var FLY_START    = 150;
  var STAGGER      = 22;
  var FLY_DUR      = 600;
  var ASSEMBLE_END = FLY_START + (letters.length - 1) * STAGGER + FLY_DUR;
  var HOLD         = 1400;
  var DISMISS      = ASSEMBLE_END + HOLD;

  requestAnimationFrame(function() {
    if (badge) {
      setTimeout(function() {
        badge.style.transition = 'opacity 0.5s ease';
        badge.style.opacity    = '1';
      }, BADGE_DELAY);
    }

    letters.forEach(function(span, i) {
      setTimeout(function() {
        span.style.transition =
          'transform ' + FLY_DUR + 'ms cubic-bezier(0.16,1,0.3,1),' +
          'opacity 380ms ease';
        span.style.transform = 'translate(0,0) scale(1)';
        span.style.opacity   = '1';
      }, FLY_START + i * STAGGER);
    });

    if (author) {
      setTimeout(function() {
        author.style.transition = 'opacity 0.5s ease';
        author.style.opacity    = '1';
      }, ASSEMBLE_END - 200);
    }

    setTimeout(function() {
      box.style.transition = 'filter 0.5s ease';
      box.style.filter     = 'drop-shadow(0 0 24px rgba(84,200,255,0.5))';
    }, ASSEMBLE_END);

    setTimeout(function() {
      try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch(e) { window.scrollTo(0, 0); }
      overlay.classList.add('fade-out');
      setTimeout(function() { overlay.remove(); }, 650);
    }, DISMISS);
  });
}

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

  window.addEventListener('scroll', checkVisibility, { passive: true });
  window.addEventListener('resize', checkVisibility, { passive: true });
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
// 4. LIVE INTERACTIVE MAC-STYLE LINUX TERMINAL
// ==========================================
function initMacTerminal() {
  const terminal = document.querySelector('.terminal-card');
  const terminalBody = document.getElementById('terminalOutputBody');
  const input = document.getElementById('liveTerminalInput');
  const chips = document.querySelectorAll('.terminal-chip');

  if (!terminal || !input) return;

  const cmdHistory = [];
  let historyIdx = -1;

  const commands = {
    help: () => `
<span style="color:var(--blue); font-weight:700;">AVAILABLE DEVOPS COMMANDS:</span>
  <span style="color:var(--emerald);">gcloud container clusters list</span>  List GCP GKE production clusters
  <span style="color:var(--emerald);">kubectl get nodes</span>              List AWS EKS & Azure AKS nodes
  <span style="color:var(--emerald);">kubectl get pods</span>               List active microservice pods
  <span style="color:var(--emerald);">terraform state list</span>            Show managed multi-cloud infrastructure
  <span style="color:var(--emerald);">cat devsecops.json</span>              Output SAST, DAST, SCA security tooling
  <span style="color:var(--emerald);">cat achievements.txt</span>            View verified production achievements
  <span style="color:var(--emerald);">cat experience.txt</span>              View 5.5 years track record
  <span style="color:var(--emerald);">cat contact.txt</span>                 Display email & LinkedIn
  <span style="color:var(--emerald);">deploy --env prod</span>               Simulate live canary rollout
  <span style="color:var(--emerald);">clear</span>                           Clear terminal window
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
    'cat devsecops.json': () => `
{
  "sast": "SonarQube (Static Application Security Testing — Code Quality Gate)",
  "dast": "Dynamic Application Security Testing (Runtime API & Endpoint audit)",
  "sca": "Snyk (Software Composition Analysis for vulnerable dependencies)",
  "secrets": "Gitleaks (Entropy credential detection & pre-commit blocking)",
  "container": "Trivy (Container Image CVE & SBOM auditor)",
  "iac_policy": ["Checkov (CIS benchmarks)", "Open Policy Agent (Rego rules)"],
  "aiops": "GCP Cloud Monitoring & Anomaly Detection"
}
`,
    'cat achievements.txt': () => `
<span style="color:var(--emerald); font-weight:700;">KEY PRODUCTION ACHIEVEMENTS — ANIS AHMED:</span>
• <span style="color:var(--blue);">CI/CD Optimization:</span> Reduced manual deployment efforts by <strong style="color:#ffffff;">70%</strong> across pipelines.
• <span style="color:var(--blue);">Shift-Left Security:</span> Integrated SAST, DAST, and SCA scanning into delivery gates.
• <span style="color:var(--blue);">Generative AI & RAG:</span> Explored RAG & LLM solutions for DevOps operational support.
• <span style="color:var(--blue);">Cloud Scalability:</span> Managed resilient, high-availability GCP & AWS infrastructure.
• <span style="color:var(--blue);">IaC Reproducibility:</span> Engineered reusable Terraform modules and Ansible playbooks.
`,
    'cat experience.txt': () => `
<span style="color:var(--blue); font-weight:700;">ANIS AHMED — SENIOR DEVOPS ENGINEER</span>
• Location:   Gurugram, India (Open to Remote Global)
• Tenure:     July 2021 — Present (5.5 Years)
• Core Focus: Google Cloud Platform (GCP), AWS, Kubernetes, Terraform
• Key Pillars: CI/CD Automation (70% effort reduction), DevSecOps (SAST/DAST/SCA),
              AIOps & GenAI/RAG, Site Reliability Engineering (SRE)
`,
    'cat contact.txt': () => `
Email:     <a href="mailto:contact@anisahmed.in" style="color:var(--blue); text-decoration:underline;">contact@anisahmed.in</a>
LinkedIn:  <a href="https://www.linkedin.com/in/webanis" target="_blank" style="color:var(--blue); text-decoration:underline;">linkedin.com/in/webanis</a>
GitHub:    <a href="https://github.com/anisahmed01" target="_blank" style="color:var(--blue); text-decoration:underline;">github.com/anisahmed01</a>
Website:   https://anisahmed.in
`,
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

  function executeCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    cmdHistory.push(raw);
    historyIdx = cmdHistory.length;

    // Echo input
    appendTerminalOutput(`<span style="color:var(--blue); font-weight:600;">$</span> <span style="color:#ffffff;">${raw}</span>`);

    if (commands[cmd]) {
      const res = commands[cmd]();
      if (res) appendTerminalOutput(res);
    } else {
      appendTerminalOutput(`
<span style="color:var(--red);">bash: command not found: ${raw}</span>
Type <span style="color:var(--blue);">help</span> to view all supported DevOps commands.
`);
    }
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
