// Variáveis globais
let speedrunTimer = null;
let speedrunStartTime = null;
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
    initializeMenu();
    initializeMobileMenus();
    initializeTerminal();
    initializeEasterEggs();
    initializeSpeedrun();
    initializeAudioControls();
});

// Inicialização dos menus móveis
function initializeMobileMenus() {
    initializeMobileMenuShortcut();
    initializeMobileMenuItems();
}

// Atalho de menu móvel (3 pontos)
function initializeMobileMenuShortcut() {
    const shortcut = document.getElementById('mobile-shortcut');
    const overlay = document.getElementById('mobile-overlay');
    const closeButton = document.getElementById('close-menu');
    
    if (!shortcut || !overlay || !closeButton) return;
    
    // Função para abrir o menu
    function openMenu() {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        
        if (window.audioSystem) {
            window.audioSystem.play('menuSelect');
        }
    }
    
    // Função para fechar o menu
    function closeMenu() {
        overlay.classList.remove('show');
        document.body.style.overflow = ''; // Restaurar scroll
        
        if (window.audioSystem) {
            window.audioSystem.play('click');
        }
    }
    
    // Event listeners
    shortcut.addEventListener('click', openMenu);
    shortcut.addEventListener('touchstart', (e) => {
        e.preventDefault();
        openMenu();
    });
    
    closeButton.addEventListener('click', closeMenu);
    closeButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        closeMenu();
    });
    
    // Fechar ao clicar fora do menu
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeMenu();
        }
    });
    
    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('show')) {
            closeMenu();
        }
    });
}

// Inicializar eventos dos itens dos menus móveis
function initializeMobileMenuItems() {
    // Itens do menu
    const menuItems = document.querySelectorAll('.mobile-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('touchstart', () => {
            if (window.audioSystem) {
                window.audioSystem.play('menuHover');
            }
        });
        
        item.addEventListener('click', () => {
            if (window.audioSystem) {
                window.audioSystem.play('menuSelect');
            }
            const page = item.dataset.page;
            if (page) {
                navigateToPage(page);
                // Fechar menu após navegação
                const overlay = document.getElementById('mobile-overlay');
                if (overlay) {
                    overlay.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Links sociais móveis
    const socialItems = document.querySelectorAll('.mobile-social-item');
    socialItems.forEach(item => {
        item.addEventListener('touchstart', () => {
            if (window.audioSystem) {
                window.audioSystem.play('menuHover');
            }
        });
        
        item.addEventListener('click', () => {
            if (window.audioSystem) {
                window.audioSystem.play('click');
            }
        });
    });
}

// Controles de áudio
function initializeAudioControls() {
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (window.audioSystem) {
                window.audioSystem.toggleMute();
            }
        });
    }
}

// Tela de loading
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simular carregamento
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Iniciar música de fundo (simulado)
            if (!isMuted) {
                console.log('🎵 Música de fundo iniciada');
            }
        }, 500);
    }, 3000);
}

// Sistema de menu
function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (window.audioSystem) {
                window.audioSystem.play('menuHover');
            }
        });
        
        item.addEventListener('click', () => {
            if (window.audioSystem) {
                window.audioSystem.play('menuSelect');
            }
            const page = item.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        });
    });
    
    // Links sociais
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (window.audioSystem) {
                window.audioSystem.play('menuHover');
            }
        });
        
        link.addEventListener('click', () => {
            if (window.audioSystem) {
                window.audioSystem.play('click');
            }
        });
    });
}

// Navegação entre páginas
function navigateToPage(pageName) {
    // Ocultar página atual
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        currentPage.classList.remove('active');
    }
    
    // Animação do Megaman
    triggerMegamanTransition();
    
    // Mostrar nova página após a transição
    setTimeout(() => {
        let targetPage = document.getElementById(pageName);
        
        // Se a página não existe, criar dinamicamente
        if (!targetPage) {
            targetPage = createPage(pageName);
        }
        
        targetPage.classList.add('active');
        if (window.audioSystem) {
            window.audioSystem.play('teleport');
        }
    }, 1000);
}

// Criar páginas dinamicamente
function createPage(pageName) {
    const mainContent = document.getElementById('main-content');
    const page = document.createElement('section');
    page.id = pageName;
    page.className = 'page';
    
    switch(pageName) {
        case 'sobre':
            page.innerHTML = createSobrePage();
            break;
        case 'curriculo':
            page.innerHTML = createCurriculoPage();
            break;
        case 'projetos':
            page.innerHTML = createProjetosPage();
            break;
        case 'skills':
            page.innerHTML = createSkillsPage();
            break;
        case 'blog':
            page.innerHTML = createBlogPage();
            break;
        case 'contato':
            page.innerHTML = createContatoPage();
            break;
        default:
            page.innerHTML = '<h1>PÁGINA EM CONSTRUÇÃO</h1><p>Esta página está sendo desenvolvida...</p>';
    }
    
    mainContent.appendChild(page);
    return page;
}

// Conteúdo das páginas
function createSobrePage() {
    return `
        <div class="page-content">
            <h1>SOBRE MIM</h1>
            <div class="about-section">
                <div class="about-avatar">
                    <div class="avatar-large"></div>
                </div>
                <div class="about-text">
                    <p>Desenvolvedor, programador e Técnico computacional autodidata com um olhar aguçado para computação e Redes.</p>
                    <p>Inovador e com grande conhecimento de técnicas voltadas a uma ótima experiência do usuário e público.</p>
                    <p>Meu principal objetivo é agregar com todo meu conhecimento e experiência que possuo na área de computação virtual.</p>
                    <p>Sou responsável, criativo, dinâmico e estratégico e estou à disposição para entrevistas e comprovações.</p>
                </div>
            </div>
            <div class="stats-section">
                <div class="stat-item">
                    <div class="stat-value">5+</div>
                    <div class="stat-label">ANOS DE EXPERIÊNCIA</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">50+</div>
                    <div class="stat-label">CERTIFICADOS</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">100+</div>
                    <div class="stat-label">PROJETOS</div>
                </div>
            </div>
        </div>
    `;
}

function createCurriculoPage() {
    return `
        <div class="page-content">
            <h1>CURRÍCULO</h1>
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

function createProjetosPage() {
    return `
        <div class="page-content">
            <h1>PROJETOS</h1>
            <div class="projects-grid">
                <div class="project-card">
                    <div class="project-icon">🌐</div>
                    <h3>PORTFÓLIO 8-BIT</h3>
                    <p>Portfólio interativo com tema retro gamer, desenvolvido com HTML5, CSS3 e JavaScript vanilla.</p>
                    <div class="project-tech">HTML5 • CSS3 • JavaScript</div>
                </div>
                <div class="project-card">
                    <div class="project-icon">🤖</div>
                    <h3>SISTEMA ARDUINO</h3>
                    <p>Projetos de automação residencial e robótica educacional usando Arduino e sensores.</p>
                    <div class="project-tech">Arduino • C++ • IoT</div>
                </div>
                <div class="project-card">
                    <div class="project-icon">🔧</div>
                    <h3>SISTEMA DE BACKUP</h3>
                    <p>Solução automatizada para backup de dados corporativos com agendamento inteligente.</p>
                    <div class="project-tech">Python • Linux • Shell</div>
                </div>
                <div class="project-card">
                    <div class="project-icon">🌐</div>
                    <h3>CONFIGURAÇÃO DE REDES</h3>
                    <p>Implementação de redes corporativas com foco em segurança e performance.</p>
                    <div class="project-tech">Cisco • Linux • Windows Server</div>
                </div>
            </div>
        </div>
    `;
}

function createSkillsPage() {
    return `
        <div class="page-content">
            <h1>HABILIDADES</h1>
            <div class="skills-section">
                <div class="skill-category">
                    <h2>LINGUAGENS DE PROGRAMAÇÃO</h2>
                    <div class="skill-bars">
                        <div class="skill-bar">
                            <div class="skill-name">JavaScript</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 90%"></div>
                            </div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-name">HTML5/CSS3</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 95%"></div>
                            </div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-name">Python</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 80%"></div>
                            </div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-name">Java</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 75%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h2>FRAMEWORKS & TECNOLOGIAS</h2>
                    <div class="skill-bars">
                        <div class="skill-bar">
                            <div class="skill-name">React</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-name">Node.js</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 80%"></div>
                            </div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-name">TypeScript</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 75%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h2>SISTEMAS & REDES</h2>
                    <div class="skill-bars">
                        <div class="skill-bar">
                            <div class="skill-name">Linux</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 90%"></div>
                            </div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-name">Windows Server</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-name">Redes TCP/IP</div>
                            <div class="skill-progress">
                                <div class="skill-fill" style="width: 88%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createBlogPage() {
    return `
        <div class="page-content">
            <h1>BLOG TÉCNICO</h1>
            <div class="blog-terminal">
                <div class="terminal-header">
                    <span class="terminal-title">BLOG_TERMINAL.EXE</span>
                </div>
                <div class="terminal-body">
                    <div class="blog-post">
                        <div class="post-date">[2024-01-15]</div>
                        <h3>Implementando Portfólio 8-bit com Vanilla JS</h3>
                        <p>Neste post, vou compartilhar como desenvolvi este portfólio retro usando apenas HTML, CSS e JavaScript vanilla...</p>
                        <div class="post-tags">#JavaScript #CSS #8bit #Portfolio</div>
                    </div>
                    
                    <div class="blog-post">
                        <div class="post-date">[2024-01-10]</div>
                        <h3>Automação com Arduino: Projetos Práticos</h3>
                        <p>Explorando projetos de automação residencial usando Arduino, sensores e programação em C++...</p>
                        <div class="post-tags">#Arduino #IoT #Automação #C++</div>
                    </div>
                    
                    <div class="blog-post">
                        <div class="post-date">[2024-01-05]</div>
                        <h3>Configuração de Redes Linux: Guia Completo</h3>
                        <p>Um guia prático para configuração de redes em sistemas Linux, desde o básico até configurações avançadas...</p>
                        <div class="post-tags">#Linux #Redes #Administração #TCP/IP</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createContatoPage() {
    return `
        <div class="page-content">
            <h1>CONTATO</h1>
            <div class="contact-section">
                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-icon">📍</div>
                        <div class="contact-text">
                            <strong>ENDEREÇO</strong><br>
                            Data: 37 Promorar, Val-de-Cans nº 231<br>
                            Belém, Pará - Brasil
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">📧</div>
                        <div class="contact-text">
                            <strong>E-MAIL</strong><br>
                            carlosaugustodiniz@outlook.com
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">💼</div>
                        <div class="contact-text">
                            <strong>LINKEDIN</strong><br>
                            www.linkedin.com/in/smeshy/
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">🌐</div>
                        <div class="contact-text">
                            <strong>PORTFÓLIO</strong><br>
                            https://carlosfilho.vercel.app
                        </div>
                    </div>
                </div>
                
                <div class="contact-form">
                    <h2>ENVIAR MENSAGEM</h2>
                    <form id="contact-form">
                        <div class="form-group">
                            <label>NOME:</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>E-MAIL:</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>MENSAGEM:</label>
                            <textarea name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit">ENVIAR MENSAGEM</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// Animação do Megaman
function triggerMegamanTransition() {
    const megamanTransition = document.getElementById('megaman-transition');
    megamanTransition.classList.add('active');
    
    setTimeout(() => {
        megamanTransition.classList.remove('active');
    }, 2000);
}

// Terminal interativo
function initializeTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    const commands = {
        'help': 'Comandos disponíveis: help, about, skills, projects, contact, clear, konami',
        'about': 'Carlos Augusto Diniz Filho - Engenheiro da Computação especializado em desenvolvimento web e redes.',
        'skills': 'JavaScript, HTML5, CSS3, Python, Java, React, Node.js, Linux, Windows Server, Arduino',
        'projects': 'Portfólio 8-bit, Sistemas Arduino, Automação, Configuração de Redes',
        'contact': 'E-mail: carlosaugustodiniz@outlook.com | LinkedIn: linkedin.com/in/smeshy/',
        'clear': '',
        'konami': '↑↑↓↓←→←→BA - Código secreto para easter egg!',
        'view projects': () => navigateToPage('projetos')
    };
    
    terminalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.toLowerCase().trim();
            const output = document.createElement('div');
            output.innerHTML = `<span style="color: var(--color-secondary);">C:\\PORTFOLIO></span> ${this.value}`;
            
            if (commands[command]) {
                if (typeof commands[command] === 'function') {
                    commands[command]();
                    output.innerHTML += '<br>Executando comando...';
                } else if (command === 'clear') {
                    terminalOutput.innerHTML = '';
                    this.value = '';
                    return;
                } else {
                    output.innerHTML += '<br>' + commands[command];
                }
            } else {
                output.innerHTML += '<br>Comando não reconhecido. Digite "help" para ver os comandos disponíveis.';
            }
            
            terminalOutput.appendChild(output);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            this.value = '';
            
            if (window.audioSystem) {
                window.audioSystem.play('click');
            }
        }
    });
}

// Easter Eggs
function initializeEasterEggs() {
    // Código Konami
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length && 
            konamiCode.every((code, index) => code === konamiSequence[index])) {
            activateKonamiEasterEgg();
            konamiCode = [];
        }
    });
    
    // Clique no avatar para glitch
    const heroAvatar = document.getElementById('hero-avatar');
    if (heroAvatar) {
        heroAvatar.addEventListener('click', function() {
            this.classList.add('glitch');
            if (window.audioSystem) {
                window.audioSystem.play('achievement');
            }
            
            setTimeout(() => {
                this.classList.remove('glitch');
            }, 2000);
        });
    }
}

// Ativar easter egg do Konami
function activateKonamiEasterEgg() {
    const konamiGame = document.getElementById('konami-game');
    konamiGame.classList.remove('hidden');
    if (window.audioSystem) {
        window.audioSystem.play('achievement');
    }
    
    // Simular pontuação
    let score = 0;
    const scoreElement = document.getElementById('game-score');
    const interval = setInterval(() => {
        score += Math.floor(Math.random() * 100);
        scoreElement.textContent = score;
    }, 500);
    
    setTimeout(() => {
        clearInterval(interval);
    }, 5000);
}

// Fechar easter egg
function closeKonamiGame() {
    const konamiGame = document.getElementById('konami-game');
    konamiGame.classList.add('hidden');
    if (window.audioSystem) {
        window.audioSystem.play('click');
    }
}

// Sistema de Speedrun
function initializeSpeedrun() {
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && !speedrunTimer) {
            startSpeedrun();
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift' && speedrunTimer) {
            stopSpeedrun();
        }
    });
}

function startSpeedrun() {
    const speedrunTimerElement = document.getElementById('speedrun-timer');
    speedrunTimerElement.classList.remove('hidden');
    
    speedrunStartTime = Date.now();
    speedrunTimer = setInterval(updateSpeedrunTimer, 100);
    
    // Ativar modo acelerado
    document.body.classList.add('speed-mode');
    
    if (window.audioSystem) {
        window.audioSystem.play('achievement');
    }
}

function stopSpeedrun() {
    if (speedrunTimer) {
        clearInterval(speedrunTimer);
        speedrunTimer = null;
        
        const speedrunTimerElement = document.getElementById('speedrun-timer');
        speedrunTimerElement.classList.add('hidden');
        
        // Desativar modo acelerado
        document.body.classList.remove('speed-mode');
        
        if (window.audioSystem) {
            window.audioSystem.play('click');
        }
    }
}

function updateSpeedrunTimer() {
    if (speedrunStartTime) {
        const elapsed = Date.now() - speedrunStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timerValue = document.querySelector('.timer-value');
        timerValue.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Função global para fechar o easter egg (chamada pelo HTML)
window.closeKonamiGame = closeKonamiGame;

