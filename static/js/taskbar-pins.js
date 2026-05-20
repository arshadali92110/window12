// taskbar-pins.js – pinning apps to taskbar, persistence

let pinnedApps = [];

async function loadPinnedApps() {
    try {
        const s = await api.get('/settings/');
        if (s.pinned_apps) {
            pinnedApps = JSON.parse(s.pinned_apps);
        } else {
            pinnedApps = ['explorer', 'browser', 'settings'];
        }
    } catch (e) {
        pinnedApps = ['explorer', 'browser', 'settings'];
    }
    refreshPinnedTaskbarIcons();
}

function savePinnedApps() {
    queueSettingsUpdate({ pinned_apps: JSON.stringify(pinnedApps) });
}

function refreshPinnedTaskbarIcons() {
    const container = document.getElementById('pinned-apps');
    if (!container) return;
    container.innerHTML = '';

    pinnedApps.forEach(app => {
        const def = startMenuApps.find(a => a.app === app);
        if (!def) return;

        const btn = document.createElement('button');
        btn.className = 'taskbar-btn';
        btn.title = def.name;
        btn.textContent = def.icon;
        btn.addEventListener('click', () => openApp(app));

        // Right-click to unpin
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`Unpin "${def.name}" from taskbar?`)) {
                pinnedApps = pinnedApps.filter(a => a !== app);
                savePinnedApps();
                refreshPinnedTaskbarIcons();
            }
        });

        container.appendChild(btn);
    });
}

function pinApp(appName) {
    if (!pinnedApps.includes(appName)) {
        pinnedApps.push(appName);
        savePinnedApps();
        refreshPinnedTaskbarIcons();
    }
}

function unpinApp(appName) {
    pinnedApps = pinnedApps.filter(a => a !== appName);
    savePinnedApps();
    refreshPinnedTaskbarIcons();
}