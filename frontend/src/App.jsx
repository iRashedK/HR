import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CVAnalyzer from './pages/CVAnalyzer';
import Employees from './pages/Employees';
import Recommendations from './pages/Recommendations';
import Library from './pages/Library';
import SettingsPage from './pages/SettingsPage';
import SkillGap from './pages/SkillGap';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<CVAnalyzer />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
