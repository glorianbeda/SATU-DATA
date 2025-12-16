# Design: Navigation Performance Optimization

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      App.jsx                             │
│  ┌─────────────────────────────────────────────────┐    │
│  │                 Suspense                         │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │            MainLayout.jsx                  │  │    │
│  │  │  ┌────────────┐  ┌────────────────────┐   │  │    │
│  │  │  │  Sidebar   │  │      Header        │   │  │    │
│  │  │  │  (memo)    │  │      (memo)        │   │  │    │
│  │  │  └────────────┘  └────────────────────┘   │  │    │
│  │  │  ┌────────────────────────────────────┐   │  │    │
│  │  │  │      Page Content (children)       │   │  │    │
│  │  │  │      ← Only this should change     │   │  │    │
│  │  │  └────────────────────────────────────┘   │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Optimization Strategy

### 1. React.memo for Layout Components

**Before:**
```jsx
const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, user }) => {
  const { t } = useTranslation();
  // ... renders on every parent re-render
};
export default Sidebar;
```

**After:**
```jsx
const Sidebar = React.memo(({ isOpen, toggleSidebar, isCollapsed, user }) => {
  const { t } = useTranslation();
  // ... only renders when props change
});
export default Sidebar;
```

### 2. useMemo for Static Menu Items

**Before:**
```jsx
const menuItems = [
  { text: t('sidebar.dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
];
```

**After:**
```jsx
const menuItems = useMemo(() => [
  { text: t('sidebar.dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
], [t]);
```

### 3. Profile Fetch Optimization

**Before:**
```jsx
useEffect(() => {
  fetchProfile();
}, [isPublic, location.pathname]); // ← re-fetches on EVERY navigation
```

**After:**
```jsx
useEffect(() => {
  fetchProfile();
}, [isPublic]); // ← only fetches once when entering protected area
```

### 4. useCallback for Event Handlers

Stabilize function references passed to memoized children:

```jsx
const toggleSidebar = useCallback(() => {
  if (window.innerWidth < 1024) {
    setIsSidebarOpen(prev => !prev);
  } else {
    setIsCollapsed(prev => !prev);
  }
}, []);
```

## Trade-offs

| Approach | Pros | Cons |
|----------|------|------|
| `React.memo` | Simple, minimal code change | Shallow comparison only |
| `useMemo` for menus | Prevents array recreation | Minor memory overhead |
| Remove path dependency | Stops unnecessary fetches | Profile won't refresh on navigation |

## Decision

Proceed with all 4 optimizations as they are complementary and low-risk.
