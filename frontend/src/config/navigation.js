/**
 * Navigation Configuration
 * Mirrors folder structure for easy maintenance
 */
import {
  Dashboard as DashboardIcon,
  Description as DocsIcon,
  AccountBalanceWallet as WalletIcon,
  AttachMoney as MoneyIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
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
  Receipt as ReimbursementIcon,
  Link as LinkIcon,
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

  // Satu Link - Collapsible
  satuLink: {
    labelKey: "sidebar.satu_link",
    icon: LinkIcon,
    collapsible: true,
    items: [
      {
        id: "satu-link-short",
        labelKey: "sidebar.satu_link_short",
        icon: LinkIcon,
        path: "/satu-link/short-links",
      },
      {
        id: "satu-link-tree",
        labelKey: "sidebar.satu_link_tree",
        icon: LinkIcon,
        path: "/satu-link/link-tree",
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

  // INVENTARIS OMK - sekarang accessible oleh semua user
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
        id: "inventory-shop",
        labelKey: "sidebar.shop",
        icon: StorefrontIcon,
        path: "/inventory/shop",
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
    ],
  },

  // REIMBURSEMENT - Semua user bisa akses
  reimbursement: {
    labelKey: "sidebar.reimbursement",
    icon: ReimbursementIcon,
    collapsible: true,
    items: [
      {
        id: "reimbursement-dashboard",
        labelKey: "sidebar.reimbursement_dashboard",
        icon: ReimbursementIcon,
        path: "/reimbursement",
      },
      {
        id: "reimbursement-admin",
        labelKey: "sidebar.reimbursement_admin",
        icon: ReimbursementIcon,
        path: "/reimbursement/admin",
        permission: "canManageFinance",
      },
    ],
  },

  // ADMIN section (matches /admin/*)
  admin: {
    labelKey: "sidebar.admin",
    icon: PeopleIcon,
    permission: "canManageUsers",
    showDivider: true,
    collapsible: true,
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
      {
        id: "satu-link-admin",
        labelKey: "sidebar.satu_link_admin",
        icon: LinkIcon,
        path: "/admin/satu-link/short-links",
        permission: "isSuperAdmin",
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
  },
};

export default navigationConfig;
