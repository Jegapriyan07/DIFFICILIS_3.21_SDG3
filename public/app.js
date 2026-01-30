// Application State
const API_BASE = 'http://localhost:3000/api';
let currentUser = null;
let currentLanguage = localStorage.getItem('language') || 'en';
let respiratoryData = [];
let maps = {};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        validateTokenAndLoadDashboard(token);
    } else {
        showPage('login-page');
    }

    // Setup event listeners
    setupLoginForm();
    setupLanguageToggles();
    setupLogoutButtons();

    // Apply saved language
    updateTranslations(currentLanguage);
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showLoadingScreen() {
    showPage('loading-page');

    // Animate progress bar
    const progressFill = document.querySelector('.progress-fill');
    progressFill.style.width = '0%';

    setTimeout(() => {
        progressFill.style.width = '100%';
    }, 100);
}

// Authentication
function setupLoginForm() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();

            // Store token and user data
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            currentLanguage = data.user.language;
            localStorage.setItem('language', currentLanguage);

            // Show loading screen
            showLoadingScreen();

            // After 3 seconds, show appropriate dashboard
            setTimeout(() => {
                loadDashboard(data.user.role);
            }, 3000);

            errorDiv.textContent = '';
        } catch (error) {
            errorDiv.textContent = t('login.error', currentLanguage);
        }
    });
}

async function validateTokenAndLoadDashboard(token) {
    try {
        const response = await fetch(`${API_BASE}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Invalid token');
        }

        const user = await response.json();
        currentUser = user;
        currentLanguage = user.language;

        loadDashboard(user.role);
    } catch (error) {
        localStorage.removeItem('token');
        showPage('login-page');
    }
}

function loadDashboard(role) {
    updateTranslations(currentLanguage);

    switch (role) {
        case 'health_officer':
            showPage('health-officer-dashboard');
            loadHealthOfficerDashboard();
            break;
        case 'urban_planner':
            showPage('urban-planner-dashboard');
            loadUrbanPlannerDashboard();
            break;
        case 'beneficiary':
            showPage('beneficiary-dashboard');
            loadBeneficiaryDashboard();
            break;
    }
}

// Language Toggle
function setupLanguageToggles() {
    const toggles = ['lang-toggle-login', 'lang-toggle-ho', 'lang-toggle-up', 'lang-toggle-ben'];

    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('click', () => {
                currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
                updateTranslations(currentLanguage);

                // Update user language preference
                if (currentUser) {
                    updateUserLanguage(currentLanguage);
                }

                // Reload dashboard content with new language
                if (currentUser) {
                    loadDashboard(currentUser.role);
                }
            });
        }
    });
}

async function updateUserLanguage(language) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_BASE}/user/language`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ language })
        });
    } catch (error) {
        console.error('Failed to update language preference:', error);
    }
}

// Logout
function setupLogoutButtons() {
    const logoutButtons = ['logout-ho', 'logout-up', 'logout-ben'];

    logoutButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                localStorage.removeItem('token');
                currentUser = null;
                respiratoryData = [];
                maps = {};
                showPage('login-page');
            });
        }
    });
}

// Fetch Respiratory Data
async function fetchRespiratoryData() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE}/respiratory-data`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        respiratoryData = result.data;
        return result;
    } catch (error) {
        console.error('Error fetching respiratory data:', error);
        return { data: [] };
    }
}

// Health Officer Dashboard
async function loadHealthOfficerDashboard() {
    const data = await fetchRespiratoryData();

    // Initialize map
    if (!maps.healthOfficer) {
        maps.healthOfficer = L.map('ho-map').setView([21.1458, 79.0882], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(maps.healthOfficer);
    }

    // Clear existing markers
    maps.healthOfficer.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) {
            maps.healthOfficer.removeLayer(layer);
        }
    });

    // Add zone markers
    respiratoryData.forEach(zone => {
        const marker = L.circleMarker([zone.location.lat, zone.location.lng], {
            radius: 15,
            fillColor: zone.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(maps.healthOfficer);

        marker.bindPopup(`
      <div class="popup-content">
        <h4>${zone.zone}</h4>
        <p><strong>AQI:</strong> ${zone.aqi}</p>
        <p><strong>${t('modal.severity', currentLanguage)}:</strong> ${zone.medicalClassification}</p>
        <p><strong>PM2.5:</strong> ${zone.pollutants.pm25} µg/m³</p>
        <p><strong>PM10:</strong> ${zone.pollutants.pm10} µg/m³</p>
        <p><strong>NO2:</strong> ${zone.pollutants.no2} µg/m³</p>
        <p style="margin-top: 8px; font-size: 0.9em;">${zone.healthImpact}</p>
      </div>
    `);
    });

    // Update severity summary
    updateSeveritySummary();

    // Update population stats
    updatePopulationStats();

    // Update medical measures
    updateMedicalMeasures();

    // Update timestamp
    document.getElementById('ho-update-time').textContent =
        `${t('common.updated', currentLanguage)}: ${new Date().toLocaleTimeString()}`;

    // Setup action buttons
    setupHealthOfficerActions();
}

function updateSeveritySummary() {
    const severityCounts = {
        good: 0,
        moderate: 0,
        high: 0,
        severe: 0
    };

    respiratoryData.forEach(zone => {
        severityCounts[zone.severity]++;
    });

    const highestSeverity = severityCounts.severe > 0 ? 'severe' :
        severityCounts.high > 0 ? 'high' :
            severityCounts.moderate > 0 ? 'moderate' : 'good';

    const affectedZones = severityCounts.high + severityCounts.severe;

    const mainDiv = document.getElementById('ho-severity-main');
    mainDiv.innerHTML = `
    <div class="severity-badge ${highestSeverity}">${highestSeverity.toUpperCase()}</div>
    <p>${affectedZones} ${t('ho.zones.affected', currentLanguage)}</p>
  `;

    const breakdownDiv = document.getElementById('ho-severity-breakdown');
    breakdownDiv.innerHTML = `
    <div class="severity-item">
      <span class="severity-dot" style="background: #00E676;"></span>
      <span>${t('legend.low', currentLanguage)}: ${severityCounts.good} zones</span>
    </div>
    <div class="severity-item">
      <span class="severity-dot" style="background: #FFD54F;"></span>
      <span>${t('legend.mild', currentLanguage)}: ${severityCounts.moderate} zones</span>
    </div>
    <div class="severity-item">
      <span class="severity-dot" style="background: #FF6B35;"></span>
      <span>${t('legend.high', currentLanguage)}: ${severityCounts.high} zones</span>
    </div>
    <div class="severity-item">
      <span class="severity-dot" style="background: #E53935;"></span>
      <span>${t('legend.severe', currentLanguage)}: ${severityCounts.severe} zones</span>
    </div>
  `;
}

function updatePopulationStats() {
    const highRiskZones = respiratoryData.filter(z => z.severity === 'high' || z.severity === 'severe');
    const estimatedAffected = highRiskZones.length * 45000; // Rough estimate

    const statsDiv = document.getElementById('ho-population-stats');
    statsDiv.innerHTML = `
    <div class="stat-item">
      <div class="stat-label">${t('ho.high.risk.zones', currentLanguage)}</div>
      <div class="stat-value">${highRiskZones.length}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">${t('ho.estimated.affected', currentLanguage)}</div>
      <div class="stat-value">~${(estimatedAffected / 1000).toFixed(0)}k ${t('ho.people', currentLanguage)}</div>
    </div>
    <div class="vulnerable-groups">
      <h4>${t('ho.vulnerable.groups', currentLanguage)}</h4>
      <ul>
        <li>${t('ho.children', currentLanguage)}: ~${(estimatedAffected * 0.19 / 1000).toFixed(0)}k</li>
        <li>${t('ho.elderly', currentLanguage)}: ~${(estimatedAffected * 0.14 / 1000).toFixed(0)}k</li>
        <li>${t('ho.asthma', currentLanguage)}: ~${(estimatedAffected * 0.05 / 1000).toFixed(0)}k</li>
        <li>${t('ho.copd', currentLanguage)}: ~${(estimatedAffected * 0.04 / 1000).toFixed(0)}k</li>
      </ul>
    </div>
  `;
}

function updateMedicalMeasures() {
    const hasSevere = respiratoryData.some(z => z.severity === 'severe');
    const hasHigh = respiratoryData.some(z => z.severity === 'high');

    const measuresDiv = document.getElementById('ho-medical-measures');

    if (hasSevere || hasHigh) {
        measuresDiv.innerHTML = `
      <div class="measures-section">
        <h4>${t('measures.immediate', currentLanguage)}</h4>
        <ul>
          <li>✓ ${t('measures.immediate.1', currentLanguage)}</li>
          <li>✓ ${t('measures.immediate.2', currentLanguage)}</li>
          <li>✓ ${t('measures.immediate.3', currentLanguage)}</li>
        </ul>
      </div>
      <div class="measures-section">
        <h4>${t('measures.short', currentLanguage)}</h4>
        <ul>
          <li>✓ ${t('measures.short.1', currentLanguage)}</li>
          <li>✓ ${t('measures.short.2', currentLanguage)}</li>
          <li>✓ ${t('measures.short.3', currentLanguage)}</li>
        </ul>
      </div>
      <div class="measures-section">
        <h4>${t('measures.medium', currentLanguage)}</h4>
        <ul>
          <li>✓ ${t('measures.medium.1', currentLanguage)}</li>
          <li>✓ ${t('measures.medium.2', currentLanguage)}</li>
          <li>✓ ${t('measures.medium.3', currentLanguage)}</li>
        </ul>
      </div>
    `;
    } else {
        measuresDiv.innerHTML = `
      <p style="padding: 20px; text-align: center; color: #00E676;">
        No immediate medical measures required. Continue routine monitoring.
      </p>
    `;
    }
}

function setupHealthOfficerActions() {
    document.getElementById('ho-generate-advisory').addEventListener('click', () => {
        alert('Advisory document generation feature - Would integrate with document generation API');
    });

    document.getElementById('ho-send-alert').addEventListener('click', async () => {
        const highRiskZones = respiratoryData.filter(z => z.severity === 'high' || z.severity === 'severe');

        if (highRiskZones.length === 0) {
            alert('No high-risk zones to alert about');
            return;
        }

        // Send alerts for all high-risk zones
        for (const zone of highRiskZones) {
            await sendAlert(zone.id, zone.severity);
        }

        alert(`Alerts sent to beneficiaries in ${highRiskZones.length} high-risk zones`);
    });
}

async function sendAlert(zoneId, severity) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`${API_BASE}/alerts/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ zoneId, severity, language: currentLanguage })
        });
    } catch (error) {
        console.error('Failed to send alert:', error);
    }
}

// Urban Planner Dashboard
async function loadUrbanPlannerDashboard() {
    const data = await fetchRespiratoryData();

    // Initialize map
    if (!maps.urbanPlanner) {
        maps.urbanPlanner = L.map('up-map').setView([21.1458, 79.0882], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(maps.urbanPlanner);
    }

    // Clear existing markers
    maps.urbanPlanner.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) {
            maps.urbanPlanner.removeLayer(layer);
        }
    });

    // Add zone markers
    respiratoryData.forEach(zone => {
        const marker = L.circleMarker([zone.location.lat, zone.location.lng], {
            radius: 15,
            fillColor: zone.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(maps.urbanPlanner);

        marker.bindPopup(`
      <div class="popup-content">
        <h4>${zone.zone}</h4>
        <p><strong>AQI:</strong> ${zone.aqi}</p>
        <p><strong>${t('up.zone.type', currentLanguage)}:</strong> ${zone.zoneType}</p>
        <p><strong>${t('modal.trend', currentLanguage)}:</strong> ${zone.trend}</p>
        <p style="margin-top: 8px; font-size: 0.9em;">${zone.planningNote}</p>
      </div>
    `);
    });

    // Update high-risk zones list
    updateHighRiskZones();

    // Update infrastructure simulator
    updateInfrastructureSimulator();

    // Update timestamp
    document.getElementById('up-update-time').textContent =
        `${t('common.updated', currentLanguage)}: ${new Date().toLocaleTimeString()}`;
}

function updateHighRiskZones() {
    const highRiskZones = respiratoryData
        .filter(z => z.aqi > 100)
        .sort((a, b) => b.aqi - a.aqi);

    const listDiv = document.getElementById('up-zone-list');

    if (highRiskZones.length === 0) {
        listDiv.innerHTML = '<p style="padding: 20px; text-align: center;">No high-risk zones currently</p>';
        return;
    }

    listDiv.innerHTML = highRiskZones.map((zone, index) => `
    <div class="zone-item">
      <div class="zone-header">
        <span class="zone-number">${index + 1}.</span>
        <span class="zone-name">${zone.zone}</span>
        <span class="zone-aqi" style="color: ${zone.color};">AQI: ${zone.aqi}</span>
      </div>
      <div class="zone-details">
        <p><strong>${t('up.zone.type', currentLanguage)}:</strong> ${zone.zoneType}</p>
        <p><strong>${t('modal.trend', currentLanguage)}:</strong> ${zone.trend}</p>
        <p><em>${zone.planningNote}</em></p>
      </div>
    </div>
  `).join('');
}

function updateInfrastructureSimulator() {
    const simulatorDiv = document.getElementById('up-simulator');

    simulatorDiv.innerHTML = `
    <div class="simulator-form">
      <div class="form-row">
        <label>Select Intervention:</label>
        <select id="intervention-type">
          <option value="green">Green Belt Expansion</option>
          <option value="traffic">Traffic Rerouting</option>
          <option value="industrial">Industrial Relocation</option>
          <option value="transport">Public Transport Enhancement</option>
        </select>
      </div>
      <div class="form-row">
        <label>Target Zone:</label>
        <select id="target-zone">
          ${respiratoryData.map(z => `<option value="${z.id}">${z.zone} (AQI: ${z.aqi})</option>`).join('')}
        </select>
      </div>
      <button class="btn-primary" id="run-simulation">Run Simulation</button>
    </div>
    <div class="simulation-results" id="simulation-results" style="display: none;">
      <!-- Results populated by simulation -->
    </div>
  `;

    document.getElementById('run-simulation').addEventListener('click', runSimulation);
}

function runSimulation() {
    const zoneId = parseInt(document.getElementById('target-zone').value);
    const intervention = document.getElementById('intervention-type').value;
    const zone = respiratoryData.find(z => z.id === zoneId);

    // Simulate impact (mock calculation)
    const reductionPercent = intervention === 'green' ? 32 :
        intervention === 'traffic' ? 28 :
            intervention === 'industrial' ? 45 : 25;

    const projectedAQI = Math.round(zone.aqi * (1 - reductionPercent / 100));
    const timeline = intervention === 'industrial' ? '24-36' : '18-24';
    const cost = intervention === 'industrial' ? '₹120' :
        intervention === 'transport' ? '₹85' : '₹45';

    const resultsDiv = document.getElementById('simulation-results');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
    <h4>Projected Impact:</h4>
    <div class="impact-stats">
      <div class="impact-item">
        <span class="impact-label">Current AQI:</span>
        <span class="impact-value" style="color: ${zone.color};">${zone.aqi}</span>
      </div>
      <div class="impact-item">
        <span class="impact-label">Projected AQI:</span>
        <span class="impact-value" style="color: #00E676;">${projectedAQI}</span>
      </div>
      <div class="impact-item">
        <span class="impact-label">Improvement:</span>
        <span class="impact-value">${reductionPercent}% reduction</span>
      </div>
      <div class="impact-item">
        <span class="impact-label">Timeline:</span>
        <span class="impact-value">${timeline} months</span>
      </div>
      <div class="impact-item">
        <span class="impact-label">Estimated Cost:</span>
        <span class="impact-value">${cost} crore</span>
      </div>
    </div>
  `;
}

// Beneficiary Dashboard
async function loadBeneficiaryDashboard() {
    const data = await fetchRespiratoryData();

    // Initialize map
    if (!maps.beneficiary) {
        maps.beneficiary = L.map('ben-map').setView([21.1458, 79.0882], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(maps.beneficiary);
    }

    // Clear existing markers
    maps.beneficiary.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) {
            maps.beneficiary.removeLayer(layer);
        }
    });

    // Add zone markers (simplified)
    respiratoryData.forEach(zone => {
        const marker = L.circleMarker([zone.location.lat, zone.location.lng], {
            radius: 12,
            fillColor: zone.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(maps.beneficiary);

        const severityLabel = t(`severity.${zone.severity}`, currentLanguage);

        marker.bindPopup(`
      <div class="popup-content">
        <h4>${zone.zone}</h4>
        <p style="font-size: 1.2em; font-weight: bold; color: ${zone.color};">${severityLabel}</p>
        <p style="margin-top: 8px;">${zone.recommendation}</p>
      </div>
    `);
    });

    // Update location status
    updateLocationStatus();

    // Update forecast
    updateForecast();

    // Update health tips
    updateHealthTips();

    // Update safe zones
    updateSafeZones();
}

function updateLocationStatus() {
    const userZone = respiratoryData.find(z => z.zone === currentUser.location.zone) || respiratoryData[0];
    const statusDiv = document.getElementById('ben-status-content');

    const statusClass = userZone.severity;
    const statusIcon = userZone.severity === 'severe' || userZone.severity === 'high' ? '🔴' :
        userZone.severity === 'moderate' ? '🟡' : '🟢';

    const statusTitle = t(`status.${userZone.severity}.title`, currentLanguage);
    const statusDesc = t(`status.${userZone.severity}.desc`, currentLanguage);
    const statusAction = t(`status.${userZone.severity}.action`, currentLanguage);

    statusDiv.innerHTML = `
    <div class="status-icon">${statusIcon}</div>
    <h2 class="status-title ${statusClass}">${statusTitle}</h2>
    <p class="status-location">${t('ben.status.title', currentLanguage)}: ${userZone.zone}</p>
    <p class="status-description">${statusDesc}</p>
    <div class="status-actions">
      <p>${statusAction}</p>
    </div>
  `;
}

function updateForecast() {
    const forecastDiv = document.getElementById('ben-forecast');

    // Mock forecast data
    const forecasts = [
        { time: t('forecast.now', currentLanguage), severity: 'high', icon: '🔴' },
        { time: t('forecast.evening', currentLanguage), severity: 'high', icon: '🟠' },
        { time: t('forecast.night', currentLanguage), severity: 'moderate', icon: '🟡' },
        { time: t('forecast.tomorrow', currentLanguage), severity: 'moderate', icon: '🟡' }
    ];

    forecastDiv.innerHTML = `
    <div class="forecast-items">
      ${forecasts.map(f => `
        <div class="forecast-item">
          <div class="forecast-time">${f.time}</div>
          <div class="forecast-icon">${f.icon}</div>
          <div class="forecast-label">${t(`severity.${f.severity}`, currentLanguage)}</div>
        </div>
      `).join('')}
    </div>
    <p class="forecast-message">${t('forecast.message', currentLanguage)}</p>
  `;
}

function updateHealthTips() {
    const tipsDiv = document.getElementById('ben-health-tips');

    tipsDiv.innerHTML = `
    <div class="tips-section">
      <h4>${t('tips.everyone', currentLanguage)}</h4>
      <ul>
        <li>${t('tips.everyone.1', currentLanguage)}</li>
        <li>${t('tips.everyone.2', currentLanguage)}</li>
        <li>${t('tips.everyone.3', currentLanguage)}</li>
      </ul>
    </div>
    <div class="tips-section">
      <h4>${t('tips.children', currentLanguage)}</h4>
      <ul>
        <li>${t('tips.children.1', currentLanguage)}</li>
        <li>${t('tips.children.2', currentLanguage)}</li>
      </ul>
    </div>
    <div class="tips-section">
      <h4>${t('tips.elderly', currentLanguage)}</h4>
      <ul>
        <li>${t('tips.elderly.1', currentLanguage)}</li>
        <li>${t('tips.elderly.2', currentLanguage)}</li>
      </ul>
    </div>
  `;
}

function updateSafeZones() {
    const safeZones = respiratoryData
        .filter(z => z.zone.includes('Lake') || z.zone.includes('Hills') || z.zone.includes('Garden'))
        .sort((a, b) => a.severityLevel - b.severityLevel);

    const zonesDiv = document.getElementById('ben-safe-zones');

    if (safeZones.length === 0) {
        zonesDiv.innerHTML = '<p style="padding: 20px;">No safer areas available nearby</p>';
        return;
    }

    zonesDiv.innerHTML = safeZones.map((zone, index) => {
        const distance = (2.3 + index * 1.2).toFixed(1);
        const severityLabel = t(`severity.${zone.severity}`, currentLanguage);

        return `
      <div class="safe-zone-item">
        <div class="safe-zone-header">
          <span class="safe-zone-name">${index + 1}. ${zone.zone}</span>
          <span class="safe-zone-distance">${distance} ${t('safezone.km', currentLanguage)}</span>
        </div>
        <div class="safe-zone-status">
          <span>${t('safezone.status', currentLanguage)}:</span>
          <span class="status-badge" style="background: ${zone.color};">${severityLabel}</span>
        </div>
      </div>
    `;
    }).join('');
}
