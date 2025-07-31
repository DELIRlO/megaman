// Sistema de linhas elétricas dinâmicas para o loading
class ElectricLines {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.lines = [];
    this.centerX = 0;
    this.centerY = 0;
    this.animationId = null;
    this.isActive = false;
  }

  init() {
    // Criar canvas para as linhas elétricas
    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "1";

    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext("2d");
    this.resize();

    // Criar linhas iniciais
    this.createLines();

    // Iniciar animação
    this.isActive = true;
    this.animate();

    // Listener para redimensionamento
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  createLines() {
    this.lines = [];
    const numLines = 12; // Número de linhas principais

    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const line = {
        angle: angle,
        length: 0,
        maxLength: Math.min(this.canvas.width, this.canvas.height) * 0.4,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.4,
        thickness: 1 + Math.random() * 2,
        segments: [],
        growing: true,
      };

      // Criar segmentos para efeito orgânico
      this.createSegments(line);
      this.lines.push(line);
    }
  }

  createSegments(line) {
    line.segments = [];
    const numSegments = 20;

    for (let i = 0; i < numSegments; i++) {
      const progress = i / numSegments;
      const baseX = Math.cos(line.angle) * progress * line.maxLength;
      const baseY = Math.sin(line.angle) * progress * line.maxLength;

      // Adicionar variação orgânica
      const variation = (Math.random() - 0.5) * 20;
      const perpX = -Math.sin(line.angle) * variation;
      const perpY = Math.cos(line.angle) * variation;

      line.segments.push({
        x: baseX + perpX,
        y: baseY + perpY,
        visible: false,
      });
    }
  }

  animate() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Atualizar e desenhar linhas
    this.lines.forEach((line) => {
      this.updateLine(line);
      this.drawLine(line);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateLine(line) {
    if (line.growing) {
      line.length += line.speed;
      if (line.length >= line.maxLength) {
        line.growing = false;
        // Recriar segmentos para variação
        setTimeout(
          () => {
            this.createSegments(line);
            line.length = 0;
            line.growing = true;
          },
          500 + Math.random() * 1000
        );
      }
    }

    // Atualizar visibilidade dos segmentos
    const visibleSegments = Math.floor(
      (line.length / line.maxLength) * line.segments.length
    );
    line.segments.forEach((segment, index) => {
      segment.visible = index < visibleSegments;
    });
  }

  drawLine(line) {
    if (line.segments.length < 2) return;

    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);

    // Configurar estilo da linha
    this.ctx.strokeStyle = `rgba(0, 255, 255, ${line.opacity})`;
    this.ctx.lineWidth = line.thickness;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    // Adicionar brilho
    this.ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
    this.ctx.shadowBlur = 5;

    // Desenhar linha
    this.ctx.beginPath();
    let hasVisibleSegments = false;

    line.segments.forEach((segment, index) => {
      if (segment.visible) {
        if (!hasVisibleSegments) {
          this.ctx.moveTo(segment.x, segment.y);
          hasVisibleSegments = true;
        } else {
          this.ctx.lineTo(segment.x, segment.y);
        }
      }
    });

    if (hasVisibleSegments) {
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  destroy() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    window.removeEventListener("resize", () => this.resize());
  }
}

// Configuração global para controle do tempo de loading
window.LOADING_CONFIG = {
  duration: 3000, // Tempo em milissegundos (padrão: 3 segundos)
  enableElectricLines: true, // Habilitar/desabilitar linhas elétricas
};

// Inicializar linhas elétricas quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  if (window.LOADING_CONFIG.enableElectricLines) {
    const electricLines = new ElectricLines();

    // Inicializar após um pequeno delay para garantir que o loading screen esteja visível
    setTimeout(() => {
      electricLines.init();

      // Destruir as linhas quando o loading terminar
      setTimeout(() => {
        electricLines.destroy();
      }, window.LOADING_CONFIG.duration);
    }, 100);
  }
});
