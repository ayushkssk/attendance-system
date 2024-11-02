class LocationVerificationModal {
    static show(locationData) {
        const modal = document.createElement('div');
        modal.className = 'location-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Location Verification</h2>
                <div id="locationMap" style="height: 300px; margin: 15px 0;"></div>
                <div class="location-info">
                    <p>Distance from office: ${locationData.distance} meters</p>
                    <p class="${locationData.isWithinRange ? 'text-success' : 'text-danger'}">
                        Status: ${locationData.isWithinRange ? 'Within range' : 'Out of range'}
                    </p>
                </div>
                <div class="modal-buttons">
                    ${locationData.isWithinRange ? `
                        <button class="confirm-btn" onclick="LocationVerificationModal.confirm()">
                            <i class="fas fa-check"></i> Confirm Check-in
                        </button>
                    ` : ''}
                    <button class="cancel-btn" onclick="LocationVerificationModal.close()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Initialize map after modal is added to DOM
        const map = GeolocationService.showLocationOnMap('locationMap');
        
        // Add current location marker if available
        if (locationData.coordinates?.current) {
            L.marker([
                locationData.coordinates.current.latitude,
                locationData.coordinates.current.longitude
            ])
            .bindPopup('Your Location')
            .addTo(map);
        }
    }

    static confirm() {
        // Trigger check-in process
        document.dispatchEvent(new CustomEvent('location-confirmed'));
        this.close();
    }

    static close() {
        const modal = document.querySelector('.location-modal');
        if (modal) {
            modal.remove();
        }
    }
} 