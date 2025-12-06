# Fix PDF Viewer Layout

## Summary

Memperbaiki layout PDF viewer di AnnotateStep agar:
1. Parent container sudah tepat (tidak berubah)
2. PDF content area memiliki internal scroll
3. PDF tidak melebihi bounds parent

## Problem

PDF viewer saat ini overflow ke luar parent container karena tidak ada constraint height dan internal scroll.

## Solution

1. Tambahkan `maxHeight` pada PDF Canvas Paper
2. Tambahkan `overflow: auto` untuk internal scrolling
3. PDF tetap scale sesuai lebar yang tersedia

## Affected Components

- `frontend/src/features/omk-docs/components/wizard/AnnotateStep.jsx`
