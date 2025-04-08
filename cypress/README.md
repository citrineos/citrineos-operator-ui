# Testing Introduction

This guide outlines our Cypress testing setup, explaining how to configure and run tests, use custom commands, and follow best practices for selecting elements.

---

## Pre-requisite: Frontend Application

Before running Cypress tests, ensure the frontend application is running. The easiest way is to use:
```bash
npm run dev
```

---

## Environment Variable: `MOCK_RESPONSES`

The `MOCK_RESPONSES` environment variable controls whether API responses are mocked or real requests are sent to the server.

- `MOCK_RESPONSES=true` (default): Mocks API responses using fixtures.
- `MOCK_RESPONSES=false`: Sends real API requests to the backend.

---

## NPM Commands

```plaintext
"cy:open": "cypress open",
"cy:local-open": "cypress open --env MOCK_RESPONSES=false",
"cypress:run": "cypress run"
```

### Usage Examples
Run Cypress with mocked API responses:
```bash
npm run cy:open
```

Run Cypress with real API requests:
```bash
npm run cy:local-open
```

Run tests headlessly:
```bash
npm run cypress:run
```

---

## Custom Command: `getByData`

A custom Cypress command simplifies selecting elements by their `data-testid` attribute.

### Command Definition
Add this in `cypress/support/commands.js`:
```javascript
Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-testid=${selector}]`);
});
```

### Usage
Use `cy.getByData` to select and interact with elements:
```javascript
cy.getByData('custom-action-dropdown-button').click();
```

---

## Best Practices: Adding `data-testid`

To ensure elements are testable and avoid relying on unstable selectors like class names or IDs, always add `data-testid` attributes to relevant components.

### Examples

#### Adding `data-testid` to a Button
```jsx
<Button
  data-testid="custom-action-dropdown-button"
  onClick={handleClick}
>
  Action
</Button>
```

---

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)

---

By following these guidelines, you’ll ensure a robust, efficient, and maintainable testing setup. 🚀