document.addEventListener("DOMContentLoaded", function () {
  const starsContainer1 = document.querySelector(".stars");
  const starsContainer2 = document.querySelector(".stars2");
  const starsContainer3 = document.querySelector(".stars3");

  function createStars(container, count, size, color) {
    for (let i = 0; i < count; i++) {
      let star = document.createElement("div");
      star.classList.add("star");

      // Posição inicial, incluindo a área de "after" para o loop
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 4000) - 2000; // Começa de -2000 para 2000

      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${y}px`;
      star.style.left = `${x}px`;
      star.style.backgroundColor = color;

      container.appendChild(star);
    }
  }

  // Gerando o mesmo número de estrelas que o seu CSS original (aproximado)
  // Eu contei 400 estrelas em cada camada.
  createStars(starsContainer1, 800, 1, "#D63C4D");
  createStars(starsContainer2, 400, 2, "#1d92d5");
  createStars(starsContainer3, 200, 3, "#7111F5");
});
