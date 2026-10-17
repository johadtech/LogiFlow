import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { dataService } from './services/dataService';
import { User, Role, Shipment, Currency, SystemSettings, Language, Permission, ShipmentStatus, ShipmentType } from './types';
import {
  LayoutDashboard, Package, Search, Users, Shield, Settings, Globe, DollarSign,
  LogOut, Menu, X, Bell, ChevronDown, Truck, Ship, Plane, Train, Plus,
  Edit, Trash2, Eye, CheckCircle, Clock, AlertTriangle, XCircle, MapPin,
  FileText, BarChart3, UserCog, Languages, Car, RefreshCw
} from 'lucide-react';

// ==================== CONTEXT ====================
interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (slug: string) => boolean;
  language: string;
  setLanguage: (code: string) => void;
  currency: string;
  setCurrency: (code: string) => void;
  t: (key: string) => string;
  formatMoney: (amount: number, code?: string) => string;
  convertMoney: (amount: number, from: string, to: string) => number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
const useApp = () => useContext(AppContext);

// ==================== APP PROVIDER ====================
function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('lf_current_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [language, setLanguageState] = useState(() => localStorage.getItem('lf_language') || 'en');
  const [currency, setCurrencyState] = useState(() => localStorage.getItem('lf_currency') || 'USD');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const login = useCallback((email: string, password: string): boolean => {
    const authenticated = dataService.authenticate(email, password);
    if (authenticated) {
      setUser(authenticated);
      localStorage.setItem('lf_current_user', JSON.stringify(authenticated));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('lf_current_user');
  }, []);

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    localStorage.setItem('lf_language', code);
  }, []);

  const setCurrency = useCallback((code: string) => {
    setCurrencyState(code);
    localStorage.setItem('lf_currency', code);
  }, []);

  const hasPermission = useCallback((slug: string): boolean => {
    if (!user) return false;
    return dataService.hasPermission(user, slug);
  }, [user]);

  const t = useCallback((key: string): string => {
    return dataService.getTranslation(key, language);
  }, [language]);

  const formatMoney = useCallback((amount: number, code?: string): string => {
    return dataService.formatCurrency(amount, code || currency);
  }, [currency]);

  const convertMoney = useCallback((amount: number, from: string, to: string): number => {
    return dataService.convertCurrency(amount, from, to);
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout, hasPermission, language, setLanguage,
      currency, setCurrency, t, formatMoney, convertMoney,
      sidebarOpen, setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ children, permission }: { children: ReactNode; permission?: string }) {
  const { user, hasPermission } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (permission && !hasPermission(permission)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// ==================== LAYOUT ====================
function Layout({ children }: { children: ReactNode }) {
  const { user, logout, t, sidebarOpen, setSidebarOpen, language, setLanguage, currency, setCurrency } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const role = user ? dataService.getUserRole(user) : null;

  const menuItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, permission: 'dashboard.view' },
    { path: '/shipments', label: t('nav.shipments'), icon: Package, permission: 'shipments.view' },
    { path: '/tracking', label: t('nav.tracking'), icon: Search, permission: 'tracking.view' },
    { path: '/invoices', label: t('nav.invoices'), icon: FileText, permission: 'invoices.view' },
    { path: '/reports', label: t('nav.reports'), icon: BarChart3, permission: 'reports.view' },
    { path: '/users', label: t('nav.users'), icon: Users, permission: 'users.view' },
    { path: '/roles', label: t('nav.roles'), icon: Shield, permission: 'roles.view' },
    { path: '/currencies', label: t('nav.currencies'), icon: DollarSign, permission: 'currencies.manage' },
    { path: '/languages', label: t('nav.languages'), icon: Languages, permission: 'languages.manage' },
    { path: '/drivers', label: t('nav.drivers'), icon: UserCog, permission: 'drivers.manage' },
    { path: '/vehicles', label: t('nav.vehicles'), icon: Car, permission: 'vehicles.manage' },
    { path: '/settings', label: t('nav.settings'), icon: Settings, permission: 'settings.view' },
  ].filter(item => !item.permission || dataService.hasPermission(user!, item.permission));

  const languages = dataService.getActiveLanguages();
  const currencies = dataService.getActiveCurrencies();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">LogiFlow</h1>
              <p className="text-xs text-slate-400">Freight Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-400 truncate">{role?.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
                {dataService.getSettings().companyName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{language.toUpperCase()}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border py-1 z-50">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === lang.code ? 'text-blue-600 font-medium' : ''}`}
                      >
                        {lang.nativeName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-2 hidden sm:block"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                ))}
              </select>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// ==================== LOGIN PAGE ====================
function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">LogiFlow</h1>
          <p className="text-blue-200 mt-2">Freight & Logistics Management</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="admin@logiflow.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Super Admin:</span> admin@logiflow.com / admin123</p>
              <p><span className="font-medium">Admin:</span> manager@logiflow.com / manager123</p>
              <p><span className="font-medium">Agent:</span> agent@logiflow.com / agent123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================
function DashboardPage() {
  const { t, formatMoney } = useApp();
  const stats = dataService.getDashboardStats();
  const shipments = dataService.getShipments().slice(0, 5);
  const statusStats = dataService.getShipmentStatsByStatus();
  const typeStats = dataService.getShipmentStatsByType();

  const statCards = [
    { label: t('dashboard.totalShipments'), value: stats.totalShipments, icon: Package, color: 'bg-blue-500', change: '+12%' },
    { label: t('dashboard.activeShipments'), value: stats.activeShipments, icon: Truck, color: 'bg-green-500', change: '+5%' },
    { label: t('dashboard.delivered'), value: stats.deliveredThisMonth, icon: CheckCircle, color: 'bg-emerald-500', change: '+8%' },
    { label: t('dashboard.revenue'), value: formatMoney(stats.revenue), icon: DollarSign, color: 'bg-purple-500', change: '+15%' },
    { label: t('dashboard.pending'), value: stats.pendingShipments, icon: Clock, color: 'bg-amber-500', change: '-3%' },
    { label: t('dashboard.cancelled'), value: stats.cancelledShipments, icon: XCircle, color: 'bg-red-500', change: '-2%' },
  ];

  const getStatusBadge = (status: ShipmentStatus) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-indigo-100 text-indigo-800',
      in_transit: 'bg-cyan-100 text-cyan-800',
      customs_clearance: 'bg-orange-100 text-orange-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getTypeIcon = (type: ShipmentType) => {
    switch (type) {
      case 'air_freight': return <Plane className="w-4 h-4" />;
      case 'sea_freight': return <Ship className="w-4 h-4" />;
      case 'road_freight': return <Truck className="w-4 h-4" />;
      case 'rail_freight': return <Train className="w-4 h-4" />;
      case 'express': return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h1>
        <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs font-medium ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">{t('dashboard.recentShipments')}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {shipments.map(s => (
              <div key={s.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">{getTypeIcon(s.type)}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.trackingNumber}</p>
                    <p className="text-xs text-gray-500">{s.origin.city} → {s.destination.city}</p>
                  </div>
                </div>
                {getStatusBadge(s.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Shipment Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">{t('dashboard.shipmentStats')}</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">By Status</h4>
              {Object.entries(statusStats).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status as ShipmentStatus)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / stats.totalShipments) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-600 mb-3">By Type</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(typeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">{getTypeIcon(type as ShipmentType)}</span>
                    <span className="text-sm text-gray-700">{type.replace(/_/g, ' ')}</span>
                    <span className="ml-auto text-sm font-bold text-gray-800">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">{t('dashboard.quickActions')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction icon={Plus} label="New Shipment" color="bg-blue-500" onClick={() => window.location.hash = '/shipments'} />
          <QuickAction icon={Search} label="Track Package" color="bg-green-500" onClick={() => window.location.hash = '/tracking'} />
          <QuickAction icon={Users} label="Add Customer" color="bg-purple-500" onClick={() => window.location.hash = '/users'} />
          <QuickAction icon={FileText} label="New Invoice" color="bg-orange-500" onClick={() => window.location.hash = '/invoices'} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, color, onClick }: { icon: any; label: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}

// ==================== SHIPMENTS PAGE ====================
function ShipmentsPage() {
  const { t, hasPermission, formatMoney } = useApp();
  const [shipments, setShipments] = useState(dataService.getShipments());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      dataService.deleteShipment(id);
      setShipments(dataService.getShipments());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{t('shipments.title')}</h1>
        {hasPermission('shipments.create') && (
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" /> {t('shipments.create')}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="customs_clearance">Customs Clearance</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="all">All Types</option>
            <option value="air_freight">Air Freight</option>
            <option value="sea_freight">Sea Freight</option>
            <option value="road_freight">Road Freight</option>
            <option value="rail_freight">Rail Freight</option>
            <option value="express">Express</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t('shipments.trackingNumber')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t('shipments.type')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">{t('shipments.origin')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">{t('shipments.destination')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t('shipments.status')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">{t('shipments.charges')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t('shipments.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredShipments.map(shipment => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-mono font-medium text-blue-600">{shipment.trackingNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{shipment.type.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{shipment.origin.city}, {shipment.origin.country}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{shipment.destination.city}, {shipment.destination.country}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-medium">{formatMoney(shipment.totalCharges, shipment.currency)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedShipment(shipment)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {hasPermission('shipments.edit') && (
                        <button className="p-1.5 rounded hover:bg-amber-50 text-amber-600" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {hasPermission('shipments.delete') && (
                        <button onClick={() => handleDelete(shipment.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredShipments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('common.noData')}</p>
          </div>
        )}
      </div>

      {/* Shipment Detail Modal */}
      {selectedShipment && (
        <ShipmentDetailModal shipment={selectedShipment} onClose={() => setSelectedShipment(null)} />
      )}

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <CreateShipmentModal onClose={() => setShowCreateModal(false)} onCreated={() => { setShipments(dataService.getShipments()); setShowCreateModal(false); }} />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ShipmentStatus }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    picked_up: 'bg-indigo-100 text-indigo-800',
    in_transit: 'bg-cyan-100 text-cyan-800',
    customs_clearance: 'bg-orange-100 text-orange-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}

function ShipmentDetailModal({ shipment, onClose }: { shipment: Shipment; onClose: () => void }) {
  const { formatMoney } = useApp();
  const events = dataService.getTrackingEvents(shipment.id);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Shipment Details</h3>
            <p className="text-sm text-gray-500 font-mono">{shipment.trackingNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Type */}
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={shipment.status} />
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
              {shipment.type.replace(/_/g, ' ')}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${shipment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              Payment: {shipment.paymentStatus}
            </span>
          </div>

          {/* Route */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-xs font-medium text-blue-600 mb-1">ORIGIN</p>
              <p className="font-semibold text-gray-800">{shipment.origin.city}, {shipment.origin.country}</p>
              <p className="text-sm text-gray-600">{shipment.origin.address}</p>
              <p className="text-xs text-gray-500 mt-2">Sender: {shipment.sender.name}</p>
              <p className="text-xs text-gray-500">{shipment.sender.company}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-xs font-medium text-green-600 mb-1">DESTINATION</p>
              <p className="font-semibold text-gray-800">{shipment.destination.city}, {shipment.destination.country}</p>
              <p className="text-sm text-gray-600">{shipment.destination.address}</p>
              <p className="text-xs text-gray-500 mt-2">Receiver: {shipment.receiver.name}</p>
              <p className="text-xs text-gray-500">{shipment.receiver.company}</p>
            </div>
          </div>

          {/* Package Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoCard label="Weight" value={`${shipment.weight} kg`} />
            <InfoCard label="Declared Value" value={formatMoney(shipment.declaredValue, shipment.currency)} />
            <InfoCard label="Freight Charges" value={formatMoney(shipment.freightCharges, shipment.currency)} />
            <InfoCard label="Total Charges" value={formatMoney(shipment.totalCharges, shipment.currency)} />
          </div>

          {/* Package Details */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Package Contents</h4>
            {shipment.packages.map(pkg => (
              <div key={pkg.id} className="p-3 bg-gray-50 rounded-lg mb-2">
                <p className="text-sm font-medium">{pkg.description}</p>
                <p className="text-xs text-gray-500">Qty: {pkg.quantity} | Weight: {pkg.weight}kg</p>
                {pkg.isFragile && <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Fragile</span>}
                {pkg.isHazardous && <span className="inline-block mt-1 ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">Hazardous</span>}
              </div>
            ))}
          </div>

          {/* Tracking Timeline */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Tracking Timeline</h4>
            <div className="space-y-0">
              {events.map((event, idx) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${idx === events.length - 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    {idx < events.length - 1 && <div className="w-0.5 h-12 bg-gray-200" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-800">{event.description}</p>
                    <p className="text-xs text-gray-500">{event.location} • {new Date(event.timestamp).toLocaleString()}</p>
                    {event.operator && <p className="text-xs text-gray-400">By: {event.operator}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}

function CreateShipmentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { user } = useApp();
  const [formData, setFormData] = useState({
    type: 'air_freight' as ShipmentType,
    originCountry: '', originCity: '', originAddress: '',
    destCountry: '', destCity: '', destAddress: '',
    senderName: '', senderEmail: '', senderPhone: '', senderCompany: '',
    receiverName: '', receiverEmail: '', receiverPhone: '', receiverCompany: '',
    packageDescription: '', packageQuantity: 1, packageWeight: 0,
    declaredValue: 0, currency: 'USD',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const freightCharges = formData.type === 'express' ? 500 : formData.type === 'air_freight' ? 300 : 150;
    const insuranceCharges = formData.declaredValue * 0.01;
    
    dataService.createShipment({
      type: formData.type,
      status: 'pending',
      origin: { country: formData.originCountry, state: '', city: formData.originCity, address: formData.originAddress, postalCode: '' },
      destination: { country: formData.destCountry, state: '', city: formData.destCity, address: formData.destAddress, postalCode: '' },
      sender: { name: formData.senderName, company: formData.senderCompany, email: formData.senderEmail, phone: formData.senderPhone, address: formData.originAddress },
      receiver: { name: formData.receiverName, company: formData.receiverCompany, email: formData.receiverEmail, phone: formData.receiverPhone, address: formData.destAddress },
      packages: [{ id: `pkg_${Date.now()}`, description: formData.packageDescription, quantity: formData.packageQuantity, weight: formData.packageWeight, dimensions: { length: 0, width: 0, height: 0, unit: 'cm' }, isFragile: false, isHazardous: false }],
      weight: formData.packageWeight,
      dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
      declaredValue: formData.declaredValue,
      currency: formData.currency,
      freightCharges,
      insuranceCharges,
      totalCharges: freightCharges + insuranceCharges,
      paymentStatus: 'pending',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: formData.notes,
      createdBy: user?.id || ''
    });
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-800">Create New Shipment</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ShipmentType})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="air_freight">Air Freight</option>
              <option value="sea_freight">Sea Freight</option>
              <option value="road_freight">Road Freight</option>
              <option value="rail_freight">Rail Freight</option>
              <option value="express">Express</option>
            </select>
          </div>

          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Country" value={formData.originCountry} onChange={e => setFormData({...formData, originCountry: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              <input type="text" placeholder="City" value={formData.originCity} onChange={e => setFormData({...formData, originCity: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              <input type="text" placeholder="Address" value={formData.originAddress} onChange={e => setFormData({...formData, originAddress: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Country" value={formData.destCountry} onChange={e => setFormData({...formData, destCountry: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              <input type="text" placeholder="City" value={formData.destCity} onChange={e => setFormData({...formData, destCity: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              <input type="text" placeholder="Address" value={formData.destAddress} onChange={e => setFormData({...formData, destAddress: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
            </div>
          </div>

          {/* Sender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sender Information</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Full Name" value={formData.senderName} onChange={e => setFormData({...formData, senderName: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              <input type="text" placeholder="Company" value={formData.senderCompany} onChange={e => setFormData({...formData, senderCompany: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="email" placeholder="Email" value={formData.senderEmail} onChange={e => setFormData({...formData, senderEmail: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              <input type="tel" placeholder="Phone" value={formData.senderPhone} onChange={e => setFormData({...formData, senderPhone: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
            </div>
          </div>

          {/* Receiver */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Information</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Full Name" value={formData.receiverName} onChange={e => setFormData({...formData, receiverName: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              <input type="text" placeholder="Company" value={formData.receiverCompany} onChange={e => setFormData({...formData, receiverCompany: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="email" placeholder="Email" value={formData.receiverEmail} onChange={e => setFormData({...formData, receiverEmail: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              <input type="tel" placeholder="Phone" value={formData.receiverPhone} onChange={e => setFormData({...formData, receiverPhone: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
            </div>
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package Details</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Description" value={formData.packageDescription} onChange={e => setFormData({...formData, packageDescription: e.target.value})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm sm:col-span-3" required />
              <input type="number" placeholder="Quantity" value={formData.packageQuantity} onChange={e => setFormData({...formData, packageQuantity: parseInt(e.target.value) || 0})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required min="1" />
              <input type="number" placeholder="Weight (kg)" value={formData.packageWeight} onChange={e => setFormData({...formData, packageWeight: parseFloat(e.target.value) || 0})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required min="0" step="0.1" />
              <input type="number" placeholder="Declared Value" value={formData.declaredValue} onChange={e => setFormData({...formData, declaredValue: parseFloat(e.target.value) || 0})} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" required min="0" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create Shipment</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== TRACKING PAGE ====================
function TrackingPage() {
  const { t } = useApp();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const shipment = dataService.getShipmentByTrackingNumber(trackingNumber.trim().toUpperCase());
    if (shipment) {
      setResult(shipment);
      setEvents(dataService.getTrackingEvents(shipment.id));
    } else {
      setResult(null);
      setEvents([]);
    }
    setSearched(true);
  };

  const statusOrder: ShipmentStatus[] = ['pending', 'confirmed', 'picked_up', 'in_transit', 'customs_clearance', 'out_for_delivery', 'delivered'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{t('tracking.title')}</h1>

      {/* Search Box */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Track Your Shipment</h2>
          <p className="text-blue-200 mb-6">Enter your tracking number to get real-time updates</p>
          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder={t('tracking.placeholder')}
              className="flex-1 px-4 py-3 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button type="submit" className="px-6 py-3 bg-white text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 transition">
              {t('tracking.track')}
            </button>
          </form>
          <p className="text-xs text-blue-200 mt-3">Try: LF7K9M2X4P, LF3N8R5W1Q, LF9T2K7H6J</p>
        </div>
      </div>

      {/* Results */}
      {searched && !result && (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
          <p className="text-gray-600">{t('tracking.noResults')}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Shipment Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Tracking Number</p>
                <p className="text-xl font-bold font-mono text-blue-600">{result.trackingNumber}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            {/* Route Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <MapPin className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                <p className="text-sm font-medium">{result.origin.city}</p>
                <p className="text-xs text-gray-500">{result.origin.country}</p>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${(statusOrder.indexOf(result.status) / (statusOrder.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <MapPin className="w-6 h-6 mx-auto text-green-600 mb-1" />
                <p className="text-sm font-medium">{result.destination.city}</p>
                <p className="text-xs text-gray-500">{result.destination.country}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard label="Type" value={result.type.replace(/_/g, ' ')} />
              <InfoCard label="Weight" value={`${result.weight} kg`} />
              <InfoCard label="Est. Delivery" value={result.estimatedDelivery} />
              <InfoCard label="Payment" value={result.paymentStatus} />
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t('tracking.timeline')}</h3>
            <div className="space-y-0">
              {[...events].reverse().map((event, idx) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${idx === 0 ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`} />
                    {idx < events.length - 1 && <div className="w-0.5 h-16 bg-gray-200" />}
                  </div>
                  <div className="pb-6">
                    <p className="font-medium text-gray-800">{event.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{event.location}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                    {event.operator && <p className="text-xs text-gray-400">Operator: {event.operator}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== USERS PAGE ====================
function UsersPage() {
  const { t, hasPermission } = useApp();
  const [users, setUsers] = useState(dataService.getUsers());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const roles = dataService.getRoles();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      dataService.deleteUser(id);
      setUsers(dataService.getUsers());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{t('nav.users')}</h1>
        {hasPermission('users.create') && (
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add User
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Last Login</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => {
                const userRole = roles.find(r => r.id === user.roleId);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">{userRole?.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : user.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {hasPermission('users.edit') && (
                          <button className="p-1.5 rounded hover:bg-amber-50 text-amber-600"><Edit className="w-4 h-4" /></button>
                        )}
                        {hasPermission('users.delete') && !userRole?.isSystem && (
                          <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal onClose={() => setShowCreateModal(false)} onCreated={() => { setUsers(dataService.getUsers()); setShowCreateModal(false); }} />
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const roles = dataService.getRoles();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', roleId: '', status: 'active' as const });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.createUser(form);
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">Create User</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="First Name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
            <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
          </div>
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" required />
          <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" required />
          <select value={form.roleId} onChange={e => setForm({...form, roleId: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" required>
            <option value="">Select Role</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== ROLES PAGE ====================
function RolesPage() {
  const { t, hasPermission } = useApp();
  const [roles, setRoles] = useState(dataService.getRoles());
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const permissions = dataService.getPermissions();
  const permissionsByModule = dataService.getPermissionsByModule();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      dataService.deleteRole(id);
      setRoles(dataService.getRoles());
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{t('nav.roles')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{role.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{role.slug}</p>
              </div>
              {role.isSystem && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">System</span>}
            </div>
            <p className="text-sm text-gray-600 mb-3">{role.description}</p>
            <p className="text-xs text-gray-500 mb-4">{role.permissions.length} permissions assigned</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedRole(role)} className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                View/Edit Permissions
              </button>
              {!role.isSystem && hasPermission('roles.delete') && (
                <button onClick={() => handleDelete(role.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Editor Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRole(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold">{selectedRole.name}</h3>
                <p className="text-sm text-gray-500">Manage permissions</p>
              </div>
              <button onClick={() => setSelectedRole(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              {Object.entries(permissionsByModule).map(([module, modulePerms]) => (
                <div key={module}>
                  <h4 className="text-sm font-semibold text-gray-700 capitalize mb-2 border-b pb-1">{module}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modulePerms.map(perm => {
                      const isChecked = selectedRole.permissions.includes(perm.slug);
                      return (
                        <label key={perm.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newPerms = e.target.checked
                                ? [...selectedRole.permissions, perm.slug]
                                : selectedRole.permissions.filter(p => p !== perm.slug);
                              const updated = dataService.updateRole(selectedRole.id, { permissions: newPerms });
                              if (updated) setSelectedRole(updated);
                              setRoles(dataService.getRoles());
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <p className="text-sm text-gray-700">{perm.name}</p>
                            <p className="text-xs text-gray-400">{perm.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== CURRENCIES PAGE ====================
function CurrenciesPage() {
  const { t } = useApp();
  const [currencies, setCurrencies] = useState(dataService.getCurrencies());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', symbol: '', exchangeRate: 1, status: 'active' as const });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.createCurrency({ ...form, isDefault: false });
    setCurrencies(dataService.getCurrencies());
    setShowForm(false);
    setForm({ code: '', name: '', symbol: '', exchangeRate: 1, status: 'active' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{t('nav.currencies')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Currency
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <input type="text" placeholder="Code (e.g. USD)" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="px-3 py-2 border rounded-lg text-sm" required />
            <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
            <input type="text" placeholder="Symbol" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
            <input type="number" placeholder="Rate" value={form.exchangeRate} onChange={e => setForm({...form, exchangeRate: parseFloat(e.target.value) || 1})} className="px-3 py-2 border rounded-lg text-sm" step="0.0001" required />
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Add</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Code</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Symbol</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Exchange Rate</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Default</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currencies.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-lg">{c.symbol}</td>
                  <td className="px-4 py-3">{c.exchangeRate}</td>
                  <td className="px-4 py-3">{c.isDefault && <CheckCircle className="w-4 h-4 text-green-600" />}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== LANGUAGES PAGE ====================
function LanguagesPage() {
  const { t } = useApp();
  const languages = dataService.getLanguages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{t('nav.languages')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map(lang => (
          <div key={lang.code} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{lang.name}</h3>
                <p className="text-sm text-gray-500">{lang.nativeName} ({lang.code})</p>
              </div>
              <div className="flex items-center gap-2">
                {lang.isDefault && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Default</span>}
                <span className={`px-2 py-0.5 text-xs rounded ${lang.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{lang.status}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{Object.keys(lang.translations).length} translation keys</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== SETTINGS PAGE ====================
function SettingsPage() {
  const { t } = useApp();
  const [settings, setSettings] = useState(dataService.getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
      dataService.resetData();
      setSettings(dataService.getSettings());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{t('nav.settings')}</h1>
        <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm">
          <RefreshCw className="w-4 h-4" /> Reset All Data
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.companyEmail} onChange={e => setSettings({...settings, companyEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" value={settings.companyPhone} onChange={e => setSettings({...settings, companyPhone: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={settings.companyAddress} onChange={e => setSettings({...settings, companyAddress: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Regional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
              <select value={settings.defaultCurrency} onChange={e => setSettings({...settings, defaultCurrency: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                {dataService.getCurrencies().map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
              <select value={settings.defaultLanguage} onChange={e => setSettings({...settings, defaultLanguage: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                {dataService.getLanguages().map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="America/Chicago">Central Time (US)</option>
                <option value="America/New_York">Eastern Time (US)</option>
                <option value="America/Los_Angeles">Pacific Time (US)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Africa/Lagos">Lagos (WAT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shipment Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Shipment Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number Prefix</label>
              <input type="text" value={settings.trackingNumberPrefix} onChange={e => setSettings({...settings, trackingNumberPrefix: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight Unit</label>
              <select value={settings.weightUnit} onChange={e => setSettings({...settings, weightUnit: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="kg">Kilograms (kg)</option>
                <option value="lb">Pounds (lb)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimension Unit</label>
              <select value={settings.dimensionUnit} onChange={e => setSettings({...settings, dimensionUnit: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="cm">Centimeters (cm)</option>
                <option value="in">Inches (in)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Notifications & System</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <input type="checkbox" checked={settings.emailNotifications} onChange={e => setSettings({...settings, emailNotifications: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">SMS Notifications</span>
              <input type="checkbox" checked={settings.smsNotifications} onChange={e => setSettings({...settings, smsNotifications: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Auto-assign Driver</span>
              <input type="checkbox" checked={settings.autoAssignDriver} onChange={e => setSettings({...settings, autoAssignDriver: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600" />
            </label>
            <label className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-red-700 font-medium">Maintenance Mode</span>
              <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-red-600" />
            </label>
          </div>
        </div>

        <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Save Settings
        </button>
      </form>
    </div>
  );
}

// ==================== INVOICES PAGE ====================
function InvoicesPage() {
  const { t, formatMoney } = useApp();
  const shipments = dataService.getShipments();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{t('nav.invoices')}</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Invoice #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Shipment</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-blue-600">INV-{String(idx + 1).padStart(4, '0')}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.trackingNumber}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{s.sender.name}</td>
                  <td className="px-4 py-3 font-medium">{formatMoney(s.totalCharges, s.currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${s.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : s.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {s.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== REPORTS PAGE ====================
function ReportsPage() {
  const { formatMoney } = useApp();
  const stats = dataService.getDashboardStats();
  const shipments = dataService.getShipments();
  const statusStats = dataService.getShipmentStatsByStatus();
  const typeStats = dataService.getShipmentStatsByType();

  const revenueByType: Record<string, number> = {};
  shipments.forEach(s => {
    if (s.paymentStatus === 'paid') {
      revenueByType[s.type] = (revenueByType[s.type] || 0) + s.totalCharges;
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatMoney(stats.revenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-sm text-gray-500">Avg. Shipment Value</p>
          <p className="text-2xl font-bold text-blue-600">{formatMoney(stats.totalShipments > 0 ? stats.revenue / shipments.filter(s => s.paymentStatus === 'paid').length : 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-sm text-gray-500">Delivery Rate</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.totalShipments > 0 ? ((stats.deliveredThisMonth / stats.totalShipments) * 100).toFixed(1) : 0}%</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-sm text-gray-500">Total Shipments</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalShipments}</p>
        </div>
      </div>

      {/* Revenue by Type */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Revenue by Shipment Type</h3>
        <div className="space-y-3">
          {Object.entries(revenueByType).map(([type, revenue]) => (
            <div key={type} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-28 capitalize">{type.replace(/_/g, ' ')}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-2" style={{ width: `${(revenue / stats.revenue) * 100}%` }}>
                  <span className="text-xs text-white font-medium">{formatMoney(revenue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Shipment Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusStats).map(([status, count]) => (
            <div key={status} className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <StatusBadge status={status as ShipmentStatus} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== DRIVERS PAGE ====================
function DriversPage() {
  const { t } = useApp();
  const drivers = [
    { id: 'd1', name: 'James Wilson', phone: '+1-555-0301', email: 'james@logiflow.com', status: 'available', vehicle: 'Truck #T-001', trips: 145 },
    { id: 'd2', name: 'Robert Davis', phone: '+1-555-0302', email: 'robert@logiflow.com', status: 'on_trip', vehicle: 'Truck #T-003', trips: 89 },
    { id: 'd3', name: 'Maria Garcia', phone: '+1-555-0303', email: 'maria@logiflow.com', status: 'available', vehicle: 'Van #V-002', trips: 210 },
    { id: 'd4', name: 'David Kim', phone: '+1-555-0304', email: 'david@logiflow.com', status: 'off_duty', vehicle: 'Truck #T-005', trips: 67 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{t('nav.drivers')}</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map(driver => (
          <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{driver.name}</h3>
                <p className="text-xs text-gray-500">{driver.vehicle}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{driver.phone}</p>
              <p className="text-gray-600">{driver.email}</p>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className={`px-2 py-1 text-xs rounded-full ${driver.status === 'available' ? 'bg-green-100 text-green-700' : driver.status === 'on_trip' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {driver.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-500">{driver.trips} trips</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== VEHICLES PAGE ====================
function VehiclesPage() {
  const { t } = useApp();
  const vehicles = [
    { id: 'v1', plate: 'TX-T-001', type: 'Heavy Truck', capacity: '20,000 kg', status: 'active', driver: 'James Wilson', mileage: '145,000 km' },
    { id: 'v2', plate: 'TX-V-002', type: 'Delivery Van', capacity: '2,500 kg', status: 'active', driver: 'Maria Garcia', mileage: '89,000 km' },
    { id: 'v3', plate: 'TX-T-003', type: 'Heavy Truck', capacity: '25,000 kg', status: 'in_use', driver: 'Robert Davis', mileage: '210,000 km' },
    { id: 'v4', plate: 'TX-T-005', type: 'Medium Truck', capacity: '10,000 kg', status: 'maintenance', driver: 'Unassigned', mileage: '67,000 km' },
    { id: 'v5', plate: 'TX-V-006', type: 'Delivery Van', capacity: '3,000 kg', status: 'active', driver: 'Unassigned', mileage: '32,000 km' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{t('nav.vehicles')}</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Plate</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Capacity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Driver</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mileage</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium">{v.plate}</td>
                  <td className="px-4 py-3">{v.type}</td>
                  <td className="px-4 py-3 text-gray-600">{v.capacity}</td>
                  <td className="px-4 py-3 text-gray-600">{v.driver}</td>
                  <td className="px-4 py-3 text-gray-600">{v.mileage}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${v.status === 'active' ? 'bg-green-100 text-green-700' : v.status === 'in_use' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {v.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute permission="dashboard.view"><DashboardPage /></ProtectedRoute>} />
              <Route path="/shipments" element={<ProtectedRoute permission="shipments.view"><ShipmentsPage /></ProtectedRoute>} />
              <Route path="/tracking" element={<ProtectedRoute permission="tracking.view"><TrackingPage /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute permission="users.view"><UsersPage /></ProtectedRoute>} />
              <Route path="/roles" element={<ProtectedRoute permission="roles.view"><RolesPage /></ProtectedRoute>} />
              <Route path="/currencies" element={<ProtectedRoute permission="currencies.manage"><CurrenciesPage /></ProtectedRoute>} />
              <Route path="/languages" element={<ProtectedRoute permission="languages.manage"><LanguagesPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute permission="settings.view"><SettingsPage /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute permission="invoices.view"><InvoicesPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute permission="reports.view"><ReportsPage /></ProtectedRoute>} />
              <Route path="/drivers" element={<ProtectedRoute permission="drivers.manage"><DriversPage /></ProtectedRoute>} />
              <Route path="/vehicles" element={<ProtectedRoute permission="vehicles.manage"><VehiclesPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
