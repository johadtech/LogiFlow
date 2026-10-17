import { User, Role, Permission, Shipment, Currency, SystemSettings, Language, TrackingEvent, DashboardStats, Notification } from '../types';

// ==================== PERMISSIONS DEFINITION ====================
const DEFAULT_PERMISSIONS: Permission[] = [
  { id: 'p1', name: 'View Dashboard', slug: 'dashboard.view', module: 'dashboard', description: 'Access the main dashboard' },
  { id: 'p2', name: 'View Shipments', slug: 'shipments.view', module: 'shipments', description: 'View all shipments' },
  { id: 'p3', name: 'Create Shipments', slug: 'shipments.create', module: 'shipments', description: 'Create new shipments' },
  { id: 'p4', name: 'Edit Shipments', slug: 'shipments.edit', module: 'shipments', description: 'Edit existing shipments' },
  { id: 'p5', name: 'Delete Shipments', slug: 'shipments.delete', module: 'shipments', description: 'Delete shipments' },
  { id: 'p6', name: 'Track Shipments', slug: 'shipments.track', module: 'shipments', description: 'Track shipment status' },
  { id: 'p7', name: 'View Users', slug: 'users.view', module: 'users', description: 'View user list' },
  { id: 'p8', name: 'Create Users', slug: 'users.create', module: 'users', description: 'Create new users' },
  { id: 'p9', name: 'Edit Users', slug: 'users.edit', module: 'users', description: 'Edit user details' },
  { id: 'p10', name: 'Delete Users', slug: 'users.delete', module: 'users', description: 'Delete users' },
  { id: 'p11', name: 'View Roles', slug: 'roles.view', module: 'roles', description: 'View roles' },
  { id: 'p12', name: 'Create Roles', slug: 'roles.create', module: 'roles', description: 'Create new roles' },
  { id: 'p13', name: 'Edit Roles', slug: 'roles.edit', module: 'roles', description: 'Edit roles' },
  { id: 'p14', name: 'Delete Roles', slug: 'roles.delete', module: 'roles', description: 'Delete roles' },
  { id: 'p15', name: 'View Settings', slug: 'settings.view', module: 'settings', description: 'View system settings' },
  { id: 'p16', name: 'Edit Settings', slug: 'settings.edit', module: 'settings', description: 'Edit system settings' },
  { id: 'p17', name: 'View Reports', slug: 'reports.view', module: 'reports', description: 'View reports' },
  { id: 'p18', name: 'Manage Currencies', slug: 'currencies.manage', module: 'currencies', description: 'Manage currencies' },
  { id: 'p19', name: 'Manage Languages', slug: 'languages.manage', module: 'languages', description: 'Manage languages' },
  { id: 'p20', name: 'View Invoices', slug: 'invoices.view', module: 'invoices', description: 'View invoices' },
  { id: 'p21', name: 'Create Invoices', slug: 'invoices.create', module: 'invoices', description: 'Create invoices' },
  { id: 'p22', name: 'Manage Customers', slug: 'customers.manage', module: 'customers', description: 'Manage customers' },
  { id: 'p23', name: 'View Tracking', slug: 'tracking.view', module: 'tracking', description: 'View tracking page' },
  { id: 'p24', name: 'Manage Drivers', slug: 'drivers.manage', module: 'drivers', description: 'Manage drivers' },
  { id: 'p25', name: 'Manage Vehicles', slug: 'vehicles.manage', module: 'vehicles', description: 'Manage vehicles' },
];

// ==================== DEFAULT ROLES ====================
const DEFAULT_ROLES: Role[] = [
  {
    id: 'role_super_admin',
    name: 'Super Administrator',
    slug: 'super-admin',
    description: 'Full system access with all permissions',
    permissions: DEFAULT_PERMISSIONS.map(p => p.slug),
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role_admin',
    name: 'Administrator',
    slug: 'admin',
    description: 'Administrative access with limited system settings',
    permissions: ['dashboard.view', 'shipments.view', 'shipments.create', 'shipments.edit', 'shipments.delete', 'shipments.track', 'users.view', 'users.create', 'users.edit', 'roles.view', 'settings.view', 'settings.edit', 'reports.view', 'currencies.manage', 'invoices.view', 'invoices.create', 'customers.manage', 'tracking.view', 'drivers.manage', 'vehicles.manage'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role_manager',
    name: 'Operations Manager',
    slug: 'operations-manager',
    description: 'Manage shipments, drivers and daily operations',
    permissions: ['dashboard.view', 'shipments.view', 'shipments.create', 'shipments.edit', 'shipments.track', 'tracking.view', 'invoices.view', 'invoices.create', 'customers.manage', 'drivers.manage', 'vehicles.manage', 'reports.view'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role_agent',
    name: 'Shipping Agent',
    slug: 'shipping-agent',
    description: 'Create and manage shipments',
    permissions: ['dashboard.view', 'shipments.view', 'shipments.create', 'shipments.edit', 'shipments.track', 'tracking.view', 'customers.manage'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role_customer',
    name: 'Customer',
    slug: 'customer',
    description: 'View own shipments and track packages',
    permissions: ['dashboard.view', 'shipments.view', 'shipments.track', 'tracking.view'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// ==================== DEFAULT USERS ====================
const DEFAULT_USERS: User[] = [
  {
    id: 'user_1',
    email: 'admin@logiflow.com',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Administrator',
    phone: '+1-555-0100',
    roleId: 'role_super_admin',
    status: 'active',
    lastLogin: '2024-12-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  },
  {
    id: 'user_2',
    email: 'manager@logiflow.com',
    password: 'manager123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1-555-0101',
    roleId: 'role_admin',
    status: 'active',
    lastLogin: '2024-12-14T08:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-14T08:00:00Z'
  },
  {
    id: 'user_3',
    email: 'agent@logiflow.com',
    password: 'agent123',
    firstName: 'Mike',
    lastName: 'Chen',
    phone: '+1-555-0102',
    roleId: 'role_agent',
    status: 'active',
    lastLogin: '2024-12-15T09:00:00Z',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-12-15T09:00:00Z'
  }
];

// ==================== DEFAULT CURRENCIES ====================
const DEFAULT_CURRENCIES: Currency[] = [
  { id: 'cur_usd', code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isDefault: true, status: 'active' },
  { id: 'cur_eur', code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.92, isDefault: false, status: 'active' },
  { id: 'cur_gbp', code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.79, isDefault: false, status: 'active' },
  { id: 'cur_cny', code: 'CNY', name: 'Chinese Yuan', symbol: '¥', exchangeRate: 7.24, isDefault: false, status: 'active' },
  { id: 'cur_jpy', code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 149.50, isDefault: false, status: 'active' },
  { id: 'cur_ngn', code: 'NGN', name: 'Nigerian Naira', symbol: '₦', exchangeRate: 1550.00, isDefault: false, status: 'active' },
  { id: 'cur_aed', code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', exchangeRate: 3.67, isDefault: false, status: 'active' },
  { id: 'cur_inr', code: 'INR', name: 'Indian Rupee', symbol: '₹', exchangeRate: 83.12, isDefault: false, status: 'active' },
];

// ==================== DEFAULT SETTINGS ====================
const DEFAULT_SETTINGS: SystemSettings = {
  companyName: 'LogiFlow Freight Solutions',
  companyEmail: 'info@logiflow.com',
  companyPhone: '+1-800-LOGIFLOW',
  companyAddress: '1200 Commerce Blvd, Suite 400, Houston, TX 77002',
  defaultCurrency: 'USD',
  defaultLanguage: 'en',
  timezone: 'America/Chicago',
  dateFormat: 'MM/DD/YYYY',
  weightUnit: 'kg',
  dimensionUnit: 'cm',
  trackingNumberPrefix: 'LF',
  autoAssignDriver: false,
  emailNotifications: true,
  smsNotifications: false,
  maintenanceMode: false,
};

// ==================== DEFAULT LANGUAGES ====================
const DEFAULT_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isDefault: true,
    status: 'active',
    translations: {
      'nav.dashboard': 'Dashboard',
      'nav.shipments': 'Shipments',
      'nav.tracking': 'Tracking',
      'nav.customers': 'Customers',
      'nav.invoices': 'Invoices',
      'nav.reports': 'Reports',
      'nav.users': 'Users',
      'nav.roles': 'Roles & Permissions',
      'nav.settings': 'Settings',
      'nav.currencies': 'Currencies',
      'nav.languages': 'Languages',
      'nav.drivers': 'Drivers',
      'nav.vehicles': 'Vehicles',
      'nav.logout': 'Logout',
      'dashboard.title': 'Dashboard',
      'dashboard.totalShipments': 'Total Shipments',
      'dashboard.activeShipments': 'Active Shipments',
      'dashboard.delivered': 'Delivered This Month',
      'dashboard.revenue': 'Revenue',
      'dashboard.pending': 'Pending',
      'dashboard.cancelled': 'Cancelled',
      'dashboard.recentShipments': 'Recent Shipments',
      'dashboard.shipmentStats': 'Shipment Statistics',
      'dashboard.quickActions': 'Quick Actions',
      'shipments.title': 'Shipments',
      'shipments.create': 'Create Shipment',
      'shipments.trackingNumber': 'Tracking Number',
      'shipments.status': 'Status',
      'shipments.origin': 'Origin',
      'shipments.destination': 'Destination',
      'shipments.type': 'Type',
      'shipments.weight': 'Weight',
      'shipments.charges': 'Charges',
      'shipments.actions': 'Actions',
      'tracking.title': 'Track Shipment',
      'tracking.placeholder': 'Enter tracking number...',
      'tracking.track': 'Track',
      'tracking.timeline': 'Tracking Timeline',
      'tracking.noResults': 'No shipment found with that tracking number',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.export': 'Export',
      'common.loading': 'Loading...',
      'common.noData': 'No data available',
      'common.confirm': 'Confirm',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.showing': 'Showing',
      'common.of': 'of',
      'common.entries': 'entries',
    }
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    isDefault: false,
    status: 'active',
    translations: {
      'nav.dashboard': 'Tableau de bord',
      'nav.shipments': 'Expéditions',
      'nav.tracking': 'Suivi',
      'nav.customers': 'Clients',
      'nav.invoices': 'Factures',
      'nav.reports': 'Rapports',
      'nav.users': 'Utilisateurs',
      'nav.roles': 'Rôles & Permissions',
      'nav.settings': 'Paramètres',
      'nav.currencies': 'Devises',
      'nav.languages': 'Langues',
      'nav.drivers': 'Chauffeurs',
      'nav.vehicles': 'Véhicules',
      'nav.logout': 'Déconnexion',
      'dashboard.title': 'Tableau de bord',
      'dashboard.totalShipments': 'Total Expéditions',
      'dashboard.activeShipments': 'Expéditions Actives',
      'dashboard.delivered': 'Livrées ce mois',
      'dashboard.revenue': 'Revenu',
      'dashboard.pending': 'En attente',
      'dashboard.cancelled': 'Annulées',
      'dashboard.recentShipments': 'Expéditions Récentes',
      'dashboard.shipmentStats': 'Statistiques des expéditions',
      'dashboard.quickActions': 'Actions Rapides',
      'shipments.title': 'Expéditions',
      'shipments.create': 'Créer une expédition',
      'shipments.trackingNumber': 'Numéro de suivi',
      'shipments.status': 'Statut',
      'shipments.origin': 'Origine',
      'shipments.destination': 'Destination',
      'shipments.type': 'Type',
      'shipments.weight': 'Poids',
      'shipments.charges': 'Frais',
      'shipments.actions': 'Actions',
      'tracking.title': 'Suivi d\'expédition',
      'tracking.placeholder': 'Entrez le numéro de suivi...',
      'tracking.track': 'Suivre',
      'tracking.timeline': 'Chronologie du suivi',
      'tracking.noResults': 'Aucune expédition trouvée avec ce numéro',
      'common.save': 'Enregistrer',
      'common.cancel': 'Annuler',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.view': 'Voir',
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.export': 'Exporter',
      'common.loading': 'Chargement...',
      'common.noData': 'Aucune donnée disponible',
      'common.confirm': 'Confirmer',
      'common.back': 'Retour',
      'common.next': 'Suivant',
      'common.previous': 'Précédent',
      'common.showing': 'Affichage',
      'common.of': 'de',
      'common.entries': 'entrées',
    }
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    isDefault: false,
    status: 'active',
    translations: {
      'nav.dashboard': 'لوحة التحكم',
      'nav.shipments': 'الشحنات',
      'nav.tracking': 'التتبع',
      'nav.customers': 'العملاء',
      'nav.invoices': 'الفواتير',
      'nav.reports': 'التقارير',
      'nav.users': 'المستخدمون',
      'nav.roles': 'الأدوار والصلاحيات',
      'nav.settings': 'الإعدادات',
      'nav.currencies': 'العملات',
      'nav.languages': 'اللغات',
      'nav.drivers': 'السائقون',
      'nav.vehicles': 'المركبات',
      'nav.logout': 'تسجيل الخروج',
      'dashboard.title': 'لوحة التحكم',
      'dashboard.totalShipments': 'إجمالي الشحنات',
      'dashboard.activeShipments': 'الشحنات النشطة',
      'dashboard.delivered': 'تم التوصيل هذا الشهر',
      'dashboard.revenue': 'الإيرادات',
      'dashboard.pending': 'قيد الانتظار',
      'dashboard.cancelled': 'ملغاة',
      'dashboard.recentShipments': 'الشحنات الأخيرة',
      'dashboard.shipmentStats': 'إحصائيات الشحنات',
      'dashboard.quickActions': 'إجراءات سريعة',
      'shipments.title': 'الشحنات',
      'shipments.create': 'إنشاء شحنة',
      'shipments.trackingNumber': 'رقم التتبع',
      'shipments.status': 'الحالة',
      'shipments.origin': 'المصدر',
      'shipments.destination': 'الوجهة',
      'shipments.type': 'النوع',
      'shipments.weight': 'الوزن',
      'shipments.charges': 'الرسوم',
      'shipments.actions': 'الإجراءات',
      'tracking.title': 'تتبع الشحنة',
      'tracking.placeholder': 'أدخل رقم التتبع...',
      'tracking.track': 'تتبع',
      'tracking.timeline': 'الجدول الزمني للتتبع',
      'tracking.noResults': 'لم يتم العثور على شحنة بهذا الرقم',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.delete': 'حذف',
      'common.edit': 'تعديل',
      'common.view': 'عرض',
      'common.search': 'بحث',
      'common.filter': 'تصفية',
      'common.export': 'تصدير',
      'common.loading': 'جاري التحميل...',
      'common.noData': 'لا توجد بيانات',
      'common.confirm': 'تأكيد',
      'common.back': 'رجوع',
      'common.next': 'التالي',
      'common.previous': 'السابق',
      'common.showing': 'عرض',
      'common.of': 'من',
      'common.entries': 'سجلات',
    }
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    isDefault: false,
    status: 'active',
    translations: {
      'nav.dashboard': '仪表板',
      'nav.shipments': '货运',
      'nav.tracking': '追踪',
      'nav.customers': '客户',
      'nav.invoices': '发票',
      'nav.reports': '报告',
      'nav.users': '用户',
      'nav.roles': '角色和权限',
      'nav.settings': '设置',
      'nav.currencies': '货币',
      'nav.languages': '语言',
      'nav.drivers': '司机',
      'nav.vehicles': '车辆',
      'nav.logout': '退出',
      'dashboard.title': '仪表板',
      'dashboard.totalShipments': '总货运量',
      'dashboard.activeShipments': '活跃货运',
      'dashboard.delivered': '本月已送达',
      'dashboard.revenue': '收入',
      'dashboard.pending': '待处理',
      'dashboard.cancelled': '已取消',
      'dashboard.recentShipments': '最近货运',
      'dashboard.shipmentStats': '货运统计',
      'dashboard.quickActions': '快速操作',
      'shipments.title': '货运管理',
      'shipments.create': '创建货运',
      'shipments.trackingNumber': '追踪号',
      'shipments.status': '状态',
      'shipments.origin': '始发地',
      'shipments.destination': '目的地',
      'shipments.type': '类型',
      'shipments.weight': '重量',
      'shipments.charges': '费用',
      'shipments.actions': '操作',
      'tracking.title': '追踪货运',
      'tracking.placeholder': '输入追踪号...',
      'tracking.track': '追踪',
      'tracking.timeline': '追踪时间线',
      'tracking.noResults': '未找到该追踪号的货运',
      'common.save': '保存',
      'common.cancel': '取消',
      'common.delete': '删除',
      'common.edit': '编辑',
      'common.view': '查看',
      'common.search': '搜索',
      'common.filter': '筛选',
      'common.export': '导出',
      'common.loading': '加载中...',
      'common.noData': '暂无数据',
      'common.confirm': '确认',
      'common.back': '返回',
      'common.next': '下一步',
      'common.previous': '上一步',
      'common.showing': '显示',
      'common.of': '共',
      'common.entries': '条',
    }
  }
];

// ==================== SAMPLE SHIPMENTS ====================
const generateTrackingNumber = (prefix: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const SAMPLE_SHIPMENTS: Shipment[] = [
  {
    id: 'shp_1',
    trackingNumber: 'LF7K9M2X4P',
    type: 'air_freight',
    status: 'in_transit',
    origin: { country: 'United States', state: 'Texas', city: 'Houston', address: '1200 Commerce Blvd', postalCode: '77002' },
    destination: { country: 'United Kingdom', state: 'England', city: 'London', address: '45 Baker Street', postalCode: 'W1U 8EW' },
    sender: { name: 'TechCorp Industries', company: 'TechCorp Inc.', email: 'ship@techcorp.com', phone: '+1-555-0200', address: '1200 Commerce Blvd, Houston, TX' },
    receiver: { name: 'Global Electronics Ltd', company: 'Global Electronics', email: 'receive@globalelec.co.uk', phone: '+44-20-7946-0958', address: '45 Baker Street, London' },
    packages: [{ id: 'pkg_1', description: 'Electronic Components - Circuit Boards', quantity: 50, weight: 250, dimensions: { length: 120, width: 80, height: 60, unit: 'cm' }, handlingInstructions: 'Keep dry', isFragile: true, isHazardous: false }],
    weight: 250,
    dimensions: { length: 120, width: 80, height: 60, unit: 'cm' },
    declaredValue: 45000,
    currency: 'USD',
    freightCharges: 3200,
    insuranceCharges: 450,
    totalCharges: 3650,
    paymentStatus: 'paid',
    paymentMethod: 'Wire Transfer',
    estimatedDelivery: '2024-12-20',
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z',
    createdBy: 'user_1'
  },
  {
    id: 'shp_2',
    trackingNumber: 'LF3N8R5W1Q',
    type: 'sea_freight',
    status: 'customs_clearance',
    origin: { country: 'China', state: 'Guangdong', city: 'Shenzhen', address: 'Port of Yantian', postalCode: '518081' },
    destination: { country: 'United States', state: 'California', city: 'Los Angeles', address: 'Port of LA, Terminal Island', postalCode: '90731' },
    sender: { name: 'Shenzhen Manufacturing Co', company: 'SZ MFG', email: 'export@szmfg.cn', phone: '+86-755-2345-6789', address: 'Port of Yantian, Shenzhen' },
    receiver: { name: 'Pacific Imports LLC', company: 'Pacific Imports', email: 'import@pacificimports.com', phone: '+1-310-555-0300', address: 'Port of LA, Terminal Island' },
    packages: [{ id: 'pkg_2', description: 'Consumer Electronics - Smartphones', quantity: 5000, weight: 2500, dimensions: { length: 600, width: 240, height: 240, unit: 'cm' }, handlingInstructions: 'Temperature controlled', isFragile: true, isHazardous: false }],
    weight: 2500,
    dimensions: { length: 600, width: 240, height: 240, unit: 'cm' },
    declaredValue: 250000,
    currency: 'USD',
    freightCharges: 8500,
    insuranceCharges: 2500,
    totalCharges: 11000,
    paymentStatus: 'paid',
    paymentMethod: 'Letter of Credit',
    estimatedDelivery: '2024-12-25',
    createdAt: '2024-12-01T06:00:00Z',
    updatedAt: '2024-12-14T10:00:00Z',
    createdBy: 'user_2'
  },
  {
    id: 'shp_3',
    trackingNumber: 'LF9T2K7H6J',
    type: 'road_freight',
    status: 'out_for_delivery',
    origin: { country: 'United States', state: 'New York', city: 'New York City', address: '500 Madison Ave', postalCode: '10022' },
    destination: { country: 'United States', state: 'Illinois', city: 'Chicago', address: '233 S Wacker Dr', postalCode: '60606' },
    sender: { name: 'East Coast Distributors', company: 'ECD Inc.', email: 'dispatch@ecd.com', phone: '+1-212-555-0400', address: '500 Madison Ave, NYC' },
    receiver: { name: 'Midwest Retail Group', company: 'MRG', email: 'orders@midwestretail.com', phone: '+1-312-555-0500', address: '233 S Wacker Dr, Chicago' },
    packages: [{ id: 'pkg_3', description: 'Retail Merchandise - Assorted', quantity: 200, weight: 1800, dimensions: { length: 400, width: 200, height: 200, unit: 'cm' }, isFragile: false, isHazardous: false }],
    weight: 1800,
    dimensions: { length: 400, width: 200, height: 200, unit: 'cm' },
    declaredValue: 75000,
    currency: 'USD',
    freightCharges: 2800,
    insuranceCharges: 750,
    totalCharges: 3550,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    estimatedDelivery: '2024-12-16',
    createdAt: '2024-12-13T07:00:00Z',
    updatedAt: '2024-12-15T16:00:00Z',
    createdBy: 'user_3'
  },
  {
    id: 'shp_4',
    trackingNumber: 'LF5V1M8D3F',
    type: 'express',
    status: 'delivered',
    origin: { country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', address: 'Dubai International Airport', postalCode: '00000' },
    destination: { country: 'Germany', state: 'Hesse', city: 'Frankfurt', address: 'Frankfurt Airport Cargo City', postalCode: '60547' },
    sender: { name: 'Dubai Gold Trading', company: 'DGT', email: 'export@dubgold.ae', phone: '+971-4-555-0600', address: 'Dubai International Airport' },
    receiver: { name: 'Frankfurt Jewelry House', company: 'FJH GmbH', email: 'import@fjh.de', phone: '+49-69-555-0700', address: 'Frankfurt Airport Cargo City' },
    packages: [{ id: 'pkg_4', description: 'Precious Metals - Gold Bars', quantity: 20, weight: 50, dimensions: { length: 40, width: 30, height: 20, unit: 'cm' }, handlingInstructions: 'High security required', isFragile: false, isHazardous: false }],
    weight: 50,
    dimensions: { length: 40, width: 30, height: 20, unit: 'cm' },
    declaredValue: 500000,
    currency: 'USD',
    freightCharges: 5000,
    insuranceCharges: 5000,
    totalCharges: 10000,
    paymentStatus: 'paid',
    paymentMethod: 'Wire Transfer',
    estimatedDelivery: '2024-12-12',
    actualDelivery: '2024-12-12',
    createdAt: '2024-12-11T05:00:00Z',
    updatedAt: '2024-12-12T18:00:00Z',
    createdBy: 'user_1'
  },
  {
    id: 'shp_5',
    trackingNumber: 'LF2W4N9G8L',
    type: 'air_freight',
    status: 'pending',
    origin: { country: 'Japan', state: 'Tokyo', city: 'Tokyo', address: 'Narita International Airport', postalCode: '282-0004' },
    destination: { country: 'Australia', state: 'NSW', city: 'Sydney', address: 'Sydney Airport Cargo Terminal', postalCode: '2020' },
    sender: { name: 'Tokyo Auto Parts Ltd', company: 'TAP', email: 'export@tokyoautoparts.jp', phone: '+81-3-5555-0800', address: 'Narita International Airport, Tokyo' },
    receiver: { name: 'Sydney Motors Repairs', company: 'SMR Pty Ltd', email: 'parts@sydneymotors.au', phone: '+61-2-5555-0900', address: 'Sydney Airport Cargo Terminal' },
    packages: [{ id: 'pkg_5', description: 'Automotive Parts - Engine Components', quantity: 100, weight: 800, dimensions: { length: 200, width: 150, height: 100, unit: 'cm' }, isFragile: false, isHazardous: false }],
    weight: 800,
    dimensions: { length: 200, width: 150, height: 100, unit: 'cm' },
    declaredValue: 120000,
    currency: 'USD',
    freightCharges: 6500,
    insuranceCharges: 1200,
    totalCharges: 7700,
    paymentStatus: 'pending',
    estimatedDelivery: '2024-12-22',
    createdAt: '2024-12-15T02:00:00Z',
    updatedAt: '2024-12-15T02:00:00Z',
    createdBy: 'user_2'
  },
  {
    id: 'shp_6',
    trackingNumber: 'LF8X6P3C2A',
    type: 'sea_freight',
    status: 'picked_up',
    origin: { country: 'India', state: 'Maharashtra', city: 'Mumbai', address: 'JNPT Port', postalCode: '400603' },
    destination: { country: 'Nigeria', state: 'Lagos', city: 'Lagos', address: 'Apapa Port Complex', postalCode: '100001' },
    sender: { name: 'Mumbai Textiles Export', company: 'MTE', email: 'export@mumbaitextiles.in', phone: '+91-22-5555-1000', address: 'JNPT Port, Mumbai' },
    receiver: { name: 'Lagos Fashion Hub', company: 'LFH Ltd', email: 'import@lagosfashion.ng', phone: '+234-1-555-1100', address: 'Apapa Port Complex, Lagos' },
    packages: [{ id: 'pkg_6', description: 'Textile Rolls - Cotton & Silk', quantity: 500, weight: 5000, dimensions: { length: 800, width: 240, height: 240, unit: 'cm' }, handlingInstructions: 'Keep dry, avoid direct sunlight', isFragile: false, isHazardous: false }],
    weight: 5000,
    dimensions: { length: 800, width: 240, height: 240, unit: 'cm' },
    declaredValue: 85000,
    currency: 'USD',
    freightCharges: 4200,
    insuranceCharges: 850,
    totalCharges: 5050,
    paymentStatus: 'paid',
    paymentMethod: 'Wire Transfer',
    estimatedDelivery: '2025-01-10',
    createdAt: '2024-12-14T04:00:00Z',
    updatedAt: '2024-12-15T08:00:00Z',
    createdBy: 'user_3'
  },
];

// ==================== TRACKING EVENTS ====================
const SAMPLE_TRACKING_EVENTS: TrackingEvent[] = [
  { id: 'te_1', shipmentId: 'shp_1', status: 'confirmed', location: 'Houston, TX', description: 'Shipment confirmed and booked', timestamp: '2024-12-10T08:30:00Z', operator: 'System' },
  { id: 'te_2', shipmentId: 'shp_1', status: 'picked_up', location: 'Houston, TX - IAH Airport', description: 'Package picked up from sender', timestamp: '2024-12-10T14:00:00Z', operator: 'Driver: James Wilson' },
  { id: 'te_3', shipmentId: 'shp_1', status: 'in_transit', location: 'IAH Airport, Houston', description: 'Departed origin airport', timestamp: '2024-12-11T06:00:00Z', operator: 'Flight: BA284' },
  { id: 'te_4', shipmentId: 'shp_1', status: 'in_transit', location: 'In Flight - North Atlantic', description: 'In transit - en route to destination', timestamp: '2024-12-11T18:00:00Z', operator: 'Flight: BA284' },
  { id: 'te_5', shipmentId: 'shp_1', status: 'in_transit', location: 'London Heathrow Airport', description: 'Arrived at destination airport, awaiting customs', timestamp: '2024-12-12T08:00:00Z', operator: 'Ground Handler' },
  { id: 'te_6', shipmentId: 'shp_2', status: 'confirmed', location: 'Shenzhen, China', description: 'Shipment confirmed and container assigned', timestamp: '2024-12-01T08:00:00Z', operator: 'System' },
  { id: 'te_7', shipmentId: 'shp_2', status: 'picked_up', location: 'Yantian Port, Shenzhen', description: 'Container loaded at port', timestamp: '2024-12-03T10:00:00Z', operator: 'Port Authority' },
  { id: 'te_8', shipmentId: 'shp_2', status: 'in_transit', location: 'South China Sea', description: 'Vessel departed port of loading', timestamp: '2024-12-05T06:00:00Z', operator: 'Vessel: MSC Oscar' },
  { id: 'te_9', shipmentId: 'shp_2', status: 'in_transit', location: 'Pacific Ocean', description: 'In transit across Pacific', timestamp: '2024-12-10T12:00:00Z', operator: 'Vessel: MSC Oscar' },
  { id: 'te_10', shipmentId: 'shp_2', status: 'customs_clearance', location: 'Port of Los Angeles', description: 'Arrived at port, customs clearance in progress', timestamp: '2024-12-14T08:00:00Z', operator: 'US Customs' },
  { id: 'te_11', shipmentId: 'shp_3', status: 'confirmed', location: 'New York, NY', description: 'Shipment confirmed', timestamp: '2024-12-13T07:30:00Z', operator: 'System' },
  { id: 'te_12', shipmentId: 'shp_3', status: 'picked_up', location: 'New York, NY', description: 'Package picked up', timestamp: '2024-12-13T10:00:00Z', operator: 'Driver: Robert Davis' },
  { id: 'te_13', shipmentId: 'shp_3', status: 'in_transit', location: 'Pennsylvania', description: 'In transit through Pennsylvania', timestamp: '2024-12-14T06:00:00Z', operator: 'Driver: Robert Davis' },
  { id: 'te_14', shipmentId: 'shp_3', status: 'in_transit', location: 'Ohio', description: 'In transit through Ohio', timestamp: '2024-12-14T18:00:00Z', operator: 'Driver: Robert Davis' },
  { id: 'te_15', shipmentId: 'shp_3', status: 'out_for_delivery', location: 'Chicago, IL', description: 'Out for delivery in Chicago area', timestamp: '2024-12-15T08:00:00Z', operator: 'Driver: Robert Davis' },
  { id: 'te_16', shipmentId: 'shp_4', status: 'confirmed', location: 'Dubai, UAE', description: 'Shipment confirmed', timestamp: '2024-12-11T05:30:00Z', operator: 'System' },
  { id: 'te_17', shipmentId: 'shp_4', status: 'picked_up', location: 'Dubai International Airport', description: 'Picked up with armed escort', timestamp: '2024-12-11T07:00:00Z', operator: 'Security Team' },
  { id: 'te_18', shipmentId: 'shp_4', status: 'in_transit', location: 'Dubai -> Frankfurt', description: 'Departed Dubai on EK-47', timestamp: '2024-12-11T10:00:00Z', operator: 'Emirates EK-47' },
  { id: 'te_19', shipmentId: 'shp_4', status: 'delivered', location: 'Frankfurt Airport', description: 'Delivered and signed for', timestamp: '2024-12-12T18:00:00Z', operator: 'Frankfurt Jewelry House' },
];

// ==================== DATA SERVICE CLASS ====================
class DataService {
  private users: User[];
  private roles: Role[];
  private permissions: Permission[];
  private shipments: Shipment[];
  private currencies: Currency[];
  private settings: SystemSettings;
  private languages: Language[];
  private trackingEvents: TrackingEvent[];
  private listeners: Set<() => void>;

  constructor() {
    this.listeners = new Set();
    this.users = this.loadFromStorage('lf_users', DEFAULT_USERS);
    this.roles = this.loadFromStorage('lf_roles', DEFAULT_ROLES);
    this.permissions = DEFAULT_PERMISSIONS;
    this.shipments = this.loadFromStorage('lf_shipments', SAMPLE_SHIPMENTS);
    this.currencies = this.loadFromStorage('lf_currencies', DEFAULT_CURRENCIES);
    this.settings = this.loadFromStorage('lf_settings', DEFAULT_SETTINGS);
    this.languages = this.loadFromStorage('lf_languages', DEFAULT_LANGUAGES);
    this.trackingEvents = this.loadFromStorage('lf_tracking_events', SAMPLE_TRACKING_EVENTS);
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ==================== AUTH METHODS ====================
  authenticate(email: string, password: string): User | null {
    const user = this.users.find(u => u.email === email && u.password === password && u.status === 'active');
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      this.users = this.users.map(u => u.id === user.id ? updatedUser : u);
      this.saveToStorage('lf_users', this.users);
    }
    return user || null;
  }

  getUserRole(user: User): Role | undefined {
    return this.roles.find(r => r.id === user.roleId);
  }

  hasPermission(user: User, permissionSlug: string): boolean {
    const role = this.getUserRole(user);
    if (!role) return false;
    return role.permissions.includes(permissionSlug);
  }

  // ==================== USER METHODS ====================
  getUsers(): User[] { return [...this.users]; }
  
  getUserById(id: string): User | undefined { return this.users.find(u => u.id === id); }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users = [...this.users, newUser];
    this.saveToStorage('lf_users', this.users);
    return newUser;
  }

  updateUser(id: string, data: Partial<User>): User | undefined {
    this.users = this.users.map(u => u.id === id ? { ...u, ...data, updatedAt: new Date().toISOString() } : u);
    this.saveToStorage('lf_users', this.users);
    return this.users.find(u => u.id === id);
  }

  deleteUser(id: string): boolean {
    const user = this.users.find(u => u.id === id);
    if (user && !this.getUserRole(user)?.isSystem) {
      this.users = this.users.filter(u => u.id !== id);
      this.saveToStorage('lf_users', this.users);
      return true;
    }
    return false;
  }

  // ==================== ROLE METHODS ====================
  getRoles(): Role[] { return [...this.roles]; }
  
  getRoleById(id: string): Role | undefined { return this.roles.find(r => r.id === id); }

  createRole(role: Omit<Role, 'id' | 'createdAt'>): Role {
    const newRole: Role = {
      ...role,
      id: `role_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.roles = [...this.roles, newRole];
    this.saveToStorage('lf_roles', this.roles);
    return newRole;
  }

  updateRole(id: string, data: Partial<Role>): Role | undefined {
    this.roles = this.roles.map(r => r.id === id ? { ...r, ...data } : r);
    this.saveToStorage('lf_roles', this.roles);
    return this.roles.find(r => r.id === id);
  }

  deleteRole(id: string): boolean {
    const role = this.roles.find(r => r.id === id);
    if (role && !role.isSystem) {
      this.roles = this.roles.filter(r => r.id !== id);
      this.saveToStorage('lf_roles', this.roles);
      return true;
    }
    return false;
  }

  // ==================== PERMISSION METHODS ====================
  getPermissions(): Permission[] { return [...this.permissions]; }
  
  getPermissionsByModule(): Record<string, Permission[]> {
    const grouped: Record<string, Permission[]> = {};
    this.permissions.forEach(p => {
      if (!grouped[p.module]) grouped[p.module] = [];
      grouped[p.module].push(p);
    });
    return grouped;
  }

  // ==================== SHIPMENT METHODS ====================
  getShipments(): Shipment[] { return [...this.shipments]; }

  getShipmentById(id: string): Shipment | undefined { return this.shipments.find(s => s.id === id); }

  getShipmentByTrackingNumber(trackingNumber: string): Shipment | undefined {
    return this.shipments.find(s => s.trackingNumber === trackingNumber);
  }

  createShipment(shipment: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>): Shipment {
    const newShipment: Shipment = {
      ...shipment,
      id: `shp_${Date.now()}`,
      trackingNumber: generateTrackingNumber(this.settings.trackingNumberPrefix),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.shipments = [...this.shipments, newShipment];
    this.saveToStorage('lf_shipments', this.shipments);
    
    // Add initial tracking event
    this.addTrackingEvent({
      id: `te_${Date.now()}`,
      shipmentId: newShipment.id,
      status: 'pending',
      location: newShipment.origin.city,
      description: 'Shipment created and pending confirmation',
      timestamp: new Date().toISOString(),
      operator: 'System'
    });
    
    return newShipment;
  }

  updateShipment(id: string, data: Partial<Shipment>): Shipment | undefined {
    this.shipments = this.shipments.map(s => s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s);
    this.saveToStorage('lf_shipments', this.shipments);
    return this.shipments.find(s => s.id === id);
  }

  updateShipmentStatus(id: string, status: Shipment['status'], location: string, description: string, operator?: string): void {
    this.shipments = this.shipments.map(s => {
      if (s.id === id) {
        return { ...s, status, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    this.saveToStorage('lf_shipments', this.shipments);
    
    this.addTrackingEvent({
      id: `te_${Date.now()}`,
      shipmentId: id,
      status,
      location,
      description,
      timestamp: new Date().toISOString(),
      operator
    });
  }

  deleteShipment(id: string): boolean {
    this.shipments = this.shipments.filter(s => s.id !== id);
    this.trackingEvents = this.trackingEvents.filter(te => te.shipmentId !== id);
    this.saveToStorage('lf_shipments', this.shipments);
    this.saveToStorage('lf_tracking_events', this.trackingEvents);
    return true;
  }

  // ==================== TRACKING METHODS ====================
  getTrackingEvents(shipmentId: string): TrackingEvent[] {
    return this.trackingEvents
      .filter(te => te.shipmentId === shipmentId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  addTrackingEvent(event: TrackingEvent): void {
    this.trackingEvents = [...this.trackingEvents, event];
    this.saveToStorage('lf_tracking_events', this.trackingEvents);
  }

  // ==================== CURRENCY METHODS ====================
  getCurrencies(): Currency[] { return [...this.currencies]; }

  getActiveCurrencies(): Currency[] { return this.currencies.filter(c => c.status === 'active'); }

  getDefaultCurrency(): Currency { return this.currencies.find(c => c.isDefault) || this.currencies[0]; }

  convertCurrency(amount: number, fromCode: string, toCode: string): number {
    const fromCurrency = this.currencies.find(c => c.code === fromCode);
    const toCurrency = this.currencies.find(c => c.code === toCode);
    if (!fromCurrency || !toCurrency) return amount;
    const amountInBase = amount / fromCurrency.exchangeRate;
    return amountInBase * toCurrency.exchangeRate;
  }

  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.currencies.find(c => c.code === currencyCode);
    if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;
    return `${currency.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  createCurrency(currency: Omit<Currency, 'id'>): Currency {
    const newCurrency: Currency = { ...currency, id: `cur_${Date.now()}` };
    this.currencies = [...this.currencies, newCurrency];
    this.saveToStorage('lf_currencies', this.currencies);
    return newCurrency;
  }

  updateCurrency(id: string, data: Partial<Currency>): void {
    this.currencies = this.currencies.map(c => c.id === id ? { ...c, ...data } : c);
    this.saveToStorage('lf_currencies', this.currencies);
  }

  // ==================== SETTINGS METHODS ====================
  getSettings(): SystemSettings { return { ...this.settings }; }

  updateSettings(data: Partial<SystemSettings>): SystemSettings {
    this.settings = { ...this.settings, ...data };
    this.saveToStorage('lf_settings', this.settings);
    return this.settings;
  }

  // ==================== LANGUAGE METHODS ====================
  getLanguages(): Language[] { return [...this.languages]; }

  getActiveLanguages(): Language[] { return this.languages.filter(l => l.status === 'active'); }

  getDefaultLanguage(): Language { return this.languages.find(l => l.isDefault) || this.languages[0]; }

  getTranslation(key: string, langCode: string): string {
    const lang = this.languages.find(l => l.code === langCode);
    return lang?.translations[key] || key;
  }

  updateLanguage(code: string, data: Partial<Language>): void {
    this.languages = this.languages.map(l => l.code === code ? { ...l, ...data } : l);
    this.saveToStorage('lf_languages', this.languages);
  }

  // ==================== DASHBOARD METHODS ====================
  getDashboardStats(): DashboardStats {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      totalShipments: this.shipments.length,
      activeShipments: this.shipments.filter(s => !['delivered', 'cancelled', 'returned'].includes(s.status)).length,
      deliveredThisMonth: this.shipments.filter(s => s.status === 'delivered' && s.actualDelivery && new Date(s.actualDelivery) >= startOfMonth).length,
      revenue: this.shipments.filter(s => s.paymentStatus === 'paid').reduce((sum, s) => sum + s.totalCharges, 0),
      pendingShipments: this.shipments.filter(s => s.status === 'pending').length,
      cancelledShipments: this.shipments.filter(s => s.status === 'cancelled').length,
    };
  }

  getShipmentStatsByType(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.shipments.forEach(s => {
      stats[s.type] = (stats[s.type] || 0) + 1;
    });
    return stats;
  }

  getShipmentStatsByStatus(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.shipments.forEach(s => {
      stats[s.status] = (stats[s.status] || 0) + 1;
    });
    return stats;
  }

  getNotifications(): Notification[] {
    const notifications: Notification[] = [];
    const pendingCount = this.shipments.filter(s => s.status === 'pending').length;
    if (pendingCount > 0) {
      notifications.push({
        id: 'n1',
        title: 'Pending Shipments',
        message: `${pendingCount} shipment(s) awaiting confirmation`,
        type: 'warning',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
    const customsCount = this.shipments.filter(s => s.status === 'customs_clearance').length;
    if (customsCount > 0) {
      notifications.push({
        id: 'n2',
        title: 'Customs Clearance',
        message: `${customsCount} shipment(s) in customs clearance`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
    return notifications;
  }

  // ==================== RESET DATA ====================
  resetData(): void {
    localStorage.removeItem('lf_users');
    localStorage.removeItem('lf_roles');
    localStorage.removeItem('lf_shipments');
    localStorage.removeItem('lf_currencies');
    localStorage.removeItem('lf_settings');
    localStorage.removeItem('lf_languages');
    localStorage.removeItem('lf_tracking_events');
    this.users = [...DEFAULT_USERS];
    this.roles = [...DEFAULT_ROLES];
    this.shipments = [...SAMPLE_SHIPMENTS];
    this.currencies = [...DEFAULT_CURRENCIES];
    this.settings = { ...DEFAULT_SETTINGS };
    this.languages = [...DEFAULT_LANGUAGES];
    this.trackingEvents = [...SAMPLE_TRACKING_EVENTS];
    this.notify();
  }
}

export const dataService = new DataService();
export { generateTrackingNumber };
