/**
 * Mega Man Controller - Sistema completo com efeitos de destruição e regeneração correta
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

    // Controle do nome
    this.nameElement = null;
    this.isMovingToName = false;
    this.nameOriginalContent = "Carlos Augusto Diniz Filho";
    this.nameRegenerationTimer = null;
    this.destructionCooldown = false;
    this.originalNameAttributes = {};
    this.originalNameContainer = null;
    this.originalNameNextSibling = null;

    // Configurações de tempo
    this.shootInterval = { min: 12000, max: 30000 };
    this.moveInterval = { min: 1500, max: 4000 };
    this.shootDuration = 1000;
    this.regenerationCooldown = 3000;
    this.animationDuration = 800;

    // Sprites
    this.sprites = {
      idle: "assets/sprites/parado10.gif",
      idleLeft: "assets/sprites/megaman-pushing-esquerda.gif",
      stopped: "assets/sprites/parado10.gif",
      shooting: "assets/sprites/m2.gif",
      running: "assets/sprites/megaman-pushing.gif",
      runningLeft: "assets/sprites/megaman-pushing-esquerda.gif",
    };

    this.direction = "right";
    this.lastPosition = { x: 100, y: 100 };

    // Limites da tela
    this.boundaries = {
      minX: 50,
      maxX: window.innerWidth - 100,
      minY: 50,
      maxY: window.innerHeight - 100,
    };

    // Estatísticas
    this.stats = {
      totalShots: 0,
      totalMoves: 0,
      timeActive: 0,
      startTime: null,
      nameDestructions: 0,
      successfulRegenerations: 0,
    };

    this.init();
  }

  init() {
    this.createMegamanElement();
    this.updateBoundaries();
    this.bindEvents();
    this.findNameElement();
  }

  createMegamanElement() {
    if (this.element) {
      this.element.remove();
    }

    this.element = document.createElement("div");
    this.element.id = "megaman-character";
    this.element.className = "megaman-character";

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
    window.addEventListener("resize", () => {
      this.updateBoundaries();
    });

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

    setTimeout(() => {
      if (this.element) {
        this.element.classList.remove("entering");
      }
    }, 1000);

    this.scheduleNextMove();
    this.scheduleNextShoot();

    console.log('🤖 Mega Man ativado! Use "megaman off" para desativar.');

    if (window.audioSystem) {
      window.audioSystem.play("achievement");
    }
  }

  stop() {
    if (!this.isActive) return;

    this.isActive = false;
    this.isPaused = false;

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
    if (this.nameRegenerationTimer) {
      clearTimeout(this.nameRegenerationTimer);
      this.nameRegenerationTimer = null;
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

    let delay = this.getRandomInterval(this.shootInterval);

    if (this.nameElement && this.isMovingToName) {
      delay = delay * 0.5;
      console.log("🎯 Megaman próximo ao nome: intervalo de tiro reduzido!");
    }

    this.shootTimer = setTimeout(() => {
      this.shoot();
    }, delay);
  }

  moveToRandomPosition() {
    if (!this.isActive || this.isPaused || this.isMoving || this.isShooting) {
      this.scheduleNextMove();
      return;
    }

    this.findNameElement();

    this.lastPosition = { ...this.position };

    if (this.nameElement && Math.random() < 0.6) {
      this.moveToName();
      return;
    }

    this.targetPosition = this.getRandomPosition();
    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";
    this.isMoving = true;
    this.isMovingToName = false;
    this.stats.totalMoves++;

    if (this.element) {
      this.element.classList.add("moving");
    }

    this.updateMovementSprite();
    this.updateMovement();
  }

  updateMovement() {
    if (!this.isActive || !this.isMoving) return;

    const dx = this.targetPosition.x - this.position.x;
    const dy = this.targetPosition.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.movementSpeed) {
      this.position.x = this.targetPosition.x;
      this.position.y = this.targetPosition.y;
      this.isMoving = false;

      if (this.element) {
        this.element.classList.remove("moving");
      }

      this.switchSprite("stopped");
      this.updateElementPosition();
      this.scheduleNextMove();
      return;
    }

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
    if (
      !this.isActive ||
      this.isPaused ||
      this.isShooting ||
      this.destructionCooldown
    ) {
      this.scheduleNextShoot();
      return;
    }

    if (this.isMoving) {
      this.stopMovement();
    }

    this.isShooting = true;
    this.stats.totalShots++;
    this.switchSprite("shooting");

    if (this.element) {
      this.element.classList.add("shooting");
    }

    if (window.audioSystem) {
      window.audioSystem.play("click");
    }

    console.log("💥 Mega Man atirando!");

    this.checkNameDestruction();

    setTimeout(() => {
      if (this.isActive) {
        this.switchSprite("stopped");
        this.isShooting = false;

        if (this.element) {
          this.element.classList.remove("shooting");
        }

        this.scheduleNextShoot();

        if (Math.random() < 0.5) {
          setTimeout(() => {
            if (this.isActive && !this.isMoving) {
              this.moveToRandomPosition();
            }
          }, 500);
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

  updateMovementSprite() {
    if (this.direction === "left") {
      this.switchSprite("runningLeft");
    } else {
      this.switchSprite("running");
    }
  }

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
        activeTime: Math.round(activeTime / 1000),
      },
    };
  }

  resetStats() {
    this.stats = {
      totalShots: 0,
      totalMoves: 0,
      timeActive: 0,
      startTime: this.isActive ? Date.now() : null,
    };
    console.log("📊 Estatísticas do Mega Man resetadas!");
  }

  findNameElement() {
    if (this.currentPage !== "home") {
      this.nameElement = null;
      return;
    }

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

      // Guarda os atributos e posição original do nome
      this.originalNameAttributes = {};
      for (const attr of titleElement.attributes) {
        this.originalNameAttributes[attr.name] = attr.value;
      }
      this.originalNameContainer = titleElement.parentNode;
      this.originalNameNextSibling = titleElement.nextSibling;
    } else {
      this.nameElement = null;
    }
  }

  moveToName() {
    if (!this.nameElement) return;

    const rect = this.nameElement.getBoundingClientRect();
    this.targetPosition = {
      x: Math.max(50, rect.left - 100),
      y: Math.max(50, rect.top + rect.height / 2 - 32),
    };

    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";
    this.isMoving = true;
    this.isMovingToName = true;
    this.stats.totalMoves++;

    if (this.element) {
      this.element.classList.add("moving");
    }

    console.log("🎯 Mega Man se movendo em direção ao nome!");

    this.updateMovementSprite();
    this.updateMovement();
  }

  checkNameDestruction() {
    if (!this.nameElement || !this.isActive || this.destructionCooldown) {
      return;
    }

    const nameRect = this.nameElement.getBoundingClientRect();
    const megamanRect = {
      left: this.position.x,
      top: this.position.y,
      right: this.position.x + 64,
      bottom: this.position.y + 64,
    };

    const distance = Math.sqrt(
      Math.pow(nameRect.left - megamanRect.left, 2) +
        Math.pow(nameRect.top - megamanRect.top, 2)
    );

    let destructionChance = 0;

    if (distance < 150) destructionChance = 0.9;
    else if (distance < 250) destructionChance = 0.8;
    else if (distance < 350) destructionChance = 0.7;
    else if (distance < 450) destructionChance = 0.5;
    else if (distance < 550) destructionChance = 0.3;

    if (destructionChance > 0 && Math.random() < destructionChance) {
      this.handleDestruction();
      console.log(
        `💥 Nome destruído pelo Mega Man! (Distância: ${Math.round(distance)}px, Chance: ${Math.round(destructionChance * 100)}%)`
      );
    }
  }

  handleDestruction() {
    if (!this.nameElement) return;

    // Guarda referências do container e próximo irmão
    const container = this.nameElement.parentNode;
    const nextSibling = this.nameElement.nextSibling;

    if (this.element) {
      this.element.classList.add("attack");
    }

    // Adiciona efeito de tremor
    this.nameElement.style.animation = "shake 0.3s ease-in-out";

    // Animação de quebra das letras
    this.animateLetterBreaking();

    // Efeito de cinzas após destruição
    setTimeout(() => {
      if (this.nameElement) {
        this.nameElement.style.animation = "ash-fall 1.5s ease-in-out";
        const ashText = this.createAshEffect(this.nameOriginalContent);
        this.nameElement.innerHTML = ashText;
        this.nameElement.style.color = "#333";
        this.nameElement.style.textShadow = "0 0 5px rgba(100, 100, 100, 0.5)";
      }
    }, 800);

    this.destructionCooldown = true;

    setTimeout(() => {
      if (this.nameElement && this.nameElement.parentNode) {
        this.nameElement.remove();
      }

      if (this.element) {
        this.element.classList.remove("attack");
      }

      setTimeout(() => {
        this.regenerateName(container, nextSibling);
        this.destructionCooldown = false;
      }, this.regenerationCooldown);
    }, this.animationDuration);
  }

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

      const brokenText = this.createProgressivelyBrokenText(
        letters,
        destructionProgress
      );
      this.nameElement.innerHTML = brokenText;

      const redIntensity = Math.floor(255 * destructionProgress);
      const blueIntensity = Math.floor(255 * (1 - destructionProgress));
      this.nameElement.style.color = `rgb(${255}, ${blueIntensity}, ${blueIntensity})`;
      this.nameElement.style.textShadow = `2px 2px 0 #000, 0 0 ${10 * destructionProgress}px #ff0000`;

      if (currentStep >= totalSteps) {
        clearInterval(breakingInterval);
      }
    }, 100);
  }

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

        const letterProgress = Math.max(
          0,
          progress - (index / letters.length) * 0.2
        );

        if (letterProgress < 0.2) return char;
        else if (letterProgress < 0.4) {
          return Math.random() < 0.3
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : char;
        } else if (letterProgress < 0.6) {
          return Math.random() < 0.5
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : char;
        } else if (letterProgress < 0.8) {
          return Math.random() < 0.7
            ? destructionChars[
                Math.floor(Math.random() * destructionChars.length)
              ]
            : char;
        } else {
          return Math.random() < 0.9
            ? destructionChars[
                Math.floor(Math.random() * destructionChars.length)
              ]
            : char;
        }
      })
      .join("");
  }

  createAshEffect(originalText) {
    const chars = "█▓▒░!@#$%^&*()_+-=[]{}|;:,.<>?~`";
    const plainText = originalText.replace(/<[^>]*>/g, "");

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

  regenerateName(container, nextSibling) {
    if (!container) {
      console.error("Container para regeneração do nome não encontrado!");
      return;
    }

    // Cria novo elemento com todas as propriedades originais
    const newNameElement = document.createElement("h1");
    newNameElement.className = "hero-title";
    newNameElement.innerHTML = this.nameOriginalContent;

    // Restaura todos os atributos originais
    for (const [name, value] of Object.entries(this.originalNameAttributes)) {
      newNameElement.setAttribute(name, value);
    }

    // Insere na posição original
    if (nextSibling) {
      container.insertBefore(newNameElement, nextSibling);
    } else {
      container.appendChild(newNameElement);
    }

    this.nameElement = newNameElement;
    this.isRegenerating = false;
    this.stats.successfulRegenerations++;
    this.nameRegenerationTimer = null;
    this.setupClickListener();

    // 60% de chance de ir para o nome após regeneração
    if (this.isActive && Math.random() < 0.6) {
      setTimeout(
        () => {
          if (this.isActive) this.moveToName();
        },
        1500 + Math.random() * 2000
      );
    }
  }

  setupClickListener() {
    if (this.nameElement) {
      this.nameElement.addEventListener(
        "click",
        () => this.handleDestruction(),
        {
          once: true,
        }
      );
    }
  }
}

// Inicialização automática quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  window.megamanController = new MegamanController();
  console.log(
    '🎮 Mega Man Controller carregado! Digite "megaman.start()" no console para iniciar.'
  );
});

// Interface para controle pelo console
window.megaman = {
  start: () => window.megamanController?.start(),
  stop: () => window.megamanController?.stop(),
  status: () => {
    const controller = window.megamanController;
    if (!controller) return "Mega Man Controller não encontrado";
    return {
      active: controller.isActive,
      position: controller.position,
      stats: controller.stats,
      nameExists: !!controller.nameElement,
      isRegenerating: controller.isRegenerating,
    };
  },
};
