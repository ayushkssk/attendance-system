class AttendanceSystem {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
        this.loadAttendanceStatus();
    }

    initializeElements() {
        this.checkInButton = document.getElementById('checkInButton');
        this.checkOutButton = document.getElementById('checkOutButton');
    }

    addEventListeners() {
        this.checkInButton.addEventListener('click', () => this.handleCheckIn());
        this.checkOutButton.addEventListener('click', () => this.handleCheckOut());
        
        // Listen for location confirmation
        document.addEventListener('location-confirmed', () => this.processCheckIn());
    }

    async handleCheckIn() {
        try {
            // Show loading state
            this.checkInButton.disabled = true;
            this.checkInButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking location...';

            const locationCheck = await GeolocationService.checkOfficeProximity();
            
            // Reset button state
            this.checkInButton.disabled = false;
            this.checkInButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Check In';

            // Show location verification modal
            LocationVerificationModal.show(locationCheck);

        } catch (error) {
            // Reset button state
            this.checkInButton.disabled = false;
            this.checkInButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Check In';
            
            NotificationService.showError(error.message);
        }
    }

    async processCheckIn() {
        try {
            // Show loading state
            this.checkInButton.disabled = true;
            this.checkInButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            // Make API call to record attendance
            const response = await fetch(`${CONFIG.API_ENDPOINTS.attendance}/check-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to record attendance');
            }

            // Update UI
            this.checkInButton.disabled = true;
            this.checkOutButton.disabled = false;
            this.checkInButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Checked In';
            
            NotificationService.showSuccess('Successfully checked in!');
            
            // Update local storage
            localStorage.setItem('attendanceStatus', 'checked-in');

        } catch (error) {
            // Reset button state
            this.checkInButton.disabled = false;
            this.checkInButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Check In';
            
            NotificationService.showError('Failed to process check-in');
        }
    }

    async handleCheckOut() {
        try {
            this.checkOutButton.disabled = true;
            this.checkOutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            const response = await fetch(`${CONFIG.API_ENDPOINTS.attendance}/check-out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to record check-out');
            }

            // Update UI
            this.checkInButton.disabled = false;
            this.checkOutButton.disabled = true;
            this.checkOutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Checked Out';
            
            NotificationService.showSuccess('Successfully checked out!');
            
            // Update local storage
            localStorage.setItem('attendanceStatus', 'checked-out');

        } catch (error) {
            // Reset button state
            this.checkOutButton.disabled = false;
            this.checkOutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Check Out';
            
            NotificationService.showError('Failed to process check-out');
        }
    }

    loadAttendanceStatus() {
        const status = localStorage.getItem('attendanceStatus');
        if (status === 'checked-in') {
            this.checkInButton.disabled = true;
            this.checkOutButton.disabled = false;
            this.checkInButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Checked In';
        } else {
            this.checkInButton.disabled = false;
            this.checkOutButton.disabled = true;
            this.checkOutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Check Out';
        }
    }
}

// Initialize attendance system
document.addEventListener('DOMContentLoaded', () => {
    window.attendanceSystem = new AttendanceSystem();
});