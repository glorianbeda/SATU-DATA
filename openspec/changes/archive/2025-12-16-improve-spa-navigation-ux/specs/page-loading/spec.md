## MODIFIED Requirements

### Requirement: Immediate Page Loading Feedback

The system MUST display a loading indicator immediately when navigation begins. The loading indicator MUST be **non-intrusive** and keep the main layout (sidebar, header) visible.

#### Scenario: User navigates between finance pages

- GIVEN a user is on the Income page
- WHEN the user clicks on Expense in the sidebar
- THEN NProgress bar appears at the top of viewport IMMEDIATELY
- AND the sidebar and header remain fully visible
- AND the content area shows an inline loading spinner (not fullscreen overlay)
- AND the loading indicator remains visible until the new page renders

#### Scenario: Layout stability during navigation

- GIVEN a user is navigating between pages
- WHEN the navigation is in progress
- THEN the sidebar and header MUST NOT be obscured by any overlay
- AND only the main content area shows loading state
- AND the user can still see their current context (active menu item, profile info)

### Requirement: Route-Level Code Splitting

The frontend MUST use lazy loading for page components. The Suspense fallback MUST be an **inline loader** that respects the content area boundaries, not a fullscreen overlay.

#### Scenario: Lazy loaded pages with inline loader

- GIVEN the app uses React.lazy for page imports
- WHEN a user navigates to a page
- THEN Suspense fallback shows an inline spinner in the content area
- AND the spinner is centered within the main content container
- AND sidebar/header remain visible and interactive
- AND then the page component renders and fetches its data

### Requirement: Loading State Timing

Loading indicators MUST appear before data fetching begins, providing instant feedback without blocking the entire viewport.

#### Scenario: Correct loading sequence with visible layout

- GIVEN a user clicks a navigation link
- THEN the sequence is:
  1. NProgress bar appears at top (immediate, non-blocking)
  2. Content area shows inline loader (sidebar/header visible)
  3. Page component loads (code splitting)
  4. Data fetching begins (page handles own loading state)
  5. Data loads and page renders fully
