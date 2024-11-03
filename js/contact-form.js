document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        // Validate form
        if (!ContactFormValidator.validateForm(formData)) {
            return;
        }

        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        // Hide any existing messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        try {
            // Add your API endpoint here
            const response = await fetch('/api/access-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Show success message
            successMessage.style.display = 'block';
            contactForm.reset();
            
            // Redirect to login page after delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            errorMessage.style.display = 'block';
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
        }
    });
}); 