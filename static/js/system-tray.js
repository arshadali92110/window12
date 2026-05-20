// system-tray.js – volume & network interactive icons

let isMuted = false;

function initSystemTray() {
    const volumeIcon = document.querySelector('.tray-icon[title="Volume"]');
    if (volumeIcon) {
        volumeIcon.addEventListener('click', () => {
            isMuted = !isMuted;
            volumeIcon.textContent = isMuted ? '🔇' : '🔊';
            // Save mute state
            api.put('/settings/', { volume_muted: isMuted }).catch(() => { });
        });
    }
    // Network – just show a tooltip
    const networkIcon = document.querySelector('.tray-icon[title="Network"]');
    if (networkIcon) {
        networkIcon.title = 'Network: Connected';
        networkIcon.addEventListener('click', () => {
            alert('Network status: Connected');
        });
    }
    // Load mute state
    loadMuteState();
}

async function loadMuteState() {
    try {
        const s = await api.get('/settings/');
        if (s.volume_muted !== undefined) {
            isMuted = s.volume_muted === true || s.volume_muted === 'True';
            const volumeIcon = document.querySelector('.tray-icon[title="Volume"]');
            if (volumeIcon) volumeIcon.textContent = isMuted ? '🔇' : '🔊';
        }
    } catch (e) { }
}