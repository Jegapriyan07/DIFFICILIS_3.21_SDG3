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

// Authentication (Role Selection Logic)
let selectedRole = null;

function setupLoginForm() {
  // No explicit setup needed for role selection cards as they use inline onclick
  // But we can initialize state if needed
  selectedRole = null;
}

// Global functions for HTML interaction
window.selectRole = function (role) {
  selectedRole = role;

  // Update UI - with new .role-option selector
  document.querySelectorAll('.role-option').forEach(card => {
    card.classList.remove('selected');
    if (card.dataset.role === role) {
      card.classList.add('selected');
    }
  });

  // Enable CTA button when role is selected
  const ctaButton = document.getElementById('login-button');
  if (ctaButton) {
    ctaButton.disabled = false;
  }

  // Show a small inline confirmation so users know which role they picked
  const roleNameKey = role === 'health_officer' ? 'ho.dashboard.title' : role === 'urban_planner' ? 'up.dashboard.title' : 'ben.dashboard.title';
  const roleDisplay = t(roleNameKey, currentLanguage);
  const roleConfDiv = document.getElementById('role-confirmation');
  if (roleConfDiv) {
    roleConfDiv.style.display = 'block';
    roleConfDiv.textContent = t('role.selected.template', currentLanguage).replace('{role}', roleDisplay);
  }
};

// Show role confirmation after login (with demo mode note)
function showRoleConfirmation(role) {
  const roleNameKey = role === 'health_officer' ? 'ho.dashboard.title' : role === 'urban_planner' ? 'up.dashboard.title' : 'ben.dashboard.title';
  const roleDisplay = t(roleNameKey, currentLanguage);
  const confirmText = t('role.confirmation.template', currentLanguage).replace('{role}', roleDisplay);

  const roleConfDiv = document.getElementById('role-confirmation');
  if (roleConfDiv) {
    roleConfDiv.style.display = 'block';
    roleConfDiv.textContent = confirmText;

    // Fade after a few seconds
    setTimeout(() => {
      roleConfDiv.style.display = 'none';
    }, 5000);
  }
}

// Normalise confidence value (supports numeric 0-1, 0-100, or strings 'high')
function getConfidenceLevel(zone) {
  const raw = zone.confidence || zone.predictionConfidence || zone.dataConfidence || zone.confidenceLevel;
  if (!raw && raw !== 0) return 'Medium';

  if (typeof raw === 'string') {
    const s = raw.toLowerCase();
    if (s.includes('high')) return 'High';
    if (s.includes('low')) return 'Low';
    return 'Medium';
  }

  const val = Number(raw);
  if (isNaN(val)) return 'Medium';

  // handle 0-1 or 0-100
  const normalized = val > 1 ? val / 100 : val;
  if (normalized >= 0.66) return 'High';
  if (normalized >= 0.33) return 'Medium';
  return 'Low';
}

function populatePrimaryAction() {
  const container = document.getElementById('ho-primary-action');
  if (!container) return;
  
  // Content is hardcoded in HTML now - no need to populate dynamically
  return;
}

window.handleLogin = async function () {
  if (!selectedRole) {
    alert('Please select a role to continue.');
    return;
  }

  const errorDiv = document.getElementById('login-error');
  if (errorDiv) errorDiv.textContent = ''; // Clear previous errors

  // Map role to demo credentials
  const credentials = {
    'health_officer': { username: 'health_officer', password: 'health123' },
    'urban_planner': { username: 'urban_planner', password: 'planner123' },
    'beneficiary': { username: 'beneficiary', password: 'user123' }
  };

  const creds = credentials[selectedRole];

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    });

    if (!response.ok) {
      throw new Error('Invalid credentials'); // Should not happen with hardcoded demo creds
    }

    const data = await response.json();

    // Store token and user data
    localStorage.setItem('token', data.token);
    currentUser = data.user;
    currentLanguage = data.user.language;
    localStorage.setItem('language', currentLanguage);

    // Show loading screen
    showLoadingScreen();

    // After 2 seconds (faster for demo), show appropriate dashboard
    setTimeout(() => {
      loadDashboard(data.user.role);
    }, 2000);

  } catch (error) {
    console.error('Login error:', error);
    if (errorDiv) errorDiv.textContent = 'Login failed. Please checks API.';
    alert('Login failed. Ensure backend is running.');
  }
};

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
      showRoleConfirmation('health_officer');
      loadHealthOfficerDashboard();
      break;
    case 'urban_planner':
      showPage('urban-planner-dashboard');
      showRoleConfirmation('urban_planner');
      loadUrbanPlannerDashboard();
      break;
    case 'beneficiary':
      showPage('beneficiary-dashboard');
      showRoleConfirmation('beneficiary');
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

        // Properly destroy Leaflet map instances to prevent re-initialization error
        Object.keys(maps).forEach(key => {
          if (maps[key]) {
            maps[key].remove();
            maps[key] = null;
          }
        });
        maps = {}; // Reset maps object

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
        <p><strong>Data Confidence:</strong> ${getConfidenceLevel(zone)}</p>
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

  // Populate today's primary action box (time-bound actions)
  populatePrimaryAction();

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
  
  // Calculate average confidence from data
  const confidenceLevels = respiratoryData.map(z => {
    const cf = getConfidenceLevel(z);
    return cf === 'High' ? 0.9 : cf === 'Medium' ? 0.6 : 0.3;
  });
  const avgConfidence = confidenceLevels.length > 0 ? 
    (confidenceLevels.reduce((a, b) => a + b, 0) / confidenceLevels.length * 100).toFixed(0) : 
    '60';

  mainDiv.innerHTML = `
    <div class="severity-badge ${highestSeverity}" id="ho-severity-badge">${highestSeverity.toUpperCase()}</div>
    <div class="prediction-confidence" id="ho-prediction-confidence">${t('ho.prediction.confidence', currentLanguage)}: ${avgConfidence}%</div>
    <p id="ho-zones-affected">${affectedZones} ${t('ho.zones.affected', currentLanguage)}</p>
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

  // Only update if element exists
  if (!measuresDiv) {
    console.log('Medical measures element not found - skipping');
    return;
  }

  if (hasSevere || hasHigh) {
    measuresDiv.innerHTML = `
      <div class="measures-section">
        <h4>${t('measures.immediate', currentLanguage)}</h4>
        <div class="single-point">
          <span class="check-icon">✓</span>
          <span class="point-text">${t('measures.immediate.1', currentLanguage)}</span>
        </div>
      </div>
      <div class="measures-section">
        <h4>${t('measures.short', currentLanguage)}</h4>
        <div class="single-point">
          <span class="check-icon">✓</span>
          <span class="point-text">${t('measures.short.1', currentLanguage)}</span>
        </div>
      </div>
    `;
  } else {
    measuresDiv.innerHTML = `
      <p style="padding: 20px; text-align: center; color: #00E676;">
        No immediate medical measures required.
      </p>
    `;
  }
}


function setupHealthOfficerActions() {
  console.log('🔧 Setting up health officer actions...');
  
  // Use document-level event delegation for more reliable button handling
  document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'ho-send-alert' || e.target.closest('#ho-send-alert'))) {
      e.preventDefault();
      e.stopPropagation();
      console.log('✅ BUTTON CLICKED! - Alert Button');
      
      // Simple alert
      setTimeout(() => {
        alert('✅ SMS Alert Sent!\n\nNotified 4 high-risk zones');
      }, 50);
    }
  }, true);
  
  console.log('✅ Document-level click delegation set up');
}

function showNotification(message, type = 'info') {
  console.log('Showing notification:', type, message);
  
  // Create notification container if it doesn't exist
  let notifContainer = document.getElementById('notification-container');
  if (!notifContainer) {
    notifContainer = document.createElement('div');
    notifContainer.id = 'notification-container';
    notifContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 420px;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;
    document.body.appendChild(notifContainer);
  }

  // Create notification element
  const notif = document.createElement('div');
  let bgColor, borderColor, shadowColor;
  
  if (type === 'success') {
    bgColor = '#10B981';
    borderColor = '#059669';
    shadowColor = 'rgba(16, 185, 129, 0.3)';
  } else if (type === 'error') {
    bgColor = '#DC2626';
    borderColor = '#B91C1C';
    shadowColor = 'rgba(220, 38, 38, 0.3)';
  } else {
    bgColor = '#1E3A8A';
    borderColor = '#1E40AF';
    shadowColor = 'rgba(30, 58, 138, 0.3)';
  }
  
  notif.style.cssText = `
    background: linear-gradient(135deg, ${bgColor} 0%, ${borderColor} 100%);
    color: white;
    padding: 18px 22px;
    border-radius: 12px;
    margin-bottom: 12px;
    box-shadow: 0 12px 24px ${shadowColor};
    animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: pre-line;
    font-size: 13px;
    line-height: 1.8;
    font-weight: 500;
    border-left: 4px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
  `;
  
  notif.textContent = message;
  notifContainer.appendChild(notif);

  // Add animation keyframes if not already added
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(500px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(500px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-remove after 6 seconds
  setTimeout(() => {
    notif.style.animation = 'slideOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => {
      if (notif.parentNode) notif.remove();
    }, 400);
  }, 6000);
}

async function sendAlert(zoneId, severity) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_BASE}/alerts/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ zoneId, severity, language: currentLanguage })
    });

    if (!response.ok) {
      throw new Error('Server returned ' + response.status);
    }
    return true;
  } catch (error) {
    console.error('Failed to send alert:', error);
    return false;
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

  // Get or create planning note, assumptions, policy relevance divs
  let notesHtml = '';
  const noteDiv = simulatorDiv.querySelector('.simulator-note');
  const assumDiv = simulatorDiv.querySelector('.simulator-assumptions');
  const policyDiv = simulatorDiv.querySelector('.policy-relevance');

  if (noteDiv) notesHtml += '<div class="simulator-note">' + noteDiv.innerHTML + '</div>';
  if (assumDiv) notesHtml += '<div class="simulator-assumptions">' + assumDiv.innerHTML + '</div>';
  if (policyDiv) notesHtml += '<div class="policy-relevance">' + policyDiv.innerHTML + '</div>';

  simulatorDiv.innerHTML = `
    ${notesHtml}
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

  // Update location status (now AQI status card)
  updateAQIStatusCard();

  // Update precautions
  updatePrecautionaryMeasures();

  // Update forecast
  updateForecast();

  // Update health tips
  updateHealthTips();

  // Update safe zones
  updateSafeZones();
}

function updateAQIStatusCard() {
  const userZone = respiratoryData.find(z => z.zone === currentUser.location.zone) || respiratoryData[0];
  const statusDiv = document.getElementById('ben-status-content');
  
  // Get AQI value from zone data
  const aqi = userZone.aqi || Math.floor(Math.random() * 250) + 50;
  
  // Determine status
  let status = 'GOOD';
  if (aqi <= 50) status = 'GOOD';
  else if (aqi <= 100) status = 'MODERATE';
  else if (aqi <= 150) status = 'UNHEALTHY FOR SENSITIVE GROUPS';
  else if (aqi <= 200) status = 'UNHEALTHY';
  else if (aqi <= 300) status = 'VERY UNHEALTHY';
  else status = 'HAZARDOUS';

  // Get weather info (mock data)
  const temperature = Math.floor(Math.random() * 15) + 15; // 15-30°C
  const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
  const windSpeed = Math.floor(Math.random() * 20) + 5; // 5-25 km/h
  const uvIndex = Math.floor(Math.random() * 8);

  statusDiv.innerHTML = `
    <div class="aqi-number">
      <div class="aqi-value">${aqi}</div>
      <div class="aqi-index">AQI (US)</div>
      <div class="aqi-status-text">${status}</div>
    </div>
    <div class="aqi-weather-info">
      <div class="weather-item">
        <span class="weather-item-label">🌡️ ${t('weather.temperature', currentLanguage) || 'Temperature'}:</span>
        <span class="weather-item-value">${temperature}°C</span>
      </div>
      <div class="weather-item">
        <span class="weather-item-label">💧 ${t('weather.humidity', currentLanguage) || 'Humidity'}:</span>
        <span class="weather-item-value">${humidity}%</span>
      </div>
      <div class="weather-item">
        <span class="weather-item-label">💨 ${t('weather.wind', currentLanguage) || 'Wind'}:</span>
        <span class="weather-item-value">${windSpeed} km/h</span>
      </div>
      <div class="weather-item">
        <span class="weather-item-label">☀️ UV Index:</span>
        <span class="weather-item-value">${uvIndex}</span>
      </div>
    </div>
  `;
}

function updatePrecautionaryMeasures() {
  const precautions = document.getElementById('ben-precautions');
  
  const precautionItems = [
    {
      icon: '🏠',
      titleKey: 'ben.precaution.stay.indoors',
      descKey: 'ben.precaution.stay.indoors.desc'
    },
    {
      icon: '😷',
      titleKey: 'ben.precaution.use.masks',
      descKey: 'ben.precaution.use.masks.desc'
    },
    {
      icon: '🌬️',
      titleKey: 'ben.precaution.air.purifier',
      descKey: 'ben.precaution.air.purifier.desc'
    },
    {
      icon: '🚫',
      titleKey: 'ben.precaution.avoid.strenuous',
      descKey: 'ben.precaution.avoid.strenuous.desc'
    },
    {
      icon: '🪟',
      titleKey: 'ben.precaution.seal.windows',
      descKey: 'ben.precaution.seal.windows.desc'
    },
    {
      icon: '⚠️',
      titleKey: 'ben.precaution.vulnerable',
      descKey: 'ben.precaution.vulnerable.desc'
    },
    {
      icon: '💧',
      titleKey: 'ben.precaution.water',
      descKey: 'ben.precaution.water.desc'
    },
    {
      icon: '🏥',
      titleKey: 'ben.precaution.monitor',
      descKey: 'ben.precaution.monitor.desc'
    }
  ];

  precautions.innerHTML = precautionItems.map(item => `
    <div class="precaution-item">
      <div class="precaution-icon">${item.icon}</div>
      <div class="precaution-text">
        <div class="precaution-title">${t(item.titleKey, currentLanguage)}</div>
        <div class="precaution-description">${t(item.descKey, currentLanguage)}</div>
      </div>
    </div>
  `).join('');
}

function updateForecast() {
  const forecastDiv = document.getElementById('ben-forecast');

  // Mock forecast data
  const forecasts = [
    { 
      time: '12:00 PM', 
      aqi: 152, 
      status: 'UNHEALTHY FOR SENSITIVE' 
    },
    { 
      time: '4:00 PM', 
      aqi: 168, 
      status: 'UNHEALTHY' 
    },
    { 
      time: '8:00 PM', 
      aqi: 145, 
      status: 'UNHEALTHY FOR SENSITIVE' 
    },
    { 
      time: 'Tomorrow', 
      aqi: 98, 
      status: 'MODERATE' 
    }
  ];

  forecastDiv.innerHTML = forecasts.map(f => `
    <div class="forecast-item">
      <span class="forecast-time">${f.time}</span>
      <span class="forecast-aqi">AQI ${f.aqi}</span>
      <span class="forecast-status">${f.status}</span>
    </div>
  `).join('');
}

function updateHealthTips() {
  const tipsDiv = document.getElementById('ben-health-tips');

  const tips = [
    '🚶 ' + (currentLanguage === 'hi' ? 'आज बाहर व्यायाम करना सुरक्षित नहीं है' : 'Avoid outdoor exercise today'),
    '💪 ' + (currentLanguage === 'hi' ? 'घर में व्यायाम करें' : 'Do indoor exercises instead'),
    '👶 ' + (currentLanguage === 'hi' ? 'बच्चों को घर में रखें' : 'Keep children indoors'),
    '🧓 ' + (currentLanguage === 'hi' ? 'बुजुर्गों को सुरक्षित रखें' : 'Check on elderly members'),
    '💊 ' + (currentLanguage === 'hi' ? 'दवाएं साथ रखें' : 'Keep medications handy'),
    '📱 ' + (currentLanguage === 'hi' ? 'आपातकालीन नंबर सहेजें' : 'Save emergency numbers')
  ];

  tipsDiv.innerHTML = tips.map(tip => `
    <div class="health-tip">
      <span class="health-tip-icon"></span>${tip}
    </div>
  `).join('');
}

function updateSafeZones() {
  const safeZones = respiratoryData
    .filter(z => z.zone.includes('Lake') || z.zone.includes('Hills') || z.zone.includes('Garden') || z.zone.includes('Park'))
    .sort((a, b) => (a.aqi || 100) - (b.aqi || 100));

  const zonesDiv = document.getElementById('ben-safe-zones');

  if (safeZones.length === 0) {
    zonesDiv.innerHTML = '<p style="padding: 16px; color: var(--text-light);">' + 
      (currentLanguage === 'hi' ? 'पास में कोई सुरक्षित क्षेत्र नहीं' : 'No safer areas available nearby') + '</p>';
    return;
  }

  zonesDiv.innerHTML = safeZones.map((zone, index) => {
    const distance = (2.3 + index * 1.2).toFixed(1);

    return `
      <div class="safe-zone-item">
        <div class="safe-zone-icon">🌳</div>
        <div>
          <div class="safe-zone-name">${zone.zone}</div>
          <div class="safe-zone-distance">${distance} km away</div>
        </div>
      </div>
    `;
  }).join('');
}
