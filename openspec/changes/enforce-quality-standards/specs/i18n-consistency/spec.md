# i18n-consistency Spec Delta

## ADDED Requirements

### Requirement: All User-Facing Text MUST Use Translation Keys
All user-visible strings in the frontend MUST use `t('key')` from `useTranslation()` hook instead of hardcoded text.

#### Scenario: Developer adds a new button label
- Given a new React component with a button
- When the developer adds a label
- Then the label must use `t('feature.button_label')` syntax
- And the key must exist in both `src/locales/id.json` and `src/locales/en.json`

#### Scenario: Review existing component for hardcoded strings
- Given a modified React component
- When reviewing the changes
- Then no raw Indonesian or English text should appear outside of `t()` calls
- And dynamic values use `{{variable}}` interpolation

---

### Requirement: Locale Files MUST Stay In Sync
Every key in `id.json` MUST have a corresponding key in `en.json` with appropriate translation.

#### Scenario: Adding a new translation key
- Given a new feature requires translation
- When the developer adds `"feature.new_key": "Teks Baru"` to `id.json`
- Then the developer must also add `"feature.new_key": "New Text"` to `en.json`
- And both keys must have the same nesting structure

#### Scenario: Auditing locale file parity
- Given both locale files exist
- When running a diff on the key structures
- Then the number of keys in `id.json` should equal `en.json`
- And no key should be missing in either file
