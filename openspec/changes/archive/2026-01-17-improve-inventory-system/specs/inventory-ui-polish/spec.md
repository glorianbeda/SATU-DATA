# Capability: Inventory UI Polish

## MODIFIED Requirements

### Requirement: Responsive UI
Inventory pages (Asset List, Loan List, Forms) MUST be responsive and usable on mobile devices, preventing horizontal scrolling for main content.

#### Scenario: Mobile Responsive Asset List
- Given I am viewing the Asset List page
- When I view it on a mobile device (width < 600px)
- Then I should see a card-based layout instead of a wide table
- And the actions (Edit/Delete) should be accessible

#### Scenario: Mobile Responsive Loan List
- Given I am viewing the Loan List page
- When I view it on a mobile device
- Then I should see a responsive layout maximizing screen space

### Requirement: Standardized Tables
All data listings in the inventory module MUST use the shared `DataTable` component to ensure consistency and reduced maintenance.

#### Scenario: Uses DataTable Component
- Given I am viewing any inventory list (Assets, Loans)
- When I inspect the code or UI
- Then it should be rendered using the `DataTable` component
- And it should support sorting, pagination, search, and export out of the box

### Requirement: Internationalization
All visible text in the inventory module MUST use localization keys to ensure consistent translation across languages.

#### Scenario: Consistent Translations
- Given I am viewing the inventory pages
- When I look at labels, buttons, and status messages
- Then they should be properly translated based on the selected language (ID/EN)
- And there should be no hardcoded strings
