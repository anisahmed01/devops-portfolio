// ==========================================
// Anis Ahmed — DevOps Portfolio Interactive Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initIntroSplash();
  initScrollObserver();
  initNavScrollTracker();
  initPipelineConsole();
  initMacTerminal();
});

// ==========================================
// 0. CINEMATIC INTRO SPLASH DISSOLVE
// ==========================================
function initIntroSplash() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  const quoteWrap = document.getElementById('introQuoteWrap');
  const badge = overlay.querySelector('.intro-badge');
  const author = overlay.querySelector('.intro-author');

  // Create full-screen high-DPI canvas for the squares
  const canvas = document.createElement('canvas');
  canvas.id = 'introSquareCanvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  overlay.insertBefore(canvas, overlay.firstChild);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    if (!overlay.parentNode) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Small squares particle system
  const NUM_SQUARES = 160;
  const colors = ['#54c8ff', '#57e6a5', '#a78bfa', '#ffd166', '#ffffff'];
  const squares = [];

  const centerX = width / 2;
  const centerY = height / 2;

  // Initialize squares scattered across full screen in 3D
  for (let i = 0; i < NUM_SQUARES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * Math.max(width, height) * 0.85 + 120;
    const startX = centerX + Math.cos(angle) * dist;
    const startY = centerY + Math.sin(angle) * dist;

    // Target region around center
    const targetX = centerX + (Math.random() - 0.5) * Math.min(width * 0.75, 820);
    const targetY = centerY + (Math.random() - 0.5) * 240;

    // Exit vector when dispersing away
    const exitAngle = angle + (Math.random() - 0.5) * 0.6;
    const exitDist = Math.max(width, height) * 1.5;
    const exitX = centerX + Math.cos(exitAngle) * exitDist;
    const exitY = centerY + Math.sin(exitAngle) * exitDist;

    squares.push({
      startX,
      startY,
      targetX,
      targetY,
      exitX,
      exitY,
      currX: startX,
      currY: startY,
      baseSize: Math.floor(Math.random() * 11) + 6, // 6px to 16px small squares
      currSize: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      delay: Math.random() * 0.35, // staggered arrival
      alpha: 0
    });
  }

  const startTime = performance.now();
  const PHASE1_DUR = 1200; // ms: collecting pieces & coming close
  const PHASE2_DUR = 1100; // ms: hold & glow
  const PHASE3_DUR = 850;  // ms: disappearing / going away into distance

  let animFrameId;

  function render(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, width, height);

    if (elapsed < PHASE1_DUR) {
      // --- PHASE 1: COLLECTING & COMING CLOSE ---
      const p = Math.min(1, elapsed / PHASE1_DUR);

      squares.forEach(sq => {
        const sqP = Math.max(0, Math.min(1, (p - sq.delay) / (1 - sq.delay)));
        const ease = 1 - Math.pow(1 - sqP, 3);

        sq.currX = sq.startX + (sq.targetX - sq.startX) * ease;
        sq.currY = sq.startY + (sq.targetY - sq.startY) * ease;
        // Coming close: zoom size up as they fly toward the viewer
        sq.currSize = sq.baseSize * ease;
        sq.alpha = ease * 0.95;
        sq.rot += sq.rotSpeed;

        drawSquare(ctx, sq);
      });

      // Reveal text cleanly from scratch as pieces arrive
      if (p > 0.55) {
        overlay.classList.add('intro-revealed');
      }

    } else if (elapsed < PHASE1_DUR + PHASE2_DUR) {
      // --- PHASE 2: HOLD & VIBRANT GLOW ---
      overlay.classList.add('intro-revealed');

      squares.forEach(sq => {
        sq.currX = sq.targetX;
        sq.currY = sq.targetY;
        sq.currSize = sq.baseSize;
        sq.alpha = 0.75 + Math.sin(now * 0.005 + sq.startX) * 0.2;
        sq.rot += sq.rotSpeed * 0.4;

        drawSquare(ctx, sq);
      });

    } else if (elapsed < PHASE1_DUR + PHASE2_DUR + PHASE3_DUR) {
      // --- PHASE 3: GOING AWAY & DISAPPEARING ---
      const p3 = Math.min(1, (elapsed - (PHASE1_DUR + PHASE2_DUR)) / PHASE3_DUR);
      const easeOut = Math.pow(p3, 2.5);

      overlay.classList.add('intro-disperse');

      squares.forEach(sq => {
        sq.currX = sq.targetX + (sq.exitX - sq.targetX) * easeOut;
        sq.currY = sq.targetY + (sq.exitY - sq.targetY) * easeOut;
        // Going away: shrink and dissolve into deep space
        sq.currSize = Math.max(0, sq.baseSize * (1 - easeOut));
        sq.alpha = Math.max(0, (1 - easeOut) * 0.9);
        sq.rot += sq.rotSpeed * 3;

        drawSquare(ctx, sq);
      });

    } else {
      // Completed - dismiss overlay cleanly
      cancelAnimationFrame(animFrameId);
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
      }, 550);
      return;
    }

    animFrameId = requestAnimationFrame(render);
  }

  function drawSquare(c, sq) {
    if (sq.currSize <= 0 || sq.alpha <= 0) return;
    c.save();
    c.translate(sq.currX, sq.currY);
    c.rotate(sq.rot);
    c.globalAlpha = sq.alpha;
    c.fillStyle = sq.color;
    c.shadowColor = sq.color;
    c.shadowBlur = 10;
    c.fillRect(-sq.currSize / 2, -sq.currSize / 2, sq.currSize, sq.currSize);
    c.restore();
  }

  animFrameId = requestAnimationFrame(render);
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
  <span style="color:var(--emerald);">kubectl get nodes</span>      List AWS EKS & Azure AKS nodes
  <span style="color:var(--emerald);">kubectl get pods</span>       List active microservice pods
  <span style="color:var(--emerald);">helm list</span>               List deployed Helm releases
  <span style="color:var(--emerald);">terraform state list</span>    Show managed cloud infrastructure
  <span style="color:var(--emerald);">cat devsecops.json</span>      Output 7-pillar security tooling
  <span style="color:var(--emerald);">cat experience.txt</span>      View 5+ years track record
  <span style="color:var(--emerald);">cat contact.txt</span>         Display email & LinkedIn
  <span style="color:var(--emerald);">deploy --env prod</span>       Simulate live canary rollout
  <span style="color:var(--emerald);">clear</span>                   Clear terminal window
`,
    'kubectl get nodes': () => `
NAME                             STATUS   ROLES           CLUSTER     VERSION
eks-ap-south-1a-worker-01        Ready    node,worker     AWS-EKS     v1.30.2
eks-ap-south-1b-worker-02        Ready    node,worker     AWS-EKS     v1.30.2
aks-centralindia-nodepool-01     Ready    node,worker     Azure-AKS   v1.30.2
`,
    'kubectl get nodes -o wide': () => `
NAME                             STATUS   ROLES           CLUSTER     VERSION   OS-IMAGE
eks-ap-south-1a-worker-01        Ready    node,worker     AWS-EKS     v1.30.2   Amazon Linux 2023
eks-ap-south-1b-worker-02        Ready    node,worker     AWS-EKS     v1.30.2   Amazon Linux 2023
aks-centralindia-nodepool-01     Ready    node,worker     Azure-AKS   v1.30.2   Ubuntu 22.04 LTS
`,
    'kubectl get pods': () => `
NAMESPACE     NAME                                   READY   STATUS    RESTARTS   AGE
production    portfolio-frontend-6b87d89bf5-2zpq7   1/1     Running   0          5d
production    argocd-server-7965448f7f-k9p6q         1/1     Running   0          42d
ingress-nginx ingress-nginx-controller-6d7c6-m5w4q   1/1     Running   0          42d
monitoring    prometheus-k8s-0                       2/2     Running   0          42d
`,
    'helm list': () => `
NAME              NAMESPACE     REVISION  STATUS    CHART                    APP VERSION
argo-cd           argocd        3         deployed  argo-cd-6.7.18           v2.11.0
cert-manager      cert-manager  1         deployed  cert-manager-v1.14.4     v1.14.4
ingress-nginx     ingress-nginx 4         deployed  ingress-nginx-4.10.0     1.10.0
kube-prometheus   monitoring    2         deployed  kube-prometheus-58.2.2   v0.73.2
falco-runtime     security      1         deployed  falco-3.8.4              0.37.1
`,
    'terraform state list': () => `
module.multi_cloud_vpc.aws_vpc.this[0]
module.multi_cloud_vpc.aws_subnet.private[0]
module.eks.aws_eks_cluster.this[0]
module.azure_aks.azurerm_kubernetes_cluster.k8s
aws_s3_bucket.terraform_remote_state
aws_dynamodb_table.terraform_state_locks
`,
    'cat devsecops.json': () => `
{
  "secrets": "Gitleaks (Entropy detection & pre-commit blocking)",
  "sast": "SonarQube (Grade A quality gate)",
  "sca": "Snyk (Vulnerable third-party dependency scanner)",
  "container": "Trivy (Image CVE & SBOM auditor)",
  "iac_policy": ["Checkov (CIS benchmarks)", "Open Policy Agent (Rego rules)"],
  "runtime": "Falco (Kernel eBPF anomaly detection)"
}
`,
    quote: () => {
      // Build the animated quote inside the terminal
      const wrapper = document.createElement('div');
      wrapper.className = 'quote-anim-wrapper';

      const quoteText = '\u201cAutomate everything. Break nothing.\u201d \u2014 Anis Ahmed';
      [...quoteText].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'q-char';
        span.textContent = ch === ' ' ? '\u00a0' : ch;
        // random scatter direction for each character
        const dx = (Math.random() * 160 - 80).toFixed(1);
        const dy = (Math.random() * 100 - 50).toFixed(1);
        span.style.setProperty('--dx', dx + 'px');
        span.style.setProperty('--dy', dy + 'px');
        wrapper.appendChild(span);
      });

      const history = document.getElementById('terminalHistory');
      if (history) {
        const entry = document.createElement('div');
        entry.style.margin = '4px 0 12px';
        entry.appendChild(wrapper);
        history.appendChild(entry);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        // Phase 1: assemble (characters fly IN from random positions)
        // Phase 2 (after 2.4s): shatter into squares and fade out
        setTimeout(() => {
          wrapper.classList.add('q-shatter');
        }, 2400);
      }
      return '';
    },
    'cat experience.txt': () => `
<span style="color:var(--blue); font-weight:700;">ANIS AHMED — DEVOPS ENGINEER</span>
• Experience: 5+ years (July 2021 — Present)
• Location: Delhi, India (Open to Remote Global)
• Core Platforms: AWS, GCP, Azure, Kubernetes, Terraform, CI/CD, DevSecOps
• Mission: Automating platforms that never fail and scaling deployments with confidence.
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
          '⚡ [INIT] Connecting to multi-cloud EKS & AKS production clusters...',
          '🔍 [DEVSECOPS] Gitleaks, SonarQube & Trivy verification: PASSED (0 CVEs)',
          '📜 [OPA] Evaluated Terraform & K8s plan against Rego compliance: APPROVED',
          '👤 [SIGN-OFF] Production Approval Gate authorized by Anis Ahmed',
          '🔄 [GITOPS] ArgoCD syncing canary release across availability zones...',
          '✅ [READY] Health probes 200 OK. 0 Downtime Canary Rollout Completed on anisahmed.in!',
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
      return `<span style="color:var(--amber);">🚀 Initiating multi-cloud DevSecOps production rollout...</span>`;
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
