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
