// ==========================================
// ANIS AHMED - DEVOPS MISSION CONTROL ENGINE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initAudioSynth();
  initNetworkCanvas();
  initPodMesh();
  initTelemetryLoop();
  initMetricsCharts();
  initPipelineSimulator();
  initTerminal();
  initMobileMenu();
});

// ==========================================
// 1. WEB AUDIO API SYNTHESIZER (CYBER SFX)
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

  soundToggle.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    soundToggle.querySelector('span').innerText = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
    soundIcon.setAttribute('data-lucide', sfxEnabled ? 'volume-2' : 'volume-x');
    if (window.lucide) window.lucide.createIcons();
    if (sfxEnabled) window.playCyberTone(1200, 'sine', 0.1);
  });
}

// ==========================================
// 2. NETWORK TOPOLOGY PARTICLE CANVAS
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
// 3. POD MESH & TELEMETRY JITTER
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
    'kubelet: reconciliation loop completed (0ms drift)',
    'calico-node: BGP peer established with spine-sw-01',
    'argocd-repo-server: git fetch origin main [COMPLETED]',
    'cert-manager: certificate /etc/ssl/anisahmed valid for 89d',
    'prometheus: scrape target worker-node-02 responded 200 OK',
    'aws-alb-controller: target group health check passed (12/12)',
    'hpa-autoscaler: evaluated desired replicas: 3 [STABLE]',
  ];

  let logIdx = 0;
  setInterval(() => {
    // Random subtle CPU fluctuations
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
// 4. OBSERVABILITY LIVE CANVASES
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

      // Add new point and shift
      points.shift();
      points.push(baseVal + (Math.sin(Date.now() / 800) * jitter * 0.7) + (Math.random() - 0.5) * (jitter * 0.5));

      const step = canvas.width / (maxPoints - 1);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      // Create gradient fill
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

      // Close path for fill
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
// 5. INTERACTIVE CI/CD PIPELINE SIMULATOR
// ==========================================
function initPipelineSimulator() {
  const cards = document.querySelectorAll('.pipeline-card');
  const titleElem = document.getElementById('inspectorStageTitle');
  const logElem = document.getElementById('inspectorLogOutput');
  const retriggerBtn = document.getElementById('retriggerPipeline');
  const progressLine = document.getElementById('pipelineProgress');

  const stageData = {
    1: {
      title: 'Stage 1: Git Commit & Webhook Trigger',
      log: `[INFO] 16:04:12 - Git commit hook triggered on branch 'main'
[INFO] 16:04:13 - Author: Anis Ahmed <contact@anisahmed.in>
[INFO] 16:04:13 - Verified GPG Signature: [KEY ID: 0x4A8FB2C1] - VALID
[INFO] 16:04:14 - Dispatched webhook payload to GitHub Actions Runner
[SUCCESS] Pipeline step initialized without errors.`,
    },
    2: {
      title: 'Stage 2: SonarQube SAST & Secret Gate',
      log: `[INFO] 16:04:15 - Initiating SonarQube Scanner v5.0.1
[INFO] 16:04:16 - Scanning 42 codebase source files for secrets / keys
[INFO] 16:04:18 - Security Hotspots: 0 | Bugs: 0 | Vulnerabilities: 0
[INFO] 16:04:19 - Code Coverage: 88.4%
[SUCCESS] Quality Gate: PASSED (Grade A achieved).`,
    },
    3: {
      title: 'Stage 3: Docker Multi-Stage Build & Push',
      log: `[INFO] 16:04:20 - docker build -t ghcr.io/anisahmed/portfolio:v2.4.0 .
[INFO] 16:04:21 - Step 1/8 : FROM node:20-alpine AS builder
[INFO] 16:04:23 - Step 2/8 : RUN npm ci && npm run build
[INFO] 16:04:25 - Step 3/8 : FROM nginx:alpine
[INFO] 16:04:26 - Step 4/8 : COPY --from=builder /app/dist /usr/share/nginx/html
[INFO] 16:04:27 - Docker image compressed: 28.4 MB
[SUCCESS] Pushed image digest sha256:7f9a8b2c to container registry.`,
    },
    4: {
      title: 'Stage 4: Trivy Container Vulnerability Scan',
      log: `[INFO] 16:04:28 - trivy image --severity HIGH,CRITICAL ghcr.io/anisahmed/portfolio:v2.4.0
[INFO] 16:04:29 - Updating vulnerability database...
[INFO] 16:04:30 - Total Vulnerabilities Found: 0
[INFO] 16:04:30 - CRITICAL: 0 | HIGH: 0 | MEDIUM: 0 | LOW: 0
[SUCCESS] Image passed compliance security audit.`,
    },
    5: {
      title: 'Stage 5: ArgoCD GitOps Reconciliation',
      log: `[INFO] 16:04:31 - ArgoCD Application controller detected new image digest
[INFO] 16:04:32 - Repository: https://github.com/anisahmed/devops-portfolio
[INFO] 16:04:33 - Comparing Target State with Live Cluster State...
[INFO] 16:04:34 - Auto-Sync policy triggered (Prune: true, SelfHeal: true)
[SUCCESS] ArgoCD sync status: Synced (Revision: HEAD).`,
    },
    6: {
      title: 'Stage 6: Kubernetes Canary Release & Verification',
      log: `[INFO] 16:04:35 - kubectl rollout status deployment/portfolio-web -n production
[INFO] 16:04:36 - Waiting for pod portfolio-web-7f89c to reach 'Running'...
[INFO] 16:04:37 - Liveness & Readiness Probes HTTP 200 OK
[INFO] 16:04:38 - Traffic shifted: 10% -> 50% -> 100% Canary Complete
[SUCCESS] Deployment successfully deployed with 0 downtime on https://anisahmed.in`,
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

  // Select first stage by default
  selectStage(1);
}

// ==========================================
// 6. INTERACTIVE DEVOPS TERMINAL
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
  <span class="text-cyber-emerald">kubectl get nodes</span>      List active cluster compute nodes
  <span class="text-cyber-emerald">kubectl get pods</span>       List running microservice pods
  <span class="text-cyber-emerald">helm list</span>               Display deployed Helm charts
  <span class="text-cyber-emerald">terraform state list</span>   Show provisioned AWS IaC state
  <span class="text-cyber-emerald">docker ps</span>              List running Docker containers
  <span class="text-cyber-emerald">cat about.txt</span>          Read Anis Ahmed's engineering bio
  <span class="text-cyber-emerald">cat skills.json</span>        Output full technical skill inventory
  <span class="text-cyber-emerald">cat contact.txt</span>        Display contact & social coordinates
  <span class="text-cyber-emerald">deploy --env prod</span>      Simulate live production rollout
  <span class="text-cyber-emerald">clear</span>                  Clear the terminal screen
`,
    'kubectl get nodes': () => `
NAME                        STATUS   ROLES           AGE   VERSION   INTERNAL-IP
ip-10-0-1-12.ec2.internal   Ready    control-plane   42d   v1.30.2   10.0.1.12
ip-10-0-2-45.ec2.internal   Ready    node,worker     42d   v1.30.2   10.0.2.45
ip-10-0-2-89.ec2.internal   Ready    node,worker     42d   v1.30.2   10.0.2.89
`,
    'kubectl get nodes -o wide': () => `
NAME                        STATUS   ROLES           AGE   VERSION   OS-IMAGE                      KERNEL-VERSION
ip-10-0-1-12.ec2.internal   Ready    control-plane   42d   v1.30.2   Amazon Linux 2023.4.202405    6.1.84-99.169.amzn2023.x86_64
ip-10-0-2-45.ec2.internal   Ready    node,worker     42d   v1.30.2   Amazon Linux 2023.4.202405    6.1.84-99.169.amzn2023.x86_64
ip-10-0-2-89.ec2.internal   Ready    node,worker     42d   v1.30.2   Amazon Linux 2023.4.202405    6.1.84-99.169.amzn2023.x86_64
`,
    'kubectl get pods': () => `
NAMESPACE     NAME                                   READY   STATUS    RESTARTS   AGE
production    portfolio-frontend-6b87d89bf5-2zpq7   1/1     Running   0          4d12h
production    portfolio-frontend-6b87d89bf5-8nm4k   1/1     Running   0          4d12h
production    argocd-server-7965448f7f-k9p6q         1/1     Running   0          42d
ingress-nginx ingress-nginx-controller-6d7c6-m5w4q   1/1     Running   0          42d
monitoring    prometheus-k8s-0                       2/2     Running   0          42d
`,
    'helm list': () => `
NAME                 NAMESPACE     REVISION  STATUS    CHART                    APP VERSION
argo-cd              argocd        3         deployed  argo-cd-6.7.18           v2.11.0
cert-manager         cert-manager  1         deployed  cert-manager-v1.14.4     v1.14.4
ingress-nginx        ingress-nginx 4         deployed  ingress-nginx-4.10.0     1.10.0
kube-prometheus      monitoring    2         deployed  kube-prometheus-58.2.2   v0.73.2
portfolio-app        production    14        deployed  portfolio-chart-1.2.0    v2.4.0
`,
    'terraform state list': () => `
module.vpc.aws_vpc.this[0]
module.vpc.aws_subnet.public[0]
module.vpc.aws_subnet.public[1]
module.vpc.aws_subnet.private[0]
module.vpc.aws_subnet.private[1]
module.vpc.aws_nat_gateway.this[0]
module.eks.aws_eks_cluster.this[0]
module.eks.aws_eks_node_group.workers["general"]
aws_iam_role.eks_cluster_role
aws_s3_bucket.terraform_remote_state
aws_dynamodb_table.terraform_state_locks
`,
    'docker ps': () => `
CONTAINER ID   IMAGE                                COMMAND                  STATUS         PORTS
7c4e1f8a9b2c   ghcr.io/anisahmed/portfolio:v2.4.0   "/docker-entrypoint.…"   Up 4 days      0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
8b2d4e6f1a0c   prom/prometheus:v2.51.0              "/bin/prometheus --c…"   Up 42 days     0.0.0.0:9090->9090/tcp
4a5b6c7d8e9f   grafana/grafana:10.4.1               "/run.sh"                Up 42 days     0.0.0.0:3000->3000/tcp
`,
    'cat about.txt': () => `
<span class="text-cyber-cyan font-bold">NAME:</span> Anis Ahmed
<span class="text-cyber-cyan font-bold">ROLE:</span> Senior DevOps & Cloud Infrastructure Engineer
<span class="text-cyber-cyan font-bold">LOCATION:</span> India (Open to Remote Global)
<span class="text-cyber-cyan font-bold">MISSION:</span> 
Eliminating manual operations through high-resilience GitOps, containerization, 
and proactive observability. I build cloud platforms that withstand failure, 
scale seamlessly, and enable developers to deploy code with total confidence.
`,
    'cat skills.json': () => `
{
  <span class="text-cyber-cyan">"cloud"</span>: ["AWS (EKS, VPC, IAM, S3, Route53)", "Hostinger LiteSpeed"],
  <span class="text-cyber-cyan">"orchestration"</span>: ["Kubernetes", "K3s", "Docker", "Helm", "Kustomize"],
  <span class="text-cyber-cyan">"iac"</span>: ["Terraform", "OpenTofu", "Ansible", "CloudFormation"],
  <span class="text-cyber-cyan">"cicd"</span>: ["ArgoCD (GitOps)", "GitHub Actions", "GitLab CI", "Jenkins"],
  <span class="text-cyber-cyan">"observability"</span>: ["Prometheus", "Grafana", "Alertmanager", "Loki"],
  <span class="text-cyber-cyan">"security"</span>: ["Trivy", "SonarQube", "IRSA", "NetworkPolicies", "Let's Encrypt"]
}
`,
    'cat contact.txt': () => `
<span class="text-cyber-cyan">Email:</span>     <a href="mailto:contact@anisahmed.in" class="underline text-white">contact@anisahmed.in</a>
<span class="text-cyber-cyan">Website:</span>   <a href="https://anisahmed.in" target="_blank" class="underline text-white">https://anisahmed.in</a>
<span class="text-cyber-cyan">GitHub:</span>    <a href="https://github.com" target="_blank" class="underline text-white">https://github.com/anisahmed</a>
<span class="text-cyber-cyan">LinkedIn:</span>  <a href="https://linkedin.com" target="_blank" class="underline text-white">https://linkedin.com/in/anisahmed</a>
<span class="text-cyber-cyan">PGP Key:</span>   4A8F B2C1 9D7E 04F3 81AA 66CD EF12 3456 7890 ABCD
`,
    'deploy --env prod': () => {
      setTimeout(() => {
        const lines = [
          '⚡ [INIT] Connecting to AWS EKS production cluster...',
          '📦 [PULL] Verifying image ghcr.io/anisahmed/portfolio:v2.4.0 checksum',
          '🔒 [IAM] Authenticated via AWS IRSA assume role: arn:aws:iam::prod-deployer',
          '🔄 [ROLLOUT] Initiating zero-downtime rolling update (maxSurge: 25%)',
          '✅ [READY] Health check passed (12/12 targets healthy)',
          '🚀 [SUCCESS] Deployment complete: anisahmed.in is live with 100% traffic!',
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
        }, 400);
      }, 100);
      return `<span class="text-cyber-amber">🚀 Triggering production canary deployment pipeline...</span>`;
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

    // Display user input line
    appendTerminalOutput(`
      <div class="flex items-center gap-2 text-slate-400">
        <span class="text-cyber-cyan font-bold">anisahmed@k8s:~$</span>
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
// 7. MOBILE MENU TOGGLE
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
