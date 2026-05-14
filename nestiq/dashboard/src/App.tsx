import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import LeadsList from './pages/LeadsList';
import LeadDetail from './pages/LeadDetail';
import Appointments from './pages/Appointments';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: '#0D1B2A' }}>
        <Sidebar />
        <main className="flex-1 ml-60 overflow-hidden">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/leads" element={<LeadsList />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
