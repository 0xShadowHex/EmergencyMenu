function downloadZip() {
    const btn = document.querySelector('.download-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-text">DOWNLOADING...</span><span class="btn-icon">⏳</span>';
    
    try {
        const link = document.createElement('a');
        link.href = 'Emergencymenu.zip';
        link.download = 'Emergencymenu.zip';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('✓ Download started! Emergency menu activated.');
        triggerCelebration();
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }, 2000);
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('✗ Download failed. Check if Emergencymenu.zip exists.');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #FF0000;
        color: white;
        padding: 15px 30px;
        border: 3px solid #1A1A1A;
        border-radius: 5px;
        font-weight: bold;
        z-index: 1000;
        font-family: 'Courier New', monospace;
        box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.4);
        animation: notificationSlide 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'notificationSlide 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function triggerCelebration() {
    const colors = ['#FFD700', '#FF0000', '#0066FF', '#1A1A1A'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border: 2px solid #1A1A1A;
            pointer-events: none;
            z-index: 999;
            animation: confettiFall ${2 + Math.random() * 2}s ease-in forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4500);
    }
}

function initializeSiren() {
    const siren = document.querySelector('.siren');
    if (siren) {
        siren.addEventListener('click', () => {
            siren.style.animation = 'none';
            void siren.offsetWidth;
            siren.style.animation = 'sirenWobble 0.5s ease-out';
            playSirenSound();
        });
    }
}


function playSirenSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log('Audio not available');
    }
}


function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'd' && !isInputFocused()) {
            downloadZip();
        }
        if (e.key.toLowerCase() === 's' && !isInputFocused()) {
            const siren = document.querySelector('.siren');
            if (siren) siren.click();
        }
    });
}

function isInputFocused() {
    return document.activeElement.tagName === 'INPUT' || 
           document.activeElement.tagName === 'TEXTAREA';
}


function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes buttonPress {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes sirenWobble {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
        }
        
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes notificationSlide {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}


function initializeApp() {
    injectDynamicStyles();
    initializeSiren();
    initializeKeyboardShortcuts();
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('🚨 EmergencyMenu initialized! 🚨');
    console.log('Shortcuts: D = Download, S = Siren');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
