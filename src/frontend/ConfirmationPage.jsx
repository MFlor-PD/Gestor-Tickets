import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, Mail, Phone, Download, Home, RefreshCw, AlertCircle, ChevronDown, ChevronUp, QrCode } from 'lucide-react';

export default function ConfirmationPage({ 
  paymentStatus, 
  reservaData, 
  eventInfo, 
  onBackToHome 
}) {
  const [currentStatus, setCurrentStatus] = useState(paymentStatus);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [reservaDetails, setReservaDetails] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Cargar tipografías árabes
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  
  const arabicFont = "'Amiri', 'Scheherazade New', serif";

  // Obtener payment ID de la URL
  const getPaymentId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('collection_id') || urlParams.get('payment_id') || 'TEST123';
  };

  // Cargar datos de la reserva
  useEffect(() => {
    const loadReservaData = async () => {
      try {
        const paymentId = getPaymentId();
        const response = await fetch(`${API_BASE_URL}/api/admin/payment/status/${paymentId}`);
        if (response.ok) {
          const data = await response.json();
          setReservaDetails(data.reserva);
          setCurrentStatus('success');
        }
      } catch (error) {
        console.error('Error loading reserva data:', error);
      }
    };

    if (currentStatus === 'success' || currentStatus === 'approved') {
      loadReservaData();
    }
  }, [currentStatus, API_BASE_URL]);

  // Polling para verificar cambios de estado en pagos pendientes
  useEffect(() => {
    if (currentStatus === 'pending' && pollingCount < 20) {
      setIsPolling(true);
      const interval = setInterval(async () => {
        try {
          const paymentId = getPaymentId();
          const response = await fetch(`${API_BASE_URL}/api/admin/payment/status/${paymentId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.status !== 'pending') {
              setCurrentStatus(data.status);
              setReservaDetails(data.reserva);
              setIsPolling(false);
              clearInterval(interval);
            }
          }
          
          setPollingCount(prev => prev + 1);
          if (pollingCount >= 19) {
            setIsPolling(false);
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [currentStatus, pollingCount, API_BASE_URL]);

  const isSuccess = currentStatus === 'success' || currentStatus === 'approved';
  const isPending = currentStatus === 'pending';
  const isFailed = currentStatus === 'failure' || currentStatus === 'rejected';

  const getStatusConfig = () => {
    if (isSuccess) {
      return {
        icon: <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-400" />,
        title: 'Pago Confirmado',
        subtitle: 'Tu reserva ha sido procesada exitosamente',
        bgColor: 'from-green-500/20 to-emerald-500/20',
        borderColor: 'border-green-400/30',
        textColor: 'text-green-400'
      };
    } else if (isPending) {
      return {
        icon: isPolling ? 
          <RefreshCw className="w-16 h-16 md:w-20 md:h-20 text-amber-400 animate-spin" /> :
          <Clock className="w-16 h-16 md:w-20 md:h-20 text-amber-400" />,
        title: 'Pago en Proceso',
        subtitle: isPolling ? 'Verificando estado del pago...' : 'Tu pago está siendo procesado',
        bgColor: 'from-amber-500/20 to-yellow-500/20',
        borderColor: 'border-amber-400/30',
        textColor: 'text-amber-400'
      };
    } else {
      return {
        icon: <XCircle className="w-16 h-16 md:w-20 md:h-20 text-red-400" />,
        title: 'Pago No Procesado',
        subtitle: 'Hubo un inconveniente con tu pago',
        bgColor: 'from-red-500/20 to-pink-500/20',
        borderColor: 'border-red-400/30',
        textColor: 'text-red-400'
      };
    }
  };

  const statusConfig = getStatusConfig();

  // Función para descargar ticket con QR
  const handleDownloadTicket = async () => {
    setIsDownloading(true);
    try {
      const paymentId = getPaymentId();
      
      const response = await fetch(`${API_BASE_URL}/api/admin/ticket/download/${paymentId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Error al generar el ticket');
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-cena-arabe-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Error al descargar el ticket. Si el problema persiste, contacta a la organización.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Línea de tiempo del proceso
  const ProcessTimeline = () => (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-400/20 p-4 md:p-6 shadow-2xl mb-6">
      <h3 className="text-lg md:text-xl font-bold text-amber-300 mb-4 text-center" style={{ fontFamily: arabicFont }}>
        Estado de tu Reserva
      </h3>
      
      <div className="flex items-center justify-between">
        {/* Paso 1: Datos completados */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
            <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
          <p className="text-green-400 text-xs md:text-sm font-medium text-center">Datos Completados</p>
        </div>

        {/* Línea conectora */}
        <div className="flex-1 h-1 mx-2 md:mx-4 bg-gradient-to-r from-green-500 to-amber-400"></div>

        {/* Paso 2: Pago */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 ${
            isSuccess ? 'bg-green-500' : isPending ? 'bg-amber-500' : 'bg-red-500'
          }`}>
            {isSuccess ? <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-white" /> :
             isPending ? <Clock className="w-4 h-4 md:w-6 md:h-6 text-white" /> :
             <XCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />}
          </div>
          <p className={`text-xs md:text-sm font-medium text-center ${
            isSuccess ? 'text-green-400' : isPending ? 'text-amber-400' : 'text-red-400'
          }`}>
            {isSuccess ? 'Pago Confirmado' : isPending ? 'Procesando Pago' : 'Pago Fallido'}
          </p>
        </div>

        {/* Línea conectora */}
        <div className={`flex-1 h-1 mx-2 md:mx-4 ${
          isSuccess ? 'bg-gradient-to-r from-amber-500 to-green-500' : 'bg-gray-600'
        }`}></div>

        {/* Paso 3: Ticket */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 ${
            isSuccess ? 'bg-green-500' : 'bg-gray-600'
          }`}>
            {isSuccess ? <QrCode className="w-4 h-4 md:w-6 md:h-6 text-white" /> : <AlertCircle className="w-4 h-4 md:w-6 md:h-6 text-gray-300" />}
          </div>
          <p className={`text-xs md:text-sm font-medium text-center ${
            isSuccess ? 'text-green-400' : 'text-gray-400'
          }`}>
            {isSuccess ? 'Ticket Listo' : 'Pendiente'}
          </p>
        </div>
      </div>
    </div>
  );

  // Datos de ejemplo si no hay datos reales
  const displayData = reservaDetails || {
    ticket: 'ARB-' + (Math.random().toString(36).substr(2, 9)).toUpperCase(),
    comprador: {
      nombre: 'Comprador',
      email: 'comprador@email.com',
      telefono: '+54 11 1234-5678'
    },
    entradas: [
      { tipo: 'VIP', cantidad: 1, precio_unitario: 80000, precio_total: 80000 }
    ],
    totales: { TOTAL: 80000 }
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
          className="absolute -left-1/4 md:-left-1/6 lg:-left-1/4 xl:-left-1/6 top-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[700px] md:h-[700px] lg:w-[1000px] lg:h-[1000px] xl:w-[1100px] xl:h-[1100px]"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, transparent 70%)',
          }}
        >
          <img
            src="/mandala.png"
            alt=""
            className="w-full h-full object-contain opacity-15 md:opacity-25 lg:opacity-30 xl:opacity-35"
            style={{ 
              filter: 'drop-shadow(0 0 50px rgba(212,175,55,.15)) brightness(1.1) contrast(1.05)' 
            }}
          />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
          
          {/* ESTADO DEL PAGO */}
          <div className={`bg-gradient-to-r ${statusConfig.bgColor} backdrop-blur-sm rounded-xl md:rounded-2xl border ${statusConfig.borderColor} p-6 md:p-12 shadow-2xl text-center mb-6`}>
            <div className="flex justify-center mb-4 md:mb-6">
              {statusConfig.icon}
            </div>
            
            <h1 
              className={`text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 tracking-wide`}
              style={{ fontFamily: arabicFont }}
            >
              {statusConfig.title}
            </h1>
            
            <p 
              className={`${statusConfig.textColor} text-lg md:text-xl lg:text-2xl mb-4 md:mb-6`}
              style={{ fontFamily: arabicFont }}
            >
              {statusConfig.subtitle}
            </p>

            {displayData?.ticket && (
              <div className="mt-4 md:mt-6 p-4 md:p-6 bg-black/30 rounded-lg border border-amber-400/20 max-w-sm mx-auto">
                <p className="text-amber-300 text-sm font-medium mb-2">Número de Reserva</p>
                <p className="text-white font-mono text-lg md:text-xl font-bold tracking-wider">{displayData.ticket}</p>
                <p className="text-amber-200/70 text-xs md:text-sm mt-2">Conserva este número para futuras consultas</p>
              </div>
            )}

            {isPending && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-500/20 rounded-lg border border-blue-400/30 max-w-md mx-auto">
                <p className="text-blue-200 text-sm">
                  {isPolling ? 
                    `Verificando automáticamente... (${pollingCount}/20)` :
                    'Recibirás una confirmación por email cuando se complete el pago'
                  }
                </p>
              </div>
            )}
          </div>

          {/* LÍNEA DE TIEMPO */}
          <ProcessTimeline />

          {/* BOTÓN DE DESCARGA PROMINENTE PARA MÓVIL */}
          {isSuccess && (
            <div className="mb-6">
              <button
                onClick={handleDownloadTicket}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-6 py-4 rounded-xl text-lg font-bold shadow-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-3"
                style={{ fontFamily: arabicFont }}
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    Generando Ticket...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    Descargar Mi Ticket (PDF + QR)
                  </>
                )}
              </button>
            </div>
          )}

          {/* DETALLES EXPANDIBLES */}
          {(isSuccess || isPending) && (
            <div className="mb-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full bg-black/20 backdrop-blur-sm rounded-xl border border-amber-400/20 p-4 shadow-lg flex items-center justify-between text-amber-300 hover:bg-black/30 transition-colors"
              >
                <span className="font-bold text-lg" style={{ fontFamily: arabicFont }}>
                  Ver Detalles de la Reserva
                </span>
                {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showDetails && (
                <div className="mt-4 space-y-4">
                  {/* INFORMACIÓN DEL EVENTO */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-400/20 p-4 md:p-6 shadow-2xl">
                    <h2 
                      className="text-xl md:text-2xl font-bold text-amber-300 mb-4"
                      style={{ fontFamily: arabicFont }}
                    >
                      Detalles del Evento
                    </h2>
                    
                    <div className="space-y-3 text-amber-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Viernes 1 de Noviembre, 2024</p>
                          <p className="text-sm text-amber-200/70">Apertura: 20:00hs</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <span className="text-sm md:text-base">Salón Haiat - Sociedad Árabe La Angelita</span>
                      </div>
                      
                      <div className="mt-4 p-3 md:p-4 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-lg">
                        <h3 
                          className="text-amber-300 font-bold text-lg mb-2"
                          style={{ fontFamily: arabicFont }}
                        >
                          Gran Cena Show Árabe
                        </h3>
                        <p 
                          className="text-amber-200"
                          style={{ fontFamily: arabicFont }}
                        >
                          BASSAM y su orquesta al Nogum
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* INFORMACIÓN DEL COMPRADOR */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-400/20 p-4 md:p-6 shadow-2xl">
                    <h2 
                      className="text-xl md:text-2xl font-bold text-amber-300 mb-4"
                      style={{ fontFamily: arabicFont }}
                    >
                      Datos del Comprador
                    </h2>
                    
                    <div className="space-y-3 text-amber-200">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-black text-xs font-bold">👤</span>
                        </div>
                        <span className="text-sm md:text-base">{displayData.comprador?.nombre}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <span className="text-sm md:text-base break-all">{displayData.comprador?.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <span className="text-sm md:text-base">{displayData.comprador?.telefono}</span>
                      </div>
                    </div>
                  </div>

                  {/* ENTRADAS COMPRADAS */}
                  {displayData?.entradas && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl border border-green-400/30 p-4 md:p-6 shadow-2xl">
                      <h2 
                        className="text-xl md:text-2xl font-bold text-green-300 mb-4 text-center"
                        style={{ fontFamily: arabicFont }}
                      >
                        Entradas Adquiridas
                      </h2>
                      
                      <div className="space-y-3">
                        {displayData.entradas.map((entrada, index) => (
                          <div key={index} className="bg-black/20 rounded-lg border border-green-400/20 p-3 md:p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-sm md:text-base">
                              <div>
                                <p className="text-green-300 text-xs md:text-sm font-medium">Tipo</p>
                                <p className="text-white font-bold">{entrada.tipo}</p>
                              </div>
                              <div>
                                <p className="text-green-300 text-xs md:text-sm font-medium">Cantidad</p>
                                <p className="text-white font-bold text-lg">{entrada.cantidad}</p>
                              </div>
                              <div>
                                <p className="text-green-300 text-xs md:text-sm font-medium">Precio Unit.</p>
                                <p className="text-white font-semibold">${entrada.precio_unitario?.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-green-300 text-xs md:text-sm font-medium">Subtotal</p>
                                <p className="text-white font-bold">${entrada.precio_total?.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 md:p-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-black font-bold text-lg md:text-xl" style={{ fontFamily: arabicFont }}>
                            Total Pagado
                          </span>
                          <span className="text-black font-extrabold text-xl md:text-2xl">
                            ${displayData.totales?.TOTAL?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6">
            {isFailed && (
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: arabicFont }}
              >
                Intentar Nuevamente
              </button>
            )}
            
            <button
              onClick={onBackToHome}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold shadow-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: arabicFont }}
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </button>
          </div>

          {/* INSTRUCCIONES IMPORTANTES */}
          {isSuccess && (
            <div className="text-center">
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30 p-4 md:p-6 shadow-lg">
                <h3 
                  className="text-blue-300 font-bold text-lg mb-3 md:mb-4"
                  style={{ fontFamily: arabicFont }}
                >
                  Instrucciones Importantes
                </h3>
                <div className="space-y-2 text-blue-200 text-sm md:text-base">
                  <p>• Llegada recomendada: 19:30hs</p>
                  <p>• Presenta tu ticket (digital o impreso) al ingresar</p>
                  <p>• El código QR será escaneado en el acceso</p>
                  <p>• Conserva tu número de reserva: <strong>{displayData?.ticket}</strong></p>
                  <p>• Para consultas: info@sociedadarabe.com</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}