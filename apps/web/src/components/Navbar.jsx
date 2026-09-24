import React from 'react';
import { LayoutDashboard, UserPlus, Users, Scissors, LogOut, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, currentView, onShowToast }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onShowToast('Signed out successfully.');
  };

  const isAdmin = user?.role === 'ADMIN';
  const staffTypeLabel = user?.staffType === 'TAILOR' ? 'Tailor' : user?.staffType === 'FULL_DETAIL' ? 'Full Detail' : null;

  const navItems = [
    { view: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    ...(isAdmin ? [
      { view: 'ADD_CUSTOMER', label: 'Add Customer', icon: UserPlus },
      { view: 'STAFF_MANAGEMENT', label: 'Staff', icon: Users }
    ] : [])
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">

        {/* Brand */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
          onClick={() => onNavigate('DASHBOARD')}
        >
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm text-white shrink-0 transition-transform group-hover:scale-105"
            style={{ background: 'var(--accent-primary)' }}
          >
            SS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold tracking-tight" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
                SS Tailoring
              </span>
              <Scissors className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 hidden xs:inline-block" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <p className="text-[10px] hidden sm:block leading-none mt-0.5" style={{ color: 'var(--gray-400)' }}>Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {navItems.map(({ view, label, icon: Icon }) => {
            const isActive = currentView === view || (view === 'DASHBOARD' && !['ADD_CUSTOMER', 'STAFF_MANAGEMENT', 'VIEW_CUSTOMER', 'EDIT_CUSTOMER'].includes(currentView));
            return (
              <button
                key={view}
                id={`nav-${view.toLowerCase()}`}
                onClick={() => onNavigate(view)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
                style={{
                  background: isActive ? 'var(--accent-primary-light)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--gray-500)',
                  fontWeight: isActive ? '700' : '600'
                }}
                title={label}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right — User Info + Logout */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* User Badge (Compact on tablet, full on desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
            <div
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white text-[11px] sm:text-xs font-bold shrink-0"
              style={{ background: isAdmin ? 'var(--accent-primary)' : '#16A34A' }}
              title={`${user?.name} (${isAdmin ? 'Admin' : staffTypeLabel || 'Staff'})`}
            >
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold leading-tight max-w-[100px] truncate" style={{ color: 'var(--gray-700)' }}>
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--gray-400)' }}>
                {isAdmin ? 'Admin' : staffTypeLabel || 'Staff'}
              </p>
            </div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full hidden xs:flex items-center justify-center shrink-0 ml-0.5" style={{ background: isAdmin ? 'var(--accent-primary-light)' : '#F0FDF4' }}>
              {isAdmin ? (
                <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ color: 'var(--accent-primary)' }} />
              ) : (
                <UserCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ color: '#16A34A' }} />
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            id="nav-logout"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
            style={{ color: 'var(--gray-500)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-500)'; }}
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
