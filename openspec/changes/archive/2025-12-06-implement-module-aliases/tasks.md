## 1. Backend
- [x] 1.1 Install `module-alias` in `backend`
- [x] 1.2 Update `backend/package.json` to add `_moduleAliases` configuration mapping `@` to `.`
- [x] 1.3 Add `require('module-alias/register')` to `backend/index.js`

## 2. Frontend
- [x] 2.1 Update `frontend/vite.config.js` to add alias `~` -> `src`
- [x] 2.2 Create/Update `frontend/jsconfig.json` to add path mapping for `~/*`
