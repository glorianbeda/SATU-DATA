# Design: Notebook Masonry & Mobile UI

## Layout Strategy

### The Masonry Problem
We want variable-height cards (like Google Keep) while maintaining chronological order.
- **CSS Columns**: Items flow down col 1, then col 2. breaks chronological reading order (newest top-left, 2nd newest might be bottom-left).
- **CSS Grid**: Requires fixed row heights or complex spanning.
- **JS Distribution**: Distribute items into N columns (arrays) based on index (Round Robin).

### Proposed Solution: Round Robin Columns
We will use a simple React logic to split `notes` array into `N` columns.
`N` depends on screen width (useMedia hook):
- Mobile (<600px): 1 Column
- Tablet (<900px): 2 Columns
- Desktop (>900px): 3 or 4 Columns

```javascript
// Pseudo-code
const columns = Array.from({ length: numCols }, () => []);
notes.forEach((note, i) => {
  columns[i % numCols].push(note);
});
return (
  <div style={{ display: 'flex', gap: '16px' }}>
    {columns.map(colNotes => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {colNotes.map(note => <NoteCard note={note} />)}
      </div>
    ))}
  </div>
)
```
This ensures that the top row is always Item 0, Item 1, Item 2 (Newest).

## Metadata Visuals
- **Color**: Store as string enum or hex. We will define a palette of 8-10 pastel colors + Dark mode variants.
- **Pinned**: Pinned notes will be rendered in a separate "Pinned" section at the top, using the same Masonry layout logic.

## Mobile Experience
- **Bottom Bar**: Fixed position at bottom.
  - FAB (Floating Action Button) in center or right for "Add".
  - Secondary actions (Search, Menu) on sides.
- **Header**: Collapsible or sticky with "Search" and "Filter Chips".

