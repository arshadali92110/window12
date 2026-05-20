// desktop-icons.js – draggable desktop icons with position persistence

let iconPositions = {}; // loaded from settings
const iconSaveDelay = 800;
let iconSaveTimer = null;

function initDesktopIcons() {
    const container = document.getElementById('desktop-icons');
    if (!container) return;
    // Make icons absolutely positioned
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    const icons = container.querySelectorAll('.desktop-icon');
    icons.forEach((icon, index) => {
        icon.style.position = 'absolute';
        const app = icon.dataset.app;
        // Set initial position from saved or default
        const saved = iconPositions[app];
        if (saved) {
            icon.style.left = saved.x + 'px';
            icon.style.top = saved.y + 'px';
        } else {
            // default layout
            icon.style.left = (10 + index * 100) + 'px';
            icon.style.top = (10 + index * 90) + 'px';
        }
        makeIconDraggable(icon, app);
    });
}

function makeIconDraggable(icon, app) {
    let offsetX, offsetY;
    icon.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        // Prevent dragging on double-click
        if (e.detail > 1) return;
        e.preventDefault();
        const rect = icon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        const onMouseMove = (ev) => {
            const container = document.getElementById('desktop-icons');
            const containerRect = container.getBoundingClientRect();
            let newLeft = ev.clientX - containerRect.left - offsetX;
            let newTop = ev.clientY - containerRect.top - offsetY;
            // Clamp inside desktop
            newLeft = Math.max(0, Math.min(newLeft, containerRect.width - icon.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, containerRect.height - icon.offsetHeight));
            icon.style.left = newLeft + 'px';
            icon.style.top = newTop + 'px';
            // Debounced save
            clearTimeout(iconSaveTimer);
            iconSaveTimer = setTimeout(() => saveIconPositions(), iconSaveDelay);
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            saveIconPositions(); // immediate save
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    // Prevent drag when double-clicking
    icon.addEventListener('dragstart', (e) => e.preventDefault());
}

function saveIconPositions() {
    const icons = document.querySelectorAll('.desktop-icon');
    const positions = {};
    icons.forEach(icon => {
        const app = icon.dataset.app;
        positions[app] = {
            x: parseInt(icon.style.left) || 0,
            y: parseInt(icon.style.top) || 0
        };
    });
    iconPositions = positions;
    api.put('/settings/', { icon_positions: JSON.stringify(positions) }).catch(() => { });
}

// Load positions from settings (called from desktop.js after login)
async function loadIconPositions() {
    try {
        const s = await api.get('/settings/');
        if (s.icon_positions) {
            iconPositions = JSON.parse(s.icon_positions);
        }
    } catch (e) { }
    initDesktopIcons();
}