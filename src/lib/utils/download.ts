// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export function downloadCSV<T extends Record<string, any>>(
  filename: string,
  headers: string[],
  rows: T[],
  mapRow: (item: T) => string[],
): void {
  const csv = [headers, ...rows.map(mapRow)]
    .map((row) =>
      row.map((v) => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','),
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
