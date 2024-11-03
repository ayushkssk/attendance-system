class ContactFormValidator {
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validateEmployeeId(id) {
        // Customize this based on your employee ID format
        const regex = /^[A-Z0-9]{4,10}$/;
        return !id || regex.test(id); // Optional field
    }

    static showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }

    static clearFieldErrors() {
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.form-input.error').forEach(field => field.classList.remove('error'));
    }

    static validateForm(formData) {
        this.clearFieldErrors();
        let isValid = true;

        // Required fields
        const requiredFields = ['fullName', 'email', 'department'];
        requiredFields.forEach(field => {
            if (!formData.get(field).trim()) {
                const element = document.getElementById(field);
                this.showFieldError(element, 'This field is required');
                isValid = false;
            }
        });

        // Email validation
        if (!this.validateEmail(formData.get('email'))) {
            const emailField = document.getElementById('email');
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        // Employee ID validation (if provided)
        const employeeId = formData.get('employeeId');
        if (employeeId && !this.validateEmployeeId(employeeId)) {
            const idField = document.getElementById('employeeId');
            this.showFieldError(idField, 'Invalid employee ID format');
            isValid = false;
        }

        return isValid;
    }
} 