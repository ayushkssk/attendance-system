class AttendanceCalendar {
    constructor() {
        this.currentDate = new Date();
        this.initializeElements();
        this.addEventListeners();
        this.renderCalendar();
        this.loadAttendanceData();
    }

    initializeElements() {
        this.calendarGrid = document.getElementById('calendarGrid');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
    }

    addEventListeners() {
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
        this.loadAttendanceData();
    }

    async loadAttendanceData() {
        try {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth() + 1;
            
            const response = await fetch(
                `${CONFIG.API_ENDPOINTS.attendance}/monthly/${year}/${month}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to load attendance data');

            const data = await response.json();
            this.updateCalendarWithAttendance(data);
            this.updateSummary(data);
        } catch (error) {
            NotificationService.showError('Failed to load attendance data');
        }
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        this.currentMonthElement.textContent = new Date(year, month)
            .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Clear grid
        this.calendarGrid.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day header';
            dayHeader.textContent = day;
            this.calendarGrid.appendChild(dayHeader);
        });

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            this.calendarGrid.appendChild(emptyDay);
        }

        // Add days of month
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="day-status"></span>
            `;
            dayElement.dataset.date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            this.calendarGrid.appendChild(dayElement);
        }
    }

    updateCalendarWithAttendance(data) {
        const days = this.calendarGrid.querySelectorAll('.calendar-day[data-date]');
        days.forEach(day => {
            const date = day.dataset.date;
            const attendance = data.attendance.find(a => a.date === date);
            
            if (attendance) {
                day.classList.add(attendance.status);
                day.querySelector('.day-status').textContent = attendance.status;
            }
        });
    }

    updateSummary(data) {
        document.getElementById('presentDays').textContent = data.summary.present;
        document.getElementById('absentDays').textContent = data.summary.absent;
        document.getElementById('leaveDays').textContent = data.summary.leave;
        document.getElementById('holidays').textContent = data.summary.holidays;
    }
}

// Initialize calendar
document.addEventListener('DOMContentLoaded', () => {
    window.attendanceCalendar = new AttendanceCalendar();
}); 