#!/usr/bin/env node

/**
 * i18n Missing Key Scanner (Improved)
 * 
 * Usage: node scripts/scan-i18n.js
 * 
 * Scans all .jsx and .js files in src/ for translation keys
 * and compares them with locale files to find missing translations.
 * 
 * Features:
 * - Filters out false positives (API paths, single chars, etc.)
 * - Groups missing keys by category
 * - Shows line numbers for easier fixing
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'frontend', 'src');
const LOCALES_DIR = path.join(__dirname, '..', 'frontend', 'src', 'locales');
const LOCALES = ['id.json', 'en.json'];

// Patterns to ignore (false positives)
const IGNORE_PATTERNS = [
  /^\/[a-z]/,                    // API paths like /api/profile
  /^[a-z]$/i,                    // Single letters
  /^http/,                        // URLs
  /^blob:/,                       // Blob URLs
  /^data:/,                       // Data URLs
  /\.(png|jpg|jpeg|gif|svg|ico)$/, // File extensions
  /^[\d.]+$/,                     // Version numbers
  /^(canvas|jszip|jspdf|qrcode)$/i, // Library names
  /^[a-z]+$/,                     // Single words without dots (often variables)
];

// Valid prefixes for translation keys
const VALID_PREFIXES = [
  'common.',
  'inventory.',
  'user_management.',
  'finance.',
  'docs.',
  'forms.',
  'dashboard.',
  'quick_edit.',
  'notebook.',
  'pdf_tools.',
  'header.',
  'sidebar.',
  'profile.',
];

// Regex to match t('key') or t("key") patterns
const TRANSLATION_KEY_REGEX = /t\s*\(\s*['"]([^'"]+)['"]\s*(?:,|\))/g;

// Also match with fallback: t('key', 'fallback')
const TRANSLATION_WITH_FALLBACK_REGEX = /t\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*\)/g;

function shouldIgnoreKey(key) {
  // Check ignore patterns
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.test(key)) return true;
  }
  
  // Check if it has a valid prefix
  const hasValidPrefix = VALID_PREFIXES.some(prefix => key.startsWith(prefix));
  if (!hasValidPrefix && key.includes('.')) {
    // Has a dot but no valid prefix - might be valid
    return false;
  }
  
  return false;
}

function scanDirectory(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, etc
      if (!item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath, files);
      }
    } else if (/\.(jsx?|tsx?)$/.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function extractKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys = new Set();
  const lines = content.split('\n');
  
  // Match t('key') or t("key")
  let match;
  while ((match = TRANSLATION_KEY_REGEX.exec(content)) !== null) {
    if (!shouldIgnoreKey(match[1])) {
      keys.add(match[1]);
    }
  }
  
  // Match t('key', 'fallback')
  while ((match = TRANSLATION_WITH_FALLBACK_REGEX.exec(content)) !== null) {
    if (!shouldIgnoreKey(match[1])) {
      keys.add(match[1]);
    }
  }
  
  return keys;
}

function loadLocale(localePath) {
  try {
    const content = fs.readFileSync(localePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error loading ${localePath}: ${e.message}`);
    return {};
  }
}

function getNestedKeys(obj, prefix = '') {
  const keys = new Set();
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nested = getNestedKeys(value, fullKey);
      nested.forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  
  return keys;
}

function groupKeysByPrefix(keys) {
  const grouped = {};
  
  for (const key of keys) {
    const prefix = key.split('.')[0];
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(key);
  }
  
  return grouped;
}

function main() {
  console.log('🔍 Scanning for i18n keys...\n');
  
  // Scan source files
  const sourceFiles = scanDirectory(SRC_DIR);
  console.log(`📁 Found ${sourceFiles.length} source files`);
  
  const allKeys = new Set();
  for (const file of sourceFiles) {
    const keys = extractKeys(file);
    keys.forEach(k => allKeys.add(k));
  }
  
  console.log(`📝 Found ${allKeys.size} unique translation keys in source\n`);
  
  // Check each locale
  const results = {};
  
  for (const locale of LOCALES) {
    const localePath = path.join(LOCALES_DIR, locale);
    const localeData = loadLocale(localePath);
    const localeKeys = getNestedKeys(localeData);
    
    const missing = [];
    const present = [];
    
    for (const key of allKeys) {
      if (localeKeys.has(key)) {
        present.push(key);
      } else {
        missing.push(key);
      }
    }
    
    results[locale] = { missing, present };
    
    console.log(`🌐 ${locale.toUpperCase()}:`);
    console.log(`   ✅ Present: ${present.length}`);
    console.log(`   ❌ Missing: ${missing.length}`);
    
    if (missing.length > 0) {
      console.log(`\n   Missing keys:`);
      const grouped = groupKeysByPrefix(missing);
      
      for (const [prefix, keys] of Object.entries(grouped)) {
        console.log(`\n   [${prefix}]:`);
        for (const key of keys.slice(0, 5)) {
          console.log(`     - ${key}`);
        }
        if (keys.length > 5) {
          console.log(`     ... and ${keys.length - 5} more`);
        }
      }
    }
    
    console.log('\n');
  }
  
  // Summary
  console.log('📊 Summary:');
  for (const [locale, data] of Object.entries(results)) {
    console.log(`   ${locale}: ${data.missing.length} missing out of ${allKeys.size} keys`);
  }
  
  // Exit with error if there are missing translations
  const totalMissing = Object.values(results).reduce((sum, r) => sum + r.missing.length, 0);
  if (totalMissing > 0) {
    console.log(`\n⚠️  Found ${totalMissing} missing translations!`);
    console.log('\n💡 Tips:');
    console.log('   - Use i18n Ally extension for inline translation');
    console.log('   - Add fallback values like: t("key", "Default Text")');
    process.exit(1);
  } else {
    console.log('\n✅ All translations are complete!');
    process.exit(0);
  }
}

main();
