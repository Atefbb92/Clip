// Sample patient data
const patients = [
    {
        id: '#1234567',
        name: 'Boubaker Atef',
        avatar: 'assets/img/patient.png',
        startDate: '2022/12/01',
        status: {
            submitted: true,
            planApproved: true,
            alignerShipped: true
        },
        conditions: ['Protursion', 'Crowding', 'CrowSpacingding', 'Anterior Crossbite']
    },
    {
        id: '#1234567',
        name: 'Nouha Jaafar',
        avatar: 'assets/img/patient.png',
        startDate: '2022/12/01',
        status: {
            submitted: true,
            planApproved: false,
            alignerShipped: false
        },
        conditions: ['Protursion', 'Crowding', 'CrowSpacingding', 'Anterior Crossbite']
    },
    {
        id: '#1234567',
        name: 'Ons Hamza',
        avatar: 'assets/img/patient.png',
        startDate: '2022/12/01',
        status: {
            submitted: true,
            planApproved: true,
            alignerShipped: false
        },
        conditions: ['Protursion', 'Crowding', 'CrowSpacingding', 'Anterior Crossbite']
    },
    {
        id: '#1234567',
        name: 'Alaeddine Ben Yahia',
        avatar: 'assets/img/patient.png',
        startDate: '2022/12/01',
        status: {
            submitted: true,
            planApproved: true,
            alignerShipped: true
        },
        conditions: ['Protursion', 'Crowding', 'CrowSpacingding', 'Anterior Crossbite']
    },
];

// Function to create status timeline
function createStatusTimeline(status) {
    return `
        <div class="status-timeline">
            <div class="status-step">
                <div class="status-dot ${status.submitted ? 'completed' : ''}"></div>
                <span>Cas soumis</span>
            </div>
            <div class="status-step">
                <div class="status-dot ${status.planApproved ? 'completed' : status.submitted ? 'current' : ''}"></div>
                <span>Plans de traitement approuvés</span>
            </div>
            <div class="status-step">
                <div class="status-dot ${status.alignerShipped ? 'completed' : status.planApproved ? 'current' : ''}"></div>
                <span>Aligneur expédié</span>
            </div>
        </div>
    `;
}

// Function to create condition tags
function createConditionTags(conditions) {
    return `
        <div class="conditions">
            ${conditions.map(condition => `
                <span class="condition-tag">${condition}</span>
            `).join('')}
        </div>
    `;
}

// Function to populate the table
function populateTable() {
    const tableBody = document.getElementById('patientsTableBody');
    tableBody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>
                <div class="patient-info">
                    <img src="${patient.avatar}" alt="${patient.name}" class="patient-avatar">
                    <span>${patient.name}</span>
                </div>
            </td>
            <td>${patient.startDate}</td>
            <td>${createStatusTimeline(patient.status)}</td>
            <td>${createConditionTags(patient.conditions)}</td>
        </tr>
    `).join('');
}

// Initialize the table
document.addEventListener('DOMContentLoaded', () => {
    populateTable();
});

// Add event listeners for tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');
    });
});

// Add event listener for search
document.querySelector('.search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.getElementById('patientsTableBody');
    tableBody.innerHTML = filteredPatients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>
                <div class="patient-info">
                    <img src="${patient.avatar}" alt="${patient.name}" class="patient-avatar">
                    <span>${patient.name}</span>
                </div>
            </td>
            <td>${patient.startDate}</td>
            <td>${createStatusTimeline(patient.status)}</td>
            <td>${createConditionTags(patient.conditions)}</td>
        </tr>
    `).join('');
});

// Add event listener for add btn
document.querySelector('.add-patient-btn').addEventListener('click', (e) => {
    window.location.href = 'ajouterPatient.html';
});