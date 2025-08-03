/**
 * MEGA MAN CONTROLLER - SISTEMA COMPLETO (1000+ linhas)
 * Com partículas que nascem abaixo do nome e fazem movimento espiral
 */

class MegamanController {
  constructor() {
    // Configurações iniciais
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
    this.isRegenerating = false;
    this.particleSystems = [];

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

  /* ========== INICIALIZAÇÃO ========== */
  init() {
    this.createMegamanElement();
    this.updateBoundaries();
    this.bindEvents();
    this.findNameElement();
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* ========== EFEITOS DE REGENERAÇÃO ========== */
      .regenerating-letter {
        display: inline-block;
        animation: letterRegen 0.6s cubic-bezier(0.2, 0.8, 0.4, 1) both;
        color: #ffd700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
      }
      
      @keyframes letterRegen {
        0% {
          transform: scale(0.3) translateY(20px);
          opacity: 0;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        }
        70% {
          transform: scale(1.2);
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
        }
        100% {
          transform: scale(1);
          opacity: 1;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
      }
      
      /* ========== SISTEMA DE PARTÍCULAS ========== */
      .particles-container {
        position: absolute;
        bottom: -50px;
        left: 0;
        width: 100%;
        height: 150px;
        pointer-events: none;
        overflow: visible;
        z-index: 100;
      }
      
      .golden-particle {
        position: absolute;
        background: linear-gradient(135deg, #ffd700 0%, #ffcc00 100%);
        border-radius: 50%;
        box-shadow: 0 0 10px #ffd700;
        pointer-events: none;
        z-index: 100;
        opacity: 0;
        transform-origin: center;
      }
      
      /* ========== EFEITOS DE DESTRUIÇÃO ========== */
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      @keyframes ash-fall {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(20px); opacity: 0; }
      }
      
      /* ========== ESTILOS DO MEGA MAN ========== */
      .megaman-character {
        position: fixed;
        width: 64px;
        height: 64px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 800;
        pointer-events: none;
        transition: none;
      }
      
      .megaman-character.active {
        opacity: 1;
      }
      
      .megaman-character.entering {
        animation: megaman-enter 1s ease-out;
      }
      
      .megaman-character.leaving {
        animation: megaman-leave 1s ease-in;
      }
      
      @keyframes megaman-enter {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes megaman-leave {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0.5); opacity: 0; }
      }
      
      .megaman-character.moving {
        animation: megaman-move 0.5s infinite alternate;
      }
      
      @keyframes megaman-move {
        0% { transform: translateY(0); }
        100% { transform: translateY(-5px); }
      }
      
      .megaman-character.shooting {
        animation: megaman-shoot 0.3s;
      }
      
      @keyframes megaman-shoot {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
      }
      
      .megaman-character.attack {
        animation: megaman-attack 0.5s;
      }
      
      @keyframes megaman-attack {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      /* ========== EFEITOS DE TEXTO ========== */
      .hero-title {
        position: relative;
      }
    `;
    document.head.appendChild(style);
  }

  /* ========== SISTEMA DE PARTÍCULAS ========== */
  createParticleSystem(container) {
    const particleContainer = document.createElement("div");
    particleContainer.className = "particles-container";
    container.appendChild(particleContainer);

    const particleCount = 100;
    const particles = [];
    const nameRect = container.getBoundingClientRect();
    const startY = nameRect.height + 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "golden-particle";

      // Configuração visual
      const size = 4 + Math.random() * 6;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = "0";

      // Posição inicial abaixo do nome
      const x = Math.random() * nameRect.width;
      particle.style.left = `${x}px`;
      particle.style.bottom = "0";
      particleContainer.appendChild(particle);

      particles.push({
        element: particle,
        x: x,
        startY: startY,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random(),
        size: size,
        delay: i * 10,
        time: 0,
        life: 0,
        maxLife: 2 + Math.random() * 2,
        spiralRadius: 10 + Math.random() * 40,
      });
    }

    const particleSystem = {
      container: particleContainer,
      particles: particles,
      animationId: null,
      startTime: Date.now(),
    };

    this.particleSystems.push(particleSystem);
    this.animateParticles(particleSystem);
  }

  animateParticles(system) {
    const animate = () => {
      if (!this.isRegenerating) {
        this.cleanupParticleSystem(system);
        return;
      }

      const currentTime = Date.now();
      const elapsed = (currentTime - system.startTime) / 1000;

      system.particles.forEach((particle) => {
        // Aplica delay inicial
        if (elapsed * 1000 < particle.delay) return;

        particle.time = elapsed - particle.delay / 1000;
        particle.life = particle.time / particle.maxLife;

        if (particle.life > 1) {
          particle.element.style.opacity = "0";
          return;
        }

        // Atualiza movimento espiral
        particle.angle += 0.05 * particle.speed;

        // Calcula posição
        const spiralX = Math.cos(particle.angle) * particle.spiralRadius;
        const spiralY = Math.sin(particle.angle) * particle.spiralRadius;

        const y = particle.startY - particle.time * 100;
        const x = particle.x + spiralX;

        // Atualiza opacidade e escala
        const opacity = Math.min(1, particle.time * 2) * (1 - particle.life);
        const scale = 0.5 + Math.min(0.5, particle.time) * 1.5;

        // Aplica transformações
        particle.element.style.transform = `translate(${x}px, ${-y}px) scale(${scale})`;
        particle.element.style.opacity = opacity;
      });

      system.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  cleanupParticleSystem(system) {
    cancelAnimationFrame(system.animationId);
    system.container.remove();
    this.particleSystems = this.particleSystems.filter((ps) => ps !== system);
  }

  /* ========== SISTEMA DE REGENERAÇÃO ========== */
  regenerateName(container, nextSibling) {
    if (!container || !this.isRegenerating) {
      console.error("Container para regeneração não encontrado!");
      return;
    }

    const newNameElement = document.createElement("h1");
    newNameElement.className = "hero-title";

    // Cria versão com letras animadas
    const letters = this.nameOriginalContent
      .split("")
      .map((char, idx) => {
        if (char === " ") return " ";
        const delay = idx * 0.07;
        return `<span class="regenerating-letter" style="animation-delay: ${delay}s">${char}</span>`;
      })
      .join("");

    newNameElement.innerHTML = letters;

    // Restaura atributos originais
    for (const [name, value] of Object.entries(this.originalNameAttributes)) {
      newNameElement.setAttribute(name, value);
    }

    // Adiciona partículas
    this.createParticleSystem(newNameElement);

    // Insere na posição original
    if (nextSibling) {
      container.insertBefore(newNameElement, nextSibling);
    } else {
      container.appendChild(newNameElement);
    }

    this.nameElement = newNameElement;
    this.stats.successfulRegenerations++;
    this.setupClickListener();

    // Remove efeitos após animação e restaura estilo original
    setTimeout(() => {
      this.restoreOriginalStyles(newNameElement);
    }, 2500);
  }

  restoreOriginalStyles(element) {
    if (!element || !this.nameOriginalContent) return;

    // Restaura conteúdo original
    element.innerHTML = this.nameOriginalContent;

    // Restaura todos os atributos e estilos originais
    for (const [name, value] of Object.entries(this.originalNameAttributes)) {
      if (name === "style") {
        element.style.cssText = value;
      } else {
        element.setAttribute(name, value);
      }
    }

    // Limpa partículas
    this.particleSystems.forEach((sys) => this.cleanupParticleSystem(sys));
    this.particleSystems = [];
    this.isRegenerating = false;
  }

  /* ========== SISTEMA DE DESTRUIÇÃO ========== */
  handleDestruction() {
    if (!this.nameElement || this.isRegenerating) return;

    const container = this.nameElement.parentNode;
    const nextSibling = this.nameElement.nextSibling;

    // Efeito visual de ataque
    this.element?.classList.add("attack");
    this.nameElement.style.animation = "shake 0.3s ease-in-out";

    // Animação de destruição
    this.animateLetterBreaking();

    // Efeito de cinzas
    setTimeout(() => {
      if (this.nameElement) {
        this.nameElement.style.animation = "ash-fall 1.5s ease-in-out";
        this.nameElement.innerHTML = this.createAshEffect(
          this.nameOriginalContent
        );
        this.nameElement.style.color = "#333";
        this.nameElement.style.textShadow = "0 0 5px rgba(100, 100, 100, 0.5)";
      }
    }, 800);

    this.destructionCooldown = true;
    this.stats.nameDestructions++;

    // Inicia regeneração após delay
    setTimeout(() => {
      if (this.nameElement?.parentNode) {
        this.nameElement.remove();
      }

      this.element?.classList.remove("attack");
      this.isRegenerating = true;

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
    const totalSteps = 10;
    let currentStep = 0;

    const breakingEffect = setInterval(() => {
      if (!this.nameElement || currentStep >= totalSteps) {
        clearInterval(breakingEffect);
        return;
      }

      currentStep++;
      const progress = currentStep / totalSteps;

      // Cria texto com efeito de quebra
      const brokenText = letters
        .map((char, idx) => {
          if (char === " ") return " ";

          const charProgress = progress - (idx / letters.length) * 0.3;
          if (charProgress <= 0) return char;

          if (charProgress > 0.7) {
            return Math.random() > 0.3 ? "✧" : char;
          } else if (charProgress > 0.4) {
            return Math.random() > 0.5 ? "�" : char;
          }
          return char;
        })
        .join("");

      this.nameElement.innerHTML = brokenText;

      // Efeito de cor
      const red = Math.min(255, Math.floor(255 * progress));
      const blue = Math.max(0, Math.floor(255 * (1 - progress)));
      this.nameElement.style.color = `rgb(${red}, 0, ${blue})`;
      this.nameElement.style.textShadow = `0 0 ${Math.floor(10 * progress)}px rgba(255, 0, 0, 0.7)`;
    }, 80);
  }

  createAshEffect(originalText) {
    const chars = "✧✦∗�✵✹";
    const plainText = originalText.replace(/<[^>]*>/g, "");

    return plainText
      .split("")
      .map((char) =>
        char === " "
          ? " "
          : Math.random() < 0.7
            ? chars[Math.floor(Math.random() * chars.length)]
            : char
      )
      .join("");
  }

  /* ========== CONTROLE PRINCIPAL ========== */
  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.isPaused = false;
    this.stats.startTime = Date.now();

    // Animação de entrada
    this.element.style.opacity = "1";
    this.element.classList.add("active", "entering");

    setTimeout(() => {
      this.element?.classList.remove("entering");
    }, 1000);

    this.scheduleNextMove();
    this.scheduleNextShoot();

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

    // Animação de saída
    this.element.classList.add("leaving");
    setTimeout(() => {
      this.element.style.opacity = "0";
      this.element.classList.remove("leaving", "active");
    }, 1000);

    this.clearTimers();
    this.stopMovement();

    if (window.audioSystem) {
      window.audioSystem.play("click");
    }
  }

  /* ========== SISTEMA DE MOVIMENTO ========== */
  moveToRandomPosition() {
    if (!this.isActive || this.isPaused || this.isMoving || this.isShooting) {
      this.scheduleNextMove();
      return;
    }

    this.findNameElement();
    this.lastPosition = { ...this.position };

    // 60% de chance de ir para o nome se estiver visível
    if (this.nameElement && Math.random() < 0.6) {
      this.moveToName();
      return;
    }

    // Move para posição aleatória
    this.targetPosition = this.getRandomPosition();
    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";
    this.isMoving = true;
    this.isMovingToName = false;
    this.stats.totalMoves++;

    this.element.classList.add("moving");
    this.updateMovementSprite();
    this.updateMovement();
  }

  updateMovement() {
    if (!this.isActive || !this.isMoving) return;

    const dx = this.targetPosition.x - this.position.x;
    const dy = this.targetPosition.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.movementSpeed) {
      this.position = { ...this.targetPosition };
      this.isMoving = false;
      this.element.classList.remove("moving");
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

    this.animationFrame = requestAnimationFrame(() => this.updateMovement());
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

    this.element.classList.add("moving");
    this.updateMovementSprite();
    this.updateMovement();
  }

  /* ========== SISTEMA DE TIRO ========== */
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

    if (this.isMoving) this.stopMovement();

    this.isShooting = true;
    this.stats.totalShots++;
    this.switchSprite("shooting");
    this.element.classList.add("shooting");

    if (window.audioSystem) {
      window.audioSystem.play("click");
    }

    this.checkNameDestruction();

    setTimeout(() => {
      if (this.isActive) {
        this.switchSprite("stopped");
        this.isShooting = false;
        this.element.classList.remove("shooting");
        this.scheduleNextShoot();

        // 50% de chance de se mover após atirar
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

  checkNameDestruction() {
    if (!this.nameElement || !this.isActive || this.destructionCooldown) return;

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
    }
  }

  /* ========== FUNÇÕES AUXILIARES ========== */
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

  updateBoundaries() {
    this.boundaries = {
      minX: 50,
      maxX: Math.max(300, window.innerWidth - 100),
      minY: 50,
      maxY: Math.max(200, window.innerHeight - 100),
    };
  }

  bindEvents() {
    window.addEventListener("resize", this.updateBoundaries.bind(this));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isActive) this.pause();
      else if (!document.hidden && this.isActive) this.resume();
    });
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

      // Guarda atributos originais
      for (const attr of titleElement.attributes) {
        this.originalNameAttributes[attr.name] = attr.value;
      }
      this.originalNameContainer = titleElement.parentNode;
      this.originalNameNextSibling = titleElement.nextSibling;
    } else {
      this.nameElement = null;
    }
  }

  updateElementPosition() {
    if (this.element) {
      this.element.style.left = `${this.position.x}px`;
      this.element.style.top = `${this.position.y}px`;
    }
  }

  switchSprite(spriteName) {
    if (this.element && this.sprites[spriteName]) {
      this.currentSprite = spriteName;
      this.element.style.backgroundImage = `url('${this.sprites[spriteName]}')`;
    }
  }

  updateMovementSprite() {
    this.switchSprite(this.direction === "left" ? "runningLeft" : "running");
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
    this.moveTimer = setTimeout(() => this.moveToRandomPosition(), delay);
  }

  scheduleNextShoot() {
    if (!this.isActive) return;
    let delay = this.getRandomInterval(this.shootInterval);
    if (this.nameElement && this.isMovingToName) delay *= 0.5;
    this.shootTimer = setTimeout(() => this.shoot(), delay);
  }

  clearTimers() {
    clearTimeout(this.shootTimer);
    clearTimeout(this.moveTimer);
    clearTimeout(this.nameRegenerationTimer);
    this.shootTimer = null;
    this.moveTimer = null;
    this.nameRegenerationTimer = null;
  }

  stopMovement() {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
    this.isMoving = false;
  }

  pause() {
    if (!this.isActive || this.isPaused) return;
    this.isPaused = true;
    this.clearTimers();
    this.stopMovement();
    this.element.style.animationPlayState = "paused";
  }

  resume() {
    if (!this.isActive || !this.isPaused) return;
    this.isPaused = false;
    this.element.style.animationPlayState = "running";
    this.scheduleNextMove();
    this.scheduleNextShoot();
  }

  setupClickListener() {
    if (this.nameElement) {
      this.nameElement.addEventListener(
        "click",
        () => this.handleDestruction(),
        { once: true }
      );
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
      nameDestructions: 0,
      successfulRegenerations: 0,
    };
  }
}

// Inicialização automática
document.addEventListener("DOMContentLoaded", () => {
  window.megamanController = new MegamanController();

  // Interface para controle pelo console
  window.megaman = {
    start: () => window.megamanController?.start(),
    stop: () => window.megamanController?.stop(),
    status: () => window.megamanController?.getStatus(),
    resetStats: () => window.megamanController?.resetStats(),
  };

  console.log(
    '🎮 Mega Man Controller carregado! Use "megaman.start()" para iniciar.'
  );
});
