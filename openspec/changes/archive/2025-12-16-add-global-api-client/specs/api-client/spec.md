# API Client Specification

## ADDED Requirements

### Requirement: Centralized API Client

The frontend MUST use a centralized axios instance for all API calls.

#### Scenario: Making GET API Requests

- GIVEN a component needs to fetch data from an API
- WHEN it imports the api client from `~/utils/api`
- THEN it should use `api.get('/endpoint')`
- AND credentials are automatically included via cookies

#### Scenario: Making POST API Requests

- GIVEN a component needs to submit data to an API
- WHEN it imports the api client from `~/utils/api`
- THEN it should use `api.post('/endpoint', data)`
- AND credentials are automatically included via cookies
