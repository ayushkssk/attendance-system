document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Basic validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        // Here you would typically make an API call to your backend
        attemptLogin(email, password, rememberMe);
    });
    
    function attemptLogin(email, password, rememberMe) {
        // Simulate API call
        // Replace this with your actual API call
        setTimeout(() => {
            // For demo purposes, always succeed
            const userData = {
                name: 'John Doe',
                email: email,
                token: 'dummy-token'
            };
            
            if (rememberMe) {
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('userData', JSON.stringify(userData));
            }
            
            // Redirect to main page
            window.location.href = 'index.html';
        }, 1000);
    }
    
    function showError(message) {
        // You can implement your own error display mechanism
        alert(message);
    }
}); 