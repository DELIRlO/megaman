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

    // Nova lógica de IA
    this.aiState = "idle"; // idle, moving_right, positioning_left, shooting_right, shooting_left
    this.targetElement = null;
    this.hasShootRight = false;
    this.hasShootLeft = false;
    this.aiCycleTimer = null;

    this.nameElement = null;
    this.isMovingToName = false;
    this.nameOriginalContent = "CARLOS FILHO";
    this.nameRegenerationTimer = null;
    this.destructionCooldown = false;
    this.originalNameAttributes = {};
    this.originalNameContainer = null;
    this.originalNameNextSibling = null;
    this.isRegenerating = false;

    this.shootInterval = { min: 12000, max: 30000 };
    this.moveInterval = { min: 1500, max: 4000 };
    this.shootDuration = 1000;
    this.regenerationCooldown = 3000;
    this.animationDuration = 800;
    this.regenerationDuration = 2500;
    this.totalDestructionCooldown = 6000;

    this.sprites = {
      idle: "assets/sprites/parado10.gif",
      idleLeft: "assets/sprites/megaman-pushing-esquerda.gif", // Usado quando parado e virado para a esquerda
      preShootingLeft: "assets/sprites/parado-reverso.gif", // Animação antes de atirar para a esquerda
      stopped: "assets/sprites/parado10.gif",
      shooting: "assets/sprites/atirando.gif",
      shootingLeft: "assets/sprites/atirando-esquerda.gif", // Novo sprite para atirar para a esquerda
      running: "assets/sprites/megaman-pushing.gif",
      runningLeft: "assets/sprites/megaman-pushing-esquerda.gif",
    };

    this.direction = "right";
    this.lastPosition = { x: 100, y: 100 };

    this.boundaries = {
      minX: 50,
      maxX: window.innerWidth - 100,
      minY: 50,
      maxY: window.innerHeight - 100,
    };

    this.stats = {
      totalShots: 0,
      totalMoves: 0,
      timeActive: 0,
      startTime: null,
      nameDestructions: 0,
      successfulRegenerations: 0,
      score: 0,
    };

    this.scoreElement = null;

    this.init();
  }

  init() {
    this.createMegamanElement();
    this.createScoreElement();
    this.updateBoundaries();
    this.bindEvents();
    this.findNameElement();
    this.injectStyles();
    this.setupPageChangeMonitoring();
  }

  // Nova lógica de IA melhorada
  startAICycle() {
    if (!this.isActive || this.isPaused) return;

    this.findTargetElement();
    if (!this.targetElement) {
      // Se não há alvo, usar comportamento antigo
      this.scheduleNextMove();
      this.scheduleNextShoot();
      return;
    }

    this.aiState = "moving_right";
    this.hasShootRight = false;
    this.hasShootLeft = false;
    this.executeAIBehavior();
  }

  findTargetElement() {
    // Procura pelo elemento alvo (título da página)
    this.findNameElement();
    this.targetElement = this.nameElement;
  }

  executeAIBehavior() {
    if (!this.isActive || this.isPaused || !this.targetElement) return;

    const targetRect = this.targetElement.getBoundingClientRect();
    const targetCenter = {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
    };

    switch (this.aiState) {
      case "moving_right":
        this.moveRightAndShoot(targetCenter);
        break;
      case "positioning_left":
        this.positionLeftAndShoot(targetCenter);
        break;
      default:
        this.aiState = "idle";
        this.scheduleNextAICycle();
        break;
    }
  }

  moveRightAndShoot(targetCenter) {
    // Move para a direita do alvo (200-300px)
    const rightPosition = {
      x: Math.min(targetCenter.x + 250, this.boundaries.maxX - 50), // Ajustado para 200-300px
      y: Math.max(
        Math.min(targetCenter.y - 32, this.boundaries.maxY - 50),
        this.boundaries.minY
      ),
    };

    this.moveToPosition(rightPosition, () => {
      // Para e atira para a esquerda (na direção do alvo)
      this.stopAndShootLeft(() => {
        this.hasShootRight = true;
        this.aiState = "positioning_left";
        setTimeout(() => this.executeAIBehavior(), 1000);
      });
    });
  }

  positionLeftAndShoot(targetCenter) {
    // Move para a esquerda do alvo
    const leftPosition = {
      x: Math.max(targetCenter.x - 150, this.boundaries.minX),
      y: Math.max(
        Math.min(targetCenter.y - 32, this.boundaries.maxY - 50),
        this.boundaries.minY
      ),
    };

    this.moveToPosition(leftPosition, () => {
      // Para, olha para a direita (gif parado-reverso) e atira para a direita
      this.stopAndShootRight(() => {
        this.hasShootLeft = true;
        this.aiState = "idle";
        this.scheduleNextAICycle();
      });
    });
  }

  moveToPosition(targetPos, callback) {
    if (this.isMoving || this.isShooting) return;

    this.targetPosition = targetPos;
    this.direction = this.targetPosition.x > this.position.x ? "right" : "left";
    this.isMoving = true;
    this.stats.totalMoves++;

    this.element.classList.add("moving");
    this.updateMovementSprite();
    this.updateMovement(callback);
  }

  stopAndShootLeft(callback) {
    if (this.isShooting) return;

    this.direction = "left";
    this.isMoving = false;
    this.element.classList.remove("moving");
    // 1. Mostra a animação de preparação
    this.switchSprite("preShootingLeft");

    // 2. Aguarda um momento com a animação de preparação
    setTimeout(() => {
      if (this.isActive && !this.isShooting) {
        // 3. Executa o tiro
        this.performShoot("left", callback);
      }
    }, 300); // Aumentei o tempo para a animação ser mais visível
  }

  stopAndShootRight(callback) {
    if (this.isShooting) return;

    // Para o movimento e muda para sprite parado olhando para a direita
    this.isMoving = false;
    this.element.classList.remove("moving");
    this.direction = "right";
    this.switchSprite("idle");

    // Aguarda um momento parado antes de atirar
    setTimeout(() => {
      this.performShoot("right", callback);
    }, 500);
  }

  performShoot(direction, callback) {
    if (this.isShooting || this.destructionCooldown) {
      if (callback) callback();
      return;
    }

    this.isShooting = true;
    this.stats.totalShots++;
    this.direction = direction;
    this.switchSprite(direction === "left" ? "shootingLeft" : "shooting");
    this.element.classList.add("shooting");

    this.checkNameDestruction();

    if (window.audioSystem) {
      window.audioSystem.play("click");
    }

    setTimeout(() => {
      if (this.isActive) {
        this.switchSprite(
          this.direction === "left" ? "preShootingLeft" : "idle"
        );
        this.isShooting = false;
        this.element.classList.remove("shooting");
        if (callback) callback();
      }
    }, this.shootDuration);
  }

  scheduleNextAICycle() {
    if (!this.isActive) return;

    // Agenda próximo ciclo de IA
    const delay = Math.random() * 8000 + 5000; // 5-13 segundos
    this.aiCycleTimer = setTimeout(() => this.startAICycle(), delay);
  }

  updateMovement(callback) {
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
      if (callback) callback();
      return;
    }

    const moveX = (dx / distance) * this.movementSpeed;
    const moveY = (dy / distance) * this.movementSpeed;

    this.position.x += moveX;
    this.position.y += moveY;
    this.updateElementPosition();

    this.animationFrame = requestAnimationFrame(() =>
      this.updateMovement(callback)
    );
  }

  createScoreElement() {
    this.scoreElement = document.createElement("div");
    this.scoreElement.className = "megaman-score";
    this.scoreElement.innerHTML = `
      <div class="score-container">
        <span class="score-label">SCORE:</span>
        <span class="score-value">00000</span>
      </div>
    `;
    document.body.appendChild(this.scoreElement);
    this.updateScore(0);

    this.checkMobileDevice();
    window.addEventListener("resize", () => this.checkMobileDevice());
  }

  checkMobileDevice() {
    const isMobile = window.innerWidth <= 768;
    const audioDebug = document.getElementById("audio-debug");
    if (audioDebug) audioDebug.style.display = isMobile ? "none" : "flex";
  }

  updateScore(points) {
    this.stats.score += points;
    if (this.scoreElement) {
      const scoreValueElement = this.scoreElement.querySelector(".score-value");
      if (scoreValueElement) {
        const formattedScore = this.stats.score.toString().padStart(4, "0");
        scoreValueElement.textContent = formattedScore;
        scoreValueElement.classList.remove("score-flash");
        void scoreValueElement.offsetWidth;
        scoreValueElement.classList.add("score-flash");
      }
    }
  }

  injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* ========== SISTEMA DE PONTUAÇÃO RETRO 8-BITS ========== */
      .megaman-score {
        position: absolute;
        top: 10px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid #0080ff;
        border-radius: 2px;
        padding: 8px 12px;
        color: #ffffff;
        font-family: 'Press Start 2P', monospace;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 0 10px rgba(0, 128, 255, 0.7), inset 0 0 5px rgba(0, 128, 255, 0.5);
        width: 123px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .score-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      
      .score-label {
        font-size: 08px;
        color: #ffcc00;
        text-shadow: 2px 2px 0 #000;
      }
      
      .score-value {
        font-size: 12px;
        color: #00ff00;
        text-shadow: 2px 2px 0 #000;
      }
      
      .score-flash {
        animation: score-flash-animation 0.3s ease-in-out;
      }
      
      @keyframes score-flash-animation {
        0% { transform: scale(1); color: #00ff00; }
        50% { transform: scale(1.2); color: #ffffff; }
        100% { transform: scale(1); color: #00ff00; }
      }
      
      /* Responsividade para dispositivos móveis */
      @media (max-width: 768px) {
        .megaman-score {
          top: 10px;
          left: 170px;
          right: auto;
          padding: 0 5px;
          border-width: 2px;
          width: 120px;
          height: 42px;
        }
        
        .score-container {
          gap: 4px;
        }
        
        .score-label {
          font-size: 8px;
        }
        
        .score-value {
          font-size: 10px;
        }
        
        #audio-debug {
          display: none !important;
        }
      }
      
      /* Para telas muito pequenas */
      @media (max-width: 480px) {
        .megaman-score {
          top: 10px;
          left: 130px;
          padding: 0 3px;
          width: 100px;
          height: 42px;
        }
      }
      
      /* Específico para Samsung Galaxy A51/A71 (412 x 914) */
      @media (min-width: 410px) and (max-width: 415px) and (min-height: 900px) and (max-height: 920px) {
        .megaman-score {
          top: 60px;
          left: 10px;
          right: auto;
          padding: 0 3px;
          width: 100px;
          height: 42px;
        }
      }
      
      /* Configuração adicional para telas menores (300px até 405px) */
      @media (min-width: 300px) and (max-width: 405px) {
        .megaman-score {
          top: 60px;
          left: 10px;
          right: auto;
          padding: 0 3px;
          width: 90px;
          height: 35px;
          border-width: 2px;
        }
        
        .score-container {
          gap: 3px;
        }
        
        .score-label {
          font-size: 7px;
        }
        
        .score-value {
          font-size: 9px;
        }
      }

      /* Variáveis para cores usadas na regeneração */
      :root {
        --color-secondary: rgba(0, 255, 255, 1);
        --color-primary: rgba(106, 13, 173, 0.9);
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
      
      /* Efeito de pulsação para o título regenerado */
      @keyframes titleGlow {
        from {
          text-shadow: 2px 2px 3px var(--color-primary), 0 0 5px var(--color-secondary);
        }
        to {
          text-shadow: 2px 2px 8px var(--color-primary), 0 0 15px var(--color-secondary), 0 0 25px var(--color-secondary);
        }
      }

      /* Efeito de piscar para o texto "REGENERADO" */
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
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
        transition: color 0.5s ease, text-shadow 0.5s ease;
        color: var(--color-secondary);
        text-shadow: 2px 2px 3px var(--color-primary);
      }
    `;
    document.head.appendChild(style);
  }

  handleDestruction() {
    if (!this.nameElement || this.isRegenerating) return;

    const container = this.nameElement.parentNode;
    const nextSibling = this.nameElement.nextSibling;

    this.element?.classList.add("attack");
    this.nameElement.style.animation = "shake 0.3s ease-in-out";

    this.animateLetterBreaking();

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
    this.updateScore(10);

    setTimeout(() => {
      if (this.nameElement?.parentNode) this.nameElement.remove();

      this.element?.classList.remove("attack");
      this.isRegenerating = true;

      setTimeout(
        () => this.regenerateName(container, nextSibling),
        this.regenerationCooldown
      );
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

      this.nameElement.style.color = `rgba(255, ${Math.floor(
        255 * (1 - destructionProgress)
      )}, ${Math.floor(255 * (1 - destructionProgress))}, 1)`;
      this.nameElement.style.textShadow = `2px 2px 0 #000, 0 0 ${
        10 * destructionProgress
      }px #ff0000`;

      if (currentStep >= totalSteps) clearInterval(breakingInterval);
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
      .map((char) =>
        char === " "
          ? " "
          : Math.random() < 0.7
            ? chars[Math.floor(Math.random() * chars.length)]
            : char
      )
      .join("");
  }

  regenerateName(container, nextSibling) {
    if (!container || !this.isRegenerating) return;

    const newNameElement = document.createElement("h1");
    for (const [name, value] of Object.entries(this.originalNameAttributes)) {
      newNameElement.setAttribute(name, value);
    }
    if (nextSibling) container.insertBefore(newNameElement, nextSibling);
    else container.appendChild(newNameElement);

    this.nameElement = newNameElement;

    const plainText = this.nameOriginalContent.replace(/<[^>]*>/g, "");

    const brokenChars = ["█", "▓", "▒", "░", "▄", "▀", "■", "□", "▪", "▫"];
    let currentStep = 0;
    const totalSteps = 10;
    let letters = [];

    for (let i = 0; i < plainText.length; i++) {
      if (plainText[i] === " ") letters.push(" ");
      else
        letters.push(
          brokenChars[Math.floor(Math.random() * brokenChars.length)]
        );
    }
    newNameElement.textContent = letters.join("");
    newNameElement.style.color = "rgba(255, 0, 0, 1)";
    newNameElement.style.textShadow = "2px 2px 0 #000, 0 0 10px #ff0000";

    const regenerationInterval = this.regenerationDuration / totalSteps;

    const interval = setInterval(() => {
      if (currentStep > totalSteps) {
        clearInterval(interval);
        this.isRegenerating = false;
        this.destructionCooldown = false;

        newNameElement.textContent = plainText;
        newNameElement.style.color = "";
        newNameElement.style.textShadow = "";
        newNameElement.style.animation =
          "titleGlow 2s ease-in-out infinite alternate";

        setTimeout(() => {
          if (!this.nameElement) return;
          const iconSpan = document.createElement("span");
          iconSpan.innerHTML = `
            <i class="fas fa-microchip" 
               style="margin-left: 15px; vertical-align: middle; position: relative; top: -3px; color: var(--color-primary); animation: flicker 1.5s linear infinite;">
            </i>
          `;
          this.nameElement.appendChild(iconSpan);

          setTimeout(() => {
            if (iconSpan.parentNode) {
              iconSpan.parentNode.removeChild(iconSpan);
              if (this.nameElement) this.nameElement.textContent = plainText;
            }
          }, 4500);
        }, 100);

        this.setupClickListener();
        return;
      }

      const progressRatio = currentStep / totalSteps;
      const charsToReveal = Math.floor(progressRatio * plainText.length);

      let currentTextArr = letters.slice();
      for (let i = 0; i < charsToReveal; i++) {
        if (plainText[i] !== " ") currentTextArr[i] = plainText[i];
      }

      for (let i = charsToReveal; i < plainText.length; i++) {
        if (plainText[i] !== " ") {
          currentTextArr[i] =
            brokenChars[Math.floor(Math.random() * brokenChars.length)];
        }
      }

      newNameElement.textContent = currentTextArr.join("");

      const r = Math.floor(255 * (1 - progressRatio));
      const g = Math.floor(150 * progressRatio);
      const b = Math.floor(255 * progressRatio);
      newNameElement.style.color = `rgba(${r},${g},${b},1)`;

      const shadowRedIntensity = 10 * (1 - progressRatio);
      const shadowPurpleIntensity = 5 * progressRatio;
      newNameElement.style.textShadow = `2px 2px 0 rgba(0,0,0,0.7), 0 0 ${shadowRedIntensity}px rgba(255,0,0,${
        1 - progressRatio
      }), 0 0 ${shadowPurpleIntensity}px var(--color-primary)`;

      currentStep++;
    }, regenerationInterval);

    this.stats.successfulRegenerations++;
    this.updateScore(5);
  }

  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.isPaused = false;
    this.stats.startTime = Date.now();

    this.element.style.opacity = "1";
    this.element.classList.add("active", "entering");

    setTimeout(() => {
      this.element?.classList.remove("entering");
    }, 1000);

    // Inicia nova lógica de IA
    this.startAICycle();

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

  // Métodos de compatibilidade com o sistema antigo
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

    this.element.classList.add("moving");
    this.updateMovementSprite();
    this.updateMovement();
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
    if (
      !this.nameElement ||
      !this.isActive ||
      this.destructionCooldown ||
      this.isRegenerating
    )
      return;

    const nameRect = this.nameElement.getBoundingClientRect();
    const megamanRect = {
      left: parseFloat(this.element.style.left),
      top: parseFloat(this.element.style.top),
      right: parseFloat(this.element.style.left) + this.element.clientWidth,
      bottom: parseFloat(this.element.style.top) + this.element.clientHeight,
    };

    const distance = Math.sqrt(
      Math.pow(nameRect.left - megamanRect.left, 2) +
        Math.pow(nameRect.top - megamanRect.top, 2)
    );

    let destructionChance = 0;
    if (distance < 250) destructionChance = 0.9;
    else if (distance < 350) destructionChance = 0.7;
    else if (distance < 450) destructionChance = 0.5;

    if (destructionChance > 0 && Math.random() < destructionChance) {
      this.handleDestruction();
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
  }

  detectCurrentPage() {
    const activePage = document.querySelector(".page.active");
    if (activePage) {
      const pageId = activePage.id;
      if (pageId) this.currentPage = pageId;
      else {
        if (activePage.querySelector(".hero-title")) this.currentPage = "home";
        else this.currentPage = "unknown";
      }
    } else this.currentPage = "home";
  }

  setupPageChangeMonitoring() {
    const observer = new MutationObserver((mutations) => {
      let pageChanged = false;
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          if (mutation.target.classList.contains("page")) pageChanged = true;
        }
      });
      if (pageChanged) {
        setTimeout(() => {
          const oldPage = this.currentPage;
          this.detectCurrentPage();
          if (oldPage !== this.currentPage) this.findNameElement();
        }, 100);
      }
    });
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) =>
      observer.observe(page, {
        attributes: true,
        attributeFilter: ["class"],
      })
    );
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  findNameElement() {
    this.detectCurrentPage();
    let titleElement = null;

    if (this.currentPage === "home") {
      titleElement = document.querySelector(".hero-title");
      if (titleElement) {
        this.nameElement = titleElement;
        this.nameOriginalContent = "CARLOS FILHO";
        if (titleElement.textContent.includes("SOBRE MIM")) {
          titleElement.textContent = this.nameOriginalContent;
        }
      }
    } else {
      const pageSelectors = [
        ".page.active .header-container h1",
        ".page.active .page-content h1",
        ".page.active h1",
      ];

      for (const selector of pageSelectors) {
        titleElement = document.querySelector(selector);
        if (titleElement) {
          this.nameElement = titleElement;
          this.nameOriginalContent = titleElement.innerHTML;
          break;
        }
      }
    }

    if (this.nameElement) {
      this.originalNameAttributes = {};
      for (const attr of this.nameElement.attributes) {
        this.originalNameAttributes[attr.name] = attr.value;
      }
      this.originalNameContainer = this.nameElement.parentNode;
      this.originalNameNextSibling = this.nameElement.nextSibling;
      this.setupClickListener();
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

      // Redimensiona apenas para os sprites de tiro
      const isShootingSprite =
        spriteName === "shooting" || spriteName === "shootingLeft";
      this.element.style.width = isShootingSprite ? "207px" : "64px";
      this.element.style.height = isShootingSprite ? "207px" : "64px";

      let x = this.position.x;
      let y = this.position.y;

      // Ajusta a posição apenas para os sprites de tiro
      if (isShootingSprite) {
        y -= 71.5; // Desloca para cima para alinhar a base

        if (spriteName === "shootingLeft") {
          x -= 143;
        }
      }

      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
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
    clearTimeout(this.aiCycleTimer);
    this.shootTimer = null;
    this.moveTimer = null;
    this.nameRegenerationTimer = null;
    this.aiCycleTimer = null;
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
    this.startAICycle();
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
      aiState: this.aiState,
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
      score: 0,
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.megamanController = new MegamanController();

  window.megaman = {
    start: () => window.megamanController?.start(),
    stop: () => window.megamanController?.stop(),
    status: () => window.megamanController?.getStatus(),
    resetStats: () => window.megamanController?.resetStats(),
  };

  console.log(
    '🎮 Mega Man Controller melhorado carregado! Use "megaman.start()" para iniciar.'
  );
});
