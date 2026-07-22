const STORAGE_KEY = "flyrank-settings";

const DEFAULTS = {
  displayName: "",
  email: "",
  bio: "",
  emailNotifications: true,
  weeklyDigest: false,
  marketingEmails: false,
  theme: "system",
  language: "en",
  timezone: "UTC",
  publicProfile: true,
  showActivity: false,
};

const form = document.getElementById("settings-form");
const statusEl = document.getElementById("status-message");

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveSettings(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function populateForm(settings) {
  for (const [key, value] of Object.entries(settings)) {
    const field = form.elements[key];
    if (!field) continue;

    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = value;
    }
  }

  applyTheme(settings.theme);
}

function collectFormData() {
  const data = {};
  for (const [key, defaultValue] of Object.entries(DEFAULTS)) {
    const field = form.elements[key];
    if (!field) continue;

    data[key] = field.type === "checkbox" ? field.checked : field.value;
  }
  return data;
}

function validate(data) {
  const errors = [];

  if (data.displayName.trim().length === 0) {
    errors.push("Display name is required.");
  }

  if (data.email.trim().length === 0) {
    errors.push("Email address is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address.");
  }

  return errors;
}

function showStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = "status-message" + (type ? ` ${type}` : "");

  if (message) {
    clearTimeout(showStatus._timer);
    showStatus._timer = setTimeout(() => {
      statusEl.textContent = "";
      statusEl.className = "status-message";
    }, 4000);
  }
}

function clearValidation() {
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
}

function markInvalid(name) {
  const field = form.elements[name];
  if (field) field.classList.add("invalid");
}

// Initialize
const saved = loadSettings();
populateForm(saved);

// Live theme preview
form.elements.theme.addEventListener("change", (e) => {
  applyTheme(e.target.value);
});

// Save
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearValidation();

  const data = collectFormData();
  const errors = validate(data);

  if (errors.length > 0) {
    if (data.displayName.trim().length === 0) markInvalid("displayName");
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      markInvalid("email");
    }
    showStatus(errors[0], "error");
    return;
  }

  saveSettings(data);
  showStatus("Settings saved successfully.", "success");
});

// Cancel — revert to last saved state
document.getElementById("cancel-btn").addEventListener("click", () => {
  clearValidation();
  populateForm(loadSettings());
  showStatus("Changes discarded.");
});

// Reset to defaults
document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("Reset all settings to their defaults?")) return;

  clearValidation();
  saveSettings(DEFAULTS);
  populateForm(DEFAULTS);
  showStatus("All settings reset to defaults.", "success");
});

// Delete account (demo)
document.getElementById("delete-btn").addEventListener("click", () => {
  const confirmed = confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  populateForm(DEFAULTS);
  showStatus("Account deleted (demo — data cleared from local storage).", "success");
});
