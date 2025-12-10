/**
 * Global currency formatting utilities for Indonesian Rupiah
 */

/**
 * Format a number to Indonesian Rupiah string (display only)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted string like "Rp 1.000.000"
 */
export const formatRupiah = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "Rp 0";
  return `Rp ${Number(amount).toLocaleString("id-ID")}`;
};

/**
 * Format a number with thousand separators (no Rp prefix)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted string like "1.000.000"
 */
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "0";
  return Number(amount).toLocaleString("id-ID");
};

/**
 * Parse a formatted string back to number
 * Handles both dot (.) and comma (,) as thousand separators
 * @param {string} value - The formatted string like "1.000.000" or "1,000,000"
 * @returns {number} The numeric value
 */
export const parseRupiah = (value) => {
  if (!value) return 0;
  // Remove "Rp" prefix if present
  let cleaned = value.toString().replace(/Rp\s*/gi, "");
  // Remove thousand separators (both . and ,)
  cleaned = cleaned.replace(/[.,]/g, "");
  // Parse to number
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
};

/**
 * Format input value for currency input field
 * Adds thousand separators as user types
 * @param {string} value - Raw input value
 * @returns {string} Formatted value with thousand separators
 */
export const formatInputValue = (value) => {
  if (!value) return "";
  // Remove non-numeric characters except minus
  const cleaned = value.toString().replace(/[^\d-]/g, "");
  if (cleaned === "" || cleaned === "-") return cleaned;

  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return "";

  return num.toLocaleString("id-ID");
};
