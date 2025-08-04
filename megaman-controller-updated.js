/**
 * MEGA MAN CONTROLLER - SISTEMA COMPLETO ATUALIZADO
 * Com efeitos de destruição e regeneração dourada com partículas para TODAS as páginas
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
    this.nameOriginalContent = "";
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
    this.regenerationDuration = 2500;

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
      score: 0,
    };

    // Elemento de pontuação
    this.scoreElement = null;

    // Mapeamento de títulos por página
    this.pageTitles = {
      home: "CARLOS AUGUSTO DINIZ FILHO",
      sobre: "SOBRE MIM",
      curriculo: "CURRÍCULO",
      projetos: "PROJETOS",
      skills: "SKILLS",
      blog: "BLOG",
      contato: "CONTATO"
    };

    this.init();
  }

  /* ========== INICIALIZAÇÃO ========== */
  init() {
    this.createMegamanElement();
    this.createScoreElement();
    this.updateBoundaries();
    this.bindEvents();
    this.findNameElement();
    this.injectStyles();
  }

  createScoreElement() {
    // Cria o elemento de pontuação com estilo retro 8-bits
    this.scoreElement = document.createElement("div");
    this.scoreElement.className = "megaman-score";
    this.scoreElement.innerHTML = `
      <div class="score-container">
        <span class="score-label">SCORE:</span>
        <span class="score-value">0000</span>
      </div>
    `;

    // Adiciona ao body
    document.body.appendChild(this.scoreElement);
  }

  updateScore(points) {
    this.stats.score += points;
    const scoreValue = this.scoreElement?.querySelector(".score-value");
    if (scoreValue) {
      scoreValue.textContent = this.stats.score.toString().padStart(4, "0");
    }
  }

  injectStyles() {
    const styleId = "megaman-controller-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Estilos do Mega Man */
      .megaman-character {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }

      .megaman-character.active {
        animation: megaman-entrance 1s ease-out;
      }

      .megaman-character.entering {
        transform: scale(0.5);
        opacity: 0;
      }

      .megaman-character.attack {
        filter: brightness(1.5) saturate(1.5);
      }

      @keyframes megaman-entrance {
        0% { transform: scale(0.5) rotate(360deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }

      /* Estilos da pontuação */
      .megaman-score {
        position: fixed;
        top: 60px;
        right: 20px;
        z-index: 1000;
        font-family: "Press Start 2P", monospace;
        font-size: 12px;
        color: #00ff00;
        text-shadow: 2px 2px 0 #000;
        background: rgba(0, 0, 0, 0.8);
        padding: 10px 15px;
        border: 2px solid #00ff00;
        border-radius: 0;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      }

      .score-container {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .score-label {
        color: #ffff00;
      }

      .score-value {
        color: #00ff00;
        font-weight: bold;
      }

      /* Efeitos de regeneração */
      .regenerating-letter {
        display: inline-block;
        animation: letter-regenerate 0.8s ease-out forwards;
        opacity: 0;
        transform: translateY(20px) scale(0.5);
        color: #ffd700;
        text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700;
      }

      @keyframes letter-regenerate {
        0% {
          opacity: 0;
          transform: translateY(20px) scale(0.5) rotate(180deg);
          color: #ffd700;
          text-shadow: 0 0 5px #ffd700;
        }
        50% {
          opacity: 0.8;
          transform: translateY(-5px) scale(1.2) rotate(0deg);
          color: #ffff00;
          text-shadow: 0 0 15px #ffff00, 0 0 25px #ffd700;
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(0deg);
          color: inherit;
          text-shadow: inherit;
        }
      }

      /* Sistema de partículas */
      .particles-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999;
        overflow: hidden;
      }

      .golden-trail {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
        animation: trail-pulse 2s ease-in-out infinite;
      }

      @keyframes trail-pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
      }

      .golden-particle {
        position: absolute;
        background: radial-gradient(circle, #ffd700 0%, #ffff00 50%, transparent 100%);
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 6px #ffd700, 0 0 12px #ffd700;
        animation: particle-sparkle 0.5s ease-in-out infinite alternate;
      }

      @keyframes particle-sparkle {
        0% { box-shadow: 0 0 6px #ffd700, 0 0 12px #ffd700; }
        100% { box-shadow: 0 0 12px #ffff00, 0 0 24px #ffd700, 0 0 36px #ffd700; }
      }

      /* Efeitos de shake */
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) rotate(-1deg); }
        75% { transform: translateX(5px) rotate(1deg); }
      }

      /* Efeito de cinzas */
      @keyframes ash-fall {
        0% { 
          opacity: 1; 
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }
        50% { 
          opacity: 0.5; 
          transform: translateY(10px) scale(0.95);
          filter: blur(1px);
        }
        100% { 
          opacity: 0.2; 
          transform: translateY(20px) scale(0.9);
          filter: blur(2px);
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ========== SISTEMA DE PARTÍCULAS ========== */
  createParticleSystem(container) {
    if (!container) return;

    const particleContainer = document.createElement("div");
    particleContainer.className = "particles-container";
    container.appendChild(particleContainer);

    const goldenTrail = document.createElement("div");
    goldenTrail.className = "golden-trail";
    particleContainer.appendChild(goldenTrail);

    const particleCount = 150;
    const particles = [];

    const containerRect = container.getBoundingClientRect();
    const letters = container.textContent.split("").filter(char => char !== " ");

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "golden-particle";

      const size = Math.random() * 4 + 2;
      const startX = Math.random() * containerRect.width;
      const startY = Math.random() * containerRect.height;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = "0";
      particle.style.filter = `blur(${Math.random() * 2}px)`;

      const delay = Math.random() * 2000;
      const maxLife = 2 + Math.random() * 2;

      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particleContainer.appendChild(particle);

      particles.push({
        element: particle,
        startX: startX,
        startY: startY,
        x: startX,
        y: startY,
        targetLetter: Math.floor(Math.random() * letters.length),
        delay: delay,
        maxLife: maxLife,
        time: 0,
        life: 0,
        speed: Math.random() * 0.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
        spiralRadius: Math.random() * 20 + 10,
        pathRandomness: Math.random() * 0.3 + 0.1,
      });
    }

    const particleSystem = {
      container: particleContainer,
      particles: particles,
      letters: this.getLetterPositions(container),
      startTime: Date.now(),
      duration: 3000,
      isActive: true,
    };

    this.particleSystems.push(particleSystem);
    this.animateParticles(particleSystem);

    setTimeout(() => {
      this.cleanupParticleSystem(particleSystem);
    }, particleSystem.duration);
  }

  getLetterPositions(container) {
    const letters = [];
    const text = container.textContent;
    const containerRect = container.getBoundingClientRect();
    const style = window.getComputedStyle(container);
    const fontSize = parseFloat(style.fontSize);

    for (let i = 0; i < text.length; i++) {
      if (text[i] !== " ") {
        letters.push({
          x: (i * fontSize * 0.6) % containerRect.width,
          y: Math.floor((i * fontSize * 0.6) / containerRect.width) * fontSize,
        });
      }
    }

    return letters;
  }

  animateParticles(system) {
    if (!system.isActive) return;

    const elapsed = (Date.now() - system.startTime) / 1000;

    if (elapsed > system.duration / 1000) {
      system.isActive = false;
      return;
    }

    system.particles.forEach((particle) => {
      if (elapsed * 1000 < particle.delay) return;

      particle.time = elapsed - particle.delay / 1000;
      particle.life = particle.time / particle.maxLife;

      if (particle.life > 1) {
        particle.element.style.opacity = "0";
        return;
      }

      const progress = Math.min(1, particle.time * 2);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      if (system.letters && system.letters[particle.targetLetter]) {
        const targetLetter = system.letters[particle.targetLetter];
        const targetX = targetLetter.x;
        const targetY = targetLetter.y;

        particle.angle += 0.05 * particle.speed;
        const spiralX =
          Math.cos(particle.angle * 2) *
          particle.spiralRadius *
          (1 - easeProgress);
        const spiralY =
          Math.sin(particle.angle * 3) *
          particle.spiralRadius *
          (1 - easeProgress);

        particle.x =
          particle.startX +
          (targetX - particle.startX) *
            easeProgress *
            (1 + particle.pathRandomness * Math.sin(particle.time * 5)) +
          spiralX;
        particle.y =
          particle.startY +
          (targetY - particle.startY) *
            easeProgress *
            (1 + particle.pathRandomness * Math.cos(particle.time * 3)) +
          spiralY;
      }

      const opacity = Math.min(1, particle.time * 3) * (1 - particle.life);
      const scale = 0.5 + 0.5 * Math.min(1, particle.time * 2);

      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${scale})`;
      particle.element.style.opacity = opacity;

      if (particle.life > 0.8) {
        particle.element.style.boxShadow = `0 0 ${15 * (1 - particle.life)}px #ffd700`;
      }
    });

    requestAnimationFrame(() => this.animateParticles(system));
  }

  cleanupParticleSystem(system) {
    if (system.container && system.container.parentNode) {
      system.container.remove();
    }
    system.isActive = false;
    this.particleSystems = this.particleSystems.filter((ps) => ps !== system);
  }

  /* ========== SISTEMA DE REGENERAÇÃO ========== */
  regenerateName(container, nextSibling) {
    if (!container || !this.isRegenerating) return;

    const currentOriginalContent = this.nameOriginalContent;
    
    const newNameElement = document.createElement("h1");
    newNameElement.className = this.originalNameAttributes.class || "hero-title";

    // Cria versão com letras animadas
    const letters = currentOriginalContent
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

    // Adiciona sistema de partículas
    this.createParticleSystem(newNameElement);

    // Insere na posição original
    if (nextSibling) {
      container.insertBefore(newNameElement, nextSibling);
    } else {
      container.appendChild(newNameElement);
    }

    this.nameElement = newNameElement;
    this.stats.successfulRegenerations++;

    // Adiciona 5 pontos por regeneração
    this.updateScore(5);

    this.setupClickListener();

    // Remove efeitos após animação
    setTimeout(() => {
      this.restoreOriginalStyles(newNameElement);
    }, this.regenerationDuration);
  }

  restoreOriginalStyles(element) {
    if (!element || !this.nameOriginalContent) return;

    const currentOriginalContent = this.nameOriginalContent;
    
    // Adiciona transição suave para a cor original
    element.style.transition = "color 0.5s ease, text-shadow 0.5s ease";

    // Restaura conteúdo original
    element.innerHTML = currentOriginalContent;

    // Restaura atributos e estilos
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

    // Remove a transição após completar
    setTimeout(() => {
      element.style.transition = "";
    }, 500);
  }

  /* ========== SISTEMA DE DESTRUIÇÃO ========== */
  handleDestruction() {
    if (!this.nameElement || this.isRegenerating) return;

    const container = this.nameElement.parentNode;
    const nextSibling = this.nameElement.nextSibling;
    
    // Guarda o conteúdo original do título atual se ainda não tiver sido guardado
    if (!this.nameOriginalContent) {
      this.nameOriginalContent = this.nameElement.innerHTML;
    }

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

    // Adiciona 10 pontos por destruição
    this.updateScore(10);

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

    const currentOriginalContent = this.nameOriginalContent;
    const plainText = currentOriginalContent.replace(/<[^>]*>/g, "");
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
    const currentContent = originalText || this.nameOriginalContent;
    const chars = "█▓▒░!@#$%^&*()_+-=[]{}|;:,.<>?~`";
    const plainText = currentContent.replace(/<[^>]*>/g, "");

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

  /* ========== CONTROLE PRINCIPAL ========== */
  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.isPaused = false;
    this.stats.startTime = Date.now();

    // Detecta a página atual
    this.detectCurrentPage();
    
    // Animação de entrada
    this.element.style.opacity = "1";
    this.element.classList.add("active", "entering");

    setTimeout(() => {
      this.element?.classList.remove("entering");
    }, 1000);

    this.scheduleNextMove();
    this.scheduleNextShoot();
    this.animate();

    console.log("Megaman ativado!");
  }

  stop() {
    if (!this.isActive) return;

    this.isActive = false;
    this.isPaused = false;

    this.clearTimers();
    this.stopMovement();

    if (this.element) {
      this.element.style.opacity = "0";
      this.element.classList.remove("active");
    }

    // Limpa sistemas de partículas
    this.particleSystems.forEach((sys) => this.cleanupParticleSystem(sys));
    this.particleSystems = [];

    // Remove elemento de pontuação
    if (this.scoreElement) {
      this.scoreElement.remove();
      this.scoreElement = null;
    }

    console.log("Megaman desativado!");
  }

  pause() {
    if (!this.isActive || this.isPaused) return;
    this.isPaused = true;
    this.clearTimers();
    this.stopMovement();
  }

  resume() {
    if (!this.isActive || !this.isPaused) return;
    this.isPaused = false;
    this.scheduleNextMove();
    this.scheduleNextShoot();
    this.animate();
  }

  /* ========== MOVIMENTO ========== */
  moveToRandomPosition() {
    if (!this.isActive || this.isPaused || this.isMoving) return;

    this.targetPosition = this.getRandomPosition();
    this.isMoving = true;
    this.stats.totalMoves++;

    // Determina direção
    this.direction = this.targetPosition.x > this.position.x ? "right" : "left";
    this.updateMovementSprite();

    this.animate();
    this.scheduleNextMove();
  }

  moveToName() {
    if (!this.nameElement || this.isMoving || this.isMovingToName) return;

    const nameRect = this.nameElement.getBoundingClientRect();
    this.targetPosition = {
      x: Math.max(
        this.boundaries.minX,
        Math.min(
          this.boundaries.maxX,
          nameRect.left + nameRect.width / 2 - 32
        )
      ),
      y: Math.max(
        this.boundaries.minY,
        Math.min(this.boundaries.maxY, nameRect.top - 80)
      ),
    };

    this.isMoving = true;
    this.isMovingToName = true;
    this.direction = this.targetPosition.x > this.position.x ? "right" : "left";
    this.updateMovementSprite();
    this.animate();
  }

  animate() {
    if (!this.isActive || this.isPaused) return;

    if (this.isMoving) {
      const dx = this.targetPosition.x - this.position.x;
      const dy = this.targetPosition.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.movementSpeed) {
        this.position = { ...this.targetPosition };
        this.isMoving = false;
        this.isMovingToName = false;
        this.switchSprite(this.direction === "left" ? "idleLeft" : "idle");
      } else {
        this.position.x += (dx / distance) * this.movementSpeed;
        this.position.y += (dy / distance) * this.movementSpeed;
      }

      this.updateElementPosition();
    }

    if (this.isMoving || this.isShooting) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
  }

  /* ========== TIRO ========== */
  shoot() {
    if (!this.isActive || this.isPaused || this.isShooting) return;

    this.isShooting = true;
    this.stats.totalShots++;

    // Se há um nome na tela e não está em cooldown, move para ele
    if (this.nameElement && !this.destructionCooldown && !this.isRegenerating) {
      this.moveToName();

      setTimeout(() => {
        if (this.nameElement && !this.destructionCooldown) {
          this.handleDestruction();
        }
      }, 1500);
    }

    this.switchSprite("shooting");

    setTimeout(() => {
      this.isShooting = false;
      if (!this.isMoving) {
        this.switchSprite(this.direction === "left" ? "idleLeft" : "idle");
      }
    }, this.shootDuration);

    this.scheduleNextShoot();
  }

  /* ========== FUNÇÕES AUXILIARES ========== */
  detectCurrentPage() {
    // Detecta a página atual baseado nas seções ativas
    const activeSection = document.querySelector(".page.active");
    if (activeSection) {
      this.currentPage = activeSection.id || "home";
      console.log("Megaman está na página:", this.currentPage);
      // Após detectar a página, procura pelo título
      this.findNameElement();
    }
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
    
    // Observa mudanças na DOM para detectar navegação entre páginas
    this.setupPageChangeObserver();
  }
  
  setupPageChangeObserver() {
    // Configura um MutationObserver para detectar mudanças nas páginas
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" || mutation.type === "attributes") {
            // Verifica se houve mudança na página ativa
            const activeSection = document.querySelector(".page.active");
            if (activeSection && activeSection.id !== this.currentPage) {
              this.currentPage = activeSection.id;
              console.log("Página mudou para:", this.currentPage);
              // Procura pelo título na nova página
              this.findNameElement();
            }
          }
        });
      });
      
      // Observa mudanças nos filhos e atributos
      observer.observe(mainContent, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    }
  }

  findNameElement() {
    // Procura por títulos em qualquer página
    let titleElement = null;
    
    // Limpa o conteúdo original ao mudar de página
    this.nameOriginalContent = null;
    
    // Verifica se estamos na página inicial
    if (this.currentPage === "home") {
      titleElement = document.querySelector("#destroyable-name, .hero-title");
      if (titleElement) {
        this.nameElement = titleElement;
        this.nameOriginalContent = this.pageTitles.home;
      }
    } 
    // Para todas as outras páginas, procura pelo primeiro h1
    else {
      // Procura por h1 na página ativa
      const activePage = document.querySelector(".page.active");
      if (activePage) {
        titleElement = activePage.querySelector("h1");
        if (titleElement) {
          this.nameElement = titleElement;
          // Define o conteúdo original baseado na página atual
          this.nameOriginalContent = this.pageTitles[this.currentPage] || titleElement.textContent.trim();
        }
      }
    }
    
    // Se encontrou um título, guarda seus atributos originais
    if (this.nameElement) {
      // Guarda atributos originais
      this.originalNameAttributes = {}; // Limpa atributos anteriores
      for (const attr of this.nameElement.attributes) {
        this.originalNameAttributes[attr.name] = attr.value;
      }
      this.originalNameContainer = this.nameElement.parentNode;
      this.originalNameNextSibling = this.nameElement.nextSibling;
      
      console.log(`Título encontrado na página ${this.currentPage}:`, this.nameOriginalContent);
    } else {
      this.nameElement = null;
      console.log(`Nenhum título encontrado na página ${this.currentPage}`);
    }
  }

  setupClickListener() {
    if (this.nameElement) {
      this.nameElement.style.cursor = "pointer";
      this.nameElement.addEventListener("click", () => {
        if (!this.destructionCooldown && !this.isRegenerating) {
          this.handleDestruction();
        }
      });
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

  /* ========== CONTROLES EXTERNOS ========== */
  forceShoot() {
    if (this.isActive && !this.isShooting) {
      this.shoot();
    }
  }

  forceMove() {
    if (this.isActive && !this.isMoving) {
      this.moveToRandomPosition();
    }
  }

  getStats() {
    const currentTime = Date.now();
    if (this.stats.startTime) {
      this.stats.timeActive = Math.floor(
        (currentTime - this.stats.startTime) / 1000
      );
    }

    return {
      ...this.stats,
      isActive: this.isActive,
      currentPage: this.currentPage,
      hasTarget: !!this.nameElement,
      targetContent: this.nameOriginalContent,
    };
  }
}

// Instância global
window.megamanController = new MegamanController();

// Funções de controle global
function megamanControlAction(action) {
  const controller = window.megamanController;
  
  switch (action) {
    case "on":
      controller.start();
      break;
    case "off":
      controller.stop();
      break;
    case "shoot":
      controller.forceShoot();
      break;
    case "move":
      controller.forceMove();
      break;
    case "stats":
      console.log("Estatísticas do Megaman:", controller.getStats());
      break;
    default:
      console.log("Ações disponíveis: on, off, shoot, move, stats");
  }
}

// Funções para compatibilidade
function toggleMegamanControls() {
  const container = document.getElementById("megaman-controls-container");
  if (container) {
    container.style.display = container.style.display === "none" ? "flex" : "none";
  }
}

console.log("Megaman Controller carregado! Use 'megaman on' ou 'megaman off' no terminal.");

