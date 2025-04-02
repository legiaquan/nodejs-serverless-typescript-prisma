/**
 * Định nghĩa các permission trong hệ thống
 */
export enum Permission {
  // User permissions
  VIEW_USERS = 'view:users',
  CREATE_USER = 'create:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',

  // Product permissions
  VIEW_PRODUCTS = 'view:products',
  CREATE_PRODUCT = 'create:product',
  UPDATE_PRODUCT = 'update:product',
  DELETE_PRODUCT = 'delete:product',

  // Activity log permissions
  VIEW_LOGS = 'view:logs',
  EXPORT_LOGS = 'export:logs',

  // Admin permissions
  MANAGE_ALL = 'manage:all',
}

/**
 * Định nghĩa các permission cho mỗi role
 */
export const ROLE_PERMISSIONS = {
  admin: [
    Permission.MANAGE_ALL,
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.VIEW_LOGS,
    Permission.EXPORT_LOGS,
  ],
  user: [
    Permission.VIEW_USERS,
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.DELETE_PRODUCT,
  ],
  guest: [Permission.VIEW_PRODUCTS],
};

/**
 * Kiểm tra xem role có permission không
 */
export const hasPermission = (role: string, permission: Permission): boolean => {
  // Admin có tất cả các quyền
  if (role === 'admin') return true;

  // Kiểm tra permission cụ thể
  const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
  return permissions.includes(permission) || permissions.includes(Permission.MANAGE_ALL);
};
