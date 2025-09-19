import React, { useState, useEffect } from 'react';
import LandingPage from './frontend/LandingPage';
import TicketsPage from './frontend/TicketPage';
import ConfirmationPage from './frontend/ConfirmationPage';
import AdminModal from './frontend/AdminModal';

// Configuración de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const API_ENDPOINTS = {
  // Rutas según tu ticketRoutes.js
  reservas: `${API_BASE_URL}/reservas`,
  crearReserva: `${API_BASE_URL}/reservas`,
  eliminarReserva: (ticket) => `${API_BASE_URL}/reservas/${ticket}`,
  
  // MercadoPago
  mercadoPago: `${API_BASE_URL}/mercadoPago`,
  
  // Rutas admin
  adminLogin: `${API_BASE_URL}/api/admin/login`,
  adminSales: `${API_BASE_URL}/api/admin/sales`,
  adminExport: `${API_BASE_URL}/api/admin/export`
};

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'tickets' | 'confirmation'
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(null); 
  const [paymentResult, setPaymentResult] = useState(null);
  
  // Estado para admin modal
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Información del evento
  const eventInfo = {
    title: "Gran Cena Show Árabe",
    subtitle: "BASSAM y su orquesta al Nogum",
    date: "1 de Noviembre",
    location: "Salón Haiat"
  };

  // Función helper para hacer requests a la API
  const apiRequest = async (url, options = {}) => {
    console.log('Making API request to:', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      // Algunos endpoints pueden no devolver JSON (ej: DELETE)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('API Error:', error);
      console.error('Request URL:', url);
      setError(error.message);
      throw error;
    }
  };

  // Función para manejar click del botón admin
  const handleAdminClick = () => {
    setShowAdminModal(true);
  };

  // Función para cerrar modal admin
  const handleCloseAdmin = () => {
    setShowAdminModal(false);
  };

  // Cargar reservas desde la API
  const fetchReservas = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiRequest(API_ENDPOINTS.reservas);
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Error al cargar las reservas');
      setReservas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nueva reserva
  const handleCreateTicket = async (ticketData) => {
    try {
      const reservaData = {
        comprador: {
          nombre: ticketData.customerName,
          email: ticketData.email,
          telefono: ticketData.phone
        },
        entradas: {
          VIP: [],
          GENERAL: []
        }
      };

      // Determinar el tipo de entrada y agregarlo al array correspondiente
      const tipoEntrada = ticketData.ticketType; // 'VIP' o 'GENERAL'
      const tipoPersona = ticketData.personType || 'Adult'; // 'Adult' o 'Child'
      
      // Agregar las entradas según la cantidad
      for (let i = 0; i < ticketData.quantity; i++) {
        const entrada = {
          tipo: tipoPersona,
          nombre: ticketData.guestNames ? ticketData.guestNames[i] : `${ticketData.customerName} ${i + 1}`
        };

        if (tipoEntrada === 'VIP') {
          reservaData.entradas.VIP.push(entrada);
        } else {
          reservaData.entradas.GENERAL.push(entrada);
        }
      }

      const response = await apiRequest(API_ENDPOINTS.crearReserva, {
        method: 'POST',
        body: JSON.stringify(reservaData)
      });

      // Actualizar la lista local
      await fetchReservas();
      setError(null);
      setSuccessMessage('Reserva creada correctamente');
      return response.reserva;
    } catch (error) {
      setError('Error al crear la reserva');
      throw error;
    }
  };

  // Eliminar reserva
  const handleDeleteTicket = async (ticket) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.eliminarReserva(ticket), {
        method: 'DELETE'
      });

      // Actualizar la lista local
      setReservas(prev => prev.filter(reserva => reserva.ticket !== ticket));
      setError(null);
      setSuccessMessage('Reserva eliminada correctamente');
    } catch (error) {
      setError('Error al eliminar la reserva');
      throw error;
    }
  };

  // Cambiar estado (actualización local por ahora)
  const handleStatusChange = async (ticket, newStatus) => {
    try {
      // Actualización local (puedes implementar PATCH en el backend)
      setReservas(prev => 
        prev.map(reserva => 
          reserva.ticket === ticket 
            ? { ...reserva, estado: newStatus } 
            : reserva
        )
      );
      
      setSuccessMessage(`Estado cambiado a: ${newStatus}`);
      console.warn('Cambio de estado solo local. Implementar PATCH /reservas/:ticket/estado en backend.');
      
    } catch (error) {
      setError('Error al cambiar el estado');
      throw error;
    }
  };

  // Generar pago con MercadoPago
  const handleGenerarPago = async (ticket) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/mercadoPago`, {
        method: 'POST',
        body: JSON.stringify({ ticket })
      });

      return response;
    } catch (error) {
      setError('Error al generar el pago');
      throw error;
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedTickets(null);
  };

  // Refrescar datos
  const handleRefresh = () => {
    fetchReservas();
  };

  // Manejar inicio de compra desde Landing Page
  const handleStartPurchase = async (selectionData) => {
    console.log('Datos recibidos del LandingPage:', selectionData);
    setSelectedTickets(selectionData);
    setCurrentView('tickets');
  };

  // Detectar redirecciones de MercadoPago
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('collection_status') || urlParams.get('status');
    const paymentId = urlParams.get('collection_id') || urlParams.get('payment_id');
    
    // Detectar rutas de retorno de MercadoPago
    if (window.location.pathname.includes('/payment/')) {
      let paymentStatus = 'failure'; // Default
      
      if (window.location.pathname.includes('/success')) {
        paymentStatus = 'success';
      } else if (window.location.pathname.includes('/pending')) {
        paymentStatus = 'pending';
      } else if (window.location.pathname.includes('/failure')) {
        paymentStatus = 'failure';
      }
      
      setCurrentView('confirmation');
      setPaymentResult({ 
        status: paymentStatus, 
        paymentId: paymentId 
      });
    }
  }, []);

  // Cargar datos cuando se monta el componente
  useEffect(() => {
    if (currentView === 'tickets') {
      fetchReservas();
    }
  }, [currentView]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Mostrar error global
  const ErrorMessage = () => {
    if (!error) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm">
        <div className="flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div className="flex-1">
            <p className="font-medium text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-200 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  const SuccessMessage = () => {
    if (!successMessage) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <p className="font-medium text-sm">{successMessage}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <ErrorMessage />
      <SuccessMessage />
      
      {currentView === 'landing' ? (
        <LandingPage 
          onStart={handleStartPurchase}
          onAdminClick={handleAdminClick}
          eventInfo={eventInfo}
        />
      ) : currentView === 'tickets' ? (
        <TicketsPage
          selectedTickets={selectedTickets}
          eventInfo={eventInfo}
          onBack={handleBackToLanding}
        />
      ) : currentView === 'confirmation' ? (
        <ConfirmationPage
          paymentStatus={paymentResult?.status}
          reservaData={paymentResult?.data}
          eventInfo={eventInfo}
          onBackToHome={() => {
            setCurrentView('landing');
            setPaymentResult(null);
            setSelectedTickets(null);
          }}
        />
      ) : null}

      {/* Modal de admin */}
      <AdminModal 
        isOpen={showAdminModal}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}

export default App;