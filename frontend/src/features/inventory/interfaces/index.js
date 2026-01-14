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

/**
 * @typedef {Object} Loan
 * @property {number} id
 * @property {number} assetId
 * @property {number} borrowerId
 * @property {string} status
 * @property {Date} requestDate
 * @property {Date|null} approvedDate
 * @property {Date|null} borrowedDate
 * @property {Date|null} dueDate
 * @property {Date|null} returnedDate
 * @property {number|null} approvedById
 * @property {string|null} notes
 * @property {string|null} returnCondition
 * @property {string|null} returnNotes
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Object} asset
 * @property {Object} borrower
 * @property {Object|null} approvedBy
 */

/**
 * @typedef {Object} LoanFormData
 * @property {number} assetId
 * @property {Date|null} dueDate
 * @property {string|null} notes
 */

/**
 * @typedef {Object} AssetLog
 * @property {number} id
 * @property {number} assetId
 * @property {number|null} loanId
 * @property {string} action
 * @property {Date} actionDate
 * @property {number} userId
 * @property {string|null} notes
 * @property {Date} createdAt
 * @property {Object} asset
 * @property {Object|null} loan
 * @property {Object} user
 */
