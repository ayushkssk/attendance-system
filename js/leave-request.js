class LeaveRequestManager {
    constructor() {
        this.initializeElements();
        this.loadLeaveBalance();
        this.loadLeaveHistory();
        this.addEventListeners();
    }

    initializeElements() {
        this.leaveForm = document.getElementById('leaveRequestForm');
        this.leaveHistoryList = document.getElementById('leaveHistoryList');
        this.startDateInput = this.leaveForm.querySelector('[name="startDate"]');
        this.endDateInput = this.leaveForm.querySelector('[name="endDate"]');
    }

    addEventListeners() {
        this.leaveForm.addEventListener('submit', (e) => this.handleLeaveSubmit(e));
        
        // Date validation
        this.startDateInput.addEventListener('change', () => this.validateDates());
        this.endDateInput.addEventListener('change', () => this.validateDates());
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        this.startDateInput.min = today;
        this.endDateInput.min = today;
    }

    async loadLeaveBalance() {
        try {
            const response = await fetch(`${CONFIG.API_ENDPOINTS.leave}/balance`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to load leave balance');

            const balance = await response.json();
            this.updateLeaveBalance(balance);
        } catch (error) {
            NotificationService.showError('Failed to load leave balance');
        }
    }

    updateLeaveBalance(balance) {
        document.getElementById('annualLeaveBalance').textContent = balance.annual;
        document.getElementById('sickLeaveBalance').textContent = balance.sick;
        document.getElementById('personalLeaveBalance').textContent = balance.personal;
    }

    async loadLeaveHistory() {
        try {
            const response = await fetch(`${CONFIG.API_ENDPOINTS.leave}/history`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to load leave history');

            const history = await response.json();
            this.renderLeaveHistory(history);
        } catch (error) {
            NotificationService.showError('Failed to load leave history');
        }
    }

    renderLeaveHistory(history) {
        this.leaveHistoryList.innerHTML = history.map(leave => `
            <div class="leave-history-item">
                <div class="leave-details">
                    <h3>${leave.type} Leave</h3>
                    <div class="leave-dates">
                        ${new Date(leave.startDate).toLocaleDateString()} - 
                        ${new Date(leave.endDate).toLocaleDateString()}
                    </div>
                    <div class="leave-reason">${leave.reason}</div>
                </div>
                <div class="leave-status status-${leave.status.toLowerCase()}">
                    ${leave.status}
                </div>
            </div>
        `).join('');
    }

    validateDates() {
        const startDate = new Date(this.startDateInput.value);
        const endDate = new Date(this.endDateInput.value);

        if (endDate < startDate) {
            this.endDateInput.value = this.startDateInput.value;
            NotificationService.showError('End date cannot be before start date');
        }
    }

    calculateLeaveDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let days = 0;
        const current = new Date(start);

        while (current <= end) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
                days++;
            }
            current.setDate(current.getDate() + 1);
        }
        return days;
    }

    async handleLeaveSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.leaveForm);
        const leaveData = Object.fromEntries(formData);

        // Calculate leave days
        const days = this.calculateLeaveDays(leaveData.startDate, leaveData.endDate);

        try {
            const response = await fetch(CONFIG.API_ENDPOINTS.leave, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...leaveData,
                    days
                })
            });

            if (!response.ok) throw new Error('Failed to submit leave request');

            const result = await response.json();
            NotificationService.showSuccess('Leave request submitted successfully');
            
            // Reset form and reload data
            this.leaveForm.reset();
            this.loadLeaveBalance();
            this.loadLeaveHistory();
        } catch (error) {
            NotificationService.showError('Failed to submit leave request');
        }
    }
}

// Initialize leave request manager
document.addEventListener('DOMContentLoaded', () => {
    window.leaveRequestManager = new LeaveRequestManager();
}); 