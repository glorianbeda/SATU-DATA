# Proposal: Add Document Archive System

## Goal

Provide a document archive system for storing, organizing, and managing files of all types with folder/category structure, integrated under the OMK Docs sidebar menu.

## Context

Users need a centralized place to store and organize archived documents. The system should support:
- All file types (PDF, images, documents, spreadsheets, etc.)
- Folder/category organization with guided category selection
- 150MB file size limit with smart redirect to PDF compress tool for oversized PDFs
- Core features: upload, download, preview, search, filtering, and sharing

## Key Features

1. **File Upload** - Drag & drop or click to upload, with 150MB limit
2. **Smart PDF Handling** - If PDF exceeds limit, redirect to compress tool with auto-populated file
3. **Folder/Category System** - Organize files with predefined categories + custom folders
4. **File Preview** - In-browser preview for common formats (PDF, images, text)
5. **Search & Filter** - Find files by name, category, date, type
6. **Download** - Single file or bulk download
7. **Sharing** - Share files with other users (read-only or editable link)
8. **File Versioning** - Track version history for updated files

## Integration

- Sidebar: Under OMK Docs parent menu (not integrated with omk-docs features)
- Backend: New endpoints under `/api/archives`
- Storage: Server filesystem in `uploads/archives/` directory
- Database: New Archive model in Prisma

## Technical Approach

### Frontend
- New page at `/tools/archives` or `/archives`
- Components: FileUploader, FolderTree, FileList, FilePreview, ShareModal
- Use existing MUI components and design patterns

### Backend
- New Prisma model: Archive, ArchiveFolder
- Endpoints: CRUD for files and folders, search, sharing
- Storage: Multer middleware with 150MB limit

### Categories (Predefined)
- Surat Masuk
- Surat Keluar
- Laporan
- Kontrak/Perjanjian
- Keuangan
- SDM/Kepegawaian
- Foto/Dokumentasi
- Lainnya
