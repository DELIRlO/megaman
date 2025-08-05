let speedrunTimer = null;
let speedrunStartTime = null;
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

let carouselInitialized = false;

document.addEventListener("DOMContentLoaded", function () {
  initializeMenu();
  initializeMobileMenus();
  initializeTerminal();
  initializeEasterEggs();
  initializeSpeedrun();
  initializeAudioControls();
  initializeBackToTop();
  populateCarouselHTML();
});

function initializeMobileMenus() {
  initializeMobileMenuShortcut();
  initializeMobileMenuItems();
}

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("custom-cursor");
  if (cursor) {
    cursor.style.display = "block";

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    const clickableElements = [
      "a",
      "button",
      "input",
      ".menu-item",
      ".social-control",
    ];

    document.addEventListener("mouseover", (e) => {
      const isClickable = clickableElements.some(
        (selector) => e.target.matches(selector) || e.target.closest(selector)
      );

      if (isClickable) {
        cursor.style.backgroundImage = "url('assets/sprites/cursor-hover.png')";
      }
    });

    document.addEventListener("mouseout", () => {
      cursor.style.backgroundImage = "url('assets/sprites/cursor.png')";
    });

    document.addEventListener("mousedown", () => {
      cursor.style.backgroundImage = "url('assets/sprites/cursor-click.png')";
    });

    document.addEventListener("mouseup", () => {
      cursor.style.backgroundImage = "url('assets/sprites/cursor.png')";
    });
  }
});

function initializeMobileMenuShortcut() {
  const shortcut = document.getElementById("mobile-shortcut");
  const overlay = document.getElementById("mobile-overlay");
  const closeButton = document.getElementById("close-menu");

  if (!shortcut || !overlay || !closeButton) return;

  function openMenu() {
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
    if (window.audioSystem) {
      window.audioSystem.play("menuSelect");
    }
  }

  function closeMenu() {
    overlay.classList.remove("show");
    document.body.style.overflow = "";
    if (window.audioSystem) {
      window.audioSystem.play("click");
    }
  }

  shortcut.addEventListener("click", openMenu);
  shortcut.addEventListener("touchstart", (e) => {
    e.preventDefault();
    openMenu();
  });

  closeButton.addEventListener("click", closeMenu);
  closeButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    closeMenu();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("show")) {
      closeMenu();
    }
  });
}

function initializeMobileMenuItems() {
  const menuItems = document.querySelectorAll(".mobile-menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("touchstart", () => {
      if (window.audioSystem) {
        window.audioSystem.play("menuHover");
      }
    });

    item.addEventListener("click", () => {
      if (window.audioSystem) {
        window.audioSystem.play("menuSelect");
      }
      const page = item.dataset.page;
      if (page) {
        navigateToPage(page);
        const overlay = document.getElementById("mobile-overlay");
        if (overlay) {
          overlay.classList.remove("show");
          document.body.style.overflow = "";
        }
      }
    });
  });

  const socialItems = document.querySelectorAll(".mobile-social-item");
  socialItems.forEach((item) => {
    item.addEventListener("touchstart", () => {
      if (window.audioSystem) {
        window.audioSystem.play("menuHover");
      }
    });

    item.addEventListener("click", () => {
      if (window.audioSystem) {
        window.audioSystem.play("click");
      }
    });
  });
}

function initializeAudioControls() {
  const muteBtn = document.getElementById("mute-btn");
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      if (window.audioSystem) {
        window.audioSystem.toggleMute();
      }
    });
  }
}

class Starfield {
  constructor() {
    this.container = document.createElement("div");
    this.container.className = "stars-container";
    document.body.appendChild(this.container);

    this.stars = [];
    this.setup();
  }

  setup() {
    this.createStars();
    setInterval(() => this.recycleStars(), 1000);
    window.addEventListener("resize", () => this.handleResize());
  }

  createStars() {
    const starsCount = Math.floor(window.innerWidth / 3);
    for (let i = 0; i < starsCount; i++) {
      const isBright = Math.random() < 0.15;
      this.createStar(isBright);
    }
  }

  createStar(isBright) {
    const star = document.createElement("div");
    star.className = `star ${isBright ? "bright" : ""}`;
    this.updateStarPosition(star, true);
    if (isBright) {
      const duration = 20 + Math.random() * 30;
      star.style.animationDuration = `${duration}s`;
      setInterval(() => {
        if (Math.random() < 0.03) {
          star.style.animation = `float ${duration}s linear infinite, spark 0.5s forwards`;
          setTimeout(() => {
            star.style.animation = `float ${duration}s linear infinite, pulse ${2 + Math.random() * 3}s ease-in-out infinite`;
          }, 500);
        }
      }, 1000);
    } else {
      star.style.animationDuration = `${30 + Math.random() * 50}s`;
    }
    this.container.appendChild(star);
    this.stars.push(star);
  }

  updateStarPosition(star, initial = false) {
    const size = star.classList.contains("bright")
      ? Math.random() * 3 + 2
      : Math.random() * 1 + 0.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = initial ? `${Math.random() * 100}%` : "100%";
  }

  recycleStars() {
    this.stars.forEach((star) => {
      const rect = star.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        this.updateStarPosition(star);
      }
    });
  }

  handleResize() {
    this.stars.forEach((star) => {
      const rect = star.getBoundingClientRect();
      if (rect.right < 0 || rect.left > window.innerWidth) {
        this.updateStarPosition(star, true);
      }
    });
  }

  destroy() {
    this.container.remove();
  }
}
const starfield = new Starfield();

function initializeMenu() {
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (window.audioSystem) {
        window.audioSystem.play("menuHover");
      }
    });
    item.addEventListener("click", () => {
      if (window.audioSystem) {
        window.audioSystem.play("menuSelect");
      }
      const page = item.dataset.page;
      if (page) {
        navigateToPage(page);
      }
    });
  });

  const socialLinks = document.querySelectorAll(".social-link");
  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (window.audioSystem) {
        window.audioSystem.play("menuHover");
      }
    });
    link.addEventListener("click", () => {
      if (window.audioSystem) {
        window.audioSystem.play("click");
      }
    });
  });
}

function navigateToPage(pageName) {
  const currentPage = document.querySelector(".page.active");
  if (currentPage) {
    currentPage.classList.remove("active");
  }

  triggerMegamanTransition();

  setTimeout(() => {
    let targetPage = document.getElementById(pageName);
    if (!targetPage) {
      targetPage = createPage(pageName);
    }
    targetPage.classList.add("active");

    if (pageName === "cursos") {
      startCarousel();
    }

    if (window.audioSystem) {
      window.audioSystem.play("teleport");
    }
  }, 1000);
}

function createPage(pageName) {
  const mainContent = document.getElementById("main-content");
  const page = document.createElement("section");
  page.id = pageName;
  page.className = "page";

  switch (pageName) {
    case "sobre":
      page.innerHTML = createSobrePage();
      break;
    case "curriculo":
      page.innerHTML = createCurriculoPage();
      break;
    case "projetos":
      page.innerHTML = createProjetosPage();
      break;
    case "skills":
      page.innerHTML = createSkillsPage();
      break;
    case "blog":
      page.innerHTML = createBlogPage();
      break;
    case "contato":
      page.innerHTML = createContatoPage();
      break;
    default:
      page.innerHTML =
        "<h1>PÁGINA EM CONSTRUÇÃO</h1><p>Esta página está sendo desenvolvida...</p>";
  }

  mainContent.appendChild(page);
  return page;
}

function createSobrePage() {
  return `<div class="page-content">
  <div class="header-container">
    <div class="avatar-title-wrapper">
      <div class="about-avatar">
        <div class="avatar-large"></div>
      </div>
      <h1 style="color: #34f2fd;"><i class="fas fa-user-tie" style="position: relative; top: -2px;"></i> SOBRE MIM</h1>
    </div>
    <h2><i class="fas fa-code red-icon" style="font-size: 15px;"></i> Desenvolvedor Full-Stack | <i class="fas fa-network-wired red-icon" style="font-size: 15px;"></i> Redes | <i class="fas fa-paint-brush red-icon" style="font-size: 15px;"></i> UX/UI</h2>
  </div>
  <div class="content-overlay">
    <div class="about-text">
      <p><i class="fas fa-briefcase green-icon" style="font-size: 15px;"></i> Profissional multidisciplinar com 5+ anos de experiência em desenvolvimento de software e infraestrutura de redes. Autodidata com certificações em:</p>
      <ul class="certifications">
        <li><i class="fab fa-js-square green-icon" style="font-size: 15px;"></i> Desenvolvimento Web (JavaScript, React, Node.js)</li>
        <li><i class="fas fa-cloud green-icon" style="font-size: 15px;"></i> Cloud Computing (AWS, Google Cloud)</li>
        <li><i class="fas fa-shield-alt green-icon" style="font-size: 15px;"></i> Segurança de Redes (Cisco CCNA)</li>
      </ul>
      <h3><i class="fas fa-star yellow-icon" style="font-size: 15px;"></i> Destaques:</h3>
      <ul class="highlights">
        <li><i class="fas fa-rocket yellow-icon" style="font-size: 15px;"></i> Especialista em soluções que combinam eficiência técnica com UX</li>
        <li><i class="fas fa-search-plus yellow-icon" style="font-size: 15px;"></i> Visão analítica para resolver problemas complexos</li>
        <li><i class="fas fa-chart-line yellow-icon" style="font-size: 15px;"></i> +40% de performance em otimizações de sistemas</li>
        <li><i class="fas fa-globe yellow-icon" style="font-size: 15px;"></i> Expertise em arquiteturas de rede (TCP/IP, DNS, HTTP/2)</li>
      </ul>
      <h3><i class="fas fa-tasks orange-icon" style="font-size: 15px;"></i> Metodologia:</h3>
      <p>"Desenvolvimento orientado a resultados" - foco em:</p>
      <ul class="methodology">
        <li><i class="fas fa-broom orange-icon" style="font-size: 15px;"></i> Clean Code e boas práticas</li>
        <li><i class="fas fa-file-alt orange-icon" style="font-size: 15px;"></i> Documentação técnica precisa</li>
        <li><i class="fas fa-vial orange-icon" style="font-size: 15px;"></i> Testes automatizados (Jest, Cypress)</li>
        <li><i class="fas fa-sync-alt orange-icon" style="font-size: 15px;"></i> CI/CD</li>
        <li><i class="fas fa-clipboard-check orange-icon" style="font-size: 15px;"></i> Gestão de Qualidade</li>
      </ul>
      <h3><i class="fas fa-bullseye red-icon" style="font-size: 15px;"></i> Objetivo Atual:</h3>
      <p>Liderar projetos inovadores que integrem:</p>
      <ul class="goals">
        <li><i class="fas fa-microchip red-icon" style="font-size: 15px;"></i> IoT e IA aplicada</li>
        <li><i class="fas fa-robot red-icon" style="font-size: 15px;"></i> DevOps</li>
        <li><i class="fas fa-universal-access red-icon" style="font-size: 15px;"></i> Acessibilidade (WCAG 2.1)</li>
      </ul>
      <h3><i class="fas fa-handshake red-icon" style="font-size: 15px;"></i> Disponível para:</h3>
      <ul class="availability">
        <li><i class="fas fa-laptop-code red-icon" style="font-size: 15px;"></i> Projetos desafiadores</li>
        <li><i class="fas fa-headset red-icon" style="font-size: 15px;"></i> Consultorias técnicas</li>
        <li><i class="fas fa-chalkboard-teacher red-icon" style="font-size: 15px;"></i> Palestras e mentoria</li>
      </ul>
    </div>
  </div>
  <div class="stats-section">
    <div class="stat-item">
      <div class="stat-value"><i class="fas fa-calendar-alt green-icon" style="font-size: 15px;"></i> 10+</div>
      <div class="stat-label">ANOS DE EXPERIÊNCIA</div>
    </div>
    <div class="stat-item">
      <div class="stat-value"><i class="fas fa-certificate green-icon" style="font-size: 15px;"></i> 50+</div>
      <div class="stat-label">CERTIFICADOS</div>
    </div>
    <div class="stat-item">
      <div class="stat-value"><i class="fas fa-project-diagram green-icon" style="font-size: 15px;"></i> 100+</div>
      <div class="stat-label">PROJETOS</div>
    </div>
  </div>
</div>
<style>
  i.fas, i.fab { margin-right: 8px; width: 20px; text-align: center; position: relative; }
  .red-icon { color: #dc3545; }
  .green-icon { color: #28a745; }
  .yellow-icon { color: #ffc107; }
  .orange-icon { color: #fd7e14; }
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">`;
}

function createCurriculoPage() {
  return `
  <div class="page-content">
    <h1>CURRÍCULO</h1>
    <div class="cv-thumbnail-container">
      <img src="https://i.ibb.co/Xrrx3kS2/CARLOS-AUGUSTO-DINIZ-FILHO-2025.png" 
           alt="Miniatura do Currículo" 
           class="cv-thumbnail"
           onclick="abrirCurriculoCompleto()">
      <p class="cv-thumbnail-caption">Clique na imagem para visualizar o currículo completo</p>
      <button class="download-btn" onclick="downloadCurriculo()">
        ⬇️ Baixar Currículo (PDF)
      </button>
    </div>
    <div class="cv-section">
      <h2>FORMAÇÃO ACADÊMICA</h2>
      <div class="cv-item">
        <h3>Bacharelado em Engenharia da Computação</h3>
        <p>Instituto de Estudos Superiores da Amazônia (IESAM) - 2011-2016</p>
        <ul>
          <li>Participou do Clube de Tecnologia</li>
          <li>Palestrante desenvolvimento Arduino</li>
          <li>Palestrante na Feira do Empreendedor e Desafio SEBRAE 2011-2017</li>
        </ul>
      </div>
      <div class="cv-item">
        <h3>Pós-Graduação Lato Sensu em Engenharia de Redes e Telecomunicações</h3>
        <p>Faculdade Estácio - 2017-2018</p>
        <ul>
          <li>Desenvolvimento de Projetos variados voltados à robótica</li>
          <li>Organização de eventos na Faculdade voltados a TI</li>
        </ul>
      </div>
    </div>
    <div class="cv-section">
      <h2>EXPERIÊNCIA PROFISSIONAL</h2>
      <div class="cv-item">
        <h3>Técnico em manutenção de computadores</h3>
        <p>50$ Computadores</p>
        <ul>
          <li>Limpeza, Programação e manutenção de software e hardware</li>
          <li>Configuração e montagem de Desktops, Micro Computadores e notebooks</li>
          <li>Configuração de Redes e sistemas em domicílio</li>
          <li>Consultor de Tecnologia e aquisição de hardware e sistemas</li>
        </ul>
      </div>
      <div class="cv-item">
        <h3>Assistente Desenvolvedor e programação</h3>
        <p>Mac manutenções</p>
        <ul>
          <li>Limpeza e configuração de micro-computadores</li>
          <li>Agendamento de arquivos de backup para diretórios oficiais</li>
          <li>Projetos online e consultas por e-mail de clientes</li>
        </ul>
      </div>
    </div>
  </div>
  `;
}

function abrirCurriculoCompleto() {
  window.open(
    "https://i.ibb.co/Xrrx3kS2/CARLOS-AUGUSTO-DINIZ-FILHO-2025.png",
    "_blank"
  );
}

function downloadCurriculo() {
  const link = document.createElement("a");
  link.href =
    "https://drive.google.com/uc?export=download&id=1SgJETTmBMuwfhpDUp0DLn3v08SBc27EO";
  link.download = "carlosfilho2025";
  link.click();
}

function createProjetosPage() {
  return `<div class="page-content"><h1>PROJETOS</h1><div class="projects-grid"><div class="project-card"><div class="project-icon">🌐</div><h3>PORTFÓLIO 8-BIT</h3><p>Portfólio interativo com tema retro gamer, desenvolvido com HTML5, CSS3 e JavaScript vanilla.</p><div class="project-tech">HTML5 • CSS3 • JavaScript</div></div><div class="project-card"><div class="project-icon">🤖</div><h3>SISTEMA ARDUINO</h3><p>Projetos de automação residencial e robótica educacional usando Arduino e sensores.</p><div class="project-tech">Arduino • C++ • IoT</div></div><div class="project-card"><div class="project-icon">🔧</div><h3>SISTEMA DE BACKUP</h3><p>Solução automatizada para backup de dados corporativos com agendamento inteligente.</p><div class="project-tech">Python • Linux • Shell</div></div><div class="project-card"><div class="project-icon">🌐</div><h3>CONFIGURAÇÃO DE REDES</h3><p>Implementação de redes corporativas com foco em segurança e performance.</p><div class="project-tech">Cisco • Linux • Windows Server</div></div></div></div>`;
}

function createSkillsPage() {
  return `<div class="page-content">
  <h1><i class="fas fa-laptop-code" style="font-size: 26px; color: red; margin-right: 10px; position: relative; top: -5px;"></i> HABILIDADES</h1>
  <div class="skills-section">
    <div class="skill-category">
      <h2><i class="fas fa-code" style="font-size: 22px; color: red; margin-right: 10px; position: relative; top: 2px;"></i> LINGUAGENS DE PROGRAMAÇÃO</h2>
      <div class="skill-bars">
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="18" style="position: relative; top: 2px;"/> JavaScript</div><div class="skill-progress"><div class="skill-fill" style="width:90%"></div></div></div>
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="18" style="position: relative; top: 2px;"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="18" style="position: relative; top: 2px;"/> HTML5/CSS3</div><div class="skill-progress"><div class="skill-fill" style="width:95%"></div></div></div>
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="18" style="position: relative; top: 2px;"/> Python</div><div class="skill-progress"><div class="skill-fill" style="width:80%"></div></div></div>
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="18" style="position: relative; top: 2px;"/> Java</div><div class="skill-progress"><div class="skill-fill" style="width:75%"></div></div></div>
      </div>
    </div>
    <div class="skill-category">
      <h2><i class="fas fa-cubes" style="font-size: 22px; color: red; margin-right: 10px; position: relative; top: 2px;"></i> FRAMEWORKS & TECNOLOGIAS</h2>
      <div class="skill-bars">
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="18" style="position: relative; top: 2px;"/> React</div><div class="skill-progress"><div class="skill-fill" style="width:85%"></div></div></div>
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="18" style="position: relative; top: 2px;"/> Node.js</div><div class="skill-progress"><div class="skill-fill" style="width:80%"></div></div></div>
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="18" style="position: relative; top: 2px;"/> TypeScript</div><div class="skill-progress"><div class="skill-fill" style="width:75%"></div></div></div>
      </div>
    </div>
    <div class="skill-category">
      <h2><i class="fas fa-network-wired" style="font-size: 22px; color: red; margin-right: 10px; position: relative; top: 2px;"></i> SISTEMAS & REDES</h2>
      <div class="skill-bars">
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" width="18" style="position: relative; top: 2px;"/> Linux</div><div class="skill-progress"><div class="skill-fill" style="width:90%"></div></div></div>
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" width="18" style="position: relative; top: 2px;"/> Windows Server</div><div class="skill-progress"><div class="skill-fill" style="width:85%"></div></div></div>
        <div class="skill-bar"><div class="skill-name"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="18" style="position: relative; top: 2px;"/> Redes TCP/IP</div><div class="skill-progress"><div class="skill-fill" style="width:88%"></div></div></div>
      </div>
    </div>
  </div>
</div>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">`;
}

function createBlogPage() {
  return `<div class="page-content"><h1>BLOG TÉCNICO</h1><div class="blog-terminal"><div class="terminal-header"><span class="terminal-title">BLOG_TERMINAL.EXE</span></div><div class="terminal-body"><div class="blog-post"><div class="post-date">[2024-01-15]</div><h3>Implementando Portfólio 8-bit com Vanilla JS</h3><p>Neste post, vou compartilhar como desenvolvi este portfólio retro usando apenas HTML, CSS e JavaScript vanilla...</p><div class="post-tags">#JavaScript #CSS #8bit #Portfolio</div></div><div class="blog-post"><div class="post-date">[2024-01-10]</div><h3>Automação com Arduino: Projetos Práticos</h3><p>Explorando projetos de automação residencial usando Arduino, sensores e programação em C++...</p><div class="post-tags">#Arduino #IoT #Automação #C++</div></div><div class="blog-post"><div class="post-date">[2024-01-05]</div><h3>Configuração de Redes Linux: Guia Completo</h3><p>Um guia prático para configuração de redes em sistemas Linux, desde o básico até configurações avançadas...</p><div class="post-tags">#Linux #Redes #Administração #TCP/IP</div></div></div></div></div>`;
}

function createContatoPage() {
  return `<div class="page-content"><h1>CONTATO</h1><div class="contact-section"><div class="contact-info"><div class="contact-item"><div class="contact-icon">📍</div><div class="contact-text"><strong>ENDEREÇO</strong><br>Data:37 Promorar,Val-de-Cans nº 231<br>Belém,Pará-Brasil</div></div><div class="contact-item"><div class="contact-icon">📧</div><div class="contact-text"><strong>E-MAIL</strong><br>carlosaugustodiniz@outlook.com</div></div><div class="contact-item"><div class="contact-icon">💼</div><div class="contact-text"><strong>LINKEDIN</strong><br>www.linkedin.com/in/ysneshy/</div></div><div class="contact-item"><div class="contact-icon">🌐</div><div class="contact-text"><strong>PORTFÓLIO</strong><br>https://carlosfilho.vercel.app</div></div></div><div class="contact-form"><h2>ENVIAR MENSAGEM</h2><form id="contact-form"><div class="form-group"><label>NOME:</label><input type="text" name="name" required></div><div class="form-group"><label>E-MAIL:</label><input type="email" name="email" required></div><div class="form-group"><label>MENSAGEM:</label><textarea name="message" rows="5" required></textarea></div><button type="submit">ENVIAR MENSAGEM</button></form></div></div></div>`;
}

function triggerMegamanTransition() {
  const megamanTransition = document.getElementById("megaman-transition");
  if (megamanTransition) {
    megamanTransition.classList.add("active");
    setTimeout(() => {
      megamanTransition.classList.remove("active");
    }, 2000);
  }
}

function initializeTerminal() {
  const terminalInput = document.getElementById("terminal-input");
  const terminalOutput = document.getElementById("terminal-output");

  if (!terminalInput || !terminalOutput) return;

  const commands = {
    help: "Comandos disponíveis: help, about, skills, projects, contact, clear, konami, megaman",
    about:
      "Carlos Augusto Diniz Filho - Engenheiro da Computação especializado em desenvolvimento web e redes.",
    skills:
      "JavaScript, HTML5, CSS3, Python, Java, React, Node.js, Linux, Windows Server, Arduino",
    projects:
      "Portfólio 8-bit, Sistemas Arduino, Automação, Configuração de Redes",
    contact:
      "E-mail: carlosaugustodiniz@outlook.com | LinkedIn: linkedin.com/in/ysneshy/",
    clear: "",
    konami: "↑↑↓↓←→←→BA - Código secreto para easter egg!",
    megaman:
      "Controla o Mega Man: 'megaman on/off', 'megaman status', 'megaman stats', 'megaman reset', 'megaman shoot', 'megaman move'",
    "megaman on": () => {
      if (window.megamanController) {
        window.megamanController.start();
        return "🤖 Mega Man ativado! Ele começará a se mover e atirar aleatoriamente.";
      }
      return "❌ Erro: Controlador do Mega Man não encontrado.";
    },
    "megaman off": () => {
      if (window.megamanController) {
        window.megamanController.stop();
        return "🤖 Mega Man desativado.";
      }
      return "❌ Erro: Controlador do Mega Man não encontrado.";
    },
    "megaman status": () => {
      if (window.megamanController) {
        const status = window.megamanController.getStatus();
        return `🤖 Status do Mega Man:\nAtivo: ${status.isActive ? "SIM" : "NÃO"}\nPausado: ${status.isPaused ? "SIM" : "NÃO"}\nMovendo: ${status.isMoving ? "SIM" : "NÃO"}\nAtirando: ${status.isShooting ? "SIM" : "NÃO"}\nSprite atual: ${status.currentSprite}\nPágina atual: ${status.currentPage}\nPosição: X=${Math.round(status.position.x)}, Y=${Math.round(status.position.y)}`;
      }
      return "❌ Erro: Controlador do Mega Man não encontrado.";
    },
    "megaman stats": () => {
      if (window.megamanController) {
        const status = window.megamanController.getStatus();
        const stats = status.stats;
        return `📊 Estatísticas do Mega Man:\nTiros disparados: ${stats.totalShots}\nMovimentos realizados: ${stats.totalMoves}\nTempo ativo: ${stats.activeTime}s\nMédia de tiros/min: ${stats.activeTime > 0 ? Math.round((stats.totalShots / stats.activeTime) * 60) : 0}`;
      }
      return "❌ Erro: Controlador do Mega Man não encontrado.";
    },
    "megaman reset": () => {
      if (window.megamanController) {
        window.megamanController.resetStats();
        return "📊 Estatísticas do Mega Man resetadas!";
      }
      return "❌ Erro: Controlador do Mega Man não encontrado.";
    },
    "megaman shoot": () => {
      if (window.megamanController && window.megamanController.isActive) {
        window.megamanController.shoot();
        return "💥 Mega Man atirou manualmente!";
      }
      return "❌ Mega Man não está ativo ou não foi encontrado.";
    },
    "megaman move": () => {
      if (window.megamanController && window.megamanController.isActive) {
        window.megamanController.moveToRandomPosition();
        return "🏃 Mega Man se moveu para uma nova posição!";
      }
      return "❌ Mega Man não está ativo ou não foi encontrado.";
    },
    "view projects": () => navigateToPage("projetos"),
  };

  terminalInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const command = this.value.toLowerCase().trim();
      const output = document.createElement("div");
      output.innerHTML = `<span style="color:var(--color-secondary);">C:\\PORTFOLIO></span> ${this.value}`;

      if (commands[command]) {
        if (typeof commands[command] === "function") {
          const result = commands[command]();
          output.innerHTML += `<br>${result}`;
        } else if (command === "clear") {
          terminalOutput.innerHTML = "";
          this.value = "";
          return;
        } else {
          output.innerHTML += "<br>" + commands[command];
        }
      } else {
        output.innerHTML +=
          '<br>Comando não reconhecido. Digite "help" para ver os comandos disponíveis.';
      }

      terminalOutput.appendChild(output);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      this.value = "";

      if (window.audioSystem) {
        window.audioSystem.play("click");
      }
    }
  });
}

function initializeEasterEggs() {
  document.addEventListener("keydown", function (e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }
    if (konamiCode.join("") === konamiSequence.join("")) {
      activateKonamiEasterEgg();
      konamiCode = [];
    }
  });

  const heroAvatar = document.getElementById("hero-avatar");
  if (heroAvatar) {
    heroAvatar.addEventListener("click", function () {
      this.classList.add("glitch");
      if (window.audioSystem) {
        window.audioSystem.play("achievement");
      }
      setTimeout(() => {
        this.classList.remove("glitch");
      }, 2000);
    });
  }
}

function activateKonamiEasterEgg() {
  let konamiGame = document.getElementById("konami-game");
  if (!konamiGame) {
    konamiGame = document.createElement("div");
    konamiGame.id = "konami-game";
    konamiGame.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h2>KONAMI EASTER EGG!</h2>
                    <button onclick="closeKonamiGame()">X</button>
                </div>
                <div class="game-content">
                    <p>Parabéns! Você descobriu o easter egg!</p>
                    <div class="game-score">Pontuação: <span id="game-score">0</span></div>
                    <div class="game-animation"></div>
                </div>
            </div>
        `;
    document.body.appendChild(konamiGame);
  }
  konamiGame.classList.remove("hidden");
  if (window.audioSystem) {
    window.audioSystem.play("achievement");
  }
  let score = 0;
  const scoreElement = document.getElementById("game-score");
  const interval = setInterval(() => {
    score += Math.floor(Math.random() * 100);
    scoreElement.textContent = score;
  }, 500);
  setTimeout(() => {
    clearInterval(interval);
  }, 5000);
  document.body.classList.add("konami-active");
  setTimeout(() => {
    document.body.classList.remove("konami-active");
  }, 5000);
}

function closeKonamiGame() {
  const konamiGame = document.getElementById("konami-game");
  if (konamiGame) {
    konamiGame.classList.add("hidden");
  }
  if (window.audioSystem) {
    window.audioSystem.play("click");
  }
}

function initializeSpeedrun() {
  document.addEventListener("keydown", function (e) {
    if (e.shiftKey && !speedrunTimer) {
      startSpeedrun();
    }
  });
  document.addEventListener("keyup", function (e) {
    if (e.key === "Shift" && speedrunTimer) {
      stopSpeedrun();
    }
  });
}

function startSpeedrun() {
  const speedrunTimerElement = document.getElementById("speedrun-timer");
  if (speedrunTimerElement) {
    speedrunTimerElement.classList.remove("hidden");
  }
  speedrunStartTime = Date.now();
  speedrunTimer = setInterval(updateSpeedrunTimer, 100);
  document.body.classList.add("speed-mode");
  if (window.audioSystem) {
    window.audioSystem.play("achievement");
  }
}

function stopSpeedrun() {
  if (speedrunTimer) {
    clearInterval(speedrunTimer);
    speedrunTimer = null;
    const speedrunTimerElement = document.getElementById("speedrun-timer");
    if (speedrunTimerElement) {
      speedrunTimerElement.classList.add("hidden");
    }
    document.body.classList.remove("speed-mode");
    if (window.audioSystem) {
      window.audioSystem.play("click");
    }
  }
}

function updateSpeedrunTimer() {
  if (speedrunStartTime) {
    const elapsed = Date.now() - speedrunStartTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timerValue = document.querySelector(".timer-value");
    if (timerValue) {
      timerValue.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }
}

function initializeBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");
  if (!backToTopButton) return;
  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  }
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (window.audioSystem) {
      window.audioSystem.play("click");
    }
  }
  window.addEventListener("scroll", toggleBackToTop);
  backToTopButton.addEventListener("click", scrollToTop);
  toggleBackToTop();
}

window.closeKonamiGame = closeKonamiGame;

document
  .querySelectorAll(".menu-item, .mobile-menu-item, .mobile-social-item")
  .forEach((button) => {
    button.addEventListener("mouseenter", () => {
      const angle = Math.random() * 10 - 5;
      button.style.transform = `translateY(-2px) rotate(${angle}deg)`;
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });

document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector(".main-content")) {
    console.error("Elemento principal não encontrado!");
    return;
  }
});

function triggerMegamanTransition() {
  const bg = document.querySelector(".megaman-bg");
  const transition = document.querySelector(".megaman-transition");

  bg.classList.add("active");
  transition.classList.add("active");

  setTimeout(() => {
    bg.classList.remove("active");
    transition.classList.remove("active");
  }, 2000);
}

function generateHorizontalLines() {
  const container = document.getElementById("horizontal-lines-container");
  if (!container) return;
  const numberOfLines = 15;
  for (let i = 0; i < numberOfLines; i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.width = `${Math.random() * 40 + 30}%`;
    line.style.top = `${Math.random() * 100}%`;
    line.style.animationDuration = `${Math.random() * 6 + 4}s`;
    line.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(line);
  }
}
document.addEventListener("DOMContentLoaded", generateHorizontalLines);
