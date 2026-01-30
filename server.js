const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'respiratory-health-sdg3-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock user database
const users = [
  {
    id: 1,
    username: 'health_officer',
    password: bcrypt.hashSync('health123', 10),
    role: 'health_officer',
    name: 'Dr. Sharma',
    phone: '+919876543210',
    language: 'en',
    location: { lat: 21.1458, lng: 79.0882, zone: 'Dharampeth' }
  },
  {
    id: 2,
    username: 'urban_planner',
    password: bcrypt.hashSync('planner123', 10),
    role: 'urban_planner',
    name: 'Rajesh Kumar',
    phone: '+919876543211',
    language: 'en',
    location: { lat: 21.1458, lng: 79.0882, zone: 'Sitabuldi' }
  },
  {
    id: 3,
    username: 'beneficiary',
    password: bcrypt.hashSync('user123', 10),
    role: 'beneficiary',
    name: 'Priya Deshmukh',
    phone: '+919876543212',
    language: 'hi',
    location: { lat: 21.1458, lng: 79.0882, zone: 'Civil Lines' }
  }
];

// Mock AQI data for Nagpur zones
const aqiData = [
  { id: 1, zone: 'Dharampeth', lat: 21.1458, lng: 79.0882, aqi: 145, severity: 'high', pollutants: { pm25: 85, pm10: 120, no2: 45 } },
  { id: 2, zone: 'Sitabuldi', lat: 21.1497, lng: 79.0806, aqi: 178, severity: 'high', pollutants: { pm25: 105, pm10: 145, no2: 52 } },
  { id: 3, zone: 'Civil Lines', lat: 21.1525, lng: 79.0925, aqi: 98, severity: 'moderate', pollutants: { pm25: 55, pm10: 85, no2: 38 } },
  { id: 4, zone: 'Sadar', lat: 21.1466, lng: 79.0882, aqi: 132, severity: 'high', pollutants: { pm25: 78, pm10: 110, no2: 48 } },
  { id: 5, zone: 'Kalamna', lat: 21.1389, lng: 79.0903, aqi: 215, severity: 'severe', pollutants: { pm25: 125, pm10: 175, no2: 65 } },
  { id: 6, zone: 'MIDC Area', lat: 21.1100, lng: 79.0550, aqi: 198, severity: 'severe', pollutants: { pm25: 115, pm10: 165, no2: 58 } },
  { id: 7, zone: 'Ambazari', lat: 21.1350, lng: 79.0450, aqi: 65, severity: 'good', pollutants: { pm25: 35, pm10: 55, no2: 25 } },
  { id: 8, zone: 'Seminary Hills', lat: 21.1200, lng: 79.0350, aqi: 48, severity: 'good', pollutants: { pm25: 28, pm10: 42, no2: 20 } },
  { id: 9, zone: 'Futala Lake', lat: 21.1350, lng: 79.0550, aqi: 72, severity: 'moderate', pollutants: { pm25: 42, pm10: 68, no2: 30 } },
  { id: 10, zone: 'Nagpur Railway Station', lat: 21.1524, lng: 79.0826, aqi: 156, severity: 'high', pollutants: { pm25: 92, pm10: 135, no2: 50 } }
];

// Alert notification storage
let alertHistory = [];

// Helper function to calculate severity from AQI
function calculateSeverity(aqi) {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'high';
  return 'severe';
}

// Helper function to get severity label
function getSeverityLabel(severity, language = 'en') {
  const labels = {
    en: {
      good: 'Safe',
      moderate: 'Be Careful',
      high: 'Avoid Outdoor',
      severe: 'High Risk - Stay In'
    },
    hi: {
      good: 'सुरक्षित',
      moderate: 'सावधान रहें',
      high: 'बाहर न जाएं',
      severe: 'उच्च जोखिम - घर में रहें'
    }
  };
  return labels[language][severity];
}

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      language: user.language,
      location: user.location
    }
  });
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Get respiratory data (role-based filtering)
app.get('/api/respiratory-data', authenticateToken, (req, res) => {
  const { role } = req.user;
  const { location } = req.query;

  let responseData = aqiData.map(zone => {
    const baseData = {
      id: zone.id,
      zone: zone.zone,
      location: { lat: zone.lat, lng: zone.lng },
      severity: zone.severity,
      severityLevel: zone.severity === 'good' ? 1 : zone.severity === 'moderate' ? 2 : zone.severity === 'high' ? 3 : 4,
      color: zone.severity === 'good' ? '#00E676' : zone.severity === 'moderate' ? '#FFD54F' : zone.severity === 'high' ? '#FF6B35' : '#E53935'
    };

    // Role-based data filtering
    if (role === 'health_officer') {
      return {
        ...baseData,
        aqi: zone.aqi,
        pollutants: zone.pollutants,
        healthImpact: zone.severity === 'severe' ? 'Emergency respiratory conditions' : 
                      zone.severity === 'high' ? 'Respiratory distress likely' :
                      zone.severity === 'moderate' ? 'Minor irritation in sensitive groups' : 
                      'Normal respiratory function',
        medicalClassification: zone.severity === 'severe' ? 'SEVERE' : 
                               zone.severity === 'high' ? 'HIGH' :
                               zone.severity === 'moderate' ? 'MILD' : 'LOW'
      };
    } else if (role === 'urban_planner') {
      return {
        ...baseData,
        aqi: zone.aqi,
        zoneType: zone.zone.includes('MIDC') ? 'Industrial' : 
                  zone.zone.includes('Railway') ? 'Transport Hub' :
                  zone.zone.includes('Lake') || zone.zone.includes('Hills') ? 'Green Zone' : 'Residential',
        trend: zone.aqi > 150 ? 'increasing' : zone.aqi > 100 ? 'stable' : 'decreasing',
        planningNote: zone.aqi > 150 ? 'Consider green buffer zones' : 'Monitor regularly'
      };
    } else {
      // Beneficiary - NO AQI values
      return {
        ...baseData,
        recommendation: zone.severity === 'severe' ? 'DO NOT go outside. Close all windows. Seek medical help if breathing difficulty.' :
                       zone.severity === 'high' ? 'Avoid outdoor activities. Use N95 masks if going out.' :
                       zone.severity === 'moderate' ? 'Limit strenuous outdoor activities. Sensitive groups should be cautious.' :
                       'Air quality is good. Enjoy outdoor activities!',
        icon: zone.severity === 'severe' || zone.severity === 'high' ? 'warning' : 'info'
      };
    }
  });

  res.json({
    data: responseData,
    timestamp: new Date().toISOString(),
    role: role
  });
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    language: user.language,
    location: user.location
  });
});

// Update user language preference
app.put('/api/user/language', authenticateToken, (req, res) => {
  const { language } = req.body;
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.language = language;
  res.json({ success: true, language });
});

// Send alert notification
app.post('/api/alerts/send', authenticateToken, (req, res) => {
  const { zoneId, severity, language } = req.body;
  
  // Only health officers can trigger manual alerts
  if (req.user.role !== 'health_officer') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const zone = aqiData.find(z => z.id === zoneId);
  if (!zone) {
    return res.status(404).json({ error: 'Zone not found' });
  }

  // Get all beneficiaries in the affected zone
  const affectedUsers = users.filter(u => 
    u.role === 'beneficiary' && u.location.zone === zone.zone
  );

  const alerts = affectedUsers.map(user => {
    const alertMessage = language === 'hi' ? 
      `⚠️ वायु गुणवत्ता चेतावनी\nआपके क्षेत्र (${zone.zone}) में हवा की गुणवत्ता खराब है।\nबाहरी गतिविधियों से बचें।` :
      `⚠️ AIR QUALITY ALERT\nPoor air quality in your area (${zone.zone}).\nAvoid outdoor activities.`;

    return {
      id: alertHistory.length + 1,
      userId: user.id,
      phone: user.phone,
      zone: zone.zone,
      severity: severity,
      message: alertMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
  });

  alertHistory.push(...alerts);

  res.json({
    success: true,
    alertsSent: alerts.length,
    alerts: alerts
  });
});

// Get alert history
app.get('/api/alerts/history', authenticateToken, (req, res) => {
  if (req.user.role !== 'health_officer') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json({
    alerts: alertHistory.slice(-50), // Last 50 alerts
    total: alertHistory.length
  });
});

// Auto-trigger alerts for high/severe zones (background job simulation)
function checkAndTriggerAlerts() {
  const highSeverityZones = aqiData.filter(z => z.severity === 'high' || z.severity === 'severe');
  
  highSeverityZones.forEach(zone => {
    const affectedUsers = users.filter(u => 
      u.role === 'beneficiary' && u.location.zone === zone.zone
    );

    affectedUsers.forEach(user => {
      const lastAlert = alertHistory.find(a => 
        a.userId === user.id && 
        a.zone === zone.zone &&
        new Date(a.timestamp) > new Date(Date.now() - 6 * 60 * 60 * 1000) // Last 6 hours
      );

      if (!lastAlert) {
        const alertMessage = user.language === 'hi' ? 
          `🔴 ${zone.severity === 'severe' ? 'अत्यावश्यक' : 'चेतावनी'}: वायु गुणवत्ता ${zone.severity === 'severe' ? 'आपातकाल' : 'खराब'}\nआपके क्षेत्र (${zone.zone}) में ${zone.severity === 'severe' ? 'खतरनाक' : 'खराब'} हवा है।\nघर के अंदर रहें।` :
          `🔴 ${zone.severity === 'severe' ? 'URGENT' : 'WARNING'}: Air Quality ${zone.severity === 'severe' ? 'Emergency' : 'Alert'}\n${zone.severity === 'severe' ? 'Hazardous' : 'Poor'} air in your area (${zone.zone}).\nStay indoors.`;

        alertHistory.push({
          id: alertHistory.length + 1,
          userId: user.id,
          phone: user.phone,
          zone: zone.zone,
          severity: zone.severity,
          message: alertMessage,
          timestamp: new Date().toISOString(),
          status: 'auto-sent',
          type: 'auto'
        });

        console.log(`Alert sent to ${user.name} (${user.phone}) for ${zone.zone} - Severity: ${zone.severity}`);
      }
    });
  });
}

// Run alert check every 15 minutes
setInterval(checkAndTriggerAlerts, 15 * 60 * 1000);

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏥 Respiratory Health Platform Server Running`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`\n👥 Test Credentials:`);
  console.log(`   Health Officer: health_officer / health123`);
  console.log(`   Urban Planner:  urban_planner / planner123`);
  console.log(`   Beneficiary:    beneficiary / user123`);
  console.log(`\n✅ Auto-alert system active\n`);
  
  // Run initial alert check
  checkAndTriggerAlerts();
});
