// Configuration settings
const CONFIG = {
    OFFICE_LOCATION: {
        latitude: 25.605679,
        longitude: 85.169476,
        //radius: 100, // 100 meters radius
        radius: 10, // Reduce to 10 meters to test out of range
        name: "Office Location - Patna"
    },

    // Map configuration for visualization
    MAP_CONFIG: {
        defaultZoom: 16,
        circleColor: '#4a90e2',
        circleOpacity: 0.2,
        markerColor: '#ff4444'
    },

    // Working hours
    WORKING_HOURS: {
        start: '09:00',
        end: '18:00',
        timezone: 'Asia/Kolkata' // Indian timezone
    },

    // API endpoints
    API_ENDPOINTS: {
        attendance: '/api/attendance',
        profile: '/api/profile',
        leave: '/api/leave'
    }
};