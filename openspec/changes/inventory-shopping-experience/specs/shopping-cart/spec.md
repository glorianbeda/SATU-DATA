# Spec: Shopping Cart & Asset Discovery

## ADDED Requirements

### Requirement: Asset Shop Interface
The asset listing page MUST support a "shopping" mode where users can browse and select multiple items.

#### Scenario: Browsing Assets in Shop Mode
GIVEN I am a member
WHEN I navigate to the Asset inventory page
THEN I see a grid of asset cards
AND each card displays the asset image, name, and availability status (Available/Stock count)
AND I see an "Add to Cart" button on available assets

### Requirement: Cart Actions
Users MUST be able to manage their selected items before proceeding to checkout.

#### Scenario: Adding to Cart
GIVEN I am viewing an available asset
WHEN I click "Add to Cart"
THEN the item is added to my temporary selection
AND the UI indicates the item is selected (e.g., button changes to "Remove", cart counter increments)

#### Scenario: Viewing Cart
GIVEN I have selected items
WHEN I click the Cart icon/indicator
THEN I see a summary list of selected assets
AND I can remove items from the list
AND I see a "Proceed to Checkout" button
