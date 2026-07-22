const { validateSettingsForm } = require('../js/validation.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed += 1;
    console.log(`  PASS: ${message}`);
  } else {
    failed += 1;
    console.error(`  FAIL: ${message}`);
  }
}

function test(name, fn) {
  console.log(`\n${name}`);
  fn();
}

test('empty required fields are rejected', () => {
  const result = validateSettingsForm({
    firstName: '',
    lastName: '',
    email: '',
    theme: '',
  });

  assert(result.valid === false, 'form should be invalid when required fields are empty');
  assert(result.errors.firstName === 'First name is required.', 'first name error is shown');
  assert(result.errors.lastName === 'Last name is required.', 'last name error is shown');
  assert(result.errors.email === 'Email is required.', 'email error is shown');
  assert(result.errors.theme === 'Please select a theme preference.', 'theme error is shown');
});

test('invalid email format is rejected', () => {
  const result = validateSettingsForm({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'not-an-email',
    theme: 'light',
  });

  assert(result.valid === false, 'form should be invalid for malformed email');
  assert(
    result.errors.email === 'Please enter a valid email address.',
    'email format error is shown'
  );
  assert(result.errors.firstName === undefined, 'first name should not error');
  assert(result.errors.lastName === undefined, 'last name should not error');
});

test('valid data passes validation', () => {
  const result = validateSettingsForm({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    theme: 'dark',
  });

  assert(result.valid === true, 'form should be valid with complete correct data');
  assert(Object.keys(result.errors).length === 0, 'no field errors should be returned');
});

test('whitespace-only required fields are rejected', () => {
  const result = validateSettingsForm({
    firstName: '   ',
    lastName: '   ',
    email: '   ',
    theme: 'system',
  });

  assert(result.valid === false, 'whitespace-only values should fail validation');
  assert(result.errors.firstName === 'First name is required.', 'trimmed first name fails');
  assert(result.errors.lastName === 'Last name is required.', 'trimmed last name fails');
  assert(result.errors.email === 'Email is required.', 'trimmed email fails');
});

console.log('\n--- Test Summary ---');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
}
