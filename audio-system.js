// Sistema de áudio com controle independente para música de fundo
class AudioSystem {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.isMuted = false;
        this.volume = 0.7;
        this.audioContext = null;
        this.initialized = false;
        this.backgroundMusicEnabled = true;
        this.audioEnabled = false;
    }

    // Inicialização do sistema
    async init() {
        try {
            if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            await this.loadSounds();
            this.initialized = true;
            console.log('🎵 Sistema de áudio inicializado');
            return true;
        } catch (error) {
            console.error('⚠️ Erro ao inicializar áudio:', error);
            return false;
        }
    }

    // Carregamento dos sons
    async loadSounds() {
        const soundFiles = {
            bgMusic: './assets/audio/bg_music.mp3',
            menuSelect: './assets/audio/menu_select.mp3',
            menuHover: './assets/audio/hover_bleep.mp3',
            teleport: './assets/audio/teleport.mp3',
            achievement: './assets/audio/achievement.mp3',
            click: './assets/audio/click.mp3'
        };

        for (const [key, path] of Object.entries(soundFiles)) {
            try {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Arquivo não encontrado: ${path}`);
                
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                
                this.sounds[key] = {
                    buffer: audioBuffer,
                    source: null,
                    loop: key === 'bgMusic',
                    play: () => {
                        if (this.isMuted || !this.audioEnabled) return;
                        if (key === 'bgMusic' && !this.backgroundMusicEnabled) return;
                        
                        this._stopSound(key);
                        
                        const source = this.audioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.loop = key === 'bgMusic';
                        
                        const gainNode = this.audioContext.createGain();
                        gainNode.gain.value = this.volume;
                        
                        source.connect(gainNode);
                        gainNode.connect(this.audioContext.destination);
                        source.start(0);
                        
                        this.sounds[key].source = source;
                        
                        if (key === 'bgMusic') {
                            this.backgroundMusic = this.sounds[key];
                        }
                    },
                    stop: () => this._stopSound(key)
                };
            } catch (error) {
                console.warn(`⚠️ Erro ao carregar ${key}:`, error);
                this.sounds[key] = this._createFallbackSound(key);
            }
        }
    }

    // Controle da música de fundo
    toggleBackgroundMusic() {
        this.backgroundMusicEnabled = !this.backgroundMusicEnabled;
        
        if (!this.backgroundMusicEnabled) {
            this.stopBackgroundMusic();
        } else if (this.initialized && !this.isMuted && this.audioEnabled) {
            this.startBackgroundMusic();
        }
        
        return this.backgroundMusicEnabled;
    }

    // Métodos principais
    play(soundName) {
        if (!this.initialized || this.isMuted || !this.audioEnabled) return;
        if (soundName === 'bgMusic' && !this.backgroundMusicEnabled) return;

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => this._playSound(soundName));
        } else {
            this._playSound(soundName);
        }
    }

    startBackgroundMusic() {
        if (this.backgroundMusicEnabled && !this.isMuted && this.initialized && this.audioEnabled) {
            this.play('bgMusic');
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic = null;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopBackgroundMusic();
        } else if (this.initialized && this.audioEnabled && this.backgroundMusicEnabled) {
            this.startBackgroundMusic();
        }
        
        return this.isMuted;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    enableAudio() {
        this.audioEnabled = true;
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Métodos internos
    _playSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound) sound.play();
    }

    _stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound && sound.source) {
            sound.source.stop();
            sound.source = null;
        }
    }

    _createFallbackSound(type) {
        const tones = {
            menuSelect: { freq: 800, duration: 0.1 },
            menuHover: { freq: 600, duration: 0.05 },
            teleport: { freq: [400, 1200], duration: 0.3 },
            achievement: { freq: [1200, 800, 1200], duration: 0.5 },
            click: { freq: 1000, duration: 0.05 },
            bgMusic: { freq: 440, duration: 1.5, loop: true }
        };
        
        const config = tones[type] || tones.click;
        
        return {
            play: () => {
                if (!this.isMuted && this.audioContext && this.audioEnabled) {
                    if (type === 'bgMusic' && !this.backgroundMusicEnabled) return;
                    this._playSynthesizedTone(config.freq, config.duration, config.loop);
                }
            },
            stop: () => {}
        };
    }

    _playSynthesizedTone(frequency, duration, loop) {
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            if (Array.isArray(frequency)) {
                frequency.forEach((freq, i) => {
                    oscillator.frequency.setValueAtTime(
                        freq, 
                        this.audioContext.currentTime + (i * duration/frequency.length)
                    );
                });
            } else {
                oscillator.frequency.value = frequency;
            }

            oscillator.type = 'square';
            gainNode.gain.value = this.volume * (loop ? 0.05 : 0.1);
            oscillator.loop = loop;

            oscillator.start();
            if (!loop) {
                oscillator.stop(this.audioContext.currentTime + duration);
            }

            if (loop) {
                this.backgroundMusic = { stop: () => oscillator.stop() };
            }
        } catch (error) {
            console.warn('⚠️ Erro no som sintetizado:', error);
        }
    }
}

// Inicialização global
window.audioSystem = new AudioSystem();

// Ativação por interação do usuário
document.addEventListener('DOMContentLoaded', () => {
    const enableAudio = () => {
        window.audioSystem.enableAudio();
        window.audioSystem.init().then(() => {
            setTimeout(() => window.audioSystem.startBackgroundMusic(), 3000);
        });
        
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
});

// Adicione no final do arquivo audio-system.js, ANTES das exportações

// Patch para corrigir a duração da música
const originalPlay = AudioSystem.prototype.play;
AudioSystem.prototype.play = function(soundName) {
    if (soundName === 'bgMusic' && this.backgroundMusic) {
        // Calcula o tempo restante da música
        const currentTime = this.audioContext.currentTime;
        const elapsed = currentTime - this.musicStartTime;
        const remaining = this.backgroundMusic.duration - elapsed;
        
        // Se faltar menos de 10 segundos, reinicia
        if (remaining < 10) {
            this._stopSound('bgMusic');
            this._playSound('bgMusic');
            return;
        }
    }
    originalPlay.call(this, soundName);
};

// Monitora o tempo de início
const originalPlaySound = AudioSystem.prototype._playSound;
AudioSystem.prototype._playSound = function(soundName) {
    if (soundName === 'bgMusic') {
        this.musicStartTime = this.audioContext.currentTime;
    }
    originalPlaySound.call(this, soundName);
};