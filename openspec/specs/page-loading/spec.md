# page-loading Specification

## Purpose
TBD - created by archiving change enhance-ux-loading-and-wallet. Update Purpose after archive.
## Requirements
### Requirement: Immediate Page Loading Feedback
The system MUST display a loading indicator immediately when navigation begins.

#### Scenario: User navigates between finance pages
- GIVEN a user is on the Income page
- WHEN the user clicks on Expense in the sidebar
- THEN a loading indicator appears IMMEDIATELY (before data fetch)
- AND the loading indicator remains visible until the new page renders

### Requirement: Route-Level Code Splitting
The frontend MUST use lazy loading for page components to enable immediate loading feedback.

#### Scenario: Lazy loaded pages
- GIVEN the app uses React.lazy for page imports
- WHEN a user navigates to a page
- THEN Suspense fallback shows while the page chunk loads
- AND then the page component renders and fetches its data

### Requirement: Loading State Timing
Loading indicators MUST appear before data fetching begins, not after.

#### Scenario: Correct loading sequence
- GIVEN a user clicks a navigation link
- THEN the sequence is:
  1. Loading indicator appears (immediate)
  2. Page component loads (code splitting)
  3. Data fetching begins (shows skeleton/spinner in page)
  4. Data loads and page renders fully

