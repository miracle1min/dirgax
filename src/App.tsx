import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import QCMenu from './qc/pages/QCMenu';
import QCSchedule from './qc/pages/QCSchedule';
import QCHistory from './qc/pages/QCHistory';
import QCNotes from './qc/pages/QCNotes';
import QCSettings from './qc/pages/QCSettings';
import QCForm1Sortir from './qc/pages/forms/QCForm1Sortir';
import QCForm2Cabe from './qc/pages/forms/QCForm2Cabe';
import QCForm3Suhu from './qc/pages/forms/QCForm3Suhu';
import QCForm4Tester from './qc/pages/forms/QCForm4Tester';
import QCForm5Return from './qc/pages/forms/QCForm5Return';
import QCForm6DataLogger from './qc/pages/forms/QCForm6DataLogger';
import QCForm7Prepare from './qc/pages/forms/QCForm7Prepare';
import { initDB } from './qc/db';

initDB();

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/qc" element={<QCMenu />} />
          <Route path="/qc/schedule" element={<QCSchedule />} />
          <Route path="/qc/history" element={<QCHistory />} />
          <Route path="/qc/notes" element={<QCNotes />} />
          <Route path="/qc/settings" element={<QCSettings />} />
          <Route path="/qc/form/sortir" element={<QCForm1Sortir />} />
          <Route path="/qc/form/cabe" element={<QCForm2Cabe />} />
          <Route path="/qc/form/suhu" element={<QCForm3Suhu />} />
          <Route path="/qc/form/tester" element={<QCForm4Tester />} />
          <Route path="/qc/form/return" element={<QCForm5Return />} />
          <Route path="/qc/form/datalogger" element={<QCForm6DataLogger />} />
          <Route path="/qc/form/prepare" element={<QCForm7Prepare />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
