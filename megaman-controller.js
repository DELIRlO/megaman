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

    // Propriedades para controle do nome
    this.targetName = null;
    this.nameElement = null;
    this.isMovingToName = false;
    this.nameOriginalContent = "";
    this.nameRegenerationTimer = null;

    // Configurações de timing - mais movimento, menos tiro
    this.shootInterval = { min: 12000, max: 30000 }; // 12-30 segundos (reduzido)
    this.moveInterval = { min: 1500, max: 4000 }; // 1.5-4 segundos (aumentado)
    this.shootDuration = 1000; // Duração do tiro em ms (reduzido)

    // Sprites disponíveis
    this.sprites = {
      idle: "assets/sprites/parado10.gif", // Mudado para sprite parado inicial
      idleLeft: "assets/sprites/megaman-pushing-esquerda.gif",
      stopped: "assets/sprites/parado10.gif",
      shooting: "assets/sprites/m2.gif",
      running: "assets/sprites/megaman-pushing.gif", // Sprite para movimento
      runningLeft: "assets/sprites/megaman-pushing-esquerda.gif", // Sprite para movimento à esquerda
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

    // Verifica se deve se mover para o nome ou posição aleatória
    this.findNameElement();

    // Salva posição anterior para calcular direção
    this.lastPosition = { ...this.position };

    // Se há um nome detectado, 40% de chance de ir até ele
    if (this.nameElement && Math.random() < 0.4) {
      this.moveToName();
      return;
    }

    this.targetPosition = this.getRandomPosition();

    // Determina direção do movimento
    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";

    this.isMoving = true;
    this.isMovingToName = false;
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

    // Para o movimento se estiver se movendo
    if (this.isMoving) {
      this.stopMovement();
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

    // Verifica se está próximo do nome e o destrói
    this.checkNameDestruction();

    // Volta ao sprite idle após a duração do tiro e agenda movimento rápido
    setTimeout(() => {
      if (this.isActive) {
        this.switchSprite("stopped");
        this.isShooting = false;

        if (this.element) {
          this.element.classList.remove("shooting");
        }

        this.scheduleNextShoot();

        // Agenda um movimento mais rápido após atirar (50% de chance)
        if (Math.random() < 0.5) {
          setTimeout(() => {
            if (this.isActive && !this.isMoving) {
              this.moveToRandomPosition();
            }
          }, 500); // Move após 0.5 segundos
        }
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
      this.switchSprite("runningLeft");
    } else {
      this.switchSprite("running");
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

  // Encontra o elemento com o nome na página home
  findNameElement() {
    if (this.currentPage !== "home") {
      this.nameElement = null;
      return;
    }

    // Procura pelo título principal que contém o nome
    const titleElement = document.querySelector(".hero-title");
    if (
      titleElement &&
      titleElement.textContent
        .toLowerCase()
        .includes("carlos augusto diniz filho")
    ) {
      this.nameElement = titleElement;
      if (!this.nameOriginalContent) {
        this.nameOriginalContent = titleElement.innerHTML;
      }
    } else {
      this.nameElement = null;
    }
  }

  // Move o Megaman para próximo do nome
  moveToName() {
    if (!this.nameElement) return;

    const rect = this.nameElement.getBoundingClientRect();

    // Posição próxima ao nome (um pouco à esquerda para não cobrir)
    this.targetPosition = {
      x: Math.max(50, rect.left - 100),
      y: Math.max(50, rect.top + rect.height / 2 - 32), // Centraliza verticalmente
    };

    // Determina direção do movimento
    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";

    this.isMoving = true;
    this.isMovingToName = true;
    this.stats.totalMoves++;

    if (this.element) {
      this.element.classList.add("moving");
    }

    console.log("🎯 Mega Man se movendo em direção ao nome!");

    // Atualiza sprite baseado na direção
    this.updateMovementSprite();
    this.updateMovement();
  }

  // Verifica se está próximo do nome e o destrói quando atirar
  checkNameDestruction() {
    if (!this.nameElement || !this.isActive) return;

    const nameRect = this.nameElement.getBoundingClientRect();
    const megamanRect = {
      left: this.position.x,
      top: this.position.y,
      right: this.position.x + 64,
      bottom: this.position.y + 64,
    };

    // Calcula distância entre Megaman e o nome
    const distance = Math.sqrt(
      Math.pow(nameRect.left - megamanRect.left, 2) +
        Math.pow(nameRect.top - megamanRect.top, 2)
    );

    // Se estiver próximo o suficiente (150px), 40% de chance de destruir o nome
    if (distance < 350 && Math.random() < 0.7) {
      this.destroyName();
      console.log("💥 Nome destruído pelo Mega Man!");
    }
  }

  // Destrói o nome com efeito visual aprimorado
  destroyName() {
    if (!this.nameElement || !this.nameOriginalContent) return;

    // Limpa timer de regeneração anterior se existir
    if (this.nameRegenerationTimer) {
      clearTimeout(this.nameRegenerationTimer);
    }

    console.log("💥 Iniciando destruição do nome...");

    // Adiciona efeito de tremor
    this.nameElement.style.animation = "shake 0.3s ease-in-out";

    // Animação de quebra das letras em etapas
    this.animateLetterBreaking();
  }

  // Animação de quebra das letras
  animateLetterBreaking() {
    if (!this.nameElement || !this.nameOriginalContent) return;

    const plainText = this.nameOriginalContent.replace(/<[^>]*>/g, "");
    const letters = plainText.split("");
    let currentStep = 0;
    const totalSteps = 8;

    const breakingInterval = setInterval(() => {
      if (!this.nameElement) {
        clearInterval(breakingInterval);
        return;
      }

      currentStep++;
      const destructionProgress = currentStep / totalSteps;

      // Cria texto progressivamente mais destruído
      const brokenText = this.createProgressivelyBrokenText(
        letters,
        destructionProgress
      );
      this.nameElement.innerHTML = brokenText;

      // Muda cor progressivamente para vermelho
      const redIntensity = Math.floor(255 * destructionProgress);
      const blueIntensity = Math.floor(255 * (1 - destructionProgress));
      this.nameElement.style.color = `rgb(${255}, ${blueIntensity}, ${blueIntensity})`;
      this.nameElement.style.textShadow = `2px 2px 0 #000, 0 0 ${10 * destructionProgress}px #ff0000`;

      if (currentStep >= totalSteps) {
        clearInterval(breakingInterval);
        console.log("💥 Nome completamente destruído!");
        // Programa a regeneração após destruição completa
        this.scheduleNameRegeneration();
      }
    }, 100); // Animação mais rápida
  }

  // Cria texto progressivamente quebrado
  createProgressivelyBrokenText(letters, progress) {
    const destructionChars = [
      "█",
      "▓",
      "▒",
      "░",
      "▄",
      "▀",
      "■",
      "□",
      "▪",
      "▫",
    ];
    const glitchChars = ["!", "@", "#", "$", "%", "^", "&", "*", "~", "`"];

    return letters
      .map((char, index) => {
        if (char === " ") return " ";

        // Probabilidade de quebrar baseada no progresso e posição
        const letterProgress = Math.max(
          0,
          progress - (index / letters.length) * 0.2
        );

        if (letterProgress < 0.2) {
          return char; // Letra original
        } else if (letterProgress < 0.4) {
          // Primeira fase: tremor ocasional
          return Math.random() < 0.3
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : char;
        } else if (letterProgress < 0.6) {
          // Segunda fase: mais glitches
          return Math.random() < 0.5
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : char;
        } else if (letterProgress < 0.8) {
          // Terceira fase: blocos aparecem
          return Math.random() < 0.7
            ? destructionChars[
                Math.floor(Math.random() * destructionChars.length)
              ]
            : char;
        } else {
          // Fase final: principalmente caracteres de destruição
          return Math.random() < 0.9
            ? destructionChars[
                Math.floor(Math.random() * destructionChars.length)
              ]
            : char;
        }
      })
      .join("");
  }

  // Cria texto "destruído" com caracteres aleatórios
  createDestroyedText(originalText) {
    const chars = "█▓▒░!@#$%^&*()_+-=[]{}|;:,.<>?~`";
    const plainText = originalText.replace(/<[^>]*>/g, ""); // Remove HTML tags

    return plainText
      .split("")
      .map((char) => {
        if (char === " ") return " ";
        return Math.random() < 0.7
          ? chars[Math.floor(Math.random() * chars.length)]
          : char;
      })
      .join("");
  }

  // Agenda a regeneração do nome
  scheduleNameRegeneration() {
    console.log("⏳ Agendando regeneração do nome em 4 segundos...");
    this.nameRegenerationTimer = setTimeout(() => {
      this.regenerateName();
    }, 4000); // Regenera após 4 segundos
  }

  // Regenera o nome gradualmente com animação aprimorada
  regenerateName() {
    if (!this.nameElement || !this.nameOriginalContent) return;

    console.log("✨ Iniciando regeneração do nome...");

    // Adiciona efeito de regeneração com brilho
    this.nameElement.style.animation = "regenerate 0.5s ease-in-out";

    const plainOriginal = this.nameOriginalContent.replace(/<[^>]*>/g, "");
    let currentStep = 0;
    const totalSteps = 15; // Mais etapas para suavizar

    const regenerationInterval = setInterval(() => {
      if (!this.nameElement) {
        clearInterval(regenerationInterval);
        return;
      }

      currentStep++;
      const progress = currentStep / totalSteps;

      // Gradualmente restaura o texto original
      const regeneratedText = this.createRegeneratingText(
        plainOriginal,
        progress
      );
      this.nameElement.innerHTML = regeneratedText;

      // Gradualmente restaura as cores (de vermelho para azul ciano)
      const redValue = Math.floor(255 * (1 - progress));
      const greenValue = Math.floor(180 * progress); // Um pouco de verde para o ciano
      const blueValue = Math.floor(255 * progress);
      this.nameElement.style.color = `rgb(${redValue}, ${greenValue}, ${blueValue})`;

      // Diminui o brilho vermelho gradualmente
      const glowIntensity = Math.floor(10 * (1 - progress));
      this.nameElement.style.textShadow =
        glowIntensity > 0
          ? `2px 2px 0 #000, 0 0 ${glowIntensity}px #ff0000`
          : "";

      if (currentStep >= totalSteps) {
        // Restauração completa
        this.nameElement.innerHTML = this.nameOriginalContent;
        this.nameElement.style.color = ""; // Volta à cor original
        this.nameElement.style.textShadow = "";
        this.nameElement.style.animation = "";
        clearInterval(regenerationInterval);
        console.log("✅ Nome completamente regenerado!");
      }
    }, 150); // Intervalo um pouco mais rápido
  }

  // Cria texto em processo de regeneração aprimorado
  createRegeneratingText(originalText, progress) {
    const destructionChars = ["█", "▓", "▒", "░", "▄", "▀", "■", "□"];
    const transitionChars = [".", ":", ";", "'", '"', "-", "_"];

    return originalText
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";

        // Progresso individual por caractere com efeito cascata
        const charProgress = Math.max(
          0,
          progress - (index / originalText.length) * 0.2
        );

        if (charProgress >= 0.9) {
          return char; // Caractere original completamente restaurado
        } else if (charProgress >= 0.7) {
          // Transição suave para o caractere original
          return Math.random() < 0.8
            ? char
            : transitionChars[
                Math.floor(Math.random() * transitionChars.length)
              ];
        } else if (charProgress >= 0.5) {
          // Mistura de caractere original e transição
          return Math.random() < 0.6
            ? char
            : Math.random() < 0.5
              ? transitionChars[
                  Math.floor(Math.random() * transitionChars.length)
                ]
              : destructionChars[
                  Math.floor(Math.random() * destructionChars.length)
                ];
        } else if (charProgress >= 0.3) {
          // Mais blocos, menos lixo
          return Math.random() < 0.3
            ? char
            : destructionChars[
                Math.floor(Math.random() * destructionChars.length)
              ];
        } else {
          // Início da regeneração - principalmente blocos
          return destructionChars[
            Math.floor(Math.random() * destructionChars.length)
          ];
        }
      })
      .join("");
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
