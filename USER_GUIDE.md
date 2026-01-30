# Respiratory Health Risk Platform - User Guide

## 🚀 Getting Started

### Step 1: Install Node.js
If you don't have Node.js installed:
1. Download from: https://nodejs.org/
2. Install the LTS (Long Term Support) version
3. Verify installation by opening Command Prompt and typing: `node --version`

### Step 2: Start the Application

**Option A: Using the batch file (Easiest)**
1. Double-click `start.bat` in the project folder
2. Wait for installation to complete
3. Server will start automatically

**Option B: Manual start**
1. Open Command Prompt in the project folder
2. Run: `npm install`
3. Run: `npm start`

### Step 3: Access the Application
1. Open your web browser (Chrome, Firefox, or Edge)
2. Navigate to: `http://localhost:3000`
3. You should see the login page

---

## 👥 User Roles & Features

### 1️⃣ Health Officer

**Login Credentials:**
- Username: `health_officer`
- Password: `health123`

**Dashboard Features:**

**A. Respiratory Severity Heatmap**
- Interactive map showing all zones in Nagpur
- Color-coded by severity (Green → Yellow → Orange → Red)
- Click on any zone to see:
  - AQI value
  - Pollutant breakdown (PM2.5, PM10, NO2)
  - Health impact assessment
  - Medical classification

**B. Medical Severity Classification**
- City-wide status overview
- Breakdown by severity levels:
  - Low (0-50): Safe for all
  - Mild (51-100): Sensitive groups monitor
  - High (101-200): General population at risk
  - Severe (201+): Emergency conditions

**C. Population at Risk**
- Estimated number of affected people
- Vulnerable groups breakdown:
  - Children (0-12 years)
  - Elderly (65+ years)
  - Asthma patients
  - COPD patients

**D. Recommended Medical Measures**
Based on current severity, you'll see:
- **Immediate Actions** (0-6 hours)
- **Short-term Measures** (6-24 hours)
- **Medium-term Planning** (24-72 hours)

**E. Action Buttons**
- **Generate Advisory Document**: Creates a health advisory (demo)
- **Send Alert to Beneficiaries**: Sends SMS/push notifications to affected citizens

**How to Use:**
1. Monitor the heatmap for high-risk zones
2. Review medical measures
3. Generate advisories for public distribution
4. Send alerts when severity is high or severe

---

### 2️⃣ Urban Planner

**Login Credentials:**
- Username: `urban_planner`
- Password: `planner123`

**Dashboard Features:**

**A. Respiratory Severity Heatmap**
- Same interactive map as Health Officer
- Shows AQI values for planning purposes
- Click zones to see:
  - AQI value
  - Zone type (Residential, Industrial, Transport Hub, Green Zone)
  - Trend (increasing, stable, decreasing)
  - Planning recommendations

**B. High-Risk Zones List**
- Prioritized list of zones with AQI > 100
- Sorted by severity (worst first)
- Shows:
  - Zone name and AQI
  - Zone type
  - Trend analysis
  - Planning notes

**C. Infrastructure Intervention Simulator**
Test the impact of interventions:

**Available Interventions:**
1. **Green Belt Expansion**: Plant trees, create parks
2. **Traffic Rerouting**: Redirect traffic flow
3. **Industrial Relocation**: Move polluting industries
4. **Public Transport Enhancement**: Improve metro/bus systems

**How to Use the Simulator:**
1. Select an intervention type
2. Choose a target zone
3. Click "Run Simulation"
4. View projected results:
   - Current AQI vs. Projected AQI
   - Improvement percentage
   - Timeline (months)
   - Estimated cost (in crores)

**Use Cases:**
- Justify budget allocation for green projects
- Plan traffic management policies
- Identify priority zones for intervention
- Compare cost-benefit of different approaches

---

### 3️⃣ Beneficiary (General Public)

**Login Credentials:**
- Username: `beneficiary`
- Password: `user123`

**Dashboard Features:**

**A. My Location Status** (Top Card)
Large, prominent display showing:
- Current risk level with color and icon:
  - 🟢 SAFE
  - 🟡 BE CAREFUL
  - 🟠 AVOID OUTDOOR
  - 🔴 HIGH RISK - STAY IN
- Your area name
- What the status means
- What you should do

**Important:** NO AQI numbers are shown - only simple risk levels!

**B. What to Expect Today**
24-hour forecast timeline showing:
- Now
- Evening (6 PM)
- Night (10 PM)
- Tomorrow

Each with color-coded risk level and simple label.

**C. Respiratory Risk Map**
- Simplified map of your city
- Color-coded zones (no numbers)
- Click any zone to see:
  - Zone name
  - Risk level (Safe/Be Careful/Avoid Outdoor/High Risk)
  - Simple health recommendations

**D. Health Tips for Today**
Practical advice organized by:
- **For Everyone**: General tips (drink water, avoid smoking)
- **For Children**: Keep indoors, watch for symptoms
- **For Elderly**: Avoid morning walks, keep medicines ready

**E. Safer Areas Near You**
List of nearby parks and green spaces with:
- Name and distance
- Current status
- Helps you find cleaner air if you must go out

**How to Use:**
1. Check your location status first thing in the morning
2. Plan your day based on the risk level
3. If high risk, stay indoors
4. Follow health tips for your family
5. Use safer areas list if you must go outside

---

## 🌐 Language Support

### Switching Languages

**On Login Page:**
- Click the language toggle button (🌐 EN/HI) in top-right corner
- Page text changes instantly

**On Dashboard:**
- Click the language toggle in the header
- All text updates immediately (no page reload)
- Your preference is saved

**Supported Languages:**
- **English (EN)**: Default
- **Hindi (HI)**: Full translation

---

## 🔔 Alert System

### For Beneficiaries

**When You'll Receive Alerts:**
- When air quality in your area becomes "High" or "Severe"
- Maximum once every 6 hours (to avoid spam)

**Alert Channels:**
- In-app notification (when logged in)
- SMS (if phone number registered)
- Email (if configured)

**Alert Content:**
- Your area name
- Current risk level
- What to do immediately
- Emergency contact numbers (if severe)

**Example Alert (English):**
```
⚠️ AIR QUALITY ALERT
Poor air quality in your area (Dharampeth).
Avoid outdoor activities. Wear mask if going out.
Stay safe!
- Nagpur Health Dept
```

**Example Alert (Hindi):**
```
⚠️ वायु गुणवत्ता चेतावनी
आपके क्षेत्र (धरमपेठ) में हवा की गुणवत्ता खराब है।
बाहरी गतिविधियों से बचें। बाहर जाएं तो मास्क पहनें।
सुरक्षित रहें!
- नागपुर स्वास्थ्य विभाग
```

### For Health Officers

**Sending Manual Alerts:**
1. Review high-risk zones on the map
2. Click "Send Alert to Beneficiaries" button
3. System sends alerts to all beneficiaries in affected zones
4. Confirmation message shows number of alerts sent

**Automatic Alerts:**
- System checks every 15 minutes
- Automatically sends alerts for new high/severe zones
- Prevents duplicate alerts within 6 hours

---

## 🗺️ Understanding the Heatmap

### Color Meanings

**🟢 Green (Good)**
- AQI: 0-50
- Safe for everyone
- Normal outdoor activities

**🟡 Yellow (Moderate)**
- AQI: 51-100
- Sensitive groups should monitor symptoms
- Generally safe for most people

**🟠 Orange (High)**
- AQI: 101-200
- General population at risk
- Avoid strenuous outdoor activities
- Wear masks if going out

**🔴 Red (Severe)**
- AQI: 201+
- Emergency conditions
- Stay indoors
- Close windows
- Seek medical help if breathing difficulty

### Map Interactions

**Zoom:**
- Use mouse wheel or +/- buttons
- Pinch on mobile devices

**Pan:**
- Click and drag to move around
- Swipe on mobile devices

**View Details:**
- Hover over a zone (desktop)
- Click/tap on a zone (all devices)
- Popup shows zone-specific information

---

## 📱 Mobile Usage

The application is fully responsive and works on:
- Smartphones (iOS, Android)
- Tablets
- Desktop computers

**Mobile Tips:**
- Use landscape mode for better map view
- Tap zones instead of hovering
- Swipe to pan the map
- Pinch to zoom

---

## ❓ Troubleshooting

### Can't Access the Application

**Problem:** Browser shows "Can't reach this page"

**Solutions:**
1. Make sure the server is running (check Command Prompt window)
2. Verify you're using the correct URL: `http://localhost:3000`
3. Try a different browser
4. Check if port 3000 is already in use

### Login Not Working

**Problem:** "Invalid credentials" error

**Solutions:**
1. Double-check username and password (case-sensitive)
2. Use the exact credentials from the demo list
3. Clear browser cache and try again

### Map Not Loading

**Problem:** Map area is blank or gray

**Solutions:**
1. Check your internet connection (map tiles load from internet)
2. Refresh the page (F5)
3. Clear browser cache
4. Try a different browser

### Language Not Changing

**Problem:** Text stays in English when switching to Hindi

**Solutions:**
1. Click the language toggle again
2. Refresh the page
3. Clear browser cache
4. Log out and log back in

### Data Not Updating

**Problem:** Dashboard shows old data

**Solutions:**
1. Refresh the page (F5)
2. Log out and log back in
3. Check server is running
4. Verify internet connection

---

## 🎯 Best Practices

### For Health Officers
1. Check dashboard at least 3 times daily (morning, afternoon, evening)
2. Send alerts proactively when severity increases
3. Generate advisories before media briefings
4. Monitor population at risk statistics
5. Keep emergency contacts updated

### For Urban Planners
1. Use simulator before budget meetings
2. Compare multiple intervention scenarios
3. Focus on zones with consistent high AQI
4. Consider seasonal patterns
5. Document simulation results for reports

### For Beneficiaries
1. Check status every morning before planning your day
2. Subscribe to alerts (if available)
3. Follow health tips appropriate for your family
4. Share safe zone information with neighbors
5. Report breathing difficulties to health authorities

---

## 🔒 Privacy & Security

### Data Privacy
- Location data is zone-level, not GPS coordinates
- No personal health data is collected
- User credentials are encrypted
- Session expires after 24 hours

### Security Features
- Passwords are hashed (not stored in plain text)
- JWT tokens for secure authentication
- Role-based access control (server-side)
- HTTPS recommended for production

---

## 📞 Support & Feedback

### Getting Help
1. Check this user guide first
2. Review the README.md file
3. Check troubleshooting section
4. Contact system administrator

### Reporting Issues
When reporting problems, include:
- Your user role (Health Officer/Urban Planner/Beneficiary)
- Browser and version
- Steps to reproduce the issue
- Screenshot (if applicable)

---

## 📚 Additional Resources

### Understanding AQI
- AQI = Air Quality Index
- Measures pollutants: PM2.5, PM10, NO2, SO2, CO, O3
- Higher number = worse air quality
- Based on international standards

### Health Impact by Severity

**Good (0-50):**
- No health impact
- Air quality is satisfactory

**Moderate (51-100):**
- Acceptable air quality
- Sensitive individuals may experience minor symptoms

**High (101-200):**
- Unhealthy for sensitive groups
- General public may experience health effects
- Sensitive groups should limit outdoor activities

**Severe (201+):**
- Health alert
- Everyone may experience serious health effects
- Avoid all outdoor activities

### Vulnerable Groups
- Children under 12
- Adults over 65
- Pregnant women
- People with asthma
- People with COPD
- People with heart disease
- People with respiratory conditions

---

## 🎓 Training & Onboarding

### For New Users

**Week 1: Familiarization**
- Log in daily
- Explore all dashboard features
- Practice language switching
- Understand color codes

**Week 2: Active Use**
- Make decisions based on data
- Use simulator (planners)
- Send test alerts (health officers)
- Share with family (beneficiaries)

**Week 3: Advanced Features**
- Analyze trends
- Generate reports
- Optimize alert timing
- Provide feedback

---

## 📈 Future Updates

Planned features:
- Real-time sensor integration
- Historical data analytics
- Predictive modeling
- Mobile app
- WhatsApp integration
- Voice alerts
- Multi-city support

---

**Stay Safe, Stay Informed!**

*This platform is aligned with UN SDG-3: Good Health and Well-being*
