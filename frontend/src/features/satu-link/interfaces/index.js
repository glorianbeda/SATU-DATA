export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  customCode: string | null;
  userId: number;
  clicks: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface LinkTree {
  id: string;
  userId: number;
  title: string;
  bio: string | null;
  avatar: string | null;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  items?: LinkTreeItem[];
  user?: {
    name: string;
    profilePicture: string | null;
  };
}

export interface LinkTreeItem {
  id: string;
  linkTreeId: string;
  title: string;
  url: string;
  icon: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
