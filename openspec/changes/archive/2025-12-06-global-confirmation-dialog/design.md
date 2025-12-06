# Design: Global Confirmation Dialog

## Architecture

### Context API
We will use the **Provider Pattern** with a **Promise-based** API.

```javascript
// Usage
const { confirm } = useConfirm();

const handleDelete = async () => {
  const isConfirmed = await confirm({
    title: 'Delete Item?',
    description: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger' // or 'primary', 'info'
  });

  if (isConfirmed) {
    // perform delete
  }
};
```

### Component Structure
-   `ConfirmationContext.jsx`: Holds the state (`isOpen`, `options`, `resolver`).
-   `ConfirmationDialog.jsx`: The UI component (MUI Dialog).
-   `useConfirm.js`: Hook to access the context.

### State Management
The context will maintain a `promise` state.
-   When `confirm()` is called:
    1.  Store the `resolve` function of a new Promise.
    2.  Set dialog options (title, message, etc.).
    3.  Open the dialog.
-   When "Confirm" is clicked:
    1.  Call `resolve(true)`.
    2.  Close dialog.
-   When "Cancel" or backdrop is clicked:
    1.  Call `resolve(false)`.
    2.  Close dialog.

## UI/UX
-   **Styling**: Use Material-UI `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`.
-   **Theming**: Respect the global theme (Dark/Light mode).
-   **Variants**: Support 'danger' (red button) for destructive actions.
