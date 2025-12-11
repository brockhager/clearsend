Description:

- Expo Android validation blocked by a missing adb tool in PATH (adb not found).
- Metro reported: Cannot find module 'metro/src/lib/TerminalReporter' (a runtime path issue) while starting `npx expo start --android`.

Steps to reproduce:
1. Ensure Android SDK is installed, but remove adb from PATH (or run on a system without emulator).
2. Run: `npx expo start --android`
3. Observe the error logs: 'No Android connected device' and 'Cannot find module "metro/src/lib/TerminalReporter"'.

Notes:
- Web builds and unit tests are passing (web/dev/site compiled); this block is purely environment/bundler related.
- Proposed mitigation: Ensure Android Platform-tools are in PATH, or re-install Metro/CLI dependencies. Consider adding a CI job to confirm Android emulator runs and the Metro bundler starts cleanly.
- Owner: @brockhager
- Priority: High
