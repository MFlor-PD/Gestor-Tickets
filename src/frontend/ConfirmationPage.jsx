import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, MapPin, Clock, Mail, Phone, Download, Home } from 'lucide-react';

export default function ConfirmationPage({ 
  paymentStatus, 
  reservaData, 
  eventInfo, 
  onBackToHome 
}) {
  // Cargar tipografías árabes
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  
  const arabicFont = "'Amiri', 'Scheherazade New', serif";

  const isSuccess = paymentStatus === 'success' || paymentStatus === 'approved';
  const isPending = paymentStatus === 'pending';
  const isFailed = paymentStatus === 'failure' || paymentStatus === 'rejected';

  const getStatusConfig = () => {
    if (isSuccess) {
      return {
        icon: <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-400" />,
        title: 'Pago Exitoso',
        subtitle: 'Tu reserva ha sido confirmada',
        bgColor: 'from-green-500/20 to-emerald-500/20',
        borderColor: 'border-green-400/30'
      };
    } else if (isPending) {
      return {
        icon: <Clock className="w-16 h-16 md:w-20 md:h-20 text-amber-400" />,
        title: 'Pago Pendiente',
        subtitle: 'Estamos procesando tu pago',
        bgColor: 'from-amber-500/20 to-yellow-500/20',
        borderColor: 'border-amber-400/30'
      };
    } else {
      return {
        icon: <XCircle className="w-16 h-16 md:w-20 md:h-20 text-red-400" />,
        title: 'Pago No Completado',
        subtitle: 'Hubo un problema con el pago',
        bgColor: 'from-red-500/20 to-pink-500/20',
        borderColor: 'border-red-400/30'
      };
    }
  };

  const statusConfig = getStatusConfig();

  const formatDate = (dateString) => {
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

  const handleDownloadTicket = () => {
    // Aquí implementarías la descarga del ticket
    console.log('Descargando ticket...');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* FONDO CONSISTENTE */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 50%, #000000 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-black/40" />
      </div>

      {/* MANDALA DE FONDO */}
      <div className="fixed left-0 top-0 h-screen w-full pointer-events-none z-0">
        <div 
          className="absolute -left-1/4 md:-left-1/6 lg:-left-1/4 xl:-left-1/6 top-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] lg:w-[1000px] lg:h-[1000px] xl:w-[1100px] xl:h-[1100px]"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, transparent 70%)',
          }}
        >
          <img
            src="/mandala.png"
            alt=""
            className="w-full h-full object-contain opacity-20 md:opacity-25 lg:opacity-30 xl:opacity-35"
            style={{ 
              filter: 'drop-shadow(0 0 50px rgba(212,175,55,.15)) brightness(1.1) contrast(1.05)' 
            }}
          />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          
          {/* ESTADO DEL PAGO */}
          <div className={`bg-gradient-to-r ${statusConfig.bgColor} backdrop-blur-sm rounded-2xl border ${statusConfig.borderColor} p-8 md:p-12 shadow-2xl text-center mb-8`}>
            <div className="flex justify-center mb-6">
              {statusConfig.icon}
            </div>
            
            <h1 
              className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide"
              style={{ fontFamily: arabicFont }}
            >
              {statusConfig.title}
            </h1>
            
            <p 
              className="text-amber-200 text-lg md:text-xl"
              style={{ fontFamily: arabicFont }}
            >
              {statusConfig.subtitle}
            </p>

            {reservaData?.ticket && (
              <div className="mt-6 p-4 bg-black/30 rounded-lg border border-amber-400/20">
                <p className="text-amber-300 text-sm font-medium">Número de Reserva</p>
                <p className="text-white font-mono text-lg">{reservaData.ticket}</p>
              </div>
            )}
          </div>

          {/* DETALLES DE LA RESERVA - Solo si el pago fue exitoso o está pendiente */}
          {(isSuccess || isPending) && reservaData && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
              
              {/* INFORMACIÓN DEL EVENTO */}
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-amber-400/20 p-6 md:p-8 shadow-2xl">
                <h2 
                  className="text-2xl font-bold text-amber-300 mb-6"
                  style={{ fontFamily: arabicFont }}
                >
                  Detalles del Evento
                </h2>
                
                <div className="space-y-4 text-amber-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="font-medium">Viernes 1 de Noviembre, 2024</p>
                      <p className="text-sm text-amber-200/70">Apertura: 20:00hs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>{eventInfo.location}</span>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-lg">
                    <h3 
                      className="text-amber-300 font-bold text-lg mb-2"
                      style={{ fontFamily: arabicFont }}
                    >
                      {eventInfo.title}
                    </h3>
                    <p 
                      className="text-amber-200"
                      style={{ fontFamily: arabicFont }}
                    >
                      {eventInfo.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN DEL COMPRADOR */}
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-amber-400/20 p-6 md:p-8 shadow-2xl">
                <h2 
                  className="text-2xl font-bold text-amber-300 mb-6"
                  style={{ fontFamily: arabicFont }}
                >
                  Datos del Comprador
                </h2>
                
                <div className="space-y-4 text-amber-200">
                  {reservaData.comprador?.nombre && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold">👤</span>
                      </div>
                      <span>{reservaData.comprador.nombre}</span>
                    </div>
                  )}
                  
                  {reservaData.comprador?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-amber-400" />
                      <span>{reservaData.comprador.email}</span>
                    </div>
                  )}
                  
                  {reservaData.comprador?.telefono && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-amber-400" />
                      <span>{reservaData.comprador.telefono}</span>
                    </div>
                  )}

                  {reservaData.comprador?.observaciones && (
                    <div className="mt-4 p-3 bg-amber-500/10 rounded-lg">
                      <p className="text-amber-300 text-sm font-medium mb-1">Observaciones:</p>
                      <p className="text-amber-200 text-sm">{reservaData.comprador.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ENTRADAS COMPRADAS */}
          {(isSuccess || isPending) && reservaData?.entradas && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 md:p-8 shadow-2xl mb-8">
              <h2 
                className="text-2xl font-bold text-green-300 mb-6 text-center"
                style={{ fontFamily: arabicFont }}
              >
                Entradas Adquiridas
              </h2>
              
              <div className="space-y-4">
                {reservaData.entradas.map((entrada, index) => (
                  <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/20 rounded-lg border border-green-400/20">
                    <div>
                      <p className="text-green-300 text-sm font-medium">Tipo</p>
                      <p className="text-white font-bold">{entrada.tipo}</p>
                    </div>
                    <div>
                      <p className="text-green-300 text-sm font-medium">Cantidad</p>
                      <p className="text-white font-bold text-lg">{entrada.cantidad}</p>
                    </div>
                    <div>
                      <p className="text-green-300 text-sm font-medium">Precio Unit.</p>
                      <p className="text-white font-semibold">${entrada.precio_unitario?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-green-300 text-sm font-medium">Subtotal</p>
                      <p className="text-white font-bold">${entrada.precio_total?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {reservaData.totales?.TOTAL && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold text-xl" style={{ fontFamily: arabicFont }}>
                      Total Pagado
                    </span>
                    <span className="text-black font-extrabold text-2xl">
                      ${reservaData.totales.TOTAL.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACCIONES */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSuccess && (
              <button
                onClick={handleDownloadTicket}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: arabicFont }}
              >
                <Download className="w-5 h-5" />
                Descargar Ticket
              </button>
            )}
            
            {isFailed && (
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: arabicFont }}
              >
                Intentar Nuevamente
              </button>
            )}
            
            <button
              onClick={onBackToHome}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: arabicFont }}
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </button>
          </div>

          {/* INSTRUCCIONES ADICIONALES */}
          {isSuccess && (
            <div className="mt-8 text-center">
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30 p-6 shadow-lg">
                <h3 
                  className="text-blue-300 font-bold text-lg mb-4"
                  style={{ fontFamily: arabicFont }}
                >
                  Instrucciones Importantes
                </h3>
                <div className="space-y-2 text-blue-200 text-sm">
                  <p>• Llegada recomendada: 19:30hs</p>
                  <p>• Presenta tu ticket al ingresar al evento</p>
                  <p>• Guarda este número de reserva: <strong>{reservaData?.ticket}</strong></p>
                  <p>• Para consultas, contacta a la organización</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}