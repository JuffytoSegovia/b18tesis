// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import UserView from './components/user/UserView';
import AdminView from './components/admin/AdminView';
import EtapasAdmin from './components/admin/EtapasAdmin';
import SeccionesAdmin from './components/admin/SeccionesAdmin';
import RequisitosAdmin from './components/admin/RequisitosAdmin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="main-content">
            <Routes>
              {/* Rutas Usuario */}
              <Route path="/" element={<UserView />} />
              <Route path="/convocatorias/:convocatoriaId/etapas/:etapaId/secciones/:seccionId" element={<UserView />} />
              
              {/* Rutas Admin */}
              <Route path="/admin" element={<AdminView />} />
              <Route path="/admin/convocatorias" element={<AdminView />} />
              <Route path="/admin/convocatorias/:convocatoriaId/etapas" element={<EtapasAdmin />} />
              <Route path="/admin/convocatorias/:convocatoriaId/etapas/:etapaId/secciones" element={<SeccionesAdmin />} />
              
              {/* Ruta única para todos los tipos de contenido */}
              <Route path="/admin/convocatorias/:convocatoriaId/etapas/:etapaId/secciones/:seccionId/contenido" element={<RequisitosAdmin />} />
              
              {/* Fallback */}
              <Route path="*" element={<UserView />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;