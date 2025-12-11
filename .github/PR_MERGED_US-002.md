Title: feat: implement transfer commit and success screen + UX polish and tests

Summary:
- Implemented commitTransfer in `src/contexts/BalanceContext.tsx` (deducts balance only on successful transfers).
- Confirm screen calls `executeTransfer` then `commitTransfer` and navigates to the success screen.
- Success screen shows transaction details and remaining balance.
- Added unit tests for `commitTransfer` and a smoke test for Confirm screen logic.
- Added Reanimated Babel plugin for runtime compat and `.gitignore` cleanups.

Test status:
- Unit tests passed locally (`npm test`).
- TypeScript checks passed: `npx tsc --noEmit`.

Known issues and post-merge action items:
- Android E2E validation is pending due to adb not being available in the environment and Metro runtime error (see `issues/ANDROID_VALIDATION.md`). Please assign and prioritize this bug to run native E2E validation on CI or a developer machine.
- `expo-doctor` reports plugin version mismatches for `@expo/config-plugins` and `@expo/prebuild-config` — consider an SDK upgrade or plugin version reconciliation.

Merge Note: This PR was merged directly into `main` per Scrum Master approval, given robust unit test coverage and UX validations on web.
