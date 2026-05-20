// taskbar-pins.js – pin/unpin apps to taskbar, persistent

let pinnedApps = []; // array of app names

async function loadPinnedApps() {
    try {
        const s = await api.get('/settings/');
        if (s.pinned_apps) {
            pinnedApps = JSON.parse(s.pinned_apps);
        }
    } catch (e) {
        pinnedApps = ['explorer', 'browser', 'settings']; // defaults
    }
    refreshPinnedTaskbarIcons();
}

function savePinnedApps() {
    api.put('/settings/', { pinned_apps: JSON.stringify(pinnedApps) }).catch(() => { });
}

// Show pinned icons in taskbar (left side or center, we'll use a dedicated container)
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
        btn.innerHTML = def.icon;
        btn.addEventListener('click', () => openApp(app));
        // right-click to unpin
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`Unpin ${def.name} from taskbar?`)) {
                pinnedApps = pinnedApps.filter(a => a !== app);
                savePinnedApps();
                refreshPinnedTaskbarIcons();
            }
        });
        container.appendChild(btn);
    });
}

// Pin an app (called from start menu context or when installing)
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