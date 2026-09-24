import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddCustomerPage from './pages/AddCustomerPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import EditCustomerPage from './pages/EditCustomerPage';
import StaffManagementPage from './pages/StaffManagementPage';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from './services/api';

function MainApp() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [currentView, setCurrentView] = useState('DASHBOARD');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadCustomerData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchCustomers('');
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Reset navigation and data whenever the user changes (login / logout / user switch)
  useEffect(() => {
    setCurrentView('DASHBOARD');
    setSelectedCustomerId(null);
    setCustomers([]);
  }, [user?.id]);

  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);

  const handleAddCustomer = async (newCustomerData) => {
    const res = await createCustomer(newCustomerData);
    if (res && res.success && res.data) {
      showToast(`Customer ${res.data.fullName} (${res.data.customerCode}) created!`);
      await loadCustomerData();
    } else {
      showToast(`Error: ${res?.error || 'Failed to create customer.'}`);
    }
    setCurrentView('DASHBOARD');
  };

  const handleUpdateCustomer = async (id, updateData) => {
    const res = await updateCustomer(id, updateData);
    if (res && res.success) {
      showToast('Customer record updated successfully!');
      await loadCustomerData();
    } else {
      showToast(`Update failed: ${res?.error || 'Admin privileges required.'}`);
    }
    setCurrentView('VIEW_CUSTOMER');
  };

  const handleDeleteCustomer = async (id, name) => {
    const res = await deleteCustomer(id);
    if (res && res.success) {
      showToast(`Customer ${name} deleted.`);
      await loadCustomerData();
      if (selectedCustomerId === id) {
        setCurrentView('DASHBOARD');
        setSelectedCustomerId(null);
      }
    } else {
      showToast(`Delete failed: ${res?.error || 'Unknown error'}`);
    }
  };

  const handleSelectCustomer = (id, view = 'VIEW_CUSTOMER') => {
    setSelectedCustomerId(id);
    setCurrentView(view);
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Redirect non-admin away from admin-only views
  const safeView = !isAdmin && ['ADD_CUSTOMER', 'STAFF_MANAGEMENT', 'EDIT_CUSTOMER'].includes(currentView)
    ? 'DASHBOARD'
    : currentView;

  if (!user) {
    return <LoginPage onShowToast={showToast} />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden" style={{ background: 'var(--gray-50)', color: 'var(--gray-800)', fontFamily: 'var(--font-body)' }}>
      <Toast message={toastMessage} />

      <Navbar
        currentView={safeView}
        onNavigate={setCurrentView}
        onShowToast={showToast}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-3 animate-spin" style={{ borderColor: 'var(--gray-200)', borderTopColor: 'var(--accent-primary)', borderWidth: '3px' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--gray-400)' }}>Loading data...</p>
          </div>
        ) : (
          <>
            {safeView === 'DASHBOARD' && (
              <DashboardPage
                customers={customers}
                onDeleteCustomer={handleDeleteCustomer}
                onSelectCustomer={handleSelectCustomer}
                onNavigate={setCurrentView}
              />
            )}

            {safeView === 'ADD_CUSTOMER' && isAdmin && (
              <AddCustomerPage
                onAddCustomer={handleAddCustomer}
                onNavigate={setCurrentView}
              />
            )}

            {safeView === 'VIEW_CUSTOMER' && (
              <CustomerDetailPage
                customer={selectedCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onNavigate={setCurrentView}
                onRefresh={loadCustomerData}
              />
            )}

            {safeView === 'EDIT_CUSTOMER' && isAdmin && (
              <EditCustomerPage
                customer={selectedCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onNavigate={setCurrentView}
              />
            )}

            {safeView === 'STAFF_MANAGEMENT' && isAdmin && (
              <StaffManagementPage
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>

      <footer
        className="py-3.5 sm:py-4 px-4 text-center text-xs font-medium"
        style={{
          background: 'var(--white)',
          borderTop: '1px solid var(--gray-200)',
          color: 'var(--gray-400)'
        }}
      >
        SS Tailoring Management System © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
