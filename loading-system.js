class ElectricParticles {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.animationId = null;
    this.isActive = false;
    this.time = 0;

    this.setupCanvas();
    this.createParticles();
  }

  setupCanvas() {
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = "1";
    this.canvas.style.pointerEvents = "none";

    document.getElementById("loading-screen").appendChild(this.canvas);
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas.bind(this));
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.floor(window.innerWidth / 10);

    for (let i = 0; i < particleCount; i++) {
      const isBright = Math.random() < 0.15; // 15% de chance de ser brilhante

      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        baseSize: isBright ? Math.random() * 4 + 2 : Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        baseOpacity: isBright
          ? Math.random() * 0.6 + 0.4
          : Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        isBright: isBright,
        brightness: isBright ? Math.random() * 0.5 + 0.5 : 0,
        pulseSpeed: isBright ? Math.random() * 0.002 + 0.001 : 0,
      });
    }
  }

  start() {
    this.isActive = true;
    this.animate();
  }

  animate() {
    if (!this.isActive) return;

    this.time += 0.01;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      // Atualizar posição
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed;

      // Resetar partículas que saírem da tela
      if (
        particle.x < 0 ||
        particle.x > this.canvas.width ||
        particle.y < 0 ||
        particle.y > this.canvas.height
      ) {
        particle.x = Math.random() * this.canvas.width;
        particle.y = Math.random() * this.canvas.height;
      }

      // Efeitos para partículas brilhantes
      let size = particle.baseSize;
      let opacity = particle.baseOpacity;

      if (particle.isBright) {
        size =
          particle.baseSize + Math.sin(this.time * particle.pulseSpeed) * 1.5;
        opacity =
          particle.baseOpacity +
          Math.sin(this.time * particle.pulseSpeed * 1.3) * 0.2;

        if (Math.random() < 0.05) {
          opacity = 1;
          size *= 1.5;
        }
      }

      // Desenhar partícula
      this.ctx.globalAlpha = opacity;

      if (particle.isBright) {
        this.ctx.shadowBlur = 15 * particle.brightness;
        this.ctx.shadowColor = `rgba(100, 255, 255, ${opacity * 0.7})`;
        this.ctx.fillStyle = `rgba(150, 255, 255, ${opacity})`;
      } else {
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = "rgba(0, 200, 255, 0.8)";
      }

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    this.isActive = false;
    cancelAnimationFrame(this.animationId);
    this.canvas.remove();
  }
}

// Sistema de Carregamento Principal (MANTIDO EXATAMENTE IGUAL)
document.addEventListener("DOMContentLoaded", () => {
  const loadingSystem = document.getElementById("loading-screen");
  const progressBar = document.getElementById("progress-indicator");
  const progressText = document.getElementById("progress-text");
  const mainContent = document.body;

  // Iniciar partículas
  const particles = new ElectricParticles();
  particles.start();

  // Simular carregamento
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.floor(progress)}%`;

    if (progress === 100) {
      clearInterval(loadingInterval);

      // Finalizar carregamento
      setTimeout(() => {
        loadingSystem.style.opacity = "0";

        setTimeout(() => {
          loadingSystem.style.display = "none";
          particles.stop();

          // Iniciar o áudio se disponível
          if (
            window.audioSystem &&
            typeof window.audioSystem.enableAudio === "function"
          ) {
            window.audioSystem.enableAudio();
          }
        }, 500);
      }, 500);
    }
  }, 200);
});
