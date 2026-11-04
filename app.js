// ==========================================
// ANIS AHMED - DEVOPS MISSION CONTROL ENGINE
// Multi-Cloud • DevSecOps • GitOps • AI Observability
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initAudioSynth();
  initNetworkCanvas();
  initScrollReveal();
  initActiveNavScroll();
  initPodMesh();
  initTelemetryLoop();
  initMetricsCharts();
  initPipelineSimulator();
  initTerminal();
  initMobileMenu();
});

// ==========================================
// 1. SCROLL REVEAL & NAVIGATION TRACKER
// ==========================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (!('IntersectionObserver' in window)) {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Subtle cyber blip on section entering viewport
        window.playCyberTone(650, 'sine', 0.02);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

function initActiveNavScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active-nav');
      }
    });
  }, { passive: true });
}

// ==========================================
// 2. WEB AUDIO API SYNTHESIZER (CYBER SFX)
// ==========================================
let audioCtx = null;
let sfxEnabled = true;

function initAudioSynth() {
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playCyberTone = function (freq = 800, type = 'sine', duration = 0.05) {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  };

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      soundToggle.querySelector('span').innerText = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
      soundIcon.setAttribute('data-lucide', sfxEnabled ? 'volume-2' : 'volume-x');
      if (window.lucide) window.lucide.createIcons();
      if (sfxEnabled) window.playCyberTone(1200, 'sine', 0.1);
    });
  }
}

// ==========================================
// 3. NETWORK TOPOLOGY PARTICLE CANVAS
// ==========================================
function initNetworkCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(Math.floor(width / 35), 45);
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// ==========================================
// 4. POD MESH & TELEMETRY JITTER
// ==========================================
function initPodMesh() {
  const meshContainer = document.getElementById('podMesh');
  if (!meshContainer) return;

  meshContainer.innerHTML = '';
  for (let i = 0; i < 32; i++) {
    const pod = document.createElement('div');
    pod.className =
      'h-2.5 rounded-sm bg-cyber-emerald/70 border border-cyber-emerald shadow-[0_0_6px_rgba(0,255,136,0.3)] transition-all hover:scale-125 cursor-pointer';
    pod.title = `Pod: svc-worker-${i} (Status: Running, Restarts: 0)`;
    pod.addEventListener('mouseenter', () => {
      window.playCyberTone(1400, 'triangle', 0.03);
    });
    meshContainer.appendChild(pod);
  }
}

function initTelemetryLoop() {
  const cpuPercentage = document.getElementById('cpuPercentage');
  const cpuBar = document.getElementById('cpuBar');
  const memPercentage = document.getElementById('memPercentage');
  const memBar = document.getElementById('memBar');
  const telemetryLog = document.getElementById('telemetryLog');

  const logs = [
    'opa-gatekeeper: all resource constraints validated (0 violations)',
    'falco: runtime kernel eBPF stream clear across namespaces',
    'gitleaks-scan: pre-commit entropy check returned zero secrets',
    'argocd-controller: multi-cluster reconcile [EKS + AKS Synced]',
    'trivy-scanner: container image vulnerability baseline: 0 Critical',
    'bedrock-telemetry: AI anomaly detection evaluating request latencies',
    'cert-manager: SSL certificate /etc/ssl/anisahmed valid for 89d',
  ];

  let logIdx = 0;
  setInterval(() => {
    const cpu = Math.floor(38 + Math.random() * 8);
    const mem = Math.floor(65 + Math.random() * 5);

    if (cpuPercentage && cpuBar) {
      cpuPercentage.innerText = `${cpu}%`;
      cpuBar.style.width = `${cpu}%`;
    }
    if (memPercentage && memBar) {
      memPercentage.innerText = `${mem}%`;
      memBar.style.width = `${mem}%`;
    }

    if (telemetryLog) {
      logIdx = (logIdx + 1) % logs.length;
      telemetryLog.innerText = logs[logIdx];
    }
  }, 3500);
}

// ==========================================
// 5. OBSERVABILITY LIVE CANVASES
// ==========================================
function initMetricsCharts() {
  function setupLiveChart(canvasId, color, baseVal, jitter) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = 110;

    const points = [];
    const maxPoints = 35;
    for (let i = 0; i < maxPoints; i++) {
      points.push(baseVal + (Math.random() - 0.5) * jitter);
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.shift();
      points.push(baseVal + (Math.sin(Date.now() / 800) * jitter * 0.7) + (Math.random() - 0.5) * (jitter * 0.5));

      const step = canvas.width / (maxPoints - 1);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, color.replace(')', ', 0.35)').replace('rgb', 'rgba'));
      grad.addColorStop(1, 'transparent');

      for (let i = 0; i < points.length; i++) {
        const x = i * step;
        const normalizedY = canvas.height - (points[i] / 100) * (canvas.height - 20) - 10;
        if (i === 0) {
          ctx.moveTo(x, normalizedY);
        } else {
          ctx.lineTo(x, normalizedY);
        }
      }

      ctx.stroke();

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    setInterval(render, 1500);
  }

  setupLiveChart('chartRPS', 'rgb(0, 242, 254)', 65, 18);
  setupLiveChart('chartMem', 'rgb(168, 85, 247)', 55, 12);
}

// ==========================================
// 6. INTERACTIVE CI/CD & DEVSECOPS SIMULATOR
// ==========================================
function initPipelineSimulator() {
  const cards = document.querySelectorAll('.pipeline-card');
  const titleElem = document.getElementById('inspectorStageTitle');
  const logElem = document.getElementById('inspectorLogOutput');
  const retriggerBtn = document.getElementById('retriggerPipeline');
  const progressLine = document.getElementById('pipelineProgress');

  const stageData = {
    1: {
      title: 'Stage 1: Gitleaks Pre-Commit Secret Scanner',
      log: `[INFO] 17:10:02 - gitleaks protect --verbose --redact --staged
[INFO] 17:10:03 - Scanning git diff against 140+ entropy and credential regex rules...
[INFO] 17:10:04 - Checked 18 files, 2,186 lines of code
[INFO] 17:10:04 - AWS Access Keys: NONE DETECTED
[INFO] 17:10:04 - Private RSA / SSH Keys: NONE DETECTED
[SUCCESS] Gitleaks secret verification passed. Clean commit approved.`,
    },
    2: {
      title: 'Stage 2: SonarQube SAST & Snyk Dependency Scan',
      log: `[INFO] 17:10:05 - Initiating SonarQube Scanner & Snyk CLI test
[INFO] 17:10:06 - SonarQube SAST: 0 Security Hotspots, 0 Bugs, Grade A Quality Gate
[INFO] 17:10:08 - Snyk SCA: Tested 342 dependencies for known vulnerabilities
[INFO] 17:10:09 - 0 high or critical severity vulnerabilities found
[SUCCESS] SonarQube & Snyk Quality Gate: PASSED.`,
    },
    3: {
      title: 'Stage 3: Docker Multi-Stage Build & Trivy Image Audit',
      log: `[INFO] 17:10:10 - docker build -t ghcr.io/anisahmed/portfolio:v2.5.0 .
[INFO] 17:10:12 - Hardened Alpine Nginx base image: non-root user (UID 101)
[INFO] 17:10:13 - trivy image --severity HIGH,CRITICAL ghcr.io/anisahmed/portfolio:v2.5.0
[INFO] 17:10:14 - Image OS: Alpine Linux 3.20 (0 Vulnerabilities Detected)
[SUCCESS] Docker container image signed & pushed with clean Trivy SBOM audit.`,
    },
    4: {
      title: 'Stage 4: Checkov & Open Policy Agent (OPA) IaC Validation',
      log: `[INFO] 17:10:15 - checkov -d ./terraform --framework terraform
[INFO] 17:10:16 - Passed checks: 42, Failed: 0, Skipped: 0
[INFO] 17:10:17 - conftest test --policy ./policy/ terraform.tfplan.json
[INFO] 17:10:18 - OPA Rego Evaluation: rule 'restrict_public_ssh' - ALLOWED
[SUCCESS] Infrastructure as Code meets CIS benchmark compliance standards.`,
    },
    5: {
      title: 'Stage 5: Production Manual Sign-off Approval Gate',
      log: `[INFO] 17:10:19 - Dispatching change advisory webhook to Slack #devops-deployments
[INFO] 17:10:20 - Change Request #CR-9481 generated with plan diff summary
[INFO] 17:10:22 - Digital Signature received from Lead Platform Engineer (Anis Ahmed)
[INFO] 17:10:23 - Target Environment: Multi-Cloud Production (AWS ap-south-1 & Azure AKS)
[SUCCESS] Production Deployment Authorization Granted.`,
    },
    6: {
      title: 'Stage 6: ArgoCD GitOps Reconciliation & Canary Rollout',
      log: `[INFO] 17:10:24 - ArgoCD ApplicationSet syncing target revision: HEAD
[INFO] 17:10:25 - Canary deployment initiated: 10% traffic shifted to v2.5.0
[INFO] 17:10:27 - Prometheus metrics evaluation: HTTP 5xx rate: 0.00%, P99: 14ms
[INFO] 17:10:28 - Traffic promoted to 100% across all availability zones
[SUCCESS] Zero-downtime release active on https://anisahmed.in`,
    },
  };

  function selectStage(stageNum) {
    cards.forEach((c) => c.classList.remove('active-stage'));
    const targetCard = document.querySelector(`.pipeline-card[data-stage="${stageNum}"]`);
    if (targetCard) targetCard.classList.add('active-stage');

    const data = stageData[stageNum];
    if (data && titleElem && logElem) {
      titleElem.innerText = data.title;
      logElem.innerText = data.log;
      window.playCyberTone(900 + stageNum * 100, 'sine', 0.05);
    }
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const stage = card.getAttribute('data-stage');
      selectStage(stage);
    });
  });

  if (retriggerBtn) {
    retriggerBtn.addEventListener('click', () => {
      let current = 1;
      selectStage(current);
      if (progressLine) progressLine.style.width = '10%';

      const interval = setInterval(() => {
        current++;
        if (current <= 6) {
          selectStage(current);
          if (progressLine) progressLine.style.width = `${(current / 6) * 100}%`;
        } else {
          clearInterval(interval);
        }
      }, 900);
    });
  }

  selectStage(1);
}

// ==========================================
// 7. INTERACTIVE DEVOPS TERMINAL
// ==========================================
function initTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalHistory = document.getElementById('terminalHistory');
  const terminalBody = document.getElementById('terminalBody');
  const clearBtn = document.getElementById('clearTerminalBtn');
  const quickCmds = document.querySelectorAll('.quick-cmd');

  if (!terminalInput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<span class="text-cyber-cyan font-bold">AVAILABLE COMMANDS:</span>
  <span class="text-cyber-emerald">cat experience.txt</span>       View Anis Ahmed's 5+ year track record
  <span class="text-cyber-emerald">cat devsecops.json</span>       View complete 7-pillar security tooling
  <span class="text-cyber-emerald">cat ai-tools.json</span>        Inspect Bedrock & Harness AI telemetry
  <span class="text-cyber-emerald">kubectl get nodes</span>        List AWS EKS & Azure AKS nodes
  <span class="text-cyber-emerald">helm list</span>                Display deployed Helm releases
  <span class="text-cyber-emerald">terraform state list</span>     Show provisioned multi-cloud IaC
  <span class="text-cyber-emerald">docker ps</span>                List running Docker containers
  <span class="text-cyber-emerald">cat contact.txt</span>          Display contact, email & LinkedIn
  <span class="text-cyber-emerald">deploy --env prod</span>        Simulate live production rollout
  <span class="text-cyber-emerald">clear</span>                    Clear terminal screen
`,
    'cat experience.txt': () => `
<span class="text-cyber-cyan font-bold">EXPERIENCE OVERVIEW:</span>
<span class="text-white font-bold">Role:</span>       DevOps Engineer (July 2021 &mdash; Present | 5 Years 5 Months)
<span class="text-white font-bold">Location:</span>   Delhi, India (Open to Remote Global)
<span class="text-white font-bold">Platforms:</span>  AWS, GCP, Azure, Kubernetes, Linux

<span class="text-cyber-emerald font-bold">CORE HIGHLIGHTS:</span>
• Multi-Cloud CI/CD across Jenkins, GitHub Actions, GCP, and Azure DevOps.
• Declarative Infrastructure as Code using Terraform and Ansible.
• Containerized microservices on Docker and Kubernetes (EKS, AKS).
• DevSecOps shift-left gates: Gitleaks, SonarQube, Snyk, Checkov, Trivy, OPA.
• 24/7 Observability: Prometheus, Grafana, ELK Stack, and CloudWatch.
• Python and Shell automation for server management and maintenance.
`,
    'cat devsecops.json': () => `
{
  <span class="text-cyber-red">"secrets"</span>: "Gitleaks (Pre-commit entropy & key detection)",
  <span class="text-cyber-blue">"sast"</span>: "SonarQube (Code quality & security gates)",
  <span class="text-cyber-purple">"sca"</span>: "Snyk (Vulnerable third-party dependency scanner)",
  <span class="text-cyan-400">"container_security"</span>: "Trivy (Image CVE & SBOM auditor)",
  <span class="text-cyber-emerald">"iac_policy"</span>: ["Checkov (CIS benchmarks)", "Open Policy Agent (Rego rules)"],
  <span class="text-amber-400">"runtime_detection"</span>: "Falco (Kernel eBPF anomaly detection)",
  <span class="text-slate-300">"approval_gates"</span>: "Slack / Teams interactive production sign-off"
}
`,
    'cat ai-tools.json': () => `
{
  <span class="text-cyber-amber">"ai_observability"</span>: "Amazon Bedrock LLM",
  <span class="text-cyber-purple">"deployment_verification"</span>: "Harness AI",
  <span class="text-cyber-cyan">"capabilities"</span>: [
    "Automated incident root-cause analysis",
    "Log anomaly clustering across Prometheus & CloudWatch",
    "Automated canary rollback verification"
  ]
}
`,
    'kubectl get nodes': () => `
NAME                             STATUS   ROLES           CLUSTER      VERSION
eks-ap-south-1a-worker-01        Ready    node,worker     AWS-EKS      v1.30.2
eks-ap-south-1b-worker-02        Ready    node,worker     AWS-EKS      v1.30.2
aks-centralindia-nodepool-01     Ready    node,worker     Azure-AKS    v1.30.2
`,
    'helm list': () => `
NAME                 NAMESPACE     REVISION  STATUS    CHART                    APP VERSION
argo-cd              argocd        3         deployed  argo-cd-6.7.18           v2.11.0
cert-manager         cert-manager  1         deployed  cert-manager-v1.14.4     v1.14.4
ingress-nginx        ingress-nginx 4         deployed  ingress-nginx-4.10.0     1.10.0
kube-prometheus      monitoring    2         deployed  kube-prometheus-58.2.2   v0.73.2
falco-runtime        security      1         deployed  falco-3.8.4              0.37.1
`,
    'terraform state list': () => `
module.multi_cloud_vpc.aws_vpc.this[0]
module.multi_cloud_vpc.aws_subnet.private[0]
module.eks.aws_eks_cluster.this[0]
module.azure_aks.azurerm_kubernetes_cluster.k8s
aws_s3_bucket.terraform_remote_state
aws_dynamodb_table.terraform_state_locks
`,
    'docker ps': () => `
CONTAINER ID   IMAGE                                COMMAND                  STATUS         PORTS
7c4e1f8a9b2c   ghcr.io/anisahmed/portfolio:v2.5.0   "/docker-entrypoint.…"   Up 5 days      0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
8b2d4e6f1a0c   prom/prometheus:v2.51.0              "/bin/prometheus --c…"   Up 42 days     0.0.0.0:9090->9090/tcp
4a5b6c7d8e9f   grafana/grafana:10.4.1               "/run.sh"                Up 42 days     0.0.0.0:3000->3000/tcp
`,
    'cat contact.txt': () => `
<span class="text-cyber-cyan">Name:</span>       Anis Ahmed (DevOps Engineer)
<span class="text-cyber-cyan">LinkedIn:</span>   <a href="https://www.linkedin.com/in/webanis" target="_blank" class="underline text-white">https://www.linkedin.com/in/webanis</a>
<span class="text-cyber-cyan">Email:</span>      <a href="mailto:contact@anisahmed.in" class="underline text-white">contact@anisahmed.in</a>
<span class="text-cyber-cyan">Website:</span>    <a href="https://anisahmed.in" target="_blank" class="underline text-white">https://anisahmed.in</a>
<span class="text-cyber-cyan">Location:</span>   Delhi, India
<span class="text-cyber-cyan">PGP Key:</span>    4A8F B2C1 9D7E 04F3 81AA 66CD EF12 3456 7890 ABCD
`,
    'deploy --env prod': () => {
      setTimeout(() => {
        const lines = [
          '⚡ [INIT] Connecting to multi-cloud EKS & AKS production clusters...',
          '🔍 [DEVSECOPS] Gitleaks, SonarQube & Trivy verification: PASSED (0 CVEs)',
          '📜 [OPA] Evaluated Terraform & K8s plan against Rego compliance: APPROVED',
          '👤 [SIGN-OFF] Production Approval Gate authorized by Anis Ahmed',
          '🔄 [GITOPS] ArgoCD syncing canary release across availability zones...',
          '✅ [READY] Health probes 200 OK. 0 Downtime Canary Rollout Completed!',
        ];

        let i = 0;
        const interval = setInterval(() => {
          if (i < lines.length) {
            appendTerminalOutput(`<span class="text-cyber-emerald">${lines[i]}</span>`);
            window.playCyberTone(800 + i * 150, 'sine', 0.04);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 380);
      }, 100);
      return `<span class="text-cyber-amber">🚀 Initiating multi-cloud DevSecOps production rollout...</span>`;
    },
    clear: () => {
      terminalHistory.innerHTML = '';
      return '';
    },
  };

  function appendTerminalOutput(htmlContent) {
    const entry = document.createElement('div');
    entry.className = 'terminal-entry space-y-1';
    entry.innerHTML = htmlContent;
    terminalHistory.appendChild(entry);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(cmdRaw);
    historyIndex = commandHistory.length;

    appendTerminalOutput(`
      <div class="flex items-center gap-2 text-slate-400">
        <span class="text-cyber-cyan font-bold">anisahmed@devops:~$</span>
        <span class="text-white font-mono">${cmdRaw}</span>
      </div>
    `);

    window.playCyberTone(1100, 'triangle', 0.04);

    if (commands[cmd]) {
      const result = commands[cmd]();
      if (result) appendTerminalOutput(result);
    } else {
      appendTerminalOutput(`
        <span class="text-cyber-red">bash: command not found: ${cmdRaw}</span><br>
        <span class="text-slate-400">Type <span class="text-cyber-cyan">help</span> to view all supported DevOps commands.</span>
      `);
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalHistory.innerHTML = '';
      window.playCyberTone(600, 'sine', 0.05);
    });
  }

  quickCmds.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmdText = btn.innerText;
      handleCommand(cmdText);
    });
  });
}

// ==========================================
// 8. MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    window.playCyberTone(700, 'sine', 0.05);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}
