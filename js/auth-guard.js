// Create this new file to handle authentication checks
class AuthGuard {
    static checkAuth() {
        const isLoggedIn = !!localStorage.getItem('userData') || !!sessionStorage.getItem('userData');
        const publicPages = ['/login.html', '/contact-admin.html'];
        const currentPage = window.location.pathname;

        if (!isLoggedIn && !publicPages.some(page => currentPage.endsWith(page))) {
            // Not logged in and trying to access protected page
            window.location.href = 'login.html';
            return false;
        }

        if (isLoggedIn && publicPages.some(page => currentPage.endsWith(page))) {
            // Already logged in and trying to access public page
            window.location.href = 'index.html';
            return false;
        }

        return true;
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', () => {
    AuthGuard.checkAuth();
}); 