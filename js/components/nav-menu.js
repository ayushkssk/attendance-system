class NavigationMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.menuPanel = document.getElementById('menuPanel');
        this.closeMenu = document.getElementById('closeMenu');
        this.overlay = document.createElement('div');
        this.overlay.className = 'menu-overlay';
        document.body.appendChild(this.overlay);
        
        this.initializeEventListeners();
        this.highlightCurrentPage();
    }

    initializeEventListeners() {
        this.menuToggle.addEventListener('click', () => this.openMenu());
        this.closeMenu.addEventListener('click', () => this.closeMenu());
        this.overlay.addEventListener('click', () => this.closeMenu());
        
        // Handle logout
        document.querySelector('.menu-logout').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
    }

    openMenu() {
        this.menuPanel.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.menuPanel.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.menu-item').forEach(item => {
            const itemPage = item.getAttribute('href');
            if (itemPage === currentPage) {
                item.classList.add('active');
            }
        });
    }

    handleLogout() {
        // Clear storage
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userData');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Initialize the menu when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationMenu();
}); 