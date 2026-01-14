/**
 * @typedef {Object} AssetCategory
 * @property {number} id
 * @property {string} name
 * @property {string} code
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Asset
 * @property {number} id
 * @property {string} name
 * @property {string} assetCode
 * @property {string} barcode
 * @property {string|null} qrCode
 * @property {number} categoryId
 * @property {string} status
 * @property {string|null} brand
 * @property {string|null} model
 * @property {string|null} serialNumber
 * @property {Date|null} purchaseDate
 * @property {number|null} purchasePrice
 * @property {string|null} location
 * @property {string|null} description
 * @property {string|null} imageUrl
 * @property {number} createdById
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {AssetCategory} category
 * @property {Object} createdBy
 * @property {Loan[]} loans
 */

/**
 * @typedef {Object} AssetFormData
 * @property {string} name
 * @property {string} assetCode
 * @property {number} categoryId
 * @property {string|null} brand
 * @property {string|null} model
 * @property {string|null} serialNumber
 * @property {string|null} purchaseDate
 * @property {number|null} purchasePrice
 * @property {string|null} location
 * @property {string|null} description
 * @property {File|null} image
 */

/**
 * @typedef {Object} CategoryFormData
 * @property {string} name
 * @property {string} code
 */
