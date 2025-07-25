// Sistema de áudio avançado para o portfólio 8-bit
class AudioSystem {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.isMuted = false;
        this.volume = 0.7;
        this.audioContext = null;
        this.initialized = false;
    }

    // Inicializar sistema de áudio
    async init() {
        try {
            // Verificar suporte do navegador
            if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Carregar todos os sons
            await this.loadSounds();
            this.initialized = true;
            console.log('🎵 Sistema de áudio inicializado');
        } catch (error) {
            console.warn('⚠️ Erro ao inicializar áudio:', error);
        }
    }

    // Carregar sons
    async loadSounds() {
        const soundFiles = {
            bgMusic: '/public/assets/audio/bg_music.wav',
            menuSelect: '/public/assets/audio/menu_select.wav',
            menuHover: '/public/assets/audio/hover_bleep.wav',
            teleport: '/public/assets/audio/teleport.wav',
            achievement: '/public/assets/audio/menu_select.wav', // Reutilizar
            click: '/public/assets/audio/hover_bleep.wav' // Reutilizar
        };

        for (const [key, path] of Object.entries(soundFiles)) {
            try {
                this.sounds[key] = await this.createHowlSound(path);
            } catch (error) {
                console.warn(`⚠️ Erro ao carregar som ${key}:`, error);
                // Fallback para Web Audio API
                this.sounds[key] = this.createWebAudioSound(key);
            }
        }
    }

    // Criar som usando Howler.js (simulado)
    createHowlSound(src) {
        return new Promise((resolve) => {
            // Simular Howler.js
            const sound = {
                src: src,
                volume: this.volume,
                loop: src.includes('bg_music'),
                play: () => {
                    if (!this.isMuted && this.audioContext) {
                        this.playWebAudioTone(src);
                    }
                },
                stop: () => {
                    // Implementar stop se necessário
                },
                fade: (from, to, duration) => {
                    // Implementar fade se necessário
                }
            };
            resolve(sound);
        });
    }

    // Fallback para Web Audio API
    createWebAudioSound(type) {
        const frequencies = {
            menuSelect: 800,
            menuHover: 600,
            teleport: 400,
            achievement: 1200,
            click: 1000,
            bgMusic: 440
        };

        return {
            play: () => {
                if (!this.isMuted && this.audioContext) {
                    this.playWebAudioTone(frequencies[type] || 440, type === 'bgMusic' ? 1.0 : 0.2);
                }
            },
            stop: () => {},
            fade: () => {}
        };
    }

    // Tocar tom usando Web Audio API
    playWebAudioTone(frequency, duration = 0.1) {
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Configurar frequência baseada no src ou usar valor direto
            if (typeof frequency === 'string') {
                if (frequency.includes('menu_select')) frequency = 800;
                else if (frequency.includes('hover_bleep')) frequency = 600;
                else if (frequency.includes('teleport')) frequency = 400;
                else if (frequency.includes('bg_music')) frequency = 440;
                else frequency = 800;
            }

            oscillator.frequency.value = frequency;
            oscillator.type = 'square'; // Som 8-bit

            // Configurar volume
            gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            // Tocar som
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('⚠️ Erro ao tocar som:', error);
        }
    }

    // Tocar som específico
    play(soundName) {
        if (!this.initialized || this.isMuted) return;

        const sound = this.sounds[soundName];
        if (sound) {
            sound.play();
        } else {
            console.warn(`⚠️ Som não encontrado: ${soundName}`);
        }
    }

    // Iniciar música de fundo
    startBackgroundMusic() {
        if (!this.initialized || this.isMuted) return;

        const bgMusic = this.sounds.bgMusic;
        if (bgMusic) {
            bgMusic.play();
            this.backgroundMusic = bgMusic;
            console.log('🎵 Música de fundo iniciada');
        }
    }

    // Parar música de fundo
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic = null;
            console.log('🎵 Música de fundo parada');
        }
    }

    // Alternar mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopBackgroundMusic();
        } else {
            this.startBackgroundMusic();
        }

        // Atualizar botão de mute
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
            muteBtn.textContent = this.isMuted ? '🔇' : '🔊';
        }

        console.log(`🔊 Áudio ${this.isMuted ? 'mutado' : 'ativado'}`);
        return this.isMuted;
    }

    // Definir volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Aplicar volume a todos os sons
        Object.values(this.sounds).forEach(sound => {
            if (sound.volume !== undefined) {
                sound.volume = this.volume;
            }
        });
    }

    // Fade in/out para transições
    fadeOut(duration = 1000) {
        if (this.backgroundMusic && this.backgroundMusic.fade) {
            this.backgroundMusic.fade(this.volume, 0, duration);
        }
    }

    fadeIn(duration = 1000) {
        if (this.backgroundMusic && this.backgroundMusic.fade) {
            this.backgroundMusic.fade(0, this.volume, duration);
        }
    }
}

// Instância global do sistema de áudio
window.audioSystem = new AudioSystem();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    // Aguardar interação do usuário para inicializar áudio (política do navegador)
    const initAudio = async () => {
        await window.audioSystem.init();
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
        
        // Iniciar música de fundo após 3 segundos (após loading screen)
        setTimeout(() => {
            window.audioSystem.startBackgroundMusic();
        }, 3000);
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
});

// Exportar para uso global
window.AudioSystem = AudioSystem;

