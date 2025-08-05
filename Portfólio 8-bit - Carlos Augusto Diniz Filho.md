# Portfólio 8-bit - Carlos Augusto Diniz Filho

Um portfólio interativo com tema retro gamer 8-bit, desenvolvido com HTML5, CSS3 e JavaScript vanilla.

## 🎮 Características

### Design Visual
- **Tema 8-bit**: Cores neon (roxo, azul ciano), fonte Press Start 2P
- **Fundo animado**: Starfield com efeito de movimento contínuo
- **Cursor personalizado**: Sprites pixelados para normal e hover
- **Animações CSS**: Efeitos de glow, bounce, glitch e CRT
- **Responsivo**: Compatível com desktop e mobile

### Funcionalidades Interativas
- **Menu flutuante**: Navegação com efeitos visuais (pixel burst, glow neon)
- **Sistema de áudio**: Música de fundo e SFX para interações
- **Terminal interativo**: Comandos para navegação e informações
- **Transições**: Megaman empurrando a tela entre páginas
- **Loading screen**: Animação de carregamento com sprite do Megaman

### Easter Eggs
- **Código Konami**: ↑↑↓↓←→←→BA para ativar mini-game
- **Glitch no avatar**: Clique no Megaman para efeito visual
- **Modo Speedrun**: Segure Shift para ativar modo acelerado
- **Efeito CRT**: Linhas de varredura simulando monitor antigo

### Páginas
- **Home**: Apresentação principal com terminal
- **Sobre**: Informações pessoais e estatísticas
- **Currículo**: Formação acadêmica e experiência profissional
- **Projetos**: Portfolio de trabalhos realizados
- **Skills**: Habilidades técnicas com barras animadas
- **Blog**: Posts técnicos em formato terminal
- **Contato**: Informações de contato e formulário

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Animações, Grid, Flexbox, Custom Properties
- **JavaScript**: Vanilla JS, Web Audio API, DOM manipulation
- **Assets**: Sprites do Megaman, fonte Press Start 2P, áudios 8-bit

## 📁 Estrutura do Projeto

```
portfolio_8bit/
├── index.html              # Página principal
├── style.css               # Estilos principais
├── scripts.js              # JavaScript principal
├── audio-system.js         # Sistema de áudio
├── vercel.json            # Configuração do Vercel
├── README.md              # Documentação
└── public/
    ├── favicon.png        # Ícone do site
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
```

## 🚀 Deploy

O projeto está configurado para deploy automático no Vercel:

1. **Configuração**: `vercel.json` com redirecionamentos e cleanUrls
2. **Otimizações**: Imagens WebP, áudios comprimidos
3. **Compatibilidade**: Funciona em todos os navegadores modernos

## 🎯 Comandos do Terminal

- `help` - Lista todos os comandos disponíveis
- `about` - Informações sobre o desenvolvedor
- `skills` - Lista de habilidades técnicas
- `projects` - Projetos realizados
- `contact` - Informações de contato
- `clear` - Limpa o terminal
- `konami` - Dica sobre o código secreto
- `view projects` - Navega para a página de projetos

## 🎮 Controles Especiais

- **Código Konami**: ↑↑↓↓←→←→BA (ativa mini-game)
- **Speedrun**: Segure Shift (ativa modo acelerado)
- **Mute**: Clique no ícone 🔊 para silenciar áudio
- **Avatar Glitch**: Clique no Megaman para efeito especial

## 📱 Responsividade

- **Desktop**: Menu lateral, layout completo
- **Mobile**: Menu inferior, layout adaptado
- **Touch**: Suporte a gestos e toques
- **Performance**: Otimizado para dispositivos móveis

## 🔧 Desenvolvimento Local

```bash
# Clonar o repositório
git clone [url-do-repositorio]

# Navegar para o diretório
cd portfolio_8bit

# Iniciar servidor local
python3 -m http.server 8000

# Acessar no navegador
http://localhost:8000
```

## 📄 Licença

Este projeto é de uso pessoal e educacional.

---

**Desenvolvido por Carlos Augusto Diniz Filho**  
Engenheiro da Computação | Especialista em Redes e Telecomunicações

