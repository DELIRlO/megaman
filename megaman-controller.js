/**
 * Mega Man Controller - Sistema de movimento aleatório e tiros
 * Controla o comportamento do Mega Man na página
 */
class MegamanController {
  constructor() {
    this.isActive = false;
    this.element = null;
    this.currentSprite = "idle";
    this.position = { x: 100, y: 100 };
    this.targetPosition = { x: 100, y: 100 };
    this.isMoving = false;
    this.isShooting = false;
    this.movementSpeed = 2;
    this.animationFrame = null;
    this.shootTimer = null;
    this.moveTimer = null;
    this.currentPage = "home";
    this.isPaused = false;

    // Configurações de timing
    this.shootInterval = { min: 6000, max: 20000 }; // 6-20 segundos
    this.moveInterval = { min: 3000, max: 8000 }; // 3-8 segundos
    this.shootDuration = 1500; // Duração do tiro em ms

    // Sprites disponíveis
    this.sprites = {
      idle: "assets/sprites/megaman-pushing.gif",
      idleLeft: "assets/sprites/megaman-pushing-esquerda.gif",
      stopped: "assets/sprites/parado10.gif",
      shooting: "assets/sprites/m2.gif",
    };

    // Controle de direção
    this.direction = "right"; // 'left' ou 'right'
    this.lastPosition = { x: 100, y: 100 };

    // Limites da tela (serão atualizados dinamicamente)
    this.boundaries = {
      minX: 50,
      maxX: window.innerWidth - 100,
      minY: 50,
      maxY: window.innerHeight - 100,
    };

    // Estatísticas para debug
    this.stats = {
      totalShots: 0,
      totalMoves: 0,
      timeActive: 0,
      startTime: null,
    };

    this.init();
  }

  init() {
    this.createMegamanElement();
    this.updateBoundaries();
    this.bindEvents();
  }

  createMegamanElement() {
    // Remove elemento existente se houver
    if (this.element) {
      this.element.remove();
    }

    // Cria novo elemento
    this.element = document.createElement("div");
    this.element.id = "megaman-character";
    this.element.className = "megaman-character";

    // Posicionamento inicial
    this.element.style.cssText = `
      position: fixed;
      width: 64px;
      height: 64px;
      background-image: url('${this.sprites.idle}');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 800;
      pointer-events: none;
      transition: none;
      left: ${this.position.x}px;
      top: ${this.position.y}px;
      opacity: 0;
    `;

    document.body.appendChild(this.element);
  }

  bindEvents() {
    // Atualiza limites quando a janela é redimensionada
    window.addEventListener("resize", () => {
      this.updateBoundaries();
    });

    // Pausa quando muda de página
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isActive) {
        this.pause();
      } else if (!document.hidden && this.isActive) {
        this.resume();
      }
    });
  }

  updateBoundaries() {
    this.boundaries = {
      minX: 50,
      maxX: Math.max(300, window.innerWidth - 100),
      minY: 50,
      maxY: Math.max(200, window.innerHeight - 100),
    };
  }

  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.isPaused = false;
    this.stats.startTime = Date.now();
    this.element.style.opacity = "1";
    this.element.classList.add("active", "entering");

    // Remove classe de entrada após animação
    setTimeout(() => {
      if (this.element) {
        this.element.classList.remove("entering");
      }
    }, 1000);

    this.scheduleNextMove();
    this.scheduleNextShoot();

    console.log('🤖 Mega Man ativado! Use "megaman off" para desativar.');

    // Som de ativação se disponível
    if (window.audioSystem) {
      window.audioSystem.play("achievement");
    }
  }

  stop() {
    if (!this.isActive) return;

    this.isActive = false;
    this.isPaused = false;

    // Atualiza estatísticas
    if (this.stats.startTime) {
      this.stats.timeActive += Date.now() - this.stats.startTime;
      this.stats.startTime = null;
    }

    this.element.classList.add("leaving");
    this.element.classList.remove("active");

    setTimeout(() => {
      if (this.element) {
        this.element.style.opacity = "0";
        this.element.classList.remove("leaving");
      }
    }, 1000);

    this.clearTimers();
    this.stopMovement();

    console.log("🤖 Mega Man desativado!");
    console.log(
      `📊 Estatísticas: ${this.stats.totalShots} tiros, ${this.stats.totalMoves} movimentos`
    );

    // Som de desativação se disponível
    if (window.audioSystem) {
      window.audioSystem.play("click");
    }
  }

  pause() {
    if (!this.isActive || this.isPaused) return;
    this.isPaused = true;
    this.clearTimers();
    this.stopMovement();

    if (this.element) {
      this.element.style.animationPlayState = "paused";
    }
  }

  resume() {
    if (!this.isActive || !this.isPaused) return;
    this.isPaused = false;

    if (this.element) {
      this.element.style.animationPlayState = "running";
    }

    this.scheduleNextMove();
    this.scheduleNextShoot();
  }

  clearTimers() {
    if (this.shootTimer) {
      clearTimeout(this.shootTimer);
      this.shootTimer = null;
    }
    if (this.moveTimer) {
      clearTimeout(this.moveTimer);
      this.moveTimer = null;
    }
  }

  stopMovement() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.isMoving = false;
  }

  getRandomPosition() {
    return {
      x:
        Math.random() * (this.boundaries.maxX - this.boundaries.minX) +
        this.boundaries.minX,
      y:
        Math.random() * (this.boundaries.maxY - this.boundaries.minY) +
        this.boundaries.minY,
    };
  }

  getRandomInterval(config) {
    return Math.random() * (config.max - config.min) + config.min;
  }

  scheduleNextMove() {
    if (!this.isActive) return;

    const delay = this.getRandomInterval(this.moveInterval);
    this.moveTimer = setTimeout(() => {
      this.moveToRandomPosition();
    }, delay);
  }

  scheduleNextShoot() {
    if (!this.isActive) return;

    const delay = this.getRandomInterval(this.shootInterval);
    this.shootTimer = setTimeout(() => {
      this.shoot();
    }, delay);
  }

  moveToRandomPosition() {
    if (!this.isActive || this.isPaused || this.isMoving || this.isShooting) {
      this.scheduleNextMove();
      return;
    }

    // Salva posição anterior para calcular direção
    this.lastPosition = { ...this.position };
    this.targetPosition = this.getRandomPosition();

    // Determina direção do movimento
    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";

    this.isMoving = true;
    this.stats.totalMoves++;

    if (this.element) {
      this.element.classList.add("moving");
    }

    // Atualiza sprite baseado na direção
    this.updateMovementSprite();
    this.updateMovement();
  }

  updateMovement() {
    if (!this.isActive || !this.isMoving) return;

    const dx = this.targetPosition.x - this.position.x;
    const dy = this.targetPosition.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.movementSpeed) {
      // Chegou ao destino
      this.position.x = this.targetPosition.x;
      this.position.y = this.targetPosition.y;
      this.isMoving = false;

      if (this.element) {
        this.element.classList.remove("moving");
      }

      // Muda para sprite parado quando para
      this.switchSprite("stopped");
      this.updateElementPosition();
      this.scheduleNextMove();
      return;
    }

    // Move em direção ao alvo
    const moveX = (dx / distance) * this.movementSpeed;
    const moveY = (dy / distance) * this.movementSpeed;

    this.position.x += moveX;
    this.position.y += moveY;

    this.updateElementPosition();

    this.animationFrame = requestAnimationFrame(() => {
      this.updateMovement();
    });
  }

  updateElementPosition() {
    if (this.element) {
      this.element.style.left = `${this.position.x}px`;
      this.element.style.top = `${this.position.y}px`;
    }
  }

  shoot() {
    if (!this.isActive || this.isPaused || this.isShooting) {
      this.scheduleNextShoot();
      return;
    }

    this.isShooting = true;
    this.stats.totalShots++;
    this.switchSprite("shooting");

    if (this.element) {
      this.element.classList.add("shooting");
    }

    // Som de tiro se disponível
    if (window.audioSystem) {
      window.audioSystem.play("click");
    }

    console.log("💥 Mega Man atirando!");

    // Volta ao sprite idle após a duração do tiro
    setTimeout(() => {
      if (this.isActive) {
        this.switchSprite("idle");
        this.isShooting = false;

        if (this.element) {
          this.element.classList.remove("shooting");
        }

        this.scheduleNextShoot();
      }
    }, this.shootDuration);
  }

  switchSprite(spriteName) {
    if (this.element && this.sprites[spriteName]) {
      this.currentSprite = spriteName;
      this.element.style.backgroundImage = `url('${this.sprites[spriteName]}')`;
    }
  }

  // Atualiza sprite baseado na direção do movimento
  updateMovementSprite() {
    if (this.direction === "left") {
      this.switchSprite("idleLeft");
    } else {
      this.switchSprite("idle");
    }
  }

  // Método para debug
  getStatus() {
    const currentTime = Date.now();
    const activeTime = this.stats.startTime
      ? this.stats.timeActive + (currentTime - this.stats.startTime)
      : this.stats.timeActive;

    return {
      isActive: this.isActive,
      isPaused: this.isPaused,
      isMoving: this.isMoving,
      isShooting: this.isShooting,
      currentSprite: this.currentSprite,
      currentPage: this.currentPage,
      position: { ...this.position },
      boundaries: { ...this.boundaries },
      stats: {
        ...this.stats,
        activeTime: Math.round(activeTime / 1000), // em segundos
      },
    };
  }

  // Método para resetar estatísticas
  resetStats() {
    this.stats = {
      totalShots: 0,
      totalMoves: 0,
      timeActive: 0,
      startTime: this.isActive ? Date.now() : null,
    };
    console.log("📊 Estatísticas do Mega Man resetadas!");
  }
}

// Otimizações de performance
const PERFORMANCE_CONFIG = {
  maxFPS: 60,
  throttleResize: 250,
  throttleVisibility: 100,
};

// Função para throttle de eventos
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Instância global com inicialização segura
function initMegamanController() {
  if (typeof window !== "undefined") {
    // Aguarda o DOM estar pronto
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        window.megamanController = new MegamanController();
        console.log(
          '🤖 Mega Man Controller inicializado! Digite "megaman on" no terminal para ativar.'
        );
      });
    } else {
      window.megamanController = new MegamanController();
      console.log(
        '🤖 Mega Man Controller inicializado! Digite "megaman on" no terminal para ativar.'
      );
    }
  }
}

// Inicializa o controlador
initMegamanController();

// Exporta para uso em outros módulos se necessário
if (typeof module !== "undefined" && module.exports) {
  module.exports = MegamanController;
}
