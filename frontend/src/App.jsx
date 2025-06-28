import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CVAnalyzer from './pages/CVAnalyzer';
import Employees from './pages/Employees';
import Recommendations from './pages/Recommendations';
import Library from './pages/Library';
import SettingsPage from './pages/SettingsPage';
import SkillGap from './pages/SkillGap';

export default function App() {
  return (
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
  );
}
