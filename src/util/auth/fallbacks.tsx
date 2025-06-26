// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

// Fallback component for unauthorized access to routes
export const AccessDeniedFallback = () => (
  <div className="access-denied-container">
    <h2>Access Denied</h2>
    <p>You don't have permission to access this resource.</p>
  </div>
);
