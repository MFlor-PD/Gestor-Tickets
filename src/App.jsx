import React, { useState, useEffect } from 'react';
import LandingPage from './frontend/LandingPage';
import TicketsPage from './frontend/TicketPage';
import ConfirmationPage from './frontend/ConfirmationPage';
import AdminModal from './frontend/AdminModal'; // ⭐ NUEVO

// Configuración de la API - Ajusta el puerto según tu backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const API_ENDPOINTS = {
  // Rutas según tu ticketRoutes.js
  reservas: `${API_BASE_URL}/reservas`,
  crearReserva: `${API_BASE_URL}/reservas`,
  eliminarReserva: (ticket) => `${API_BASE_URL}/reservas/${ticket}`,
  
  // Rutas del carrito
  carrito: `${API_BASE_URL}/carrito`,
  agregarCarrito: `${API_BASE_URL}/carrito`,
  eliminarCarrito: (ticket) => `${API_BASE_URL}/carrito/${ticket}`,
  vaciarCarrito: `${API_BASE_URL}/carrito`,
  medioPago: `${API_BASE_URL}/carrito/medio-pago`,
  
  // MercadoPago
  mercadoPago: `${API_BASE_URL}/mercadoPago`,
  
  // ⭐ RUTAS ADMIN NUEVAS
  adminLogin: `${API_BASE_URL}/api/admin/login`,
  adminSales: `${API_BASE_URL}/api/admin/sales`,
  adminExport: `${API_BASE_URL}/api/admin/export`
};

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'tickets'
  const [reservas, setReservas] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(null); 
  const [paymentResult, setPaymentResult] = useState(null);
  
  // ⭐ ESTADO PARA ADMIN MODAL
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

  // ⭐ FUNCIÓN PARA MANEJAR CLICK DEL BOTÓN ADMIN
  const handleAdminClick = () => {
    setShowAdminModal(true);
  };

  // ⭐ FUNCIÓN PARA CERRAR MODAL ADMIN
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

  // Cargar carrito
  const fetchCarrito = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.carrito);
      setCarrito(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    }
  };

  // Crear nueva reserva - FORMATO CORREGIDO SEGÚN BACKEND
  const handleCreateTicket = async (ticketData) => {
    try {
      // Formato según el backend que proporcionaste
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

  // Crear reserva desde datos del Landing Page
  const handleCreateTicketFromSelection = async (selectionData) => {
    try {
      const reservaData = {
        comprador: {
          nombre: "Cliente", // Esto debería venir de un formulario
          email: "cliente@example.com", // Esto debería venir de un formulario
          telefono: "+541112345678" // Esto debería venir de un formulario
        },
        entradas: {
          VIP: [],
          GENERAL: []
        }
      };

      // Agregar tickets VIP
      for (let i = 0; i < selectionData.vipTickets; i++) {
        reservaData.entradas.VIP.push({
          tipo: "Adult", // Puedes ajustar según necesites
          nombre: `VIP ${i + 1}`
        });
      }

      // Agregar tickets para adultos
      for (let i = 0; i < selectionData.adultTickets; i++) {
        reservaData.entradas.GENERAL.push({
          tipo: "Adult",
          nombre: `Adult ${i + 1}`
        });
      }

      // Agregar tickets para niños
      for (let i = 0; i < selectionData.childTickets; i++) {
        reservaData.entradas.GENERAL.push({
          tipo: "Child",
          nombre: `Child ${i + 1}`
        });
      }

      const response = await apiRequest(API_ENDPOINTS.crearReserva, {
        method: 'POST',
        body: JSON.stringify(reservaData)
      });

      await fetchReservas();
      setError(null);
      setSuccessMessage('Reserva creada desde selección');
      return response.reserva;
    } catch (error) {
      setError('Error al crear reserva desde selección');
      throw error;
    }
  };

  // Actualizar reserva (si implementas PUT en el backend)
  const handleUpdateTicket = async (ticketId, ticketData) => {
    try {
      // Por ahora, como no tienes ruta PUT, eliminamos y creamos nueva
      // O puedes implementar PUT /reservas/:ticket en tu backend
      
      setError('Función de actualización no implementada aún');
      throw new Error('Actualización no disponible');
    } catch (error) {
      setError('Error al actualizar la reserva');
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

  // Agregar al carrito - FORMATO CORREGIDO
  const handleAddToCarrito = async (reservaData) => {
    try {
      // Usar el mismo formato que las reservas según el backend
      const carritoData = {
        comprador: {
          nombre: reservaData.customerName || reservaData.comprador?.nombre || "Cliente",
          email: reservaData.email || reservaData.comprador?.email || "cliente@example.com",
          telefono: reservaData.phone || reservaData.comprador?.telefono || "+541112345678"
        },
        entradas: {
          VIP: [],
          GENERAL: []
        }
      };

      // Si es una selección del landing page
      if (reservaData.vipTickets || reservaData.adultTickets || reservaData.childTickets) {
        // Agregar tickets VIP
        for (let i = 0; i < (reservaData.vipTickets || 0); i++) {
          carritoData.entradas.VIP.push({
            tipo: "Adult",
            nombre: `VIP ${i + 1}`
          });
        }

        // Agregar tickets para adultos
        for (let i = 0; i < (reservaData.adultTickets || 0); i++) {
          carritoData.entradas.GENERAL.push({
            tipo: "Adult",
            nombre: `Adult ${i + 1}`
          });
        }

        // Agregar tickets para niños
        for (let i = 0; i < (reservaData.childTickets || 0); i++) {
          carritoData.entradas.GENERAL.push({
            tipo: "Child",
            nombre: `Child ${i + 1}`
          });
        }
      } else {
        // Formato tradicional de ticket individual
        const tipoEntrada = reservaData.ticketType || 'GENERAL';
        const tipoPersona = reservaData.personType || 'Adult';
        
        for (let i = 0; i < (reservaData.quantity || 1); i++) {
          const entrada = {
            tipo: tipoPersona,
            nombre: reservaData.guestNames ? reservaData.guestNames[i] : `${carritoData.comprador.nombre} ${i + 1}`
          };

          if (tipoEntrada === 'VIP') {
            carritoData.entradas.VIP.push(entrada);
          } else {
            carritoData.entradas.GENERAL.push(entrada);
          }
        }
      }

      const response = await apiRequest(API_ENDPOINTS.agregarCarrito, {
        method: 'POST',
        body: JSON.stringify(carritoData)
      });
      
      await fetchCarrito();
      setError(null);
      setSuccessMessage('Agregado al carrito correctamente');
      return response.reserva;
    } catch (error) {
      setError('Error al agregar al carrito');
      throw error;
    }
  };

  // Eliminar del carrito
  const handleRemoveFromCarrito = async (ticket) => {
    try {
      await apiRequest(API_ENDPOINTS.eliminarCarrito(ticket), {
        method: 'DELETE'
      });
      
      await fetchCarrito();
      setError(null);
      setSuccessMessage('Eliminado del carrito');
    } catch (error) {
      setError('Error al eliminar del carrito');
      throw error;
    }
  };

  // Vaciar carrito
  const handleVaciarCarrito = async () => {
    try {
      await apiRequest(API_ENDPOINTS.vaciarCarrito, {
        method: 'DELETE'
      });
      
      setCarrito([]);
      setError(null);
      setSuccessMessage('Carrito vaciado');
    } catch (error) {
      setError('Error al vaciar el carrito');
      throw error;
    }
  };

  // Generar pago con MercadoPago - ✅ FUNCIÓN ÚNICA
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

  // Guardar medio de pago
  const handleMedioPago = async (medio) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.medioPago, {
        method: 'PATCH',
        body: JSON.stringify({ medio })
      });

      await fetchCarrito(); // Recargar carrito con medio de pago actualizado
      setSuccessMessage(`Medio de pago guardado: ${medio}`);
      return response;
    } catch (error) {
      setError('Error al guardar medio de pago');
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
    fetchCarrito();
  };

  // Manejar inicio de compra desde Landing Page
  const handleStartPurchase = async (selectionData) => {
    console.log('Datos recibidos del LandingPage:', selectionData);
    setSelectedTickets(selectionData);
    
    // Opción 1: Ir directamente a TicketsPage para que el usuario complete los datos
    setCurrentView('tickets');
    
    // Opción 2: Agregar automáticamente al carrito (descomenta si prefieres esto)
    // try {
    //   await handleAddToCarrito(selectionData);
    //   setCurrentView('tickets');
    // } catch (error) {
    //   console.error('Error al procesar selección:', error);
    // }
  };

  // Cargar datos cuando se monta el componente y cuando cambia la vista
  useEffect(() => {
    if (currentView === 'tickets') {
      fetchReservas();
      fetchCarrito();
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
          onAdminClick={handleAdminClick} // ⭐ NUEVA PROP
          eventInfo={eventInfo}
        />
      ) : currentView === 'tickets' ? (
        <TicketsPage
          selectedTickets={selectedTickets}
          tickets={reservas}
          carrito={carrito}
          onCreateTicket={handleCreateTicket}
          onUpdateTicket={handleUpdateTicket}
          onDeleteTicket={handleDeleteTicket}
          onStatusChange={handleStatusChange}
          onAddToCarrito={handleAddToCarrito}
          onRemoveFromCarrito={handleRemoveFromCarrito}
          onVaciarCarrito={handleVaciarCarrito}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          eventInfo={eventInfo}
          onGenerarPago={handleGenerarPago}
          onMedioPago={handleMedioPago}
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

      {/* ⭐ MODAL DE ADMIN */}
      <AdminModal 
        isOpen={showAdminModal}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}

export default App;