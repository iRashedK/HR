import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Settings from './pages/Settings';

export default function App() {
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'upload':
        return <Upload />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('upload')}>Upload CSV</button>
        <button onClick={() => setPage('settings')}>Settings</button>
      </aside>
      <main className="flex-1 p-4">
        {renderPage()}
      </main>
    </div>
  );
}
