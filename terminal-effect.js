document.addEventListener("DOMContentLoaded", () => {
  const outputElement = document.getElementById("terminal-output");
  if (!outputElement) {
    console.error("Elemento 'terminal-output' não foi encontrado.");
    return;
  }

  const textToType = "Digite 'help' ou escreva megaman on ou off...";
  let charIndex = 0;

  function typeWriter() {
    // Limpa o conteúdo anterior para redesenhar
    outputElement.innerHTML = "";

    // Cria e adiciona o prompt
    const promptSpan = document.createElement("span");
    promptSpan.className = "prompt";
    promptSpan.textContent = "C:\\YSNES> ";
    outputElement.appendChild(promptSpan);

    // Cria um único span para o texto digitado + cursor
    const textSpan = document.createElement("span");
    textSpan.className = "typed-text";

    // Adiciona o texto até o caractere atual
    textSpan.textContent = textToType.substring(0, charIndex);

    // Adiciona o cursor como parte do texto (usando um span interno)
    const cursorSpan = document.createElement("span");
    cursorSpan.className = "cursor";
    cursorSpan.textContent = "|"; // Ou pode ser um caractere vazio com CSS
    textSpan.appendChild(cursorSpan);

    outputElement.appendChild(textSpan);

    if (charIndex < textToType.length) {
      charIndex++;
      setTimeout(typeWriter, 156);
    } else {
      // Mantém o cursor piscando no final e se prepara para reiniciar
      setTimeout(() => {
        charIndex = 0;
        typeWriter();
      }, 3000); // Pausa antes de reiniciar
    }
  }

  typeWriter();
});
