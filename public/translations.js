// Translation system for English and Hindi
const translations = {
    en: {
        // Login Page
        'login.title': 'Respiratory Health Platform',
        'login.subtitle': 'SDG-3: Good Health and Well-being',
        'login.username': 'Username',
        'login.password': 'Password',
        'login.button': 'Sign In',
        'login.demo': 'Demo Credentials:',
        'login.error': 'Invalid credentials. Please try again.',

        // Loading Screen
        'loading.message': 'Analyzing respiratory risk data...',

        // Common
        'common.logout': 'Logout',
        'common.updated': 'Updated',
        'common.close': 'Close',

        // Health Officer Dashboard
        'ho.dashboard.title': 'Health Officer Dashboard',
        'ho.heatmap.title': 'Respiratory Severity Heatmap',
        'ho.severity.title': 'Medical Severity Classification',
        'ho.population.title': 'Population at Risk',
        'ho.measures.title': '🏥 Recommended Medical Measures',
        'ho.generate.advisory': 'Generate Advisory Document',
        'ho.send.alert': 'Send Alert to Beneficiaries',
        'ho.zones.affected': 'zones affected',
        'ho.high.risk.zones': 'High-Risk Zones',
        'ho.estimated.affected': 'Estimated Affected',
        'ho.people': 'people',
        'ho.vulnerable.groups': 'Vulnerable Groups:',
        'ho.children': 'Children (0-12)',
        'ho.elderly': 'Elderly (65+)',
        'ho.asthma': 'Asthma patients',
        'ho.copd': 'COPD patients',

        // Medical Measures
        'measures.immediate': 'Immediate Actions (0-6 hours):',
        'measures.immediate.1': 'Issue public health advisory via media',
        'measures.immediate.2': 'Alert hospitals to prepare respiratory units',
        'measures.immediate.3': 'Distribute N95 masks to vulnerable populations',
        'measures.short': 'Short-term Measures (6-24 hours):',
        'measures.short.1': 'Set up mobile health camps in affected zones',
        'measures.short.2': 'Coordinate with schools to cancel outdoor activities',
        'measures.short.3': 'Activate telemedicine support for respiratory queries',
        'measures.medium': 'Medium-term Planning (24-72 hours):',
        'measures.medium.1': 'Monitor hospital admission rates for respiratory cases',
        'measures.medium.2': 'Stockpile bronchodilators and emergency medications',
        'measures.medium.3': 'Prepare evacuation plan for critical care patients',

        // Urban Planner Dashboard
        'up.dashboard.title': 'Urban Planner Dashboard',
        'up.heatmap.title': 'Respiratory Severity Heatmap',
        'up.zones.title': 'High-Risk Zones (AQI > 100)',
        'up.infrastructure.title': '🏗️ Infrastructure Intervention Simulator',
        'up.zone.type': 'Zone Type',
        'up.cause': 'Cause',
        'up.action': 'Recommended Action',
        'up.traffic': 'Traffic congestion',
        'up.industrial': 'Industrial emissions',
        'up.dust': 'Vehicular + dust',

        // Beneficiary Dashboard
        'ben.dashboard.title': 'Air Quality Status',
        'ben.status.title': 'My Location Status',
        'ben.forecast.title': 'What to Expect Today',
        'ben.map.title': 'Respiratory Risk Map',
        'ben.tips.title': '💡 Health Tips for Today',
        'ben.safe.zones.title': '🌳 Safer Areas Near You',

        // Severity Labels
        'severity.good': 'SAFE',
        'severity.moderate': 'BE CAREFUL',
        'severity.high': 'AVOID OUTDOOR',
        'severity.severe': 'HIGH RISK - STAY IN',

        // Legend
        'legend.low': 'Low (0-50)',
        'legend.mild': 'Mild (51-100)',
        'legend.high': 'High (101-200)',
        'legend.severe': 'Severe (201+)',
        'legend.good': 'Good (0-50)',
        'legend.moderate': 'Moderate (51-100)',
        'legend.safe': 'Safe',
        'legend.careful': 'Be Careful',
        'legend.avoid': 'Avoid Outdoor',
        'legend.highrisk': 'High Risk',

        // Health Tips
        'tips.everyone': 'For Everyone:',
        'tips.everyone.1': 'Drink plenty of water',
        'tips.everyone.2': 'Avoid smoking',
        'tips.everyone.3': 'Use public transport',
        'tips.children': 'For Children:',
        'tips.children.1': 'Keep them indoors today',
        'tips.children.2': 'Watch for coughing/wheezing',
        'tips.elderly': 'For Elderly:',
        'tips.elderly.1': 'Avoid morning walks today',
        'tips.elderly.2': 'Keep medicines handy',

        // Recommendations
        'rec.severe': 'DO NOT go outside. Close all windows. Seek medical help if breathing difficulty.',
        'rec.high': 'Avoid outdoor activities. Use N95 masks if going out.',
        'rec.moderate': 'Limit strenuous outdoor activities. Sensitive groups should be cautious.',
        'rec.good': 'Air quality is good. Enjoy outdoor activities!',

        // Status Messages
        'status.severe.title': 'HIGH RISK - STAY INDOORS',
        'status.severe.desc': 'Air quality is very poor.',
        'status.severe.action': 'Stay inside. Close windows. Wear mask if you go out.',
        'status.high.title': 'AVOID OUTDOOR ACTIVITIES',
        'status.high.desc': 'Air quality is poor in your area.',
        'status.high.action': 'Stay indoors as much as possible. Use N95 mask if going out.',
        'status.moderate.title': 'BE CAREFUL',
        'status.moderate.desc': 'Air quality is moderate.',
        'status.moderate.action': 'Limit strenuous activities. Sensitive groups be cautious.',
        'status.good.title': 'SAFE',
        'status.good.desc': 'Air quality is good today.',
        'status.good.action': 'You can go outside normally. Enjoy outdoor activities!',

        // Forecast
        'forecast.now': 'Now',
        'forecast.evening': 'Evening',
        'forecast.night': 'Night',
        'forecast.tomorrow': 'Tomorrow',
        'forecast.message': 'Air quality will improve slightly by evening. Still better to stay indoors today.',

        // Safe Zones
        'safezone.status': 'Status',
        'safezone.distance': 'Distance',
        'safezone.km': 'km',

        // Modal
        'modal.zone': 'Zone',
        'modal.aqi': 'AQI',
        'modal.severity': 'Severity',
        'modal.pollutants': 'Pollutants',
        'modal.health.impact': 'Health Impact',
        'modal.recommendation': 'Recommendation',
        'modal.zone.type': 'Zone Type',
        'modal.trend': 'Trend',
        'modal.planning.note': 'Planning Note'
    },

    hi: {
        // Login Page
        'login.title': 'श्वसन स्वास्थ्य मंच',
        'login.subtitle': 'SDG-3: अच्छा स्वास्थ्य और कल्याण',
        'login.username': 'उपयोगकर्ता नाम',
        'login.password': 'पासवर्ड',
        'login.button': 'साइन इन करें',
        'login.demo': 'डेमो क्रेडेंशियल:',
        'login.error': 'अमान्य क्रेडेंशियल। कृपया पुनः प्रयास करें।',

        // Loading Screen
        'loading.message': 'श्वसन जोखिम डेटा का विश्लेषण किया जा रहा है...',

        // Common
        'common.logout': 'लॉगआउट',
        'common.updated': 'अपडेट किया गया',
        'common.close': 'बंद करें',

        // Health Officer Dashboard
        'ho.dashboard.title': 'स्वास्थ्य अधिकारी डैशबोर्ड',
        'ho.heatmap.title': 'श्वसन गंभीरता हीटमैप',
        'ho.severity.title': 'चिकित्सा गंभीरता वर्गीकरण',
        'ho.population.title': 'जोखिम में जनसंख्या',
        'ho.measures.title': '🏥 अनुशंसित चिकित्सा उपाय',
        'ho.generate.advisory': 'सलाहकार दस्तावेज़ बनाएं',
        'ho.send.alert': 'लाभार्थियों को अलर्ट भेजें',
        'ho.zones.affected': 'क्षेत्र प्रभावित',
        'ho.high.risk.zones': 'उच्च जोखिम क्षेत्र',
        'ho.estimated.affected': 'अनुमानित प्रभावित',
        'ho.people': 'लोग',
        'ho.vulnerable.groups': 'संवेदनशील समूह:',
        'ho.children': 'बच्चे (0-12)',
        'ho.elderly': 'बुजुर्ग (65+)',
        'ho.asthma': 'दमा के रोगी',
        'ho.copd': 'COPD रोगी',

        // Medical Measures
        'measures.immediate': 'तत्काल कार्रवाई (0-6 घंटे):',
        'measures.immediate.1': 'मीडिया के माध्यम से सार्वजनिक स्वास्थ्य सलाह जारी करें',
        'measures.immediate.2': 'अस्पतालों को श्वसन इकाइयां तैयार करने के लिए सचेत करें',
        'measures.immediate.3': 'संवेदनशील आबादी को N95 मास्क वितरित करें',
        'measures.short': 'अल्पकालिक उपाय (6-24 घंटे):',
        'measures.short.1': 'प्रभावित क्षेत्रों में मोबाइल स्वास्थ्य शिविर स्थापित करें',
        'measures.short.2': 'स्कूलों के साथ बाहरी गतिविधियों को रद्द करने के लिए समन्वय करें',
        'measures.short.3': 'श्वसन प्रश्नों के लिए टेलीमेडिसिन सहायता सक्रिय करें',
        'measures.medium': 'मध्यम अवधि योजना (24-72 घंटे):',
        'measures.medium.1': 'श्वसन मामलों के लिए अस्पताल प्रवेश दरों की निगरानी करें',
        'measures.medium.2': 'ब्रोन्कोडायलेटर्स और आपातकालीन दवाओं का भंडार करें',
        'measures.medium.3': 'गंभीर देखभाल रोगियों के लिए निकासी योजना तैयार करें',

        // Urban Planner Dashboard
        'up.dashboard.title': 'शहरी योजनाकार डैशबोर्ड',
        'up.heatmap.title': 'श्वसन गंभीरता हीटमैप',
        'up.zones.title': 'उच्च जोखिम क्षेत्र (AQI > 100)',
        'up.infrastructure.title': '🏗️ बुनियादी ढांचा हस्तक्षेप सिमुलेटर',
        'up.zone.type': 'क्षेत्र प्रकार',
        'up.cause': 'कारण',
        'up.action': 'अनुशंसित कार्रवाई',
        'up.traffic': 'यातायात भीड़',
        'up.industrial': 'औद्योगिक उत्सर्जन',
        'up.dust': 'वाहन + धूल',

        // Beneficiary Dashboard
        'ben.dashboard.title': 'वायु गुणवत्ता स्थिति',
        'ben.status.title': 'मेरे स्थान की स्थिति',
        'ben.forecast.title': 'आज क्या उम्मीद करें',
        'ben.map.title': 'श्वसन जोखिम मानचित्र',
        'ben.tips.title': '💡 आज के लिए स्वास्थ्य सुझाव',
        'ben.safe.zones.title': '🌳 आपके पास सुरक्षित क्षेत्र',

        // Severity Labels
        'severity.good': 'सुरक्षित',
        'severity.moderate': 'सावधान रहें',
        'severity.high': 'बाहर न जाएं',
        'severity.severe': 'उच्च जोखिम - घर में रहें',

        // Legend
        'legend.low': 'निम्न (0-50)',
        'legend.mild': 'हल्का (51-100)',
        'legend.high': 'उच्च (101-200)',
        'legend.severe': 'गंभीर (201+)',
        'legend.good': 'अच्छा (0-50)',
        'legend.moderate': 'मध्यम (51-100)',
        'legend.safe': 'सुरक्षित',
        'legend.careful': 'सावधान रहें',
        'legend.avoid': 'बाहर न जाएं',
        'legend.highrisk': 'उच्च जोखिम',

        // Health Tips
        'tips.everyone': 'सभी के लिए:',
        'tips.everyone.1': 'खूब पानी पिएं',
        'tips.everyone.2': 'धूम्रपान से बचें',
        'tips.everyone.3': 'सार्वजनिक परिवहन का उपयोग करें',
        'tips.children': 'बच्चों के लिए:',
        'tips.children.1': 'उन्हें आज घर के अंदर रखें',
        'tips.children.2': 'खांसी/घरघराहट पर ध्यान दें',
        'tips.elderly': 'बुजुर्गों के लिए:',
        'tips.elderly.1': 'आज सुबह की सैर से बचें',
        'tips.elderly.2': 'दवाएं तैयार रखें',

        // Recommendations
        'rec.severe': 'बाहर न जाएं। सभी खिड़कियां बंद करें। सांस लेने में कठिनाई हो तो चिकित्सा सहायता लें।',
        'rec.high': 'बाहरी गतिविधियों से बचें। बाहर जाएं तो N95 मास्क पहनें।',
        'rec.moderate': 'कठिन बाहरी गतिविधियों को सीमित करें। संवेदनशील समूह सावधान रहें।',
        'rec.good': 'हवा की गुणवत्ता अच्छी है। बाहरी गतिविधियों का आनंद लें!',

        // Status Messages
        'status.severe.title': 'उच्च जोखिम - घर के अंदर रहें',
        'status.severe.desc': 'हवा की गुणवत्ता बहुत खराब है।',
        'status.severe.action': 'अंदर रहें। खिड़कियां बंद करें। बाहर जाएं तो मास्क पहनें।',
        'status.high.title': 'बाहरी गतिविधियों से बचें',
        'status.high.desc': 'आपके क्षेत्र में हवा की गुणवत्ता खराब है।',
        'status.high.action': 'यथासंभव घर के अंदर रहें। बाहर जाएं तो N95 मास्क पहनें।',
        'status.moderate.title': 'सावधान रहें',
        'status.moderate.desc': 'हवा की गुणवत्ता मध्यम है।',
        'status.moderate.action': 'कठिन गतिविधियों को सीमित करें। संवेदनशील समूह सावधान रहें।',
        'status.good.title': 'सुरक्षित',
        'status.good.desc': 'आज हवा की गुणवत्ता अच्छी है।',
        'status.good.action': 'आप सामान्य रूप से बाहर जा सकते हैं। बाहरी गतिविधियों का आनंद लें!',

        // Forecast
        'forecast.now': 'अभी',
        'forecast.evening': 'शाम',
        'forecast.night': 'रात',
        'forecast.tomorrow': 'कल',
        'forecast.message': 'शाम तक हवा की गुणवत्ता में थोड़ा सुधार होगा। फिर भी आज घर के अंदर रहना बेहतर है।',

        // Safe Zones
        'safezone.status': 'स्थिति',
        'safezone.distance': 'दूरी',
        'safezone.km': 'किमी',

        // Modal
        'modal.zone': 'क्षेत्र',
        'modal.aqi': 'AQI',
        'modal.severity': 'गंभीरता',
        'modal.pollutants': 'प्रदूषक',
        'modal.health.impact': 'स्वास्थ्य प्रभाव',
        'modal.recommendation': 'सिफारिश',
        'modal.zone.type': 'क्षेत्र प्रकार',
        'modal.trend': 'प्रवृत्ति',
        'modal.planning.note': 'योजना नोट'
    }
};

// Translation function
function t(key, lang = null) {
    const currentLang = lang || localStorage.getItem('language') || 'en';
    return translations[currentLang][key] || key;
}

// Update all translatable elements
function updateTranslations(lang) {
    document.querySelectorAll('[id]').forEach(element => {
        const id = element.id;

        // Map element IDs to translation keys
        const translationMap = {
            // Login
            'login-title': 'login.title',
            'login-subtitle': 'login.subtitle',
            'label-username': 'login.username',
            'label-password': 'login.password',
            'login-btn-text': 'login.button',
            'demo-title': 'login.demo',

            // Loading
            'loading-text': 'loading.message',

            // Health Officer
            'ho-dashboard-title': 'ho.dashboard.title',
            'ho-heatmap-title': 'ho.heatmap.title',
            'ho-severity-title': 'ho.severity.title',
            'ho-population-title': 'ho.population.title',
            'ho-measures-title': 'ho.measures.title',
            'ho-generate-text': 'ho.generate.advisory',
            'ho-send-text': 'ho.send.alert',
            'logout-text-ho': 'common.logout',

            // Urban Planner
            'up-dashboard-title': 'up.dashboard.title',
            'up-heatmap-title': 'up.heatmap.title',
            'up-zones-title': 'up.zones.title',
            'up-infrastructure-title': 'up.infrastructure.title',
            'logout-text-up': 'common.logout',

            // Beneficiary
            'ben-dashboard-title': 'ben.dashboard.title',
            'ben-forecast-title': 'ben.forecast.title',
            'ben-map-title': 'ben.map.title',
            'ben-tips-title': 'ben.tips.title',
            'ben-safe-zones-title': 'ben.safe.zones.title',
            'logout-text-ben': 'common.logout',

            // Legends
            'legend-low': 'legend.low',
            'legend-mild': 'legend.mild',
            'legend-high': 'legend.high',
            'legend-severe': 'legend.severe',
            'up-legend-good': 'legend.good',
            'up-legend-moderate': 'legend.moderate',
            'up-legend-high': 'legend.high',
            'up-legend-severe': 'legend.severe',
            'ben-legend-safe': 'legend.safe',
            'ben-legend-careful': 'legend.careful',
            'ben-legend-avoid': 'legend.avoid',
            'ben-legend-highrisk': 'legend.highrisk'
        };

        if (translationMap[id]) {
            element.textContent = t(translationMap[id], lang);
        }
    });

    // Update language toggle buttons
    document.querySelectorAll('[id^="lang-text-"]').forEach(btn => {
        btn.textContent = lang.toUpperCase();
    });

    // Save language preference
    localStorage.setItem('language', lang);
}
