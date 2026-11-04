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

  var badge  = overlay.querySelector('.intro-badge');
  var wrap   = document.getElementById('introQuoteWrap');
  var author = overlay.querySelector('.intro-author');

  /* hide everything instantly — inline style beats all CSS */
  [badge, wrap, author].forEach(function(el) {
    if (el) { el.style.opacity = '0'; el.style.transition = 'none'; }
  });

  /* ── Build the quote from scratch — nothing pre-existing ── */
  if (wrap) wrap.innerHTML = '';  /* wipe any HTML text that was there */

  var QUOTE = '\u201cAutomate everything. Break nothing.\u201d';

  /* gradient colours interpolated per character */
  function charColor(i, total) {
    var t = i / Math.max(1, total - 1);
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

  /* flex container for letters */
  var box = document.createElement('div');
  box.style.cssText = [
    'display:flex',
    'flex-wrap:wrap',
    'justify-content:center',
    'align-items:baseline',
    'padding:0 24px',
    'font-size:clamp(2rem,5vw,3.6rem)',
    'font-weight:850',
    'letter-spacing:-1px',
    'line-height:1.2',
    'text-align:center'
  ].join(';');

  var letters = [];
  var words = QUOTE.split(' ');
  var letterIdx = 0; /* global index for colour gradient */
  var totalChars = QUOTE.replace(/ /g, '').length;

  words.forEach(function(word, wi) {
    /* each word lives in its own inline-flex span — prevents mid-word wrapping */
    var wordWrap = document.createElement('span');
    wordWrap.style.cssText = 'display:inline-flex;white-space:nowrap;';

    for (var ci = 0; ci < word.length; ci++) {
      var ch  = word[ci];
      var col = charColor(letterIdx, totalChars);
      letterIdx++;

      var span = document.createElement('span');
      span.textContent = ch;

      var angle = Math.random() * Math.PI * 2;
      var dist  = 350 + Math.random() * 450;
      var dx    = (Math.cos(angle) * dist).toFixed(0);
      var dy    = (Math.sin(angle) * dist).toFixed(0);

      span.style.cssText = [
        'display:inline-block',
        'color:' + col,
        'text-shadow:0 0 18px ' + col,
        'opacity:0',
        'transform:translate(' + dx + 'px,' + dy + 'px) scale(0.15)',
        'transition:none',
        'will-change:transform,opacity'
      ].join(';');

      wordWrap.appendChild(span);
      letters.push(span);
    }

    box.appendChild(wordWrap);

    /* space between words (but not after the last word) */
    if (wi < words.length - 1) {
      var sp = document.createElement('span');
      sp.textContent = '\u00a0';
      sp.style.cssText = 'display:inline-block;width:0.28em;';
      box.appendChild(sp);
    }
  });

  if (wrap) {
    wrap.style.opacity = '1';   /* wrap itself visible — letters handle their own opacity */
    wrap.appendChild(box);
  }

  /* ── Timing ── */
  var BADGE_DELAY  = 0;      /* ms — badge appears instantly */
  var FLY_START    = 150;    /* ms — letters start flying in */
  var STAGGER      = 22;     /* ms — gap between each letter */
  var FLY_DUR      = 650;    /* ms — each letter fly duration */
  var ASSEMBLE_END = FLY_START + (letters.length - 1) * STAGGER + FLY_DUR;
  var HOLD         = 1300;   /* ms — hold after all assembled */
  var DISMISS      = ASSEMBLE_END + HOLD;

  requestAnimationFrame(function() {

    /* badge fades in first */
    if (badge) {
      setTimeout(function() {
        badge.style.transition = 'opacity 0.55s ease';
        badge.style.opacity    = '1';
      }, BADGE_DELAY);
    }

    /* letters fly in with stagger */
    letters.forEach(function(span, i) {
      setTimeout(function() {
        span.style.transition =
          'transform ' + FLY_DUR + 'ms cubic-bezier(0.16,1,0.3,1),' +
          'opacity 420ms ease';
        span.style.transform = 'translate(0,0) scale(1)';
        span.style.opacity   = '1';
      }, FLY_START + i * STAGGER);
    });

    /* author appears after letters land */
    if (author) {
      setTimeout(function() {
        author.style.transition = 'opacity 0.55s ease';
        author.style.opacity    = '1';
      }, ASSEMBLE_END - 200);
    }

    /* add a soft glow to the assembled quote */
    setTimeout(function() {
      box.style.transition = 'filter 0.5s ease';
      box.style.filter     = 'drop-shadow(0 0 28px rgba(84,200,255,0.55))';
    }, ASSEMBLE_END);

    /* smooth fade-out — the whole overlay dissolves into the site */
    setTimeout(function() {
      overlay.classList.add('fade-out');
      setTimeout(function() { overlay.remove(); }, 700);
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
