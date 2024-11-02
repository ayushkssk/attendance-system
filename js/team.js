class TeamDashboard {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
        this.loadTeamData();
    }

    initializeElements() {
        this.membersList = document.getElementById('membersList');
        this.leaveRequestsList = document.getElementById('leaveRequestsList');
        this.searchInput = document.getElementById('searchMembers');
        this.statusFilter = document.getElementById('statusFilter');
    }

    addEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterMembers());
        this.statusFilter.addEventListener('change', () => this.filterMembers());
    }

    async loadTeamData() {
        try {
            const [teamData, leaveRequests] = await Promise.all([
                this.fetchTeamData(),
                this.fetchLeaveRequests()
            ]);

            this.updateTeamStats(teamData);
            this.renderTeamMembers(teamData.members);
            this.renderLeaveRequests(leaveRequests);
        } catch (error) {
            NotificationService.showError('Failed to load team data');
        }
    }

    async fetchTeamData() {
        const response = await fetch(`${CONFIG.API_ENDPOINTS.team}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch team data');
        return await response.json();
    }

    async fetchLeaveRequests() {
        const response = await fetch(`${CONFIG.API_ENDPOINTS.team}/leave-requests`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch leave requests');
        return await response.json();
    }

    updateTeamStats(data) {
        document.getElementById('totalMembers').textContent = data.totalMembers;
        document.getElementById('presentToday').textContent = data.presentToday;
        document.getElementById('onLeave').textContent = data.onLeave;
    }

    renderTeamMembers(members) {
        this.membersList.innerHTML = members.map(member => `
            <div class="member-card" data-status="${member.status}">
                <img src="${member.avatar}" alt="${member.name}" class="member-avatar">
                <div class="member-info">
                    <h3 class="member-name">${member.name}</h3>
                    <div class="member-role">${member.role}</div>
                </div>
                <span class="member-status status-${member.status.toLowerCase()}">
                    ${member.status}
                </span>
            </div>
        `).join('');
    }

    renderLeaveRequests(requests) {
        this.leaveRequestsList.innerHTML = requests.map(request => `
            <div class="request-card">
                <div class="request-header">
                    <h4>${request.employeeName}</h4>
                    <span class="request-dates">
                        ${new Date(request.startDate).toLocaleDateString()} - 
                        ${new Date(request.endDate).toLocaleDateString()}
                    </span>
                </div>
                <p>${request.reason}</p>
                <div class="request-actions">
                    <button class="action-btn approve-btn" 
                            onclick="teamDashboard.handleLeaveAction('${request.id}', 'approve')">
                        Approve
                    </button>
                    <button class="action-btn reject-btn"
                            onclick="teamDashboard.handleLeaveAction('${request.id}', 'reject')">
                        Reject
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterMembers() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const statusFilter = this.statusFilter.value;

        const memberCards = this.membersList.querySelectorAll('.member-card');
        memberCards.forEach(card => {
            const name = card.querySelector('.member-name').textContent.toLowerCase();
            const status = card.dataset.status.toLowerCase();
            const matchesSearch = name.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || status === statusFilter;

            card.style.display = matchesSearch && matchesStatus ? 'flex' : 'none';
        });
    }

    async handleLeaveAction(requestId, action) {
        try {
            const response = await fetch(`${CONFIG.API_ENDPOINTS.team}/leave-requests/${requestId}/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error(`Failed to ${action} leave request`);

            NotificationService.showSuccess(`Leave request ${action}ed successfully`);
            this.loadTeamData(); // Reload data
        } catch (error) {
            NotificationService.showError(`Failed to ${action} leave request`);
        }
    }
}

// Initialize team dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.teamDashboard = new TeamDashboard();
}); 