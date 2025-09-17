import React from 'react';
import { Calendar, MapPin, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

const TicketCard = ({ ticket, onStatusChange, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
      case 'pending': 
        return 'bg-red-100 text-red-800 border-red-200';
      case 'confirmado':
      case 'confirmed': 
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pagado':
      case 'paid': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
      case 'cancelled': 
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
      case 'pending': 
        return <AlertCircle className="h-4 w-4" />;
      case 'confirmado':
      case 'confirmed': 
        return <Clock className="h-4 w-4" />;
      case 'pagado':
      case 'paid': 
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelado':
      case 'cancelled': 
        return <XCircle className="h-4 w-4" />;
      default: 
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTicketTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'VIP': 
        return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white';
      case 'PREMIUM': 
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'GENERAL': 
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: 
        return 'bg-gray-500 text-white';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Adaptar a la estructura de tu backend
  const getTicketData = () => {
    return {
      id: ticket.id || ticket.ticket,
      customerName: ticket.comprador?.nombre || ticket.customerName,
      email: ticket.comprador?.email || ticket.email,
      phone: ticket.comprador?.telefono || ticket.phone,
      specialRequests: ticket.comprador?.observaciones || ticket.specialRequests,
      ticket: ticket.ticket,
      fecha: ticket.fecha,
      entradas: ticket.entradas || [],
      totales: ticket.totales || {},
      medioPago: ticket.medioPago
    };
  };

  const ticketData = getTicketData();
  const primeraEntrada = ticketData.entradas[0] || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900">
              {ticketData.customerName || 'Sin nombre'}
            </h3>
            {primeraEntrada.tipo && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTicketTypeColor(primeraEntrada.tipo)}`}>
                {primeraEntrada.tipo}
              </span>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            {ticketData.email && (
              <p className="text-gray-600">
                📧 {ticketData.email}
              </p>
            )}
            
            {ticketData.phone && (
              <p className="text-gray-600">
                📱 {ticketData.phone}
              </p>
            )}
            
            {primeraEntrada.fecha_evento && (
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(primeraEntrada.fecha_evento)}
              </p>
            )}
            
            {primeraEntrada.ubicacion && (
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {primeraEntrada.ubicacion}
              </p>
            )}

            {ticketData.ticket && (
              <p className="text-gray-500 font-mono text-xs">
                🎫 {ticketData.ticket}
              </p>
            )}
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border ${getStatusColor(ticket.estado || 'pendiente')}`}>
          {getStatusIcon(ticket.estado || 'pendiente')}
          {ticket.estado || 'Pendiente'}
        </div>
      </div>
      
      {/* Información de entradas */}
      {ticketData.entradas.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-red-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-gray-700 mb-3">Entradas:</h4>
          <div className="space-y-3">
            {ticketData.entradas.map((entrada, idx) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Tipo</p>
                  <p className="font-bold text-gray-900">{entrada.tipo}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 font-medium">Cantidad</p>
                  <p className="font-bold text-lg text-gray-900">{entrada.cantidad}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 font-medium">Precio Unit.</p>
                  <p className="font-semibold text-lg text-green-600">
                    {formatPrice(entrada.precio_unitario)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500 font-medium">Mesa</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {entrada.mesa || 'Por asignar'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totales */}
      {ticketData.totales && Object.keys(ticketData.totales).length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Resumen de precios:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(ticketData.totales).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key.toLowerCase()}:</span>
                <span className={`font-semibold ${key === 'TOTAL' ? 'text-xl text-green-700' : 'text-green-600'}`}>
                  {formatPrice(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Medio de pago */}
      {ticketData.medioPago && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Medio de pago:</span> {ticketData.medioPago}
          </p>
        </div>
      )}

      {/* Solicitudes especiales */}
      {ticketData.specialRequests && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Observaciones:</span> {ticketData.specialRequests}
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {ticketData.fecha && (
            <p>Creado: {formatDate(ticketData.fecha)}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {onEdit && (
            <button
              onClick={() => onEdit(ticket)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Editar
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(ticketData.ticket)}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Eliminar
            </button>
          )}
          
          {onStatusChange && (
            <select
              value={ticket.estado || 'pendiente'}
              onChange={(e) => onStatusChange(ticketData.ticket, e.target.value)}
              className="border-2 border-amber-300 rounded-lg px-3 py-2 text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-200 min-w-[120px]"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="pagado">Pagado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;