import React, { useState, useEffect } from 'react';

export default function AdminModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({});

  // Usar la variable de entorno para la URL base
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Cargar tipografías
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  
  const arabicFont = "'Amiri', 'Scheherazade New', serif";

  const handleLogin = async () => {
    if (!password.trim()) {
      setError('Por favor ingresa la contraseña');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        loadSalesData();
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSalesData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/sales`);
      const data = await response.json();
      setSalesData(data.sales || []);
      setStats(data.stats || {});
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error al cargar ventas:', err);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ventas_cena_arabe_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error al descargar el archivo');
      console.error('Error en descarga:', err);
    }
  };

  const resetModal = () => {
    setPassword('');
    setError('');
    setIsLoggedIn(false);
    setSalesData([]);
    setStats({});
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-amber-400/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {!isLoggedIn ? (
          // Login Form
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: arabicFont }}>
                Panel de Administración
              </h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-amber-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2" style={{ fontFamily: arabicFont }}>
                  Contraseña de Administrador
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 bg-white/10 border border-amber-400/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400"
                  placeholder="Ingresa la contraseña"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                style={{ fontFamily: arabicFont }}
              >
                {isLoading ? 'Verificando...' : 'Acceder'}
              </button>
            </div>
          </div>
        ) : (
          // Admin Panel
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: arabicFont }}>
                Dashboard de Ventas
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={downloadExcel}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  style={{ fontFamily: arabicFont }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                  <span>Descargar Excel</span>
                </button>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-amber-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                <h3 className="text-blue-400 text-sm font-semibold">Total Ventas</h3>
                <p className="text-white text-2xl font-bold">{stats.totalSales || 0}</p>
              </div>
              <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                <h3 className="text-green-400 text-sm font-semibold">Ingresos</h3>
                <p className="text-white text-2xl font-bold">${(stats.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-4">
                <h3 className="text-purple-400 text-sm font-semibold">Entradas Vendidas</h3>
                <p className="text-white text-2xl font-bold">{stats.totalTickets || 0}</p>
              </div>
              <div className="bg-amber-600/20 border border-amber-400/30 rounded-lg p-4">
                <h3 className="text-amber-400 text-sm font-semibold">VIP Vendidas</h3>
                <p className="text-white text-2xl font-bold">{stats.totalVipTickets || 0}</p>
              </div>
            </div>

            {/* Lista de ventas */}
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/10 sticky top-0">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-amber-400 font-semibold">Fecha</th>
                      <th className="px-4 py-3 text-amber-400 font-semibold">Cliente</th>
                      <th className="px-4 py-3 text-amber-400 font-semibold">Entradas</th>
                      <th className="px-4 py-3 text-amber-400 font-semibold">Total</th>
                      <th className="px-4 py-3 text-amber-400 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((sale, index) => (
                      <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3 text-white">
                          {new Date(sale.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-white">
                          <div>
                            <p className="font-medium">{sale.nombre}</p>
                            <p className="text-xs text-white/70">{sale.email}</p>
                            <p className="text-xs text-white/70">{sale.telefono}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white">
                          <div className="text-xs space-y-1">
                            {sale.vipTickets > 0 && <div>VIP: {sale.vipTickets}</div>}
                            {sale.adultTickets > 0 && <div>Adultos: {sale.adultTickets}</div>}
                            {sale.childTickets > 0 && <div>Niños: {sale.childTickets}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white font-semibold">
                          ${sale.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sale.estado === 'approved' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {sale.estado === 'approved' ? 'Pagado' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {salesData.length === 0 && (
                  <div className="text-center py-8 text-white/70">
                    No hay ventas registradas aún
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}