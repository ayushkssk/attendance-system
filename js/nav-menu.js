document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle menu
    menuToggle.addEventListener('click', function() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu function
    function closeMenuHandler() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close menu events
    closeMenu.addEventListener('click', closeMenuHandler);
    menuOverlay.addEventListener('click', closeMenuHandler);

    // Handle logout
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Clear storage
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userData');
        // Redirect to login
        window.location.href = 'login.html';
    });

    // Highlight current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenuHandler();
        }
    });
}); 