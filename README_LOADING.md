# Animação de Loading com Efeito Elétrico

## Descrição
Esta implementação adiciona uma animação de loading inspirada no efeito de energia elétrica, com linhas dinâmicas emanando do centro da tela e um brilho suave que não interfere na barra de progresso.

## Características
- **Efeito de energia elétrica**: Linhas dinâmicas que crescem e se movem organicamente
- **Brilho suave**: Efeito de brilho no centro que não ofusca a barra de progresso
- **Tempo configurável**: Possibilidade de ajustar a duração do loading
- **Não interfere em outras funções**: Mantém todas as funcionalidades existentes do projeto
- **Design original preservado**: Mantém o sprite do Mega Man e a barra de progresso

## Configuração

### Tempo de Loading
Para modificar o tempo de duração do loading, edite o arquivo `electric-lines.js` ou adicione no início do seu script:

```javascript
// Configurar tempo de loading (em milissegundos)
window.LOADING_CONFIG = {
  duration: 5000, // 5 segundos
  enableElectricLines: true
};
```

### Desabilitar Linhas Elétricas
Para desabilitar apenas as linhas elétricas mantendo o efeito de brilho:

```javascript
window.LOADING_CONFIG = {
  duration: 3000,
  enableElectricLines: false
};
```

## Arquivos Modificados
1. **style.css**: Adicionados estilos para o efeito de brilho suave
2. **scripts.js**: Modificada função `initializeLoadingScreen()` para aceitar duração configurável
3. **electric-lines.js**: Novo arquivo com a lógica das linhas elétricas
4. **index.html**: Adicionada referência ao script das linhas elétricas

## Efeitos Implementados

### 1. Brilho Suave Central
- Gradiente radial com opacidade baixa
- Animação de pulsação suave
- Não interfere na visibilidade da barra de progresso

### 2. Linhas Elétricas Dinâmicas
- 12 linhas principais emanando do centro
- Movimento orgânico com variações aleatórias
- Crescimento e regeneração contínua
- Efeito de brilho (glow) nas linhas

### 3. Fundo de Energia
- Gradiente horizontal simulando fluxo de energia
- Animação de escala e opacidade
- Cores em tons de ciano/azul neon

## Compatibilidade
- Mantém compatibilidade com todas as funcionalidades existentes
- Não interfere no sistema de áudio
- Não afeta as animações do Mega Man
- Responsivo para dispositivos móveis

## Personalização Avançada

### Cores
Para alterar as cores do efeito, modifique as variáveis CSS em `style.css`:

```css
/* Alterar cor das linhas elétricas */
rgba(0, 255, 255, 0.3) /* Ciano atual */
/* Para roxo: rgba(138, 43, 226, 0.3) */
/* Para verde: rgba(0, 255, 0, 0.3) */
```

### Intensidade do Efeito
No arquivo `electric-lines.js`, ajuste os parâmetros:

```javascript
const numLines = 12; // Número de linhas (padrão: 12)
line.opacity = 0.3 + Math.random() * 0.4; // Opacidade das linhas
line.thickness = 1 + Math.random() * 2; // Espessura das linhas
```

## Notas Técnicas
- Utiliza Canvas API para renderização das linhas
- RequestAnimationFrame para animações suaves
- Cleanup automático quando o loading termina
- Otimizado para performance em dispositivos móveis

