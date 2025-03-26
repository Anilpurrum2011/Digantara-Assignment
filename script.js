const formSteps = document.querySelectorAll('.form-step');
const nextButtons = document.querySelectorAll('.next-btn');
const backButtons = document.querySelectorAll('.back-btn');
const progressSteps = document.querySelectorAll('.progress-step');
const summaryDiv = document.getElementById('summary');
const form = document.getElementById('multiStepForm');

let currentStep = 0;

// Update form steps and progress bar
function updateForm() {
  formSteps.forEach((step, index) => {
    step.classList.toggle('active', index === currentStep);
  });

  progressSteps.forEach((step, index) => {
    step.classList.toggle('active', index <= currentStep);
  });

  // Display summary at Step 3
  if (currentStep === 2) {
    displaySummary();
  }
}

// Handle next button click
nextButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateForm();
    }
  });
});

// Handle back button click
backButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentStep--;
    updateForm();
  });
});

// Validate form step
function validateStep(step) {
  const inputs = formSteps[step].querySelectorAll('input, select, textarea');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.checkValidity()) {
      input.reportValidity();
      isValid = false;
    }
  });

  return isValid;
}

// Display summary at Step 3
function displaySummary() {
  const formData = new FormData(form);
  let summaryHTML = '<h3>Summary of Your Information</h3>';

  formData.forEach((value, key) => {
    summaryHTML += `<p><strong>${key}:</strong> ${value}</p>`;
  });

  summaryDiv.innerHTML = summaryHTML;
}

// Function to reset the form
function resetForm() {
  // Clear form fields
  form.reset();

  // Reset step counter
  currentStep = 0;
  updateForm();

  // Clear localStorage
  localStorage.removeItem('formData');
  localStorage.removeItem('formSubmitted'); // Clear the submission flag

  // Clear summary
  summaryDiv.innerHTML = '';
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Form submitted successfully!');
  resetForm(); // Reset the form after submission
  localStorage.setItem('formSubmitted', 'true'); // Set a flag
});

// Optional: Save form data to localStorage
function saveFormData() {
  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  localStorage.setItem('formData', JSON.stringify(data));
}

function loadFormData() {
  // Check if the form was previously submitted
  if (localStorage.getItem('formSubmitted') === 'true') {
    localStorage.removeItem('formSubmitted'); // Clear the flag
    return; // Do not load old data
  }

  // Load saved data
  const data = JSON.parse(localStorage.getItem('formData'));
  if (data) {
    Object.keys(data).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = data[key];
    });
  }
}

// Load saved data on page load
window.addEventListener('load', loadFormData);

// Save data on input change
form.addEventListener('input', saveFormData);