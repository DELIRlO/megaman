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

    // Cria e adiciona o texto digitado
    const textSpan = document.createElement("span");
    textSpan.className = "typed-text";
    textSpan.textContent = textToType.substring(0, charIndex);
    outputElement.appendChild(textSpan);

    // Cria e adiciona o cursor
    const cursorSpan = document.createElement("span");
    cursorSpan.className = "cursor";
    outputElement.appendChild(cursorSpan);

    if (charIndex < textToType.length) {
      charIndex++;
      setTimeout(typeWriter, 156);
    } else {
      // Mantém o cursor no final e se prepara para reiniciar
      setTimeout(() => {
        charIndex = 0;
        typeWriter();
      }, 3000); // Pausa antes de reiniciar
    }
  }

  typeWriter();
});
