import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import UploadRecord from './pages/UploadRecord';
import MyRecords from './pages/MyRecords';
import VerifyRecord from './pages/VerifyRecord';
import PatientSearch from './pages/PatientSearch';
import ActivityLogs from './pages/ActivityLogs';
import BlockExplorer from './pages/BlockExplorer';
import NetworkHealth from './pages/NetworkHealth';
import SystemLogs from './pages/SystemLogs';
import Settings from './pages/Settings';

function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {user && <Navbar user={user} onLogout={logout} />}
        
        <div className="flex flex-1">
          {user && <Sidebar role={user.role} />}
          
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route 
                path="/login" 
                element={!user ? <Login onLogin={login} /> : <Navigate to="/" />} 
              />
              
              <Route 
                path="/" 
                element={user ? <Dashboard /> : <Navigate to="/login" />} 
              />

              {/* Doctor Routes */}
              <Route 
                path="/upload" 
                element={user?.role === 'doctor' ? <UploadRecord /> : <Navigate to="/" />} 
              />
              <Route 
                path="/patients" 
                element={user?.role === 'doctor' ? <PatientSearch /> : <Navigate to="/" />} 
              />
              <Route 
                path="/activity" 
                element={user?.role === 'doctor' ? <ActivityLogs /> : <Navigate to="/" />} 
              />

              {/* Patient Routes */}
              <Route 
                path="/my-records" 
                element={user?.role === 'patient' ? <MyRecords /> : <Navigate to="/" />} 
              />
              <Route 
                path="/verify" 
                element={user?.role === 'patient' ? <VerifyRecord /> : <Navigate to="/" />} 
              />

              {/* Admin / Explorer Routes */}
              <Route path="/explorer" element={user ? <BlockExplorer /> : <Navigate to="/login" />} />
              <Route path="/network" element={user?.role === 'admin' ? <NetworkHealth /> : <Navigate to="/" />} />
              <Route path="/logs" element={user?.role === 'admin' ? <SystemLogs /> : <Navigate to="/" />} />
              
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
