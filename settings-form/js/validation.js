/**
 * Pure validation helpers for the user settings form.
 * Exported for use in the browser and in Node.js tests.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_THEMES = ['system', 'light', 'dark'];

/**
 * @param {Partial<{ firstName: string; lastName: string; email: string; theme: string }>} data
 * @returns {{ valid: boolean; errors: Record<string, string> }}
 */
function validateSettingsForm(data) {
  const errors = {};

  const firstName = (data.firstName ?? '').trim();
  const lastName = (data.lastName ?? '').trim();
  const email = (data.email ?? '').trim();
  const theme = (data.theme ?? '').trim();

  if (!firstName) {
    errors.firstName = 'First name is required.';
  }

  if (!lastName) {
    errors.lastName = 'Last name is required.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!theme) {
    errors.theme = 'Please select a theme preference.';
  } else if (!VALID_THEMES.includes(theme)) {
    errors.theme = 'Please select a valid theme preference.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateSettingsForm, EMAIL_PATTERN, VALID_THEMES };
}
