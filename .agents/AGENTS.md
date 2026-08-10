# Workspace Rules for TerminalBuddy

## Screenshot Validation & README Integration
- **Screenshot Folder**: The project has a `screenshots/` directory at the project root (`./screenshots/`).
- **Pre-Commit Screenshot & Privacy Validation**: Before committing any changes to this repository:
  1. Check `screenshots/` for any new, added, or unreferenced image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, etc.).
  2. **Sensitive Information Check**: Visually/contextually inspect any new screenshots for private information such as IP addresses, access tokens, API keys, passwords, secrets, or confidential hostnames.
     - **CRITICAL**: If any private or sensitive information is detected in an image, **STOP** the commit immediately and warn the user, detailing the affected file and sensitive data found so the user can redact or replace it.
  3. Verify whether all screenshots in `screenshots/` are included in `README.md`.
  4. If any new or missing clean screenshots are found in `screenshots/`, update `README.md` (e.g. under `## Screenshots` section) using relative paths (e.g., `![Description](screenshots/filename.png)`).
  5. Ensure the new screenshot files and updated `README.md` are staged and included as part of the commit.
