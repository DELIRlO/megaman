// Flag para garantir que a funcionalidade completa (eventos, autoplay) seja inicializada apenas uma vez.
let isCarouselActive = false;

/**
 * Preenche o HTML do carrossel com as imagens e legendas dos cursos.
 * Esta função deve ser chamada quando o DOM principal estiver pronto.
 */
function populateCarouselHTML() {
  const track = document.querySelector(".carousel-track");
  if (!track) {
    console.error("Carousel track not found for population!");
    return;
  }
  track.innerHTML = ""; // Limpa o conteúdo para evitar duplicação

  const courseImages = [
    "administracao de redes linux 1.png",
    "administracao de redes linux 2.png",
    "administracao de sistemas linux 1.jpg",
    "administracao estrategica.jpg",
    "ADMINISTRADOR DE BANCO DE DADOS.png",
    "automacao de sistemas.jpg",
    "banco de dados 1.jpg",
    "BLOBKCHAIN SENAI.png",
    "C PROGRAMACAO BRADESCO.png",
    "CERIMONIALISTA.png",
    "COMPETENCIA TRANSVERSAL TI SENAI.png",
    "css.jpg",
    "DESVENDANDO 5G SENAI.png",
    "DESVENDANDO A INDUSTRIA 40 SENAI.png",
    "direito.png",
    "empreender senai.jpg",
    "escola do trabalhador trabalhando com computadores.png",
    "fundamentos de sistema linux.png",
    "geoinformacao.jpg",
    "html_desenvolvimento de paginas web.jpg",
    "implementando banco de dados.png",
    "INTRODUCAO PROGRAMACAO ORIENTADA OBJETO POO.png",
    "learning python.jpg",
    "logica de programacao 2.jpg",
    "logica de programacao multiplos valorees.png",
    "logica de programacao.jpg",
    "logica de prorgamacao 3.jpg",
    "marketing publico.png",
    "matematica analitica.jpg",
    "MODEDLAGEM E DESENVOLVIMENTO SOFTWARE BRADESCO.png",
    "MODELANDO DADOS NO  POWER BI.png",
    "PRIVACIDADE E PROTECAO DE DADOS SENAI.png",
    "programacao java.jpg",
    "programador web.png",
    "PROJETOS DE SISTEMA TI.png",
    "psicologia aplicada reabilitacao.png",
    "psicologia no trabalho.png",
    "raspberry-aplicacoes.jpg",
    "raspyberry.jpg",
    "seguranca em linux - firewall.png",
    "SEGURANÇA EM TECNOLOGIA DA INFORMACAO.png",
    "SENAI EXCEL BASICO.png",
    "senai sao paulo.png",
    "SHAREPOINT.png",
    "tecnologia assistiva no contexto educacional.png",
    "VEICULOS ELETRICOS E HIBRIDOS.png",
    "VIDEO AULA E VIDEO IFMS.png",
    "windows service 2016.jpg",
  ];

  courseImages.forEach((imageFile) => {
    const title = imageFile
      .substring(0, imageFile.lastIndexOf("."))
      .replace(/[-_]/g, " ")
      .toUpperCase();
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    const img = document.createElement("img");
    img.src = `assets/imagens/cursos/${imageFile}`;
    img.alt = title;
    img.onerror = function () {
      this.src = "assets/imagens/portfolio-thumbnail.png";
    };
    const caption = document.createElement("div");
    caption.className = "carousel-caption";
    caption.textContent = title;
    slide.appendChild(img);
    slide.appendChild(caption);
    track.appendChild(slide);
  });
}

/**
 * Ativa toda a funcionalidade interativa do carrossel e do modal.
 * Esta função é chamada quando a página de cursos se torna visível.
 */
function startCarousel() {
  if (isCarouselActive) return;

  const container = document.querySelector(".carousel-container");
  const track = document.querySelector(".carousel-track");
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");
  const dotsContainer = document.querySelector(".carousel-dots-container");
  let modalCloseTimer = null;

  if (!container || !track || !prevButton || !nextButton || !dotsContainer) {
    console.error("Carousel elements missing. Cannot start.");
    return;
  }

  const slides = track.querySelectorAll(".carousel-slide");
  if (slides.length === 0) return;

  // --- Lógica do Carrossel ---
  if (slides.length <= 1) {
    if (slides.length === 1) track.style.justifyContent = "center";
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    isCarouselActive = true;
    return;
  }

  // Calcula a largura do slide corretamente APÓS ser exibido
  const isMobile = window.innerWidth <= 768;
  const slideWidth = slides[0].clientWidth;
  const slideHeight = slides[0].clientHeight;
  const slideMargin = parseInt(window.getComputedStyle(slides[0]).marginRight);
  const totalSlideWidth = slideWidth + slideMargin * 2;
  const totalSlideHeight = slideHeight;

  if (isMobile && totalSlideHeight === 0) return;
  if (!isMobile && totalSlideWidth === 0) return;

  let currentIndex = 0;
  let autoplayInterval = null;

  // --- Lógica dos Indicadores (Dots) ---
  dotsContainer.innerHTML = "";
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
      updateDots();
    });
    dotsContainer.appendChild(dot);
  });

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  const updateCarousel = () => {
    if (isMobile) {
      track.style.transform = `translateY(-${currentIndex * totalSlideHeight}px)`;
    } else {
      track.style.transform = `translateX(-${currentIndex * totalSlideWidth}px)`;
    }
    updateDots();
  };

  const moveNext = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  };

  const movePrev = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayInterval = setInterval(moveNext, 3000);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayInterval);
  };

  nextButton.addEventListener("click", () => {
    moveNext();
    if (window.audioSystem) window.audioSystem.play("click");
  });
  const upButton = document.querySelector(".carousel-button.up");
  const downButton = document.querySelector(".carousel-button.down");

  if (isMobile) {
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    if (upButton) upButton.style.display = "block";
    if (downButton) downButton.style.display = "block";

    if (upButton)
      upButton.addEventListener("click", () => {
        movePrev();
        if (window.audioSystem) window.audioSystem.play("click");
      });
    if (downButton)
      downButton.addEventListener("click", () => {
        moveNext();
        if (window.audioSystem) window.audioSystem.play("click");
      });
  } else {
    if (upButton) upButton.style.display = "none";
    if (downButton) downButton.style.display = "none";
    prevButton.style.display = "block";
    nextButton.style.display = "block";

    prevButton.addEventListener("click", () => {
      movePrev();
      if (window.audioSystem) window.audioSystem.play("click");
    });
    nextButton.addEventListener("click", () => {
      moveNext();
      if (window.audioSystem) window.audioSystem.play("click");
    });
  }
  container.addEventListener("mouseenter", stopAutoplay);
  container.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
  isCarouselActive = true;
}
