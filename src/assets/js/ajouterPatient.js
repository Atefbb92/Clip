document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtn = document.querySelector('.btn-next');
    const backBtn = document.querySelector('.btn-back');
    const cancelBtn = document.querySelector('.btn-cancel');
    const closeBtn = document.querySelector('.close-btn');
    let currentStep = 0;

    // Handle card selection
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const button = card.querySelector('.select-btn');
            button.textContent = 'Sélectionné';
        });
    });

    // Handle condition tag selection
    const conditionTags = document.querySelectorAll('.condition-tag');
    conditionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
        });
    });

    function updateSteps() {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index < currentStep) {
                step.classList.add('completed');
            } else if (index === currentStep) {
                step.classList.add('active');
            }
        });

        formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === currentStep) {
                step.classList.add('active');
            }
        });

        // Update button visibility
        backBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateSteps();
        }
    });

    backBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateSteps();
        }
    });

    cancelBtn.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir annuler ce cas ?')) {
            console.log('Case cancelled');
        }
    });

    closeBtn.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir fermer cette fenêtre ?')) {
            console.log('Window closed');
        }
    });

    // Initialize steps
    updateSteps();
});

document.addEventListener('DOMContentLoaded', function() {
    // Handle arcade selection
    const arcadeInputs = document.querySelectorAll('input[name="arcade"]');
    const maxillaireOptions = document.querySelectorAll('input[name="maxillaire-option"]');
    
    arcadeInputs.forEach(input => {
        input.addEventListener('change', function() {
            maxillaireOptions.forEach(option => {
                option.disabled = this.value !== 'maxillaire';
            });
        });
    });
    const mandibulaireOptions = document.querySelectorAll('input[name="mandibulaire-option"]');
    
    arcadeInputs.forEach(input => {
        input.addEventListener('change', function() {
            mandibulaireOptions.forEach(option => {
                option.disabled = this.value !== 'mandibulaire';
            });
        });
    });
    // Handle restrictions radio buttons
    const restrictionsInputs = document.querySelectorAll('input[name="restrictions"]');
    const teethCheckboxes = document.querySelectorAll('.tooth-box input[type="checkbox"]');
    
    restrictionsInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'none') {
                teethCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
            }
        });
    });
});