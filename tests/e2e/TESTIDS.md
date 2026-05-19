# `data-testid` Registry

**Status (Phase 1):** **Deferred indefinitely.** Per a binding constraint from the project owner, no modifications may be made to `src/`. Phase 1 ships using accessible queries only — see [`tests/e2e/pages/overview.page.ts`](pages/overview.page.ts) and the spec files for the actual selectors used.

This file remains the canonical place to declare any `data-testid`s that are eventually added. When the `src/` constraint is lifted, the seven entries below are the first-priority additions.

The full multi-phase list with traceability lives in:

- [TEST_PLAN.md §11](../../TEST_PLAN.md)
- [PLAYWRIGHT_AUTOMATION_PLAN.md §9](../../PLAYWRIGHT_AUTOMATION_PLAN.md)

## Phase 0

Phase 0 (E2E-001 admin login) requires no `data-testid`s. The login form exposes labeled `Email` and `Password` textboxes and a `Sign in` button reachable via `getByRole`/`getByLabel`. The overview heading is reachable via `getByRole('heading')`.

## Phase 1 — accessible-only

Phase 1 (E2E-002 through E2E-017) avoids `data-testid` entirely:

- KPI cards are anchored by their `<h2>` headings (Charger Online Status, Active Transactions, Plug-In Success Rate, Charger Activity)
- Welcome modal is anchored by its dialog role + accessible name "Welcome to CitrineOS Operator UI"
- Theme toggle and Logout buttons require expanding the sidebar (the collapse toggle has `aria-label="Expand sidebar"`); once expanded, they expose visible text labels ("Light Mode" / "Dark Mode" / "Logout")
- The Faulted Chargers list is anchored by its `<h4>` heading

## Future-phase backlog (deferred)

- [ ] `kpi-online-stations` — when src/ becomes editable
- [ ] `kpi-active-transactions`
- [ ] `kpi-plugin-success`
- [ ] `kpi-issues`
- [ ] `welcome-modal`
- [ ] `theme-toggle`
- [ ] `station-list-row`
- [ ] `station-status-tag`
- [ ] `ocpp-message-row`
- [ ] `command-remotestart-button`
- [ ] `command-remotestop-button`
- [ ] `command-reset-button`
- [ ] `command-changeavailability-button`
- [ ] `command-triggermessage-button`
- [ ] `command-getvariables-button`
- [ ] `command-setvariables-button`
- [ ] `command-updatefirmware-button`
- [ ] `command-unlockconnector-button`
- [ ] `command-forcedisconnect-button`
- [ ] `reset-modal-confirm`
- [ ] `remotestart-modal-confirm`
- [ ] `getvariables-result-row`
- [ ] `evses-tab-row`
- [ ] `connectors-tab-row`
- [ ] `configuration-tab-row`
- [ ] `transaction-list-row`
- [ ] `transaction-cost`
- [ ] `chart-power`
- [ ] `chart-energy`
- [ ] `chart-voltage`
- [ ] `chart-current`
- [ ] `chart-soc`
- [ ] `filter-station-id`
- [ ] `filter-date-range`
- [ ] `filter-active-only`
