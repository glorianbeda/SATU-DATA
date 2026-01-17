/**
 * Navigation Configuration
 * Mirrors folder structure for easy maintenance
 */
import {
  Dashboard as DashboardIcon,
  Description as DocsIcon,
  AccountBalanceWallet as WalletIcon,
  AttachMoney as MoneyIcon,
  WhatsApp as WhatsAppIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
  Traffic as SignIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  GridView as GridViewIcon,
  Checklist as ChecklistIcon,
  Note as NoteIcon,
  Speed as ProductivityIcon,
  Build as UtilitiesIcon,
  CallSplit,
  Transform,
  PhotoSizeSelectSmall as CompressIcon,
  ListAlt as FormIcon,
  Inventory as ArchiveIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  RequestPage as RequestIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";

export const navigationConfig = {
  // MENU section
  main: {
    labelKey: "sidebar.menu",
    items: [
      {
        id: "dashboard",
        labelKey: "sidebar.dashboard",
        icon: DashboardIcon,
        path: "/dashboard",
      },
      {
        id: "forms",
        labelKey: "sidebar.forms",
        icon: FormIcon,
        path: "/forms",
      },
    ],
  },

  // Dokumen OMK - collapsible (matches /docs/*)
  docs: {
    labelKey: "sidebar.omk_docs",
    icon: DocsIcon,
    collapsible: true,
    items: [
      {
        id: "request",
        labelKey: "sidebar.request_signature",
        icon: EditIcon,
        path: "/docs/request",
      },
      {
        id: "inbox",
        labelKey: "sidebar.needs_signature",
        icon: DocsIcon,
        path: "/docs/inbox",
      },
      {
        id: "validate",
        labelKey: "sidebar.validate_docs",
        icon: CheckCircleIcon,
        path: "/docs/validate",
      },
      {
        id: "archives",
        labelKey: "sidebar.archives",
        icon: ArchiveIcon,
        path: "/archives",
      },
    ],
  },

  // ADMIN section (matches /admin/*)
  admin: {
    labelKey: "sidebar.admin",
    permission: "canManageUsers",
    showDivider: true,
    items: [
      {
        id: "users",
        labelKey: "sidebar.user_management",
        icon: PeopleIcon,
        path: "/admin/users",
      },
      {
        id: "documents",
        labelKey: "sidebar.admin_documents",
        icon: DocsIcon,
        path: "/admin/documents",
      },
    ],
  },

  // Keuangan - collapsible (matches /finance/*)
  finance: {
    labelKey: "sidebar.finance",
    icon: MoneyIcon,
    permission: "canManageFinance",
    collapsible: true,
    items: [
      {
        id: "income",
        labelKey: "sidebar.income",
        icon: TrendingUp,
        path: "/finance/income",
      },
      {
        id: "expense",
        labelKey: "sidebar.expense",
        icon: TrendingDown,
        path: "/finance/expense",
      },
      {
        id: "balance",
        labelKey: "sidebar.balance",
        icon: WalletIcon,
        path: "/finance/balance",
      },
    ],
  },

  // ALAT section with subgroups (matches /tools/*)
  tools: {
    labelKey: "sidebar.tools",
    showDivider: true,
    subgroups: [
      // /tools/productivity/*
      {
        id: "productivity",
        labelKey: "sidebar.productivity",
        icon: ProductivityIcon,
        collapsible: true,
        items: [
          {
            id: "todo",
            labelKey: "sidebar.todo",
            icon: ChecklistIcon,
            path: "/tools/productivity/todo",
          },
          {
            id: "notebook",
            labelKey: "sidebar.notebook",
            icon: NoteIcon,
            path: "/tools/productivity/notebook",
          },
        ],
      },
      // /tools/utilities/*
      {
        id: "utilities",
        labelKey: "sidebar.utilities",
        icon: UtilitiesIcon,
        collapsible: true,
        items: [
          {
            id: "image-splitter",
            labelKey: "sidebar.image_splitter",
            icon: GridViewIcon,
            path: "/tools/utilities/image-splitter",
          },
        ],
      },
      // /tools/pdf/*
      {
        id: "pdf",
        labelKey: "sidebar.pdf_editor",
        icon: PdfIcon,
        collapsible: true,
        items: [
          {
            id: "compress",
            labelKey: "sidebar.pdf_compress",
            icon: CompressIcon,
            path: "/tools/pdf/compress",
          },
          {
            id: "editor",
            labelKey: "sidebar.pdf_edit",
            icon: EditIcon,
            path: "/tools/pdf/editor",
          },
          {
            id: "split",
            labelKey: "sidebar.pdf_split",
            icon: CallSplit,
            path: "/tools/pdf/split",
          },
          {
            id: "convert",
            labelKey: "sidebar.pdf_convert",
            icon: Transform,
            path: "/tools/pdf/convert",
          },
        ],
      },
    ],
    // Standalone items (not in subfolders)
    items: [
      {
        id: "report-wa",
        labelKey: "sidebar.report_wa",
        icon: WhatsAppIcon,
        path: "/report/wa",
      },
      {
        id: "report-pdf",
        labelKey: "sidebar.report_pdf",
        icon: PdfIcon,
        path: "/report/pdf",
      },
      {
        id: "sign-system",
        labelKey: "sidebar.sign_system",
        icon: SignIcon,
        path: "/sign-system",
      },
    ],
  },

  // INVENTARIS OMK section
  inventory: {
    labelKey: "sidebar.inventory",
    icon: InventoryIcon,
    collapsible: true,
    items: [
      {
        id: "inventory-dashboard",
        labelKey: "sidebar.inventory_dashboard",
        icon: DashboardIcon,
        path: "/inventory",
      },
      {
        id: "asset-management",
        labelKey: "sidebar.asset_management",
        icon: CategoryIcon,
        path: "/inventory/assets",
        permission: "canManageInventory",
      },
      {
        id: "category-management",
        labelKey: "sidebar.category_management",
        icon: CategoryIcon,
        path: "/inventory/categories",
        permission: "isSuperAdmin",
      },
      {
        id: "loan-management",
        labelKey: "sidebar.loan_management",
        icon: RequestIcon,
        path: "/inventory/loans",
        permission: "canManageInventory",
      },
      {
        id: "inventory-shop",
        labelKey: "sidebar.shop",
        icon: StorefrontIcon,
        path: "/inventory/shop",
        badge: {
          text: "New",
          expiresAt: "2026-02-01",
        },
      },
    ],
  },
};

export default navigationConfig;
