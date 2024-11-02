class GeolocationService {
    static async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        });
    }

    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    }

    static async checkOfficeProximity() {
        try {
            const position = await this.getCurrentPosition();
            const distance = this.calculateDistance(
                position.coords.latitude,
                position.coords.longitude,
                CONFIG.OFFICE_LOCATION.latitude,
                CONFIG.OFFICE_LOCATION.longitude
            );
            
            return {
                isWithinRange: distance <= CONFIG.OFFICE_LOCATION.radius,
                distance: Math.round(distance),
                coordinates: {
                    current: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    office: {
                        latitude: CONFIG.OFFICE_LOCATION.latitude,
                        longitude: CONFIG.OFFICE_LOCATION.longitude
                    }
                }
            };
        } catch (error) {
            throw new Error(`Location check failed: ${error.message}`);
        }
    }

    static showLocationOnMap(containerId) {
        const map = L.map(containerId).setView(
            [CONFIG.OFFICE_LOCATION.latitude, CONFIG.OFFICE_LOCATION.longitude],
            CONFIG.MAP_CONFIG.defaultZoom
        );

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add office marker
        L.marker([CONFIG.OFFICE_LOCATION.latitude, CONFIG.OFFICE_LOCATION.longitude])
            .bindPopup(CONFIG.OFFICE_LOCATION.name)
            .addTo(map);

        // Add radius circle
        L.circle(
            [CONFIG.OFFICE_LOCATION.latitude, CONFIG.OFFICE_LOCATION.longitude],
            {
                radius: CONFIG.OFFICE_LOCATION.radius,
                color: CONFIG.MAP_CONFIG.circleColor,
                fillColor: CONFIG.MAP_CONFIG.circleColor,
                fillOpacity: CONFIG.MAP_CONFIG.circleOpacity
            }
        ).addTo(map);

        return map;
    }
}