document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    const app = {
        init() {
            this.initializeUI();
            this.initializeTheme();
            this.startClock();
            this.initializeCalendar();
            this.addEventListeners();
        },

        initializeUI() {
            this.menuToggle = document.getElementById('menuToggle');
            this.sideMenu = document.getElementById('sideMenu');
            this.themeToggle = document.getElementById('themeToggle');
            this.userName = document.getElementById('userName');
            
            // Set user name from session/local storage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            this.userName.textContent = user.name || 'User';
        },

        initializeTheme() {
            const isDarkMode = localStorage.getItem('darkMode') === 'true';
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        },

        startClock() {
            const updateClock = () => {
                const now = new Date();
                document.getElementById('currentTime').textContent = 
                    now.toLocaleTimeString('en-US', { 
                        hour12: true, 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                    });
                document.getElementById('currentDate').textContent = 
                    now.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
            };

            updateClock();
            setInterval(updateClock, 1000);
        },

        initializeCalendar() {
            const calendar = new Calendar('calendar');
            calendar.render();
        },

        addEventListeners() {
            // Menu toggle
            this.menuToggle.addEventListener('click', () => {
                this.sideMenu.classList.toggle('open');
            });

            // Theme toggle
            this.themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
                this.themeToggle.innerHTML = isDarkMode ? 
                    '<i class="fas fa-sun"></i>' : 
                    '<i class="fas fa-moon"></i>';
            });

            // Logout handler
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        },

        handleLogout() {
            const confirmLogout = confirm('Are you sure you want to logout?');
            if (confirmLogout) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }
        }
    };

    // Initialize the application
    app.init();
});
