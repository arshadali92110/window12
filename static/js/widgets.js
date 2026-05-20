// widgets.js – dynamic widgets data

function initWidgets() {
    updateWeatherWidget();
    updateStocksWidget();
    updateCalendarWidget();
    // Refresh every 5 minutes
    setInterval(updateWeatherWidget, 300000);
    setInterval(updateStocksWidget, 300000);
}

function updateWeatherWidget() {
    const tempEl = document.querySelector('.widget-weather .weather-temp');
    const descEl = document.querySelector('.widget-weather .weather-desc');
    if (!tempEl) return;
    // Simulate real data
    const temps = [68, 72, 75, 70, 78, 65, 80];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const randTemp = temps[Math.floor(Math.random() * temps.length)];
    const randCond = conditions[Math.floor(Math.random() * conditions.length)];
    tempEl.textContent = randTemp + '°F';
    descEl.textContent = randCond + ' · New York';
    const iconEl = document.querySelector('.widget-weather .weather-icon');
    if (iconEl) {
        const icons = { 'Sunny': '☀️', 'Partly Cloudy': '⛅', 'Cloudy': '☁️', 'Light Rain': '🌧️', 'Clear': '🌙' };
        iconEl.textContent = icons[randCond] || '☀️';
    }
}

function updateStocksWidget() {
    const stockEl = document.querySelector('.widget-stocks .stock-val');
    if (!stockEl) return;
    const change = (Math.random() * 4 - 1).toFixed(2);
    const sign = change >= 0 ? '▲' : '▼';
    const color = change >= 0 ? '#34d399' : '#ef4444';
    stockEl.innerHTML = `<span style="color:${color}">${sign} S&P 500 ${change}%</span>`;
}

function updateCalendarWidget() {
    // Show today's date nicely
    const calEl = document.querySelector('.widget-calendar .cal-text');
    if (!calEl) return;
    const now = new Date();
    calEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}