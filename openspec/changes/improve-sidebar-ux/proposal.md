# Improve Sidebar UX

## Summary
Enhance the sidebar experience by implementing a collapsible "mini" sidebar for desktop users and improving the toggle behavior.

## Background
Currently, the sidebar on desktop is fixed width. The user wants the ability to collapse it to an icon-only view to save space. Additionally, the "X" close button should be removed on desktop, and the hamburger menu should control the collapse/expand state.

## Goals
1. **Desktop Toggle:** Hamburger button toggles between expanded and collapsed (mini) sidebar on desktop.
2. **Mobile Toggle:** Hamburger button toggles between open (overlay) and closed sidebar on mobile (existing behavior).
3. **Mini Sidebar:** Show only icons when collapsed.
4. **Floating Submenus:** When collapsed, parent menu items show their children in a floating tooltip/card to the side.
5. **Clean UI:** Remove "X" button on desktop.

## Plan
1. Refactor `Sidebar.jsx` to accept `isCollapsed` prop.
2. Update layouts (`AppLayout`, `DashboardLayout`) to manage `isCollapsed` state for desktop.
3. Implement floating submenu logic using Material-UI `Menu` or `Popper` for collapsed state.
