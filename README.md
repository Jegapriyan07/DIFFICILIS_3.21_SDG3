# Respiratory Health Risk Platform (SDG-3)

A comprehensive single-page web application for monitoring respiratory health risks based on air quality data, aligned with UN Sustainable Development Goal 3 (Good Health and Well-being).

## 🎯 Features

### Role-Based Access Control
- **Health Officers**: Full access to AQI data, medical severity classifications, and advisory tools
- **Urban Planners**: AQI data with zone-based patterns and infrastructure planning tools
- **Beneficiaries**: Simplified respiratory risk information without technical AQI values

### Multi-Language Support
- English and Hindi language support
- Dynamic language switching without page reload
- Language preference persistence

### Interactive Heatmaps
- Leaflet-based respiratory severity visualization
- Color-coded zones (Green → Yellow → Orange → Red)
- Role-specific data abstraction
- Interactive tooltips and popups

### Alert System
- Automatic alerts for high/severe severity zones
- Location-based notifications
- Language-aware alert messages
- SMS integration ready (Twilio)

### Clean UI/UX
- Single-page application (no page reloads)
- Card-based layout
- Smooth transitions and animations
- Responsive design for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start the server**
```bash
npm start
```

3. **Access the application**
Open your browser and navigate to:
```
http://localhost:3000
```

## 👥 Demo Credentials

### Health Officer
- **Username**: `health_officer`
- **Password**: `health123`
- **Features**: Full AQI data, medical measures, alert management

### Urban Planner
- **Username**: `urban_planner`
- **Password**: `planner123`
- **Features**: AQI data, zone patterns, infrastructure simulator

### Beneficiary
- **Username**: `beneficiary`
- **Password**: `user123`
- **Features**: Simplified risk levels, health tips, safe zones

## 📁 Project Structure

```
respiratory-health-platform/
├── server.js                 # Express backend server
├── package.json             # Dependencies
├── .env                     # Environment configuration
├── public/
│   ├── index.html          # Main HTML structure
│   ├── styles.css          # CSS styling
│   ├── app.js              # Main application logic
│   └── translations.js     # Language translations
└── README.md
```

## 🔧 Configuration

### Environment Variables
Edit `.env` file to configure:
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT tokens
- Twilio credentials (for SMS alerts)

### Adding SMS Alerts
To enable SMS notifications:
1. Sign up for Twilio account
2. Add credentials to `.env`:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

## 🗺️ API Endpoints

### Authentication
- `POST /api/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/language` - Update language preference

### Data
- `GET /api/respiratory-data` - Get respiratory data (role-based filtering)

### Alerts
- `POST /api/alerts/send` - Send alert to beneficiaries (Health Officer only)
- `GET /api/alerts/history` - Get alert history (Health Officer only)

## 🎨 Dashboard Features

### Health Officer Dashboard
- **Respiratory Severity Heatmap**: Full AQI values with pollutant breakdown
- **Medical Severity Classification**: City-wide status summary
- **Population at Risk**: Demographic analysis
- **Recommended Medical Measures**: Action plans based on severity
- **Alert Management**: Send alerts to affected populations

### Urban Planner Dashboard
- **Respiratory Severity Heatmap**: AQI data with zone overlays
- **High-Risk Zones**: Prioritized list with causes
- **Infrastructure Simulator**: What-if scenario planning
- **Temporal Patterns**: Seasonal and hourly trends

### Beneficiary Dashboard
- **My Location Status**: Current risk level (NO AQI numbers)
- **24-Hour Forecast**: Simple timeline
- **Respiratory Risk Map**: Color-coded zones only
- **Health Tips**: Practical daily guidance
- **Safer Areas**: Nearby parks and green spaces

## 🌐 Language Support

### Supported Languages
- English (en)
- Hindi (hi)

### Adding New Languages
1. Edit `public/translations.js`
2. Add new language object with all translation keys
3. Update language toggle to include new option

## 🔒 Security Features

- JWT-based authentication
- Role-based data filtering (server-side)
- Password hashing with bcrypt
- Token expiration (24 hours)
- Input sanitization

## 📊 Data Model

### AQI to Severity Mapping
- **Good (0-50)**: Safe for all
- **Moderate (51-100)**: Sensitive groups monitor
- **High (101-200)**: General population at risk
- **Severe (201+)**: Emergency conditions

### Alert Triggers
- Alerts sent when severity crosses "High" or "Severe"
- Maximum 1 alert per zone per 6 hours
- Location-based (zone-level, not GPS)
- Language-aware messages

## 🎯 SDG-3 Alignment

This platform supports UN SDG-3 (Good Health and Well-being) by:
- Providing real-time respiratory health risk information
- Enabling data-driven health interventions
- Supporting urban planning for healthier cities
- Empowering citizens with actionable health guidance
- Facilitating early warning systems for air quality emergencies

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Leaflet.js (interactive maps)
- Google Fonts (Inter, Poppins)

### Backend
- Node.js
- Express.js
- JWT for authentication
- bcrypt for password hashing
- Twilio (SMS alerts - optional)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 1024px
- Touch-friendly interface
- Optimized map interactions

## 🔄 Auto-Update System

- Dashboard data refreshes every 15 minutes
- Real-time map updates
- Automatic alert checking
- Background notification system

## 🚨 Alert System

### Alert Levels
1. **Warning (AQI > 100)**: Sent once when threshold crossed
2. **Emergency (AQI > 200)**: Immediate + every 6 hours if persists

### Alert Channels
- In-app notifications
- SMS (via Twilio)
- Email (configurable)

### Alert Content
- Location-specific
- Language-aware
- Actionable guidance
- Emergency contact info

## 🎓 Educational Use

This platform can be used for:
- Public health education
- Urban planning workshops
- Environmental awareness campaigns
- Smart city demonstrations
- SDG implementation training

## 📈 Future Enhancements

- [ ] Real sensor integration (IoT devices)
- [ ] Machine learning predictions
- [ ] Historical data analytics
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration
- [ ] Voice alerts (IVR)
- [ ] Multi-city support
- [ ] API for third-party integration

## 🤝 Contributing

This is a demonstration project for SDG-3 implementation. Contributions welcome!

## 📄 License

MIT License - Free to use for educational and non-commercial purposes.

## 👨‍💻 Developer Notes

### Mock Data
- Currently uses simulated AQI data for Nagpur zones
- Replace with real sensor data by modifying `aqiData` in `server.js`

### Customization
- Colors: Edit CSS variables in `styles.css`
- Translations: Modify `translations.js`
- Alert logic: Update `checkAndTriggerAlerts()` in `server.js`

### Testing
- Test all three user roles
- Verify language switching
- Check map interactions
- Test alert system

## 📞 Support

For questions or issues, please refer to the documentation or create an issue.

---

**Built with ❤️ for SDG-3: Good Health and Well-being**
