// Global variables
let map;
let transportLayers = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeEventListeners();
    animateFareBars();
});

// Initialize Leaflet Map
function initializeMap() {
    // Initialize map centered on Metro Manila
    map = L.map('metro-map').setView([14.5995, 120.9842], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create layer groups for different transport modes
    transportLayers = {
        mrt: L.layerGroup(),
        lrt: L.layerGroup(),
        bus: L.layerGroup(),
        jeepney: L.layerGroup(),
        all: L.layerGroup()
    };

    // Add all layers to map initially
    Object.values(transportLayers).forEach(layer => layer.addTo(map));

    // Add MRT-3 Line
    const mrtStations = [
        [14.6563, 121.0327], // North Avenue
        [14.6505, 121.0297], // Quezon Avenue
        [14.6368, 121.0248], // GMA-Kamuning
        [14.6297, 121.0205], // Cubao
        [14.6198, 121.0162], // Santolan-Annapolis
        [14.6095, 121.0118], // Ortigas
        [14.5995, 121.0075], // Shaw Boulevard
        [14.5895, 121.0032], // Boni
        [14.5795, 120.9988], // Guadalupe
        [14.5695, 120.9945], // Buendia
        [14.5595, 120.9902], // Ayala
        [14.5495, 120.9858], // Magallanes
        [14.5395, 120.9815]  // Taft Avenue
    ];

    const mrtLine = L.polyline(mrtStations, {
        color: '#E91E63',
        weight: 4,
        opacity: 0.8
    }).addTo(transportLayers.mrt);

    // Add MRT stations
    mrtStations.forEach((station, index) => {
        const stationNames = [
            'North Avenue', 'Quezon Avenue', 'GMA-Kamuning', 'Cubao',
            'Santolan-Annapolis', 'Ortigas', 'Shaw Boulevard', 'Boni',
            'Guadalupe', 'Buendia', 'Ayala', 'Magallanes', 'Taft Avenue'
        ];
        
        L.circleMarker(station, {
            color: '#E91E63',
            fillColor: '#E91E63',
            fillOpacity: 0.8,
            radius: 6
        }).bindPopup(`<b>MRT-3: ${stationNames[index]}</b><br>Fare: ₱15-28`).addTo(transportLayers.mrt);
    });

    // Add LRT-1 Line
    const lrt1Stations = [
        [14.6563, 121.0200], // Roosevelt
        [14.6463, 121.0180], // Balintawak
        [14.6363, 121.0160], // Monumento
        [14.6263, 121.0140], // 5th Avenue
        [14.6163, 121.0120], // R. Papa
        [14.6063, 121.0100], // Abad Santos
        [14.5963, 121.0080], // Blumentritt
        [14.5863, 121.0060], // Tayuman
        [14.5763, 121.0040], // Bambang
        [14.5663, 121.0020], // Doroteo Jose
        [14.5563, 121.0000], // Carriedo
        [14.5463, 120.9980], // Central Terminal
        [14.5363, 120.9960], // UN Avenue
        [14.5263, 120.9940], // Pedro Gil
        [14.5163, 120.9920], // Quirino
        [14.5063, 120.9900], // Vito Cruz
        [14.4963, 120.9880], // Gil Puyat
        [14.4863, 120.9860], // Libertad
        [14.4763, 120.9840], // EDSA
        [14.4663, 120.9820]  // Baclaran
    ];

    const lrt1Line = L.polyline(lrt1Stations, {
        color: '#2196F3',
        weight: 4,
        opacity: 0.8
    }).addTo(transportLayers.lrt);

    // Add major bus routes (EDSA)
    const edsaBusRoute = [
        [14.6563, 121.0327], // Monumento area
        [14.6297, 121.0205], // Cubao
        [14.6095, 121.0118], // Ortigas
        [14.5595, 120.9902], // Ayala
        [14.5395, 120.9815], // Magallanes
        [14.4663, 120.9820]  // Baclaran
    ];

    L.polyline(edsaBusRoute, {
        color: '#4CAF50',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 5'
    }).bindPopup('<b>EDSA Bus Route</b><br>Fare: ₱12-45').addTo(transportLayers.bus);

    // Add sample jeepney routes
    const jeepneyRoutes = [
        {
            name: 'Cubao-Quiapo',
            route: [[14.6297, 121.0205], [14.6000, 121.0100], [14.5800, 121.0050], [14.5600, 121.0020]],
            fare: '₱12-15'
        },
        {
            name: 'Divisoria-Baclaran',
            route: [[14.6000, 121.0300], [14.5500, 121.0000], [14.5000, 120.9900], [14.4663, 120.9820]],
            fare: '₱12-18'
        }
    ];

    jeepneyRoutes.forEach(route => {
        L.polyline(route.route, {
            color: '#FF9800',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 5'
        }).bindPopup(`<b>${route.name}</b><br>Fare: ${route.fare}`).addTo(transportLayers.jeepney);
    });

    // Add all layers to the 'all' group
    transportLayers.all.addLayer(transportLayers.mrt);
    transportLayers.all.addLayer(transportLayers.lrt);
    transportLayers.all.addLayer(transportLayers.bus);
    transportLayers.all.addLayer(transportLayers.jeepney);
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation toggle for mobile
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Transport filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Filter map layers
            const transport = e.target.getAttribute('data-transport');
            filterTransportLayers(transport);
        });
    });

    // Tab functionality for transport modes
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.textContent.toLowerCase().includes('rail') ? 'rail' :
                           e.target.textContent.toLowerCase().includes('bus') ? 'bus' :
                           e.target.textContent.toLowerCase().includes('jeepney') ? 'jeepney' : 'other';
            showTransportTab(tabName);
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Filter transport layers on map
function filterTransportLayers(transport) {
    // Remove all layers first
    Object.values(transportLayers).forEach(layer => {
        map.removeLayer(layer);
    });

    // Add selected layer(s)
    if (transport === 'all') {
        transportLayers.all.addTo(map);
    } else if (transportLayers[transport]) {
        transportLayers[transport].addTo(map);
    }
}

// Show transport tab
function showTransportTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.transport-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Find route function
function findRoute() {
    const fromLocation = document.getElementById('from-location').value;
    const toLocation = document.getElementById('to-location').value;
    const resultsDiv = document.getElementById('route-results');
    
    if (!fromLocation || !toLocation) {
        alert('Please select both starting point and destination');
        return;
    }
    
    if (fromLocation === toLocation) {
        alert('Starting point and destination cannot be the same');
        return;
    }
    
    // Sample route suggestions (in a real app, this would connect to a routing API)
    const routeSuggestions = generateRouteSuggestions(fromLocation, toLocation);
    
    resultsDiv.innerHTML = `
        <h4>Suggested Routes from ${formatLocationName(fromLocation)} to ${formatLocationName(toLocation)}:</h4>
        ${routeSuggestions}
    `;
    resultsDiv.style.display = 'block';
}

// Generate route suggestions
function generateRouteSuggestions(from, to) {
    let routes = [];
    
    // Manila to Makati - Use LRT-1
    if ((from === 'manila' && to === 'makati') || (from === 'makati' && to === 'manila')) {
        routes = [
            {
                mode: 'LRT-1 (Recommended)',
                time: '15-25 minutes',
                fare: '₱20-50 (₱10-25 students)',
                description: 'Take LRT-1  from any Manila station, then walk/jeepney to final destination in Makati (Gil Puyat Station is also nearby in Makati)'
            },
            {
                mode: 'City Bus',
                time: '30-45 minutes',
                fare: '₱25-40',
                description: 'Direct bus route via major roads'
            },
            {
                mode: 'Taxi/Grab',
                time: '20-35 minutes',
                fare: '₱150-250',
                description: 'Direct door-to-door service'
            }
        ];
    }
    // Quezon City to Makati - Use MRT-3
    else if ((from === 'quezon-city' && to === 'makati') || (from === 'makati' && to === 'quezon-city')) {
        routes = [
            {
                mode: 'MRT-3 (Recommended)',
                time: 'Peak: 30-45 min | Off-peak: 20-30 min',
                fare: '₱20-22',
                description: 'Take MRT-3 from North Avenue to Ayala Station, then walk/jeepney to final destination'
            },
            {
                mode: 'City Bus',
                time: '1-1.5 hours',
                fare: '₱70',
                description: 'Direct bus route via EDSA'
            },
            {
                mode: 'Taxi/Grab',
                time: '38-40 minutes',
                fare: '₱210-262',
                description: 'Direct service, consistent timing'
            }
        ];
    }
    // BGC to Manila
    else if ((from === 'bgc' && to === 'manila') || (from === 'manila' && to === 'bgc')) {
        routes = [
            {
                mode: 'BGC Bus (Recommended)',
                time: '20-30 minutes',
                fare: '₱15 flat rate',
                description: 'Take BGC Bus (East/West route) to EDSA Ayala, then jeepney/bus to Manila'
            },
            {
                mode: 'Jeepney via C5',
                time: '35-50 minutes',
                fare: '₱20-30',
                description: 'Jeepney route along C5 corridor'
            }
        ];
    }
    // Ortigas to Alabang
    else if ((from === 'ortigas' && to === 'alabang') || (from === 'alabang' && to === 'ortigas')) {
        routes = [
            {
                mode: 'MRT-3 + P2P Bus (Recommended)',
                time: '1h 45min - 1h 50min',
                fare: '₱70 total',
                description: 'MRT-3 (Ortigas → Ayala) + P2P bus to Alabang'
            },
            {
                mode: 'Direct P2P Bus',
                time: '1.5-2 hours',
                fare: '₱140',
                description: 'Direct point-to-point bus service'
            }
        ];
    }
    // Fairview to BGC
    else if ((from === 'fairview' && to === 'bgc') || (from === 'bgc' && to === 'fairview')) {
        routes = [
            {
                mode: 'Multi-modal (Recommended)',
                time: '2-3 hours (heavy traffic)',
                fare: '₱60-70 total',
                description: 'SM Fairview → MRT/Carousel → Guadalupe/Ayala → BGC Bus'
            },
            {
                mode: 'Direct Nova Bus',
                time: '2-2.5 hours',
                fare: '₱70',
                description: 'Direct bus via C5 (infrequent service)'
            }
        ];
    }
    // Generic routes for other combinations
    else {
        routes = [
            {
                mode: 'Rail Transit + Transfer',
                time: '45-90 minutes',
                fare: '₱20-50',
                description: 'Use MRT/LRT to nearest station, then transfer to local transport'
            },
            {
                mode: 'Bus Route',
                time: '1-2 hours',
                fare: '₱25-70',
                description: 'Direct or connecting bus routes'
            },
            {
                mode: 'Taxi/Grab',
                time: '30-60 minutes',
                fare: '₱150-400',
                description: 'Direct door-to-door service (varies by distance)'
            }
        ];
    }
    
    return routes.map(route => `
        <div class="route-suggestion">
            <div class="route-mode"><strong>${route.mode}</strong></div>
            <div class="route-details">
                <span class="route-time"><i class="fas fa-clock"></i> ${route.time}</span>
                <span class="route-fare"><i class="fas fa-peso-sign"></i> ${route.fare}</span>
            </div>
            <div class="route-description">${route.description}</div>
        </div>
    `).join('');
}

// Format location name
function formatLocationName(location) {
    return location.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Calculate fare function
function calculateFare() {
    const distance = parseFloat(document.getElementById('distance').value);
    const transportMode = document.getElementById('transport-mode').value;
    const resultDiv = document.getElementById('fare-result');
    
    if (!distance || distance <= 0) {
        alert('Please enter a valid distance');
        return;
    }
    
    let fare = 0;
    let description = '';
    
    switch (transportMode) {
        case 'jeepney':
            fare = Math.max(12, Math.ceil(distance * 1.5));
            description = 'Jeepney fare calculation: Base fare ₱12 + distance';
            break;
        case 'bus-ordinary':
            fare = Math.max(12, Math.ceil(distance * 2));
            description = 'Ordinary bus fare: Base fare ₱12 + distance';
            break;
        case 'bus-aircon':
            fare = Math.max(15, Math.ceil(distance * 2.5));
            description = 'Air-conditioned bus fare: Base fare ₱15 + distance';
            break;
        case 'mrt':
        case 'lrt':
            fare = Math.min(30, Math.max(15, Math.ceil(distance * 1.8)));
            description = 'Rail transit fare: ₱15-30 depending on distance';
            break;
        case 'taxi':
            fare = 40 + (distance * 13.5);
            description = 'Taxi fare: ₱40 base + ₱13.50 per km';
            break;
        case 'grab':
            fare = 50 + (distance * 15);
            description = 'Grab fare estimate: Base fare + per km rate';
            break;
    }
    
    resultDiv.innerHTML = `
        <div class="fare-calculation">
            <div class="calculated-fare">Estimated Fare: <strong>₱${Math.ceil(fare)}</strong></div>
            <div class="fare-description">${description}</div>
            <div class="fare-note"><em>*Fares are estimates and may vary based on actual conditions</em></div>
        </div>
    `;
    resultDiv.style.display = 'block';
}

// Animate fare bars
function animateFareBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.fare-bar-fill');
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.width = bar.style.width || '0%';
                        // Trigger reflow
                        bar.offsetHeight;
                        // Animate to full width
                        const targetWidth = bar.getAttribute('style').match(/width:\s*(\d+%)/);
                        if (targetWidth) {
                            bar.style.width = targetWidth[1];
                        }
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const fareSection = document.querySelector('.fare-comparison');
    if (fareSection) {
        observer.observe(fareSection);
    }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to route cards
    document.querySelectorAll('.route-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to tip cards
    document.querySelectorAll('.tip-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add floating animation to hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((btn, index) => {
        btn.style.animationDelay = `${index * 0.2}s`;
        btn.classList.add('float-animation');
    });
});

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    .float-animation {
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .route-suggestion {
        background: white;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 10px;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .route-mode {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: #333;
    }
    
    .route-details {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: #666;
    }
    
    .route-description {
        font-size: 0.9rem;
        color: #777;
    }
    
    .fare-calculation {
        text-align: center;
    }
    
    .calculated-fare {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .fare-description {
        margin-bottom: 0.5rem;
        opacity: 0.9;
    }
    
    .fare-note {
        font-size: 0.8rem;
        opacity: 0.7;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .route-details {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
`;
document.head.appendChild(style);
