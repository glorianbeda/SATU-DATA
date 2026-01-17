# i18n Consistency

## ADDED Requirements

### Requirement: Complete Translation Coverage
All user-facing strings in the inventory module MUST use translation keys.

#### Scenario: No hardcoded strings in components
Given any inventory component is rendered
When the language is changed
Then all visible text should update to the selected language
And no English strings should remain when Indonesian is selected
And no Indonesian strings should remain when English is selected

#### Scenario: Translation keys exist in both language files
Given a new translation key is added to `id.json`
Then the same key must exist in `en.json`
And both values should be non-empty

### Requirement: Consistent Terminology
The same concepts MUST use consistent translation keys across components.

#### Scenario: Asset-related terms are consistent
Given terms like "Asset", "Serial Number", "Category" appear in multiple places
Then they should use the same translation keys throughout
And the display text should be consistent
