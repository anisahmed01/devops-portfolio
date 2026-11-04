// ==========================================
// Anis Ahmed ΓÇö DevOps Portfolio Interactive Engine
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
  var overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  /* ── grab the three text nodes ── */
  var badge  = overlay.querySelector('.intro-badge');
  var wrap   = document.getElementById('introQuoteWrap');
  var author = overlay.querySelector('.intro-author');

  /* guarantee hidden BEFORE first paint — inline style wins every time */
  [badge, wrap, author].forEach(function(el) {
    if (el) { el.style.opacity = '0'; el.style.transition = 'none'; }
  });

  /* ── full-screen canvas ── */
  var cvs = document.createElement('canvas');
  cvs.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:5;';
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
  overlay.appendChild(cvs);
  var ctx = cvs.getContext('2d');
  var W = cvs.width, H = cvs.height;
  var CX = W * 0.5, CY = H * 0.5;

  /* ── 180 glowing squares ── */
  var COLS = ['#54c8ff','#57e6a5','#a78bfa','#ffd166','#c8e8ff'];
  var sqs  = [];
  for (var i = 0; i < 180; i++) {
    var ang  = Math.random() * Math.PI * 2;
    var dist = (0.65 + Math.random() * 0.55) * Math.max(W, H);
    sqs.push({
      /* start position: scattered around the full screen edges */
      sx: CX + Math.cos(ang) * dist,
      sy: CY + Math.sin(ang) * dist,
      /* landing position: spread over the WHOLE screen */
      lx: CX + (Math.random() - 0.5) * W * 0.9,
      ly: CY + (Math.random() - 0.5) * H * 0.9,
      /* exit position: blast back out even further */
      ex: CX + Math.cos(ang) * dist * 1.6,
      ey: CY + Math.sin(ang) * dist * 1.6,
      sz:  7 + Math.random() * 13,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      rot: Math.random() * 6.28,
      rs:  (Math.random() - 0.5) * 0.14,
      d:   Math.random() * 0.38
    });
  }

  /* timing (ms) */
  var T1 = 1500;   /* phase 1 — collect in */
  var T2 = 1600;   /* phase 2 — hold */
  var T3 = 850;    /* phase 3 — blast out */

  var t0    = performance.now();
  var shown = false;
  var rafId;

  function easeOut(t) { return 1 - Math.pow(1 - Math.min(1, t), 3); }
  function easeIn(t)  { return Math.min(1, t) * Math.min(1, t) * Math.min(1, t); }

  function drawSq(sq, x, y, a) {
    if (a <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(sq.rot);
    ctx.globalAlpha   = Math.min(1, a);
    ctx.fillStyle     = sq.col;
    ctx.shadowColor   = sq.col;
    ctx.shadowBlur    = 18;
    var s = sq.sz / 2;
    ctx.fillRect(-s, -s, sq.sz, sq.sz);
    ctx.restore();
  }

  function showText() {
    if (shown) return;
    shown = true;
    [badge, wrap, author].forEach(function(el) {
      if (!el) return;
      el.style.transition = 'opacity 0.7s ease';
      el.style.opacity    = '1';
    });
  }

  function hideText() {
    [badge, wrap, author].forEach(function(el) {
      if (!el) return;
      el.style.transition = 'opacity 0.4s ease';
      el.style.opacity    = '0';
    });
  }

  function frame(now) {
    var el = now - t0;
    ctx.clearRect(0, 0, W, H);

    if (el < T1) {
      /* ─── PHASE 1: squares fly IN from full-screen edges ─── */
      var p = el / T1;
      sqs.forEach(function(sq) {
        sq.rot += sq.rs;
        var sp = Math.max(0, (p - sq.d) / (1 - sq.d));
        var e  = easeOut(sp);
        drawSq(sq, sq.sx + (sq.lx - sq.sx) * e, sq.sy + (sq.ly - sq.sy) * e, e);
      });
      if (p > 0.65) showText();

    } else if (el < T1 + T2) {
      /* ─── PHASE 2: hold — squares gently pulse ─── */
      showText();
      sqs.forEach(function(sq) {
        sq.rot += sq.rs * 0.25;
        var pulse = 0.55 + 0.4 * Math.sin(now * 0.0022 + sq.sx * 0.008);
        drawSq(sq, sq.lx, sq.ly, pulse);
      });

    } else if (el < T1 + T2 + T3) {
      /* ─── PHASE 3: squares blast OUT across full screen ─── */
      var p3 = (el - T1 - T2) / T3;
      var e3 = easeIn(p3);
      if (p3 > 0.12) hideText();
      sqs.forEach(function(sq) {
        sq.rot += sq.rs * 5;
        drawSq(sq,
          sq.lx + (sq.ex - sq.lx) * e3,
          sq.ly + (sq.ey - sq.ly) * e3,
          1 - e3);
      });

    } else {
      /* ─── DONE ─── */
      cancelAnimationFrame(rafId);
      overlay.classList.add('fade-out');
      setTimeout(function() { overlay.remove(); }, 700);
      return;
    }

    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);
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
    quote: () => `
<span style="color:var(--emerald); font-weight:700;">ΓÇ£Automate everything. Break nothing.ΓÇ¥</span> &mdash; Anis Ahmed
<span style="color:var(--blue);">Thanks for stopping by!</span> ≡ƒæï
`,
    'cat experience.txt': () => `
<span style="color:var(--blue); font-weight:700;">ANIS AHMED ΓÇö DEVOPS ENGINEER</span>
ΓÇó Experience: 5+ years (July 2021 ΓÇö Present)
ΓÇó Location: Delhi, India (Open to Remote Global)
ΓÇó Core Platforms: AWS, GCP, Azure, Kubernetes, Terraform, CI/CD, DevSecOps
ΓÇó Mission: Automating platforms that never fail and scaling deployments with confidence.
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
          'ΓÜí [INIT] Connecting to multi-cloud EKS & AKS production clusters...',
          '≡ƒöì [DEVSECOPS] Gitleaks, SonarQube & Trivy verification: PASSED (0 CVEs)',
          '≡ƒô£ [OPA] Evaluated Terraform & K8s plan against Rego compliance: APPROVED',
          '≡ƒæñ [SIGN-OFF] Production Approval Gate authorized by Anis Ahmed',
          '≡ƒöä [GITOPS] ArgoCD syncing canary release across availability zones...',
          'Γ£à [READY] Health probes 200 OK. 0 Downtime Canary Rollout Completed on anisahmed.in!',
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
      return `<span style="color:var(--amber);">≡ƒÜÇ Initiating multi-cloud DevSecOps production rollout...</span>`;
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
