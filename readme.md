# 🕹️ Portfólio 8-bit - Carlos Augusto Diniz Filho

<p align="center">
  <img src="https://img.shields.io/badge/STYLE-8BIT-00ff00?style=for-the-badge" alt="8-bit style">
  <img src="https://img.shields.io/badge/COLOR-NEON-ff00ff?style=for-the-badge" alt="Neon colors">
</p>

<p align="center">
  <a href="https://ibb.co/SwpmQkY" target="_blank">
    <img src="https://i.ibb.co/N2zN10DR/Screenshot-1.png" alt="Preview do Portfólio 8-bit" style="border: 1px solid #2d2d2d; border-radius: 8px;">
  </a>
</p>

```diff
+ Um portfólio interativo com tema retro gamer 8-bit
+ Desenvolvido com HTML5, CSS3 e JavaScript vanilla

🌟 Características

🎨 Design Visual

+ 🖌️ Tema 8-bit: Cores neon (roxo, azul ciano), fonte Press Start 2P
+ 🌌 Fundo animado: Starfield com efeito de movimento contínuo
+ 🖱️ Cursor personalizado: Sprites pixelados para normal e hover
+ ✨ Animações CSS: Efeitos de glow, bounce, glitch e CRT
+ 📱 Responsivo: Compatível com desktop e mobile

+ 🍔 Menu flutuante: Navegação com efeitos visuais (pixel burst, glow neon)
+ 🔊 Sistema de áudio: Música de fundo e SFX para interações
+ 💻 Terminal interativo: Comandos para navegação e informações
+ 🤖 Transições: Megaman empurrando a tela entre páginas
+ ⏳ Loading screen: Animação de carregamento com sprite do Megaman

+ 🎮 Código Konami: ↑↑↓↓←→←→BA para ativar mini-game
+ 💥 Glitch no avatar: Clique no Megaman para efeito visual
+ ⚡ Modo Speedrun: Segure Shift para ativar modo acelerado
+ 📺 Efeito CRT: Linhas de varredura simulando monitor antigo

+ 🏠 Home: Apresentação principal com terminal
+ ℹ️ Sobre: Informações pessoais e estatísticas
+ 📄 Currículo: Formação acadêmica e experiência profissional
+ 🗂️ Projetos: Portfolio de trabalhos realizados
+ 🛠️ Skills: Habilidades técnicas com barras animadas
+ ✍️ Blog: Posts técnicos em formato terminal
+ 📧 Contato: Informações de contato e formulário

+ 🏗️ HTML5: Estrutura semântica
+ 🎨 CSS3: Animações, Grid, Flexbox, Custom Properties
+ ⚙️ JavaScript: Vanilla JS, Web Audio API, DOM manipulation
+ 🖼️ Assets: Sprites do Megaman, fonte Press Start 2P, áudios 8-bit

portfolio_8bit/
├── index.html              # Página principal
├── style.css               # Estilos principais
├── scripts.js              # JavaScript principal
├── audio-system.js         # Sistema de áudio
├── vercel.json             # Configuração do Vercel
└── public/
    ├── favicon.png         # Ícone do site
    └── assets/
        ├── fonts/
        │   └── press-start-2p.woff2
        ├── sprites/
        │   ├── megaman-idle.gif
        │   ├── megaman-running.gif
        │   ├── cursor.png
        │   └── cursor-hover.png
        ├── images/
        │   ├── starfield-bg.jpg
        │   └── starfield-bg.webp
        └── audio/
            ├── bg_music.wav
            ├── menu_select.wav
            ├── hover_bleep.wav
            └── teleport.wav

            + ⚙️ Configuração: vercel.json com redirecionamentos e cleanUrls
+ ⚡ Otimizações: Imagens WebP, áudios comprimidos
+ 🌐 Compatibilidade: Funciona em todos os navegadores modernos

❓ help           # Lista todos os comandos disponíveis
👨‍💻 about         # Informações sobre o desenvolvedor
🛠️ skills        # Lista de habilidades técnicas
🗂️ projects      # Projetos realizados
📧 contact       # Informações de contato
🧹 clear         # Limpa o terminal
🎮 konami        # Dica sobre o código secreto
👀 view projects # Navega para a página de projetos

+ 🕹️ Código Konami: ↑↑↓↓←→←→BA (ativa mini-game)
+ ⚡ Speedrun: Segure Shift (ativa modo acelerado)
+ 🔇 Mute: Clique no ícone 🔊 para silenciar áudio
+ 💥 Avatar Glitch: Clique no Megaman para efeito especial

+ 🖥️ Desktop: Menu lateral, layout completo
+ 📱 Mobile: Menu inferior, layout adaptado
+ 👆 Touch: Suporte a gestos e toques
+ ⚡ Performance: Otimizado para dispositivos móveis


# Clonar o repositório
git clone [url-do-repositorio]

# Navegar para o diretório
cd portfolio_8bit

# Iniciar servidor local
python3 -m http.server 8000

# Acessar no navegador
http://localhost:8000


- Este projeto é de uso pessoal e educacional.
- Não permite redistribuição comercial.

🤖 Sistema Mega Man - Documentação

🎮 Como Usar Comandos Básicos

megaman on - Ativa o Mega Man

megaman off - Desativa o Mega Man

megaman status - Mostra o status atual

megaman stats - Exibe estatísticas detalhadas

megaman reset - Reseta as estatísticas

megaman shoot - Força um tiro manual

megaman move - Força um movimento manual

⚙️ Configurações Timing Aleatório

⏱️ Tiros: Entre 6-20 segundos (imprevisível)

🏃 Movimento: Entre 3-8 segundos

💥 Duração do tiro: 1.5 segundos

🎨 Recursos Visuais Animações CSS

✨ Efeito de entrada com rotação

🎭 Efeito de saída suave

💡 Brilho quando ativo

💓 Pulso durante o tiro

🚀 Rastro de movimento (opcional)

📊 Sistema de Estatísticas Métricas Coletadas

🔫 Total de tiros disparados

🏃 Total de movimentos realizados

⏱️ Tempo total ativo

📈 Média de tiros por minuto

🛠️ Otimizações de Performance Throttling de Eventos

🖼️ Resize da janela: 250ms

👀 Mudança de visibilidade: 100ms

🎮 FPS limitado a 60fps

🎨 Personalização Modificar Sprites

this.sprites = {
idle: "assets/sprites/seu-sprite-idle.gif",
shooting: "assets/sprites/seu-sprite-tiro.gif"
};

this.shootInterval = { min: 4000, max: 15000 }; // 4-15 segundos
this.moveInterval = { min: 2000, max: 6000 }; // 2-6 segundos

🔧 Desenvolvimento Local

! ----------------------------------------

- # 1. Clonar o repositório
- git clone [url-do-repositorio]
  !
- # 2. Entrar na pasta do projeto
- cd portfolio_8bit
  !
- # 3. Iniciar servidor Python
- python3 -m http.server 8000
  !
- # 4. Acessar no navegador
- http://localhost:8000

  ! ----------------------------------------

🐛 Solução de Problemas

Problema Solução
Mega Man não aparece Verifique se digitou megaman on corretamente
Movimento muito rápido/lento Ajuste movementSpeed no código
Não funciona no mobile Verifique se o terminal está acessível
Desenvolvido com ❤️ por Carlos Augusto Diniz Filho | 🎮 Portfólio 8-bit | 2025 whatszap 91 88199828

```
