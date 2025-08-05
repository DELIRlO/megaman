/**
 * MEGA MAN CONTROLLER - SISTEMA COMPLETO
 * Com efeitos de destruição e regeneração dourada com partículas
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
    document.body.appendChild(this.scoreElement);
    this.updateScore(0);

    // Verifica se é um dispositivo móvel para ajustar o posicionamento
    this.checkMobileDevice();

    // Adiciona listener para redimensionamento da janela
    window.addEventListener("resize", () => this.checkMobileDevice());
  }

  checkMobileDevice() {
    // Verifica se é um dispositivo móvel baseado na largura da tela
    const isMobile = window.innerWidth <= 768;

    // Oculta a barra de debug de áudio em dispositivos móveis
    const audioDebug = document.getElementById("audio-debug");
    if (audioDebug) {
      audioDebug.style.display = isMobile ? "none" : "flex";
    }
  }

  updateScore(points) {
    // Atualiza a pontuação
    this.stats.score += points;

    // Atualiza o elemento visual
    if (this.scoreElement) {
      const scoreValueElement = this.scoreElement.querySelector(".score-value");
      if (scoreValueElement) {
        // Formata o score com zeros à esquerda para manter 4 dígitos
        const formattedScore = this.stats.score.toString().padStart(4, "0");
        scoreValueElement.textContent = formattedScore;

        // Adiciona efeito de flash quando a pontuação muda
        scoreValueElement.classList.remove("score-flash");
        void scoreValueElement.offsetWidth; // Força reflow para reiniciar a animação
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
        border-radius: 4px;
        padding: 8px 12px;
        color: #ffffff;
        font-family: 'Press Start 2P', monospace;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 0 10px rgba(0, 128, 255, 0.7), inset 0 0 5px rgba(0, 128, 255, 0.5);
<<<<<<< HEAD
        width: 140px;
=======
        width: 200px;
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
        height: 40px;
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
<<<<<<< HEAD
        font-size: 08px;
=======
        font-size: 14px;
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
        color: #ffcc00;
        text-shadow: 2px 2px 0 #000;
      }
      
      .score-value {
<<<<<<< HEAD
        font-size: 12px;
=======
        font-size: 20px;
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
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
          height: 40px;
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
          height: 40px;
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
          height: 40px;
        }
      }
      
<<<<<<< HEAD

        
=======
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
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
<<<<<<< HEAD


=======
      
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
      /* ========== EFEITOS DE REGENERAÇÃO DOURADA ========== */
      .regenerating-letter {
        display: inline-block;
        animation: letterRegen 0.6s cubic-bezier(0.2, 0.8, 0.4, 1) both;
        color: #ffd700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
        position: relative;
        z-index: 100;
      }
      
      @keyframes letterRegen {
        0% {
          transform: scale(0.3) translateY(20px);
          opacity: 0;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
          color: rgba(255, 215, 0, 0);
        }
        50% {
          color: rgba(255, 215, 0, 0.5);
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
        }
        70% {
          transform: scale(1.2);
          text-shadow: 0 0 40px rgba(255, 215, 0, 1);
        }
        100% {
          transform: scale(1);
          opacity: 1;
          color: #ffd700;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
        }
      }
      
      /* ========== SISTEMA DE PARTÍCULAS DOURADAS ========== */
      .particles-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
        z-index: 90;
      }
      
      .golden-particle {
        position: absolute;
        background: linear-gradient(135deg, #ffd700 0%, #ffcc00 100%);
        border-radius: 50%;
        box-shadow: 0 0 10px #ffd700;
        pointer-events: none;
        z-index: 95;
        opacity: 0;
        transform-origin: center;
        will-change: transform, opacity;
      }
      
      .golden-trail {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse at center, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0) 70%);
        transform-origin: center;
        z-index: 80;
        opacity: 0;
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
        transition: color 0.5s ease, text-shadow 0.5s ease;
      }
    `;
    document.head.appendChild(style);
  }

  /* ========== SISTEMA DE PARTÍCULAS ========== */
  createParticleSystem(container) {
    const particleContainer = document.createElement("div");
    particleContainer.className = "particles-container";
    container.appendChild(particleContainer);

    // Efeito de fundo dourado
    const goldenTrail = document.createElement("div");
    goldenTrail.className = "golden-trail";
    particleContainer.appendChild(goldenTrail);

    const particleCount = 150;
    const particles = [];
    const nameRect = container.getBoundingClientRect();
    const centerX = nameRect.width / 2;
    const centerY = nameRect.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "golden-particle";

      // Configuração visual
      const size = 3 + Math.random() * 8;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = "0";
      particle.style.filter = `blur(${Math.random() * 2}px)`;

      // Posição inicial abaixo do nome
      const startX = Math.random() * nameRect.width;
      const startY = nameRect.height + Math.random() * 50;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particleContainer.appendChild(particle);

      particles.push({
        element: particle,
        x: startX,
        y: startY,
        startX: startX,
        startY: startY,
        angle: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        size: size,
        delay: i * 15,
        time: 0,
        life: 0,
        maxLife: 1.5 + Math.random() * 2,
        spiralRadius: 5 + Math.random() * 30,
        targetLetter: Math.floor(
<<<<<<< HEAD
          Math.random() * this.nameOriginalContent.replace(/ /g, "").length
=======
          Math.random() * (this.nameOriginalContent ? this.nameOriginalContent.replace(/ /g, "").length : 10)
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
        ),
        pathRandomness: Math.random() * 0.3 + 0.7,
      });
    }

    const particleSystem = {
      container: particleContainer,
      particles: particles,
      goldenTrail: goldenTrail,
      animationId: null,
      startTime: Date.now(),
      letters: Array.from(container.querySelectorAll(".regenerating-letter")),
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

      // Atualiza efeito de fundo dourado
      if (system.goldenTrail) {
        const trailOpacity = Math.min(0.4, elapsed * 0.3);
        system.goldenTrail.style.opacity = trailOpacity;
        system.goldenTrail.style.transform = `scale(${1 + elapsed * 0.1})`;
      }

      system.particles.forEach((particle) => {
        // Aplica delay inicial
        if (elapsed * 1000 < particle.delay) return;

        particle.time = elapsed - particle.delay / 1000;
        particle.life = particle.time / particle.maxLife;

        if (particle.life > 1) {
          particle.element.style.opacity = "0";
          return;
        }

        // Calcula progresso da animação
        const progress = Math.min(1, particle.time * 2);
        const smoothProgress = Math.sin((progress * Math.PI) / 2);

        // Movimento em direção à letra alvo com espiral
        if (system.letters && system.letters[particle.targetLetter]) {
          const targetLetter = system.letters[particle.targetLetter];
          const letterRect = targetLetter.getBoundingClientRect();
          const containerRect = system.container.getBoundingClientRect();

          const targetX =
            letterRect.left - containerRect.left + letterRect.width / 2;
          const targetY =
            letterRect.top - containerRect.top + letterRect.height / 2;

          particle.angle += 0.05 * particle.speed;
          const spiralX =
            Math.cos(particle.angle * 2) *
            particle.spiralRadius *
            (1 - smoothProgress);
          const spiralY =
            Math.sin(particle.angle * 3) *
            particle.spiralRadius *
            (1 - smoothProgress);

          particle.x =
            particle.startX +
            (targetX - particle.startX) *
              smoothProgress *
              particle.pathRandomness +
            spiralX;
          particle.y =
            particle.startY +
            (targetY - particle.startY) *
              smoothProgress *
              particle.pathRandomness +
            spiralY;
        }

        // Atualiza opacidade e escala
        const opacity = Math.min(1, particle.time * 3) * (1 - particle.life);
        const scale = 0.3 + smoothProgress * 1.5;

        // Aplica transformações
        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${scale})`;
        particle.element.style.opacity = opacity;

        // Efeito de brilho final
        if (particle.life > 0.8) {
          particle.element.style.boxShadow = `0 0 ${15 * (1 - particle.life)}px #ffd700`;
        }
      });

      system.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  cleanupParticleSystem(system) {
    if (system.animationId) {
      cancelAnimationFrame(system.animationId);
    }
    if (system.container && system.container.parentNode) {
      system.container.parentNode.removeChild(system.container);
    }
    this.particleSystems = this.particleSystems.filter((ps) => ps !== system);
  }

  /* ========== SISTEMA DE REGENERAÇÃO ========== */
  regenerateName(container, nextSibling) {
    if (!container || !this.isRegenerating) return;

<<<<<<< HEAD
=======
    // Guarda o conteúdo original atual para garantir consistência
    const currentOriginalContent = this.nameOriginalContent;
    
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
    const newNameElement = document.createElement("h1");
    newNameElement.className = "hero-title";

    // Cria versão com letras animadas
<<<<<<< HEAD
    const letters = this.nameOriginalContent
=======
    const letters = currentOriginalContent
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
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

<<<<<<< HEAD
=======
    // Guarda o conteúdo original atual para garantir consistência
    const currentOriginalContent = this.nameOriginalContent;
    
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
    // Adiciona transição suave para a cor original
    element.style.transition = "color 0.5s ease, text-shadow 0.5s ease";

    // Restaura conteúdo original
<<<<<<< HEAD
    element.innerHTML = this.nameOriginalContent;
=======
    element.innerHTML = currentOriginalContent;
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28

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
<<<<<<< HEAD
=======
    
    // Guarda o conteúdo original do título atual se ainda não tiver sido guardado
    if (!this.nameOriginalContent) {
      this.nameOriginalContent = this.nameElement.innerHTML;
    }
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28

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

<<<<<<< HEAD
    const plainText = this.nameOriginalContent.replace(/<[^>]*>/g, "");
=======
    // Guarda o conteúdo original atual para garantir consistência
    const currentOriginalContent = this.nameOriginalContent;
    const plainText = currentOriginalContent.replace(/<[^>]*>/g, "");
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
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
<<<<<<< HEAD
    const chars = "█▓▒░!@#$%^&*()_+-=[]{}|;:,.<>?~`";
    const plainText = originalText.replace(/<[^>]*>/g, "");
=======
    // Garante que estamos usando o conteúdo original correto
    const currentContent = originalText || this.nameOriginalContent;
    const chars = "█▓▒░!@#$%^&*()_+-=[]{}|;:,.<>?~`";
    const plainText = currentContent.replace(/<[^>]*>/g, "");
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28

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

<<<<<<< HEAD
=======
    // Detecta a página atual
    this.detectCurrentPage();
    
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
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
<<<<<<< HEAD
=======
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
  
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
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
<<<<<<< HEAD
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
=======
    
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
      titleElement = document.querySelector(".hero-title");
      if (titleElement && titleElement.textContent.toLowerCase().includes("carlos augusto diniz filho")) {
        this.nameElement = titleElement;
      }
    } 
    // Verifica se estamos na página Sobre
    else if (this.currentPage === "sobre") {
      titleElement = document.querySelector(".header-container h1");
      if (titleElement && titleElement.textContent.toLowerCase().includes("sobre mim")) {
        this.nameElement = titleElement;
      }
    }
    // Verifica se estamos na página Currículo
    else if (this.currentPage === "curriculo") {
      titleElement = document.querySelector(".header-container h1, .page-content h1");
      if (titleElement) {
        this.nameElement = titleElement;
      }
    }
    // Verifica se estamos na página Projetos
    else if (this.currentPage === "projetos") {
      titleElement = document.querySelector(".header-container h1, .page-content h1");
      if (titleElement) {
        this.nameElement = titleElement;
      }
    }
    // Verifica se estamos na página Skills
    else if (this.currentPage === "skills") {
      titleElement = document.querySelector(".header-container h1, .page-content h1");
      if (titleElement) {
        this.nameElement = titleElement;
      }
    }
    // Verifica se estamos na página Blog
    else if (this.currentPage === "blog") {
      titleElement = document.querySelector(".header-container h1, .page-content h1");
      if (titleElement) {
        this.nameElement = titleElement;
      }
    }
    // Verifica se estamos na página Contato
    else if (this.currentPage === "contato") {
      titleElement = document.querySelector(".header-container h1, .page-content h1");
      if (titleElement) {
        this.nameElement = titleElement;
      }
    } else {
      this.nameElement = null;
      return;
    }
    
    // Se encontrou um título, guarda seus atributos originais
    if (this.nameElement) {
      // Guarda o conteúdo original do título atual
      this.nameOriginalContent = this.nameElement.innerHTML;
      
      // Guarda atributos originais
      this.originalNameAttributes = {}; // Limpa atributos anteriores
      for (const attr of this.nameElement.attributes) {
        this.originalNameAttributes[attr.name] = attr.value;
      }
      this.originalNameContainer = this.nameElement.parentNode;
      this.originalNameNextSibling = this.nameElement.nextSibling;
>>>>>>> 3e0a275fa3837b3a15d07c5b073679ae6dc8ae28
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
