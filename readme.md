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

# 🤖 Sistema Mega Man - Documentação

## Visão Geral

O sistema Mega Man adiciona um personagem interativo que se move aleatoriamente pela página e atira periodicamente. O sistema é totalmente controlado via terminal e possui diversas funcionalidades avançadas.

## 🎮 Como Usar

### Comandos Básicos

Digite os seguintes comandos no terminal da página:

- `megaman on` - Ativa o Mega Man
- `megaman off` - Desativa o Mega Man
- `megaman status` - Mostra o status atual
- `megaman stats` - Exibe estatísticas detalhadas
- `megaman reset` - Reseta as estatísticas
- `megaman shoot` - Força um tiro manual
- `megaman move` - Força um movimento manual

### Comandos de Ajuda

- `help` - Lista todos os comandos disponíveis
- `megaman` - Mostra ajuda específica do Mega Man

## ⚙️ Configurações

### Timing Aleatório

- **Tiros**: Entre 6-20 segundos (imprevisível)
- **Movimento**: Entre 3-8 segundos
- **Duração do tiro**: 1.5 segundos

### Sprites Utilizados

- `megaman-idle.gif` - Movimento normal
- `m2.gif` - Atirando

## 🎨 Recursos Visuais

### Animações CSS

- Efeito de entrada com rotação
- Efeito de saída suave
- Brilho quando ativo
- Pulso durante o tiro
- Rastro de movimento (opcional)

### Responsividade

- **Desktop**: 64x64px
- **Tablet**: 48x48px
- **Mobile**: 40x40px

## 🔧 Funcionalidades Técnicas

### Sistema de Pausa Inteligente

- Pausa automática quando muda de página
- Pausa quando a aba perde foco
- Resume automático quando volta

### Detecção de Bordas

- Movimento limitado às bordas da tela
- Ajuste automático para diferentes resoluções
- Margem de segurança de 50px

### Integração com Áudio

- Sons de ativação/desativação
- Som de tiro (se sistema de áudio disponível)
- Compatível com o sistema de áudio existente

## 📊 Sistema de Estatísticas

### Métricas Coletadas

- Total de tiros disparados
- Total de movimentos realizados
- Tempo total ativo
- Média de tiros por minuto

### Comandos de Estatísticas

```bash
megaman stats    # Ver estatísticas
megaman reset    # Resetar contadores
megaman status   # Status completo
```

## 🎯 Estados do Sistema

### Estados Principais

- **Inativo**: Mega Man não aparece na tela
- **Ativo**: Mega Man visível e funcionando
- **Pausado**: Ativo mas temporariamente parado
- **Movendo**: Em movimento para nova posição
- **Atirando**: Executando animação de tiro

### Transições de Estado

```
Inativo → [megaman on] → Ativo
Ativo → [megaman off] → Inativo
Ativo → [mudança de página] → Pausado
Pausado → [volta à página] → Ativo
```

## 🛠️ Otimizações de Performance

### Throttling de Eventos

- Resize da janela: 250ms
- Mudança de visibilidade: 100ms
- FPS limitado a 60fps

### Gerenciamento de Memória

- Limpeza automática de timers
- Remoção de event listeners
- Garbage collection de elementos órfãos

## 🎮 Modo Debug

### Informações Disponíveis

- Posição atual (X, Y)
- Estado de movimento
- Estado de tiro
- Sprite atual
- Página atual
- Limites da tela

### Como Acessar

```bash
megaman status  # Informações básicas
megaman stats   # Estatísticas detalhadas
```

## 🔄 Integração com o Sistema Existente

### Compatibilidade

- ✅ Sistema de áudio existente
- ✅ Sistema de navegação de páginas
- ✅ Terminal interativo
- ✅ Tema 8-bit do portfólio
- ✅ Responsividade mobile

### Z-Index

- Mega Man: 800 (acima do conteúdo, abaixo dos menus)
- Não interfere com a navegação

## 🚀 Exemplos de Uso

### Ativação Básica

```bash
# No terminal da página
megaman on
# 🤖 Mega Man ativado! Ele começará a se mover e atirar aleatoriamente.
```

### Monitoramento

```bash
megaman stats
# 📊 Estatísticas do Mega Man:
# Tiros disparados: 15
# Movimentos realizados: 23
# Tempo ativo: 180s
# Média de tiros/min: 5
```

### Controle Manual

```bash
megaman shoot  # Força um tiro
megaman move   # Força um movimento
```

## 🎨 Personalização

### Modificar Sprites

Edite o arquivo `megaman-controller.js`:

```javascript
this.sprites = {
  idle: "assets/sprites/seu-sprite-idle.gif",
  shooting: "assets/sprites/seu-sprite-tiro.gif",
};
```

### Ajustar Timing

```javascript
this.shootInterval = { min: 4000, max: 15000 }; // 4-15 segundos
this.moveInterval = { min: 2000, max: 6000 }; // 2-6 segundos
```

### Modificar Velocidade

```javascript
this.movementSpeed = 3; // Pixels por frame
```

## 🐛 Solução de Problemas

### Mega Man não aparece

1. Verifique se digitou `megaman on` corretamente
2. Abra o console (F12) para ver erros
3. Verifique se os sprites existem na pasta `assets/sprites/`

### Movimento muito rápido/lento

- Ajuste `movementSpeed` no código
- Verifique se não há conflitos de CSS

### Não funciona no mobile

- Sistema é responsivo e deve funcionar
- Verifique se o terminal está acessível no mobile

## 📝 Notas Técnicas

### Arquivos Modificados

- `megaman-controller.js` - Controlador principal (novo)
- `scripts.js` - Comandos do terminal (modificado)
- `style.css` - Estilos e animações (modificado)
- `index.html` - Inclusão do script (modificado)

### Dependências

- Nenhuma dependência externa
- Usa apenas APIs nativas do browser
- Compatível com ES6+

---

**Desenvolvido para o Portfólio 8-bit de Carlos Augusto Diniz Filho**

_Sistema implementado com foco em performance, usabilidade e diversão! 🎮_
