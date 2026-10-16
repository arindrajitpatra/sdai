---
name: Startup Stability Preflight Skill
description: Preflight health check and environment verification procedures before starting test runner or application server.
---

# Startup Stability Preflight Skill

## Preflight Checks
1. Verify node version (`node -v >= 18.0.0`).
2. Verify Playwright browsers installed (`npx playwright install chromium --with-deps`).
3. Check target service availability (`curl -I http://localhost:3000`).
4. Flush stale test reports and temporary artifact locks before launching new test runs.
