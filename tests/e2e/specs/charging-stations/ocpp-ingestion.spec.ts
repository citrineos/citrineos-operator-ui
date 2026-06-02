// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from '../../fixtures';
import { ChargingStationDetailPage } from '../../pages/charging-stations/detail.page';

// Proves the OCPP → CitrineOS-core → Hasura → UI ingestion pipeline for the
// live EVerest station. Every other transaction/status/meter test in the suite
// seeds rows directly via Hasura, bypassing this path entirely; these specs
// exercise it for real against the auto-emitted BootNotification /
// StatusNotification / message stream from cp001.

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('charging-stations › OCPP ingestion @everest', () => {
  test('E2E-090: BootNotification and StatusNotification are ingested and surfaced @everest', async ({
    page,
    everestStation,
    apiClient,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.id);
    await detail.openMessagesTab();

    // UI proof the live OCPP stream reaches the table: a charging-station
    // Heartbeat is always among the most recent rows. (BootNotification and
    // StatusNotification are emitted once at registration and page off the
    // desc-sorted first screen once heartbeat + command traffic accumulates on
    // a busy run — the snapshot here is dominated by the newest messages — so
    // their specific ingestion is confirmed via the read-only API below rather
    // than by scrolling/filtering the table.)
    await expect(
      page.getByRole('cell', { name: /Heartbeat/i }).first(),
    ).toBeVisible({ timeout: 30_000 });

    // Confirm both registration messages were ingested into Hasura. The
    // fixture's online guard already waits for a fresh StatusNotification, so
    // both rows are guaranteed present by the time this test runs.
    const { boot, status } = await apiClient.gql<{
      boot: { aggregate: { count: number } };
      status: { aggregate: { count: number } };
    }>(
      `query RegistrationIngestionProbe($name: String!) {
         boot: OCPPMessages_aggregate(
           where: { ocppConnectionName: { _eq: $name }, action: { _eq: "BootNotification" } }
         ) { aggregate { count } }
         status: OCPPMessages_aggregate(
           where: { ocppConnectionName: { _eq: $name }, action: { _eq: "StatusNotification" } }
         ) { aggregate { count } }
       }`,
      { name: everestStation.ocppConnectionName },
    );
    expect(boot.aggregate.count).toBeGreaterThan(0);
    expect(status.aggregate.count).toBeGreaterThan(0);
  });

  test('E2E-091: cp001 detail card shows live Online status from ingested state @everest', async ({
    page,
    everestStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.id);

    // The card binds this text to station.isOnline via useOne (no seeding) —
    // it is Online only because the live OCPP connection was ingested.
    await expect(detail.statusTag).toHaveText(/online/i, { timeout: 30_000 });
  });

  test('E2E-092: detail card surfaces a real Last-OCPP-Message timestamp @everest', async ({
    page,
    everestStation,
  }) => {
    const detail = new ChargingStationDetailPage(page);
    await detail.goto(everestStation.id);

    // The "Last OCPP Message" KeyValue reads N/A when nothing has been
    // ingested; against a live station it must hold a real timestamp.
    const lastOcppValue = page
      .getByText('Last OCPP Message', { exact: true })
      .locator('xpath=following-sibling::span[1]');
    await expect(lastOcppValue).toBeVisible({ timeout: 30_000 });
    await expect(lastOcppValue).not.toHaveText('N/A');
  });
});
