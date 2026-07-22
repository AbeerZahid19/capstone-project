\# Workflow Comparison: Vague vs Precise Prompting



\## Round 1 — Vague Prompt

Prompt used: "make me a settings form"



The AI produced a functional settings form (index.html, styles.css, script.js) with fields for name, email, theme, notifications, and password change. It included basic validation and localStorage persistence — more complete than expected for a single vague sentence. However, there were no tests, no accessibility considerations beyond basic labels, and no verification that the code actually worked as intended. I had to manually inspect the code to trust it.



\## Round 2 — Precise Prompt

Prompt included: specific fields, validation rules, accessibility requirements (labels, keyboard-only usability, aria-live), and an explicit instruction to write and run tests.



The AI produced a more structured output: separate files for validation logic (validation.js) and app logic (app.js), plus a dedicated test file (validation.test.js). It ran 15 assertions across 4 test cases — all passed, including an edge case (whitespace-only input) that I hadn't explicitly asked for but the AI added on its own.



\## Correctness

Round 2 is verifiably correct — the tests prove the validation logic behaves as expected. Round 1's correctness was assumed, not verified; I had no way to confirm the email regex or required-field checks worked without manually testing the form myself.



\## Accessibility

Round 1 included basic <label> elements but no explicit keyboard-navigation testing or aria-live status updates. Round 2 explicitly included aria-live for status messages and confirmed keyboard-only usability, because I specified it as a constraint.



\## Edge Cases

Round 1 did not handle whitespace-only input (e.g., " " as a "valid" first name). Round 2 caught this — the AI added a whitespace-trim check and a corresponding test case on its own, which was the AI mistake I caught being fixed proactively before I even asked.



\## Review Effort

Round 1 felt faster upfront (one sentence, quick output) but required me to manually read through all the code to check if validation logic was even correct — I couldn't fully trust it without testing it myself afterward. Round 2 took longer to prompt (I had to think through constraints, fields, and verification steps), but the review effort afterward was much lower — the test output told me directly whether the code worked, rather than me having to infer it. End-to-end, Round 2 was actually faster once review time is included, even though the initial prompt took more effort to write.



\## Key Takeaway

The "vague" round produced code that looked done but wasn't verified. The "precise" round took more upfront thinking but produced code I could actually trust, because it verified itself.

