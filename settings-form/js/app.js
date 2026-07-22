(function () {
  const form = document.getElementById('settings-form');
  const statusRegion = document.getElementById('form-status');

  const fields = {
    firstName: {
      input: document.getElementById('first-name'),
      error: document.getElementById('first-name-error'),
    },
    lastName: {
      input: document.getElementById('last-name'),
      error: document.getElementById('last-name-error'),
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
    },
    theme: {
      input: document.getElementById('theme'),
      error: document.getElementById('theme-error'),
    },
  };

  function getFormData() {
    return {
      firstName: fields.firstName.input.value,
      lastName: fields.lastName.input.value,
      email: fields.email.input.value,
      theme: fields.theme.input.value,
    };
  }

  function clearFieldError(fieldKey) {
    const field = fields[fieldKey];
    field.error.textContent = '';
    field.input.setAttribute('aria-invalid', 'false');
  }

  function showFieldError(fieldKey, message) {
    const field = fields[fieldKey];
    field.error.textContent = message;
    field.input.setAttribute('aria-invalid', 'true');
  }

  function clearAllErrors() {
    Object.keys(fields).forEach(clearFieldError);
  }

  function announceStatus(message) {
    statusRegion.textContent = message;
  }

  function showValidationErrors(errors) {
    Object.entries(errors).forEach(([fieldKey, message]) => {
      showFieldError(fieldKey, message);
    });

    const errorCount = Object.keys(errors).length;
    announceStatus(
      `Form has ${errorCount} error${errorCount === 1 ? '' : 's'}. Please review the fields below.`
    );

    const firstInvalidKey = Object.keys(errors)[0];
    if (firstInvalidKey && fields[firstInvalidKey]) {
      fields[firstInvalidKey].input.focus();
    }
  }

  Object.values(fields).forEach((field) => {
    field.input.addEventListener('input', () => {
      const fieldKey = Object.keys(fields).find((key) => fields[key].input === field.input);
      if (fieldKey) {
        clearFieldError(fieldKey);
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearAllErrors();

    const result = validateSettingsForm(getFormData());

    if (!result.valid) {
      showValidationErrors(result.errors);
      return;
    }

    announceStatus('Settings saved successfully.');
    form.reset();
    clearAllErrors();
  });
})();
