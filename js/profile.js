class ProfileManager {
    constructor() {
        this.initializeElements();
        this.loadProfileData();
        this.addEventListeners();
    }

    initializeElements() {
        this.profileAvatar = document.getElementById('profileAvatar');
        this.editAvatarBtn = document.querySelector('.edit-avatar-btn');
        this.editCoverBtn = document.querySelector('.edit-cover-btn');
        this.skillsContainer = document.getElementById('skillsContainer');
        this.addSkillBtn = document.getElementById('addSkillBtn');
        this.editProfileModal = document.getElementById('editProfileModal');
    }

    addEventListeners() {
        // Avatar upload
        this.editAvatarBtn.addEventListener('click', () => this.handleImageUpload('avatar'));
        this.editCoverBtn.addEventListener('click', () => this.handleImageUpload('cover'));
        this.addSkillBtn.addEventListener('click', () => this.showAddSkillModal());

        // Make fields editable on click
        document.querySelectorAll('[data-field]').forEach(field => {
            field.addEventListener('click', () => this.makeFieldEditable(field));
        });
    }

    async loadProfileData() {
        try {
            const response = await fetch(`${CONFIG.API_ENDPOINTS.profile}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load profile data');
            
            const profileData = await response.json();
            this.updateProfileUI(profileData);
        } catch (error) {
            NotificationService.showError('Failed to load profile data');
        }
    }

    updateProfileUI(data) {
        // Update all data-field elements
        Object.entries(data).forEach(([key, value]) => {
            const element = document.querySelector(`[data-field="${key}"]`);
            if (element) element.textContent = value;
        });

        // Update avatar if exists
        if (data.avatarUrl) {
            this.profileAvatar.src = data.avatarUrl;
        }

        // Update skills
        if (data.skills) {
            this.renderSkills(data.skills);
        }
    }

    async handleImageUpload(type) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('type', type);

                    const response = await fetch(`${CONFIG.API_ENDPOINTS.profile}/upload-image`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: formData
                    });

                    if (!response.ok) throw new Error('Upload failed');

                    const data = await response.json();
                    if (type === 'avatar') {
                        this.profileAvatar.src = data.imageUrl;
                    }
                    NotificationService.showSuccess('Image uploaded successfully');
                } catch (error) {
                    NotificationService.showError('Failed to upload image');
                }
            }
        };

        input.click();
    }

    makeFieldEditable(field) {
        const currentValue = field.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.className = 'editable-input';

        field.textContent = '';
        field.appendChild(input);
        input.focus();

        input.onblur = () => this.handleFieldUpdate(field, input);
        input.onkeypress = (e) => {
            if (e.key === 'Enter') input.blur();
        };
    }

    async handleFieldUpdate(field, input) {
        const newValue = input.value.trim();
        const fieldName = field.dataset.field;

        if (newValue !== field.textContent) {
            try {
                const response = await fetch(`${CONFIG.API_ENDPOINTS.profile}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        [fieldName]: newValue
                    })
                });

                if (!response.ok) throw new Error('Update failed');

                field.textContent = newValue;
                NotificationService.showSuccess('Updated successfully');
            } catch (error) {
                field.textContent = input.defaultValue;
                NotificationService.showError('Failed to update field');
            }
        } else {
            field.textContent = input.defaultValue;
        }
    }

    renderSkills(skills) {
        this.skillsContainer.innerHTML = skills.map(skill => `
            <div class="skill-tag">
                ${skill}
                <button class="remove-skill-btn" onclick="profileManager.removeSkill('${skill}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    showAddSkillModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Add New Skill</h3>
                <input type="text" id="newSkillInput" placeholder="Enter skill name">
                <div class="modal-buttons">
                    <button onclick="profileManager.addSkill()">Add</button>
                    <button onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('newSkillInput').focus();
    }

    async addSkill() {
        const input = document.getElementById('newSkillInput');
        const skill = input.value.trim();
        
        if (skill) {
            try {
                const response = await fetch(`${CONFIG.API_ENDPOINTS.profile}/skills`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ skill })
                });

                if (!response.ok) throw new Error('Failed to add skill');

                const { skills } = await response.json();
                this.renderSkills(skills);
                document.querySelector('.modal').remove();
                NotificationService.showSuccess('Skill added successfully');
            } catch (error) {
                NotificationService.showError('Failed to add skill');
            }
        }
    }

    async removeSkill(skill) {
        try {
            const response = await fetch(`${CONFIG.API_ENDPOINTS.profile}/skills/${skill}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to remove skill');

            const { skills } = await response.json();
            this.renderSkills(skills);
            NotificationService.showSuccess('Skill removed successfully');
        } catch (error) {
            NotificationService.showError('Failed to remove skill');
        }
    }
}

// Initialize profile manager
const profileManager = new ProfileManager();
