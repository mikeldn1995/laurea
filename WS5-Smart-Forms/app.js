// ===== DOM References =====
// Get references to the form and key elements
const form = document.getElementById('signup-form');
const errorSummary = document.getElementById('error-summary');
const errorList = document.getElementById('error-list');
const entriesSection = document.getElementById('entries-section');
const entriesList = document.getElementById('entries-list');

// Get references to all input fields
const fields = {
    fullname: document.getElementById('fullname'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirm-password')
};

// ===== Custom Validation Messages =====
// Define user-friendly error messages for each field
const validationMessages = {
    fullname: 'Please enter your full name (2-50 characters).',
    email: 'Please enter a valid email address.',
    phone: 'Please enter a valid phone number.',
    username: 'Username must be 3-20 characters (letters, numbers, underscores).',
    password: 'Password must be at least 8 characters.',
    confirmPassword: 'Passwords do not match.'
};

// ===== Field Validation Function =====
// Validates a single field and shows/hides error messages
function validateField(field, fieldName) {
    const errorSpan = document.getElementById(fieldName + '-error') ||
                      document.getElementById('confirm-password-error');

    // Special validation for confirm password
    if (fieldName === 'confirmPassword') {
        if (field.value !== fields.password.value) {
            field.setCustomValidity('Passwords do not match.');
        } else {
            field.setCustomValidity('');
        }
    }

    // Check validity and update UI
    if (!field.checkValidity()) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        field.setAttribute('aria-invalid', 'true');
        errorSpan.textContent = validationMessages[fieldName];
        return false;
    } else {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.removeAttribute('aria-invalid');
        errorSpan.textContent = '';
        return true;
    }
}

// ===== Real-Time Validation on Input =====
// Add input event listeners to validate fields as the user types
Object.entries(fields).forEach(([name, field]) => {
    field.addEventListener('input', () => {
        validateField(field, name);
        saveDraft(); // Autosave on every input change
    });
});

// ===== Autosave: Save Draft to localStorage =====
// Saves form data to localStorage so it persists across page refreshes
function saveDraft() {
    const draft = {
        fullname: fields.fullname.value,
        email: fields.email.value,
        phone: fields.phone.value,
        username: fields.username.value
        // Note: Never save passwords to localStorage for security
    };
    localStorage.setItem('smartFormDraft', JSON.stringify(draft));
    console.log('Saved Draft:', draft);
}

// ===== Autosave: Restore Draft from localStorage =====
// Restores previously saved form data when the page loads
function restoreDraft() {
    const saved = localStorage.getItem('smartFormDraft');
    if (saved) {
        const draft = JSON.parse(saved);
        fields.fullname.value = draft.fullname || '';
        fields.email.value = draft.email || '';
        fields.phone.value = draft.phone || '';
        fields.username.value = draft.username || '';
        console.log('Restored Draft:', draft);
    }
}

// Restore draft when page loads
restoreDraft();

// ===== Display Saved Entries =====
// Shows all previously submitted entries from localStorage
function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('smartFormEntries') || '[]');
    entriesList.innerHTML = '';

    if (entries.length > 0) {
        entriesSection.hidden = false;
        entries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${entry.fullname} (${entry.email}) - ${entry.username}`;
            entriesList.appendChild(li);
        });
    } else {
        entriesSection.hidden = true;
    }
}

// Display entries when page loads
displayEntries();

// ===== Form Submission =====
// Handles form submission with validation and data storage
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default browser submission

    let isValid = true;
    const errors = [];

    // Validate all fields
    Object.entries(fields).forEach(([name, field]) => {
        if (!validateField(field, name)) {
            isValid = false;
            const label = field.closest('.form-group').querySelector('label').textContent.replace(' *', '');
            errors.push({ field: field.id, message: `${label}: ${validationMessages[name]}` });
        }
    });

    // Show or hide error summary
    if (!isValid) {
        errorList.innerHTML = '';
        errors.forEach(error => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#' + error.field;
            link.textContent = error.message;
            link.addEventListener('click', function (e) {
                e.preventDefault();
                document.getElementById(error.field).focus();
            });
            li.appendChild(link);
            errorList.appendChild(li);
        });
        errorSummary.hidden = false;
        errorSummary.focus();
        console.log('Validation failed:', errors);
        return;
    }

    // Hide error summary on success
    errorSummary.hidden = true;

    // Save entry to localStorage
    const newEntry = {
        fullname: fields.fullname.value,
        email: fields.email.value,
        phone: fields.phone.value,
        username: fields.username.value,
        timestamp: new Date().toISOString()
    };

    const entries = JSON.parse(localStorage.getItem('smartFormEntries') || '[]');
    entries.push(newEntry);
    localStorage.setItem('smartFormEntries', JSON.stringify(entries));

    // Clear the draft since submission is complete
    localStorage.removeItem('smartFormDraft');

    // Reset form and update UI
    form.reset();
    Object.values(fields).forEach(field => {
        field.classList.remove('valid', 'invalid');
        field.removeAttribute('aria-invalid');
    });

    displayEntries();
    console.log('Form submitted successfully:', newEntry);
    alert('Signup successful! Your entry has been saved.');
});

// ===== Step 4: Phone Number Normalisation =====
// Normalises phone number format when user leaves the phone field
fields.phone.addEventListener('blur', function () {
    let phone = fields.phone.value.trim();

    if (phone === '') return; // Skip if empty

    // Remove all non-digit characters except leading +
    let hasPlus = phone.startsWith('+');
    let digits = phone.replace(/\D/g, '');

    // If started with +, keep it
    if (hasPlus) {
        digits = '+' + digits;
    }

    // Format Finnish numbers: +358 XX XXXXXXX
    if (digits.startsWith('+358') && digits.length >= 12) {
        const country = digits.slice(0, 4);
        const area = digits.slice(4, 6);
        const number = digits.slice(6);
        fields.phone.value = `${country} ${area} ${number}`;
    } else if (digits.startsWith('0') && digits.length >= 10) {
        // Convert local format (0XX XXXXXXX) to international
        const area = digits.slice(1, 3);
        const number = digits.slice(3);
        fields.phone.value = `+358 ${area} ${number}`;
    } else {
        // For other formats, just clean up spacing
        fields.phone.value = digits;
    }

    console.log('Phone normalised to:', fields.phone.value);
    saveDraft();
});
