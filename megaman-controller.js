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

    this.controlMode = "ia"; // 'ia', 'manual', 'hibrido'
    this.aiTargetingState = "name"; // 'name', 'icon1', 'subtitle', 'icon2'

    this.targets = [];
    this.iconTargets = [];
    this.currentTarget = null;
    this.isMovingToTarget = false;
    this.destructionCooldown = false;
    this.isRegenerating = false;

    this.shootInterval = { min: 12000, max: 30000 };
    this.moveInterval = { min: 1500, max: 4000 };
    this.shootDuration = 1000;
    this.regenerationCooldown = 3000;
    this.animationDuration = 800;
    this.regenerationDuration = 2500;

    this.sprites = {
      idle: "assets/sprites/parado10.gif",
      idleLeft: "assets/sprites/megaman-pushing-esquerda.gif",
      preShootingLeft: "assets/sprites/parado-reverso.gif",
      stopped: "assets/sprites/parado10.gif",
      shooting: "assets/sprites/atirando.gif",
      shootingLeft: "assets/sprites/atirando-esquerda.gif",
      running: "assets/sprites/megaman-pushing.gif",
      runningLeft: "assets/sprites/megaman-pushing-esquerda.gif",
      destroying: "assets/sprites/destroiicon.gif",
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
    this.findTargetElements();
    this.injectStyles();
    this.setupPageChangeMonitoring();
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.isPaused = false;
    this.stats.startTime = Date.now();
    this.element.style.opacity = "1";
    this.element.classList.add("active", "entering");
    setTimeout(() => this.element?.classList.remove("entering"), 1000);
    this.scheduleNextMove(true);
    this.scheduleNextShoot(true);
    if (window.audioSystem) window.audioSystem.play("achievement");
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
    if (window.audioSystem) window.audioSystem.play("click");
  }

  scheduleNextMove(isInitialStart = false) {
    if (!this.isActive || this.controlMode === "manual") return;
    const delay = isInitialStart
      ? 1000
      : this.getRandomInterval(this.moveInterval);
    this.moveTimer = setTimeout(
      () => this.determineAndMoveToNextTarget(),
      delay
    );
  }

  scheduleNextShoot(isInitialStart = false) {
    if (!this.isActive || this.controlMode === "manual") return;
    let delay = isInitialStart
      ? 2500
      : this.getRandomInterval(this.shootInterval);
    if (this.currentTarget && this.isMovingToTarget) delay *= 0.5;
    this.shootTimer = setTimeout(() => this.shoot(false), delay);
  }

  determineAndMoveToNextTarget() {
    if (!this.isActive || this.isPaused || this.isMoving || this.isShooting) {
      this.scheduleNextMove();
      return;
    }
    this.findTargetElements();
    let target;
    switch (this.aiTargetingState) {
      case "name":
        target = this.targets.find((t) => t.element.id === "destroyable-name");
        if (target && target.element.isConnected) {
          this.currentTarget = target;
          this.moveToTarget();
        } else {
          this.aiTargetingState = "icon1";
          this.determineAndMoveToNextTarget();
        }
        break;
      case "icon1":
      case "icon2":
        const availableIcons = Array.from(this.iconTargets).filter(
          (icon) => icon.style.opacity !== "0" && icon.isConnected
        );
        if (availableIcons.length > 0) {
          const icon =
            availableIcons[Math.floor(Math.random() * availableIcons.length)];
          this.moveToIcon(icon);
        } else {
          this.aiTargetingState =
            this.aiTargetingState === "icon1" ? "subtitle" : "name";
          this.determineAndMoveToNextTarget();
        }
        break;
      case "subtitle":
        target = this.targets.find(
          (t) => t.element.id === "destroyable-subtitle"
        );
        if (target && target.element.isConnected) {
          this.currentTarget = target;
          this.moveToTarget();
        } else {
          this.aiTargetingState = "icon2";
          this.determineAndMoveToNextTarget();
        }
        break;
      default:
        this.aiTargetingState = "name";
        this.determineAndMoveToNextTarget();
        break;
    }
  }

  moveToRandomPosition() {
    if (this.isMoving || this.isShooting) return;
    this.targetPosition = this.getRandomPosition();
    this.isMovingToTarget = false;
    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";
    this.isMoving = true;
    this.stats.totalMoves++;
    this.element.classList.add("moving");
    this.updateMovementSprite();
    this.updateMovement(() => {
      this.scheduleNextMove();
    });
  }

  moveToTarget() {
    if (!this.currentTarget || !this.currentTarget.element) return;
    const rect = this.currentTarget.element.getBoundingClientRect();
    this.targetPosition = {
      x: Math.max(50, rect.left + rect.width / 2 - 32),
      y: Math.max(50, rect.top + rect.height / 2 - 32),
    };
    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";
    this.isMoving = true;
    this.isMovingToTarget = true;
    this.stats.totalMoves++;
    this.element.classList.add("moving");
    this.updateMovementSprite();
    this.updateMovement();
  }

  moveToIcon(icon) {
    if (!icon) return;
    const rect = icon.getBoundingClientRect();
    this.targetPosition = {
      x: rect.left + rect.width / 2 - 32,
      y: rect.top + rect.height / 2 - 32,
    };
    this.direction = this.targetPosition.x < this.position.x ? "left" : "right";
    this.isMoving = true;
    this.isMovingToTarget = false;
    this.stats.totalMoves++;
    this.element.classList.add("moving");
    this.updateMovementSprite();
    this.updateMovement(() => this.destroyIcon(icon));
  }

  shoot(isManual = false) {
    if (
      !this.isActive ||
      this.isPaused ||
      this.isShooting ||
      this.destructionCooldown
    ) {
      if (!isManual) this.scheduleNextShoot();
      return;
    }
    if (!isManual && this.controlMode === "manual") {
      this.scheduleNextShoot();
      return;
    }
    if (this.isMoving) this.stopMovement();
    if (!this.currentTarget) {
      this.determineAndMoveToNextTarget();
      return;
    }
    if (this.currentTarget && this.currentTarget.element) {
      const nameRect = this.currentTarget.element.getBoundingClientRect();
      this.direction =
        this.position.x > nameRect.left + nameRect.width / 2 ? "left" : "right";
    }
    this.isShooting = true;
    this.stats.totalShots++;
    this.switchSprite(this.direction === "left" ? "shootingLeft" : "shooting");
    this.element.classList.add("shooting");
    if (window.audioSystem) window.audioSystem.play("ataque");
    this.checkNameDestruction();
    setTimeout(() => {
      if (this.isActive) {
        this.switchSprite(
          this.direction === "left" ? "preShootingLeft" : "stopped"
        );
        this.isShooting = false;
        this.element.classList.remove("shooting");
        if (!isManual) this.scheduleNextShoot();
      }
    }, this.shootDuration);
  }

  checkNameDestruction() {
    if (
      !this.currentTarget ||
      !this.currentTarget.element ||
      !this.isActive ||
      this.destructionCooldown ||
      this.isRegenerating
    )
      return;
    const nameRect = this.currentTarget.element.getBoundingClientRect();
    const megamanX = this.position.x;
    const megamanY = this.position.y;
    const isShootingTowardsName =
      (this.direction === "left" && megamanX > nameRect.left) ||
      (this.direction === "right" && megamanX < nameRect.right);
    if (!isShootingTowardsName) return;
    const distance = Math.sqrt(
      Math.pow(nameRect.left + nameRect.width / 2 - megamanX, 2) +
        Math.pow(nameRect.top + nameRect.height / 2 - megamanY, 2)
    );
    let destructionChance = 0;
    if (distance < 300) destructionChance = 0.9;
    else if (distance < 400) destructionChance = 0.7;
    else if (distance < 500) destructionChance = 0.5;
    if (destructionChance > 0 && Math.random() < destructionChance) {
      this.handleDestruction(this.currentTarget);
    }
  }

  handleDestruction(target) {
    if (!target || !target.element || this.isRegenerating) return;

    // Oculta o elemento original e o marca para regeneração
    target.element.style.display = "none";

    if (target.element.id === "destroyable-name") {
      this.aiTargetingState = "icon1";
    } else if (target.element.id === "destroyable-subtitle") {
      this.aiTargetingState = "icon2";
    }

    this.element?.classList.add("attack");

    // Cria um contêiner temporário para a animação
    const regenContainer = document.createElement("div");
    regenContainer.className = "processor-container";
    target.originalContainer.insertBefore(regenContainer, target.element);

    this.animateLetterBreaking(regenContainer, target.originalContent);

    setTimeout(() => {
      regenContainer.innerHTML = this.createAshEffect(target.originalContent);
      regenContainer.style.color = "#333";
      regenContainer.style.textShadow = "0 0 5px rgba(100, 100, 100, 0.5)";
    }, 800);

    this.destructionCooldown = true;
    this.stats.nameDestructions++;
    this.updateScore(10);

    setTimeout(() => {
      regenContainer.remove(); // Remove o contêiner de cinzas
      this.element?.classList.remove("attack");
      this.isRegenerating = true;
      this.regenerateName(target); // Inicia a regeneração no elemento original

      setTimeout(() => {
        if (this.isActive && !this.isMoving) this.moveToRandomPosition();
      }, this.animationDuration + 100);
    }, this.animationDuration + 1500); // Aumenta o tempo para a animação de cinzas
  }

  destroyIcon(icon) {
    if (!icon || icon.style.opacity === "0") return;
    this.isShooting = true;
    if (this.aiTargetingState === "icon1") {
      this.aiTargetingState = "subtitle";
    } else if (this.aiTargetingState === "icon2") {
      this.aiTargetingState = "name";
    }
    this.switchSprite("destroying");
    icon.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      if (window.audioSystem) window.audioSystem.play("ataque");
      icon.style.transition = "opacity 0.3s";
      icon.style.opacity = "0";
      icon.style.animation = "";
    }, 500);
    setTimeout(() => {
      this.isShooting = false;
      this.switchSprite("idle");
      this.scheduleNextMove();
    }, 1000);
    setTimeout(() => {
      icon.style.opacity = "0";
      icon.style.transition = "opacity 0.2s linear";
      let flashes = 0;
      const flickerInterval = setInterval(() => {
        icon.style.opacity = icon.style.opacity === "0" ? "1" : "0";
        flashes++;
        if (flashes >= 6) {
          clearInterval(flickerInterval);
          icon.style.opacity = "1";
        }
      }, 200);
    }, 10000);
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
    this.scoreElement.innerHTML = `<div class="score-container"><span class="score-label">SCORE:</span><span class="score-value">00000</span></div>`;
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
      .megaman-score { position: absolute; top: 10px; right: 20px; background-color: rgba(0, 0, 0, 0.7); border: 1px solid #0080ff; border-radius: 2px; padding: 8px 12px; color: #ffffff; font-family: 'Press Start 2P', monospace; text-align: center; z-index: 1000; box-shadow: 0 0 10px rgba(0, 128, 255, 0.7), inset 0 0 5px rgba(0, 128, 255, 0.5); width: 123px; height: 35px; display: flex; align-items: center; justify-content: center; }
      .score-container { display: flex; align-items: center; justify-content: center; gap: 8px; }
      .score-label { font-size: 08px; color: #ffcc00; text-shadow: 2px 2px 0 #000; }
      .score-value { font-size: 12px; color: #00ff00; text-shadow: 2px 2px 0 #000; }
      .score-flash { animation: score-flash-animation 0.3s ease-in-out; }
      @keyframes score-flash-animation { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
      .megaman-character { position: fixed; width: 64px; height: 64px; background-size: contain; background-repeat: no-repeat; background-position: center; z-index: 800; pointer-events: none; transition: none; }
      .megaman-character.entering { animation: megaman-enter 1s ease-out; }
      .megaman-character.leaving { animation: megaman-leave 1s ease-in; }
      @keyframes megaman-enter { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes megaman-leave { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.5); opacity: 0; } }
      @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
    `;
    document.head.appendChild(style);
  }

  regenerateName(target) {
    if (!target || !target.originalContainer || !this.isRegenerating) return;

    const regenContainer = document.createElement("div");
    regenContainer.className = "processor-container";
    target.originalContainer.insertBefore(regenContainer, target.element);

    const processorImage = document.createElement("div");
    processorImage.className = "processor-image";
    regenContainer.appendChild(processorImage);

    const textElement = document.createElement("span");
    regenContainer.appendChild(textElement);

    const plainText = target.originalContent.replace(/<[^>]*>/g, "");
    const brokenChars = ["█", "▓", "▒", "░", "▄", "▀", "■", "□", "▪", "▫"];
    let currentStep = 0;
    const totalSteps = 10;

    let letters = [];
    for (let i = 0; i < plainText.length; i++) {
      letters.push(
        plainText[i] === " "
          ? " "
          : brokenChars[Math.floor(Math.random() * brokenChars.length)]
      );
    }
    textElement.textContent = letters.join("");
    textElement.style.color = "rgba(0, 0, 255, 1)";
    textElement.style.textShadow = "2px 2px 0 #000, 0 0 10px #0000ff";

    const regenerationInterval = this.regenerationDuration / totalSteps;
    const interval = setInterval(() => {
      if (currentStep > totalSteps) {
        clearInterval(interval);
        this.isRegenerating = false;
        this.destructionCooldown = false;
        regenContainer.remove();
        target.element.style.display = "";
        this.setupClickListener(target);
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

      textElement.textContent = currentTextArr.join("");

      const r = Math.floor(255 * (1 - progressRatio));
      const g = Math.floor(150 * progressRatio);
      const b = 255;
      textElement.style.color = `rgba(${r},${g},${b},1)`;

      const shadowRedIntensity = 10 * (1 - progressRatio);
      const shadowBlueIntensity = 15 * progressRatio;
      textElement.style.textShadow = `2px 2px 0 rgba(0,0,0,0.7), 0 0 ${shadowRedIntensity}px rgba(255,0,0,${1 - progressRatio}), 0 0 ${shadowBlueIntensity}px rgba(0,0,255,1)`;

      currentStep++;
    }, regenerationInterval);

    this.stats.successfulRegenerations++;
    this.updateScore(5);
  }

  animateLetterBreaking(container, originalText) {
    const plainText = originalText.replace(/<[^>]*>/g, "");
    const letters = plainText.split("");
    let currentStep = 0;
    const totalSteps = 8;
    const breakingInterval = setInterval(() => {
      if (!container) {
        clearInterval(breakingInterval);
        return;
      }
      currentStep++;
      const destructionProgress = currentStep / totalSteps;
      const brokenText = this.createProgressivelyBrokenText(
        letters,
        destructionProgress
      );
      container.innerHTML = brokenText;
      container.style.color = `rgba(255, ${Math.floor(255 * (1 - destructionProgress))}, ${Math.floor(255 * (1 - destructionProgress))}, 1)`;
      container.style.textShadow = `2px 2px 0 #000, 0 0 ${10 * destructionProgress}px #ff0000`;
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
        else if (letterProgress < 0.4)
          return Math.random() < 0.3
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : char;
        else if (letterProgress < 0.6)
          return Math.random() < 0.5
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : char;
        else if (letterProgress < 0.8)
          return Math.random() < 0.7
            ? destructionChars[
                Math.floor(Math.random() * destructionChars.length)
              ]
            : char;
        else
          return Math.random() < 0.9
            ? destructionChars[
                Math.floor(Math.random() * destructionChars.length)
              ]
            : char;
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

  createMegamanElement() {
    if (this.element) this.element.remove();
    this.element = document.createElement("div");
    this.element.id = "megaman-character";
    this.element.className = "megaman-character";
    this.element.style.cssText = `position: fixed; width: 64px; height: 64px; background-image: url('${this.sprites.idle}'); background-size: contain; background-repeat: no-repeat; background-position: center; z-index: 800; pointer-events: none; transition: none; left: ${this.position.x}px; top: ${this.position.y}px; opacity: 0;`;
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

  setupPageChangeMonitoring() {
    // Dummy para evitar erros
  }

  findTargetElements() {
    this.targets = [];
    const targetConfigs = [
      { selector: "#destroyable-name", originalContent: "CARLOS FILHO" },
      {
        selector: "#destroyable-subtitle",
        originalContent: "ENGENHEIRO DA COMPUTAÇÃO",
      },
    ];
    targetConfigs.forEach((config) => {
      const element = document.querySelector(config.selector);
      if (element) {
        const targetData = {
          element: element,
          originalContent: config.originalContent,
          originalAttributes: {},
          originalContainer: element.parentNode,
          originalNextSibling: element.nextSibling,
          originalClasses: element.className,
        };
        for (const attr of element.attributes) {
          targetData.originalAttributes[attr.name] = attr.value;
        }
        this.targets.push(targetData);
        if (!element.hasAttribute("data-has-listener")) {
          this.setupClickListener(targetData);
          element.setAttribute("data-has-listener", "true");
        }
      }
    });
    this.findIconsToDestroy();
  }

  findIconsToDestroy() {
    this.iconTargets = document.querySelectorAll(".icon-to-destroy");
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
      const isShootingSprite =
        spriteName === "shooting" || spriteName === "shootingLeft";
      const isDestroyingSprite = spriteName === "destroying";
      if (isDestroyingSprite) {
        this.element.style.width = "203px";
        this.element.style.height = "203px";
      } else if (isShootingSprite) {
        this.element.style.width = "207px";
        this.element.style.height = "207px";
      } else {
        this.element.style.width = "64px";
        this.element.style.height = "64px";
      }
      let x = this.position.x;
      let y = this.position.y;
      if (isShootingSprite) {
        y -= 71.5;
        if (spriteName === "shootingLeft") x -= 143;
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

  clearTimers() {
    clearTimeout(this.shootTimer);
    clearTimeout(this.moveTimer);
    if (this.nameRegenerationTimer) clearTimeout(this.nameRegenerationTimer);
    if (this.aiCycleTimer) clearTimeout(this.aiCycleTimer);
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
    if (this.element) this.element.style.animationPlayState = "paused";
  }

  resume() {
    if (!this.isActive || !this.isPaused) return;
    this.isPaused = false;
    if (this.element) this.element.style.animationPlayState = "running";
    this.scheduleNextMove();
    this.scheduleNextShoot();
  }

  setControlMode(mode) {
    if (["ia", "manual", "hibrido"].includes(mode)) {
      this.controlMode = mode;
      const event = new CustomEvent("controlmodechange", {
        detail: { mode: this.controlMode },
      });
      document.dispatchEvent(event);
      if (mode !== "manual") {
        this.clearTimers();
        this.scheduleNextMove(true);
        this.scheduleNextShoot(true);
      } else {
        this.clearTimers();
        this.stopMovement();
      }
    }
  }

  handleManualAction(action) {
    if (
      !this.isActive ||
      (this.controlMode !== "manual" && this.controlMode !== "hibrido")
    )
      return;
    switch (action) {
      case "shoot":
        this.shoot(true);
        break;
      case "move_right": {
        const newPos = {
          x: Math.min(this.boundaries.maxX, this.position.x + 200),
          y: this.position.y,
        };
        this.moveToPosition(newPos);
        break;
      }
      case "move_left": {
        const newPos = {
          x: Math.max(this.boundaries.minX, this.position.x - 200),
          y: this.position.y,
        };
        this.moveToPosition(newPos);
        break;
      }
    }
  }

  setupClickListener(target) {
    if (target && target.element) {
      const clickHandler = () => this.handleDestruction(target);
      target.clickHandler = clickHandler;
      target.element.addEventListener("click", clickHandler, { once: true });
    }
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
});
