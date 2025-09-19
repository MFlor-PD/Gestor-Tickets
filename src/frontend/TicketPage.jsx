import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, MessageCircle, CreditCard, Calendar, MapPin, Users } from 'lucide-react';

export default function TicketsPage({
  selectedTickets,
  eventInfo,
  onBack
}) {
  console.log('TicketsPage - selectedTickets:', selectedTickets);
  console.log('TicketsPage - API_BASE_URL:', process.env.REACT_APP_API_URL);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    specialRequests: '',
    additionalAttendees: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAgreed, setIsAgreed] = useState(false);

  // Calcular total de personas
  const totalPeople = (selectedTickets?.vipTickets || 0) + (selectedTickets?.adultTickets || 0) + (selectedTickets?.childTickets || 0);

  // Inicializar campos para asistentes adicionales
  useEffect(() => {
    if (totalPeople > 1) {
      const additionalCount = totalPeople - 1;
      setFormData(prev => ({
        ...prev,
        additionalAttendees: Array(additionalCount).fill().map((_, index) => ({
          name: prev.additionalAttendees[index]?.name || '',
          age: prev.additionalAttendees[index]?.age || ''
        }))
      }));
    }
  }, [totalPeople]);

  // Cargar tipografías árabes
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const arabicFont = "'Amiri', 'Scheherazade New', serif";

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    const sanitizedPhone = formData.phone.replace(/[\s-()]/g, '');
    if (!sanitizedPhone) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (sanitizedPhone.length < 8) {
      newErrors.phone = 'El número de teléfono parece demasiado corto';
    }

    if (totalPeople > 1) {
      formData.additionalAttendees.forEach((attendee, index) => {
        if (!attendee.name.trim()) {
          newErrors[`attendee_${index}`] = `El nombre del asistente ${index + 2} es obligatorio`;
        }
      });
    }

    if (!isAgreed) {
        newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en asistentes adicionales
  const handleAttendeeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalAttendees: prev.additionalAttendees.map((attendee, i) =>
        i === index ? { ...attendee, [field]: value } : attendee
      )
    }));
    if (errors[`attendee_${index}`]) {
      setErrors(prev => ({
        ...prev,
        [`attendee_${index}`]: ''
      }));
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Función principal con debug completo
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 INICIO handleSubmit');

    if (!validateForm()) {
      console.log('❌ FORMULARIO INVÁLIDO');
      return;
    }

    console.log('✅ Formulario válido, iniciando proceso...');
    setIsSubmitting(true);

    try {
      const entradas = [];
      
      if (selectedTickets.vipTickets > 0) {
        entradas.push({
          tipo: 'VIP',
          cantidad: selectedTickets.vipTickets,
          precio_unitario: selectedTickets.prices.VIP_PRICE,
          precio_total: selectedTickets.vipTickets * selectedTickets.prices.VIP_PRICE
        });
      }
      
      if (selectedTickets.adultTickets > 0) {
        entradas.push({
          tipo: 'Adultos',
          cantidad: selectedTickets.adultTickets,
          precio_unitario: selectedTickets.prices.ADULT_PRICE,
          precio_total: selectedTickets.adultTickets * selectedTickets.prices.ADULT_PRICE
        });
      }
      
      if (selectedTickets.childTickets > 0) {
        entradas.push({
          tipo: 'Niños',
          cantidad: selectedTickets.childTickets,
          precio_unitario: selectedTickets.prices.CHILD_PRICE,
          precio_total: selectedTickets.childTickets * selectedTickets.prices.CHILD_PRICE
        });
      }

      const comprador = {
        nombre: formData.customerName,
        email: formData.email,
        telefono: formData.phone,
        observaciones: formData.specialRequests || '',
        evento: 'Gran Cena Show Árabe',
        fecha_evento: '2024-11-01',
        ubicacion: 'Salón Haiat - Sociedad Árabe La Angelita'
      };

      console.log('📦 Datos a enviar:', { comprador, entradas });
      console.log('🌐 URL destino:', `${API_BASE_URL}/api/create-payment`);

      const response = await fetch(`${API_BASE_URL}/api/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comprador: comprador,
          entradas: entradas
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const responseText = await response.text();
      console.log('📄 Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('✅ Datos parseados:', data);

      if (data.paymentUrl) {
        console.log('🔗 Redirigiendo a paymentUrl:', data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else if (data.init_point) {
        console.log('🔗 Redirigiendo a init_point:', data.init_point);
        window.location.href = data.init_point;
      } else {
        console.log('❌ No hay URL de pago en la respuesta:', data);
        throw new Error('No se recibió el link de pago de MercadoPago');
      }

    } catch (error) {
      console.error('💥 ERROR COMPLETO:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      console.log('🏁 FIN handleSubmit');
    }
  };

  if (!selectedTickets) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">No hay entradas seleccionadas</h2>
          <p className="mb-6">Por favor, regresa a la página principal para seleccionar tus entradas.</p>
          <button
            onClick={onBack}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* FONDO SIMILAR AL LANDING */}
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
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">

          {/* HEADER CON BOTÓN VOLVER */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-amber-300 hover:text-amber-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span style={{ fontFamily: arabicFont }}>Volver a selección</span>
            </button>

            <div className="text-center">
              <h1
                className="text-3xl lg:text-5xl font-bold text-amber-400 mb-2 tracking-wide"
                style={{ fontFamily: arabicFont }}
              >
                Finalizar Compra
              </h1>
              <p
                className="text-amber-200 text-lg lg:text-xl"
                style={{ fontFamily: arabicFont }}
              >
                {eventInfo?.title || 'Gran Cena Show Árabe'}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* COLUMNA IZQUIERDA - FORMULARIO */}
            <div className="space-y-6">
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-amber-400/20 p-6 lg:p-8 shadow-2xl">
                <h2
                  className="text-2xl font-bold text-amber-300 mb-6 text-center"
                  style={{ fontFamily: arabicFont }}
                >
                  Datos del Comprador
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* NOMBRE COMPLETO */}
                  <div>
                    <label className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-2">
                      <User className="w-4 h-4" />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                        errors.customerName ? 'border-red-500' : 'border-amber-400/30'
                      } text-white placeholder-amber-200/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors`}
                      placeholder="Ingresa tu nombre completo"
                    />
                    {errors.customerName && (
                      <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-2">
                      <Mail className="w-4 h-4" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                        errors.email ? 'border-red-500' : 'border-amber-400/30'
                      } text-white placeholder-amber-200/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors`}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* TELÉFONO */}
                  <div>
                    <label className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-2">
                      <Phone className="w-4 h-4" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                        errors.phone ? 'border-red-500' : 'border-amber-400/30'
                      } text-white placeholder-amber-200/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors`}
                      placeholder="Ej: 11 1234 5678"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* OBSERVACIONES */}
                  <div>
                    <label className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-2">
                      <MessageCircle className="w-4 h-4" />
                      Observaciones (Opcional)
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/30 text-white placeholder-amber-200/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors resize-none"
                      placeholder="Alergias, necesidades especiales, preferencias de mesa..."
                    />
                  </div>

                  {/* ASISTENTES ADICIONALES */}
                  {totalPeople > 1 && (
                    <div className="border-t border-amber-400/20 pt-6">
                      <h3 className="flex items-center gap-2 text-amber-300 text-lg font-bold mb-4">
                        <Users className="w-5 h-5" />
                        Datos de Asistentes Adicionales
                      </h3>
                      <p className="text-amber-200/70 text-sm mb-4">
                        Completa los datos de las {totalPeople - 1} persona{totalPeople > 2 ? 's' : ''} adicional{totalPeople > 2 ? 'es' : ''}
                      </p>

                      <div className="space-y-4">
                        {formData.additionalAttendees.map((attendee, index) => (
                          <div key={index} className="bg-white/5 p-4 rounded-xl border border-amber-400/10">
                            <h4 className="text-amber-300 font-medium mb-3">
                              Asistente {index + 2}
                            </h4>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-amber-200 text-sm font-medium mb-2 block">
                                  Nombre Completo *
                                </label>
                                <input
                                  type="text"
                                  value={attendee.name}
                                  onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg bg-white/10 border ${
                                    errors[`attendee_${index}`] ? 'border-red-500' : 'border-amber-400/30'
                                  } text-white placeholder-amber-200/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors text-sm`}
                                  placeholder="Nombre y apellido"
                                />
                                {errors[`attendee_${index}`] && (
                                  <p className="text-red-400 text-xs mt-1">{errors[`attendee_${index}`]}</p>
                                )}
                              </div>

                              <div>
                                <label className="text-amber-200 text-sm font-medium mb-2 block">
                                  Edad (Opcional)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="120"
                                  value={attendee.age}
                                  onChange={(e) => handleAttendeeChange(index, 'age', e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-amber-400/30 text-white placeholder-amber-200/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-colors text-sm"
                                  placeholder="Edad"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                        <p className="text-blue-200 text-xs">
                          Estos datos nos ayudan con el control de acceso y la organización del evento
                        </p>
                      </div>
                    </div>
                  )}

                </form>
              </div>
            </div>

            {/* COLUMNA DERECHA - RESUMEN */}
            <div className="space-y-6">

              {/* RESUMEN DEL EVENTO */}
              <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl border border-amber-400/30 p-6 lg:p-8 shadow-2xl">
                <h3
                  className="text-xl font-bold text-amber-300 mb-4"
                  style={{ fontFamily: arabicFont }}
                >
                  Detalles del Evento
                </h3>

                <div className="space-y-3 text-amber-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span>Viernes 1 de Noviembre, 2024</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>{eventInfo?.location || 'Salón Haiat - Sociedad Árabe La Angelita'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span>Apertura de puertas: 20:00hs</span>
                  </div>
                </div>
              </div>

              {/* RESUMEN DE ENTRADAS */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-amber-400/20 p-6 lg:p-8 shadow-2xl">
                <h3
                  className="text-xl font-bold text-amber-300 mb-6"
                  style={{ fontFamily: arabicFont }}
                >
                  Resumen de tu compra
                </h3>

                <div className="space-y-4">
                  {selectedTickets.vipTickets > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-amber-400/20">
                      <div>
                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">VIP</span>
                        <span className="text-white">{selectedTickets.vipTickets} entrada{selectedTickets.vipTickets > 1 ? 's' : ''}</span>
                      </div>
                      <span className="text-amber-400 font-bold text-lg">
                        ${(selectedTickets.vipTickets * selectedTickets.prices.VIP_PRICE).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedTickets.adultTickets > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-amber-400/20">
                      <div>
                        <span className="text-white font-medium">Adultos: {selectedTickets.adultTickets} entrada{selectedTickets.adultTickets > 1 ? 's' : ''}</span>
                      </div>
                      <span className="text-amber-400 font-bold text-lg">
                        ${(selectedTickets.adultTickets * selectedTickets.prices.ADULT_PRICE).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedTickets.childTickets > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-amber-400/20">
                      <div>
                        <span className="text-white font-medium">Niños: {selectedTickets.childTickets} entrada{selectedTickets.childTickets > 1 ? 's' : ''}</span>
                        <span className="text-amber-200/70 text-sm block">Hasta 12 años</span>
                      </div>
                      <span className="text-amber-400 font-bold text-lg">
                        ${(selectedTickets.childTickets * selectedTickets.prices.CHILD_PRICE).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* TOTAL */}
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl p-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-bold text-xl" style={{ fontFamily: arabicFont }}>
                      Total a Pagar
                    </span>
                    <span className="text-black font-extrabold text-2xl">
                      ${selectedTickets.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* CHECKBOX DE TÉRMINOS Y CONDICIONES */}
                <div className="mt-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-amber-400 rounded-md bg-white/10 border-amber-400/50 focus:ring-amber-400/50 transition-colors"
                    />
                    <span className="text-sm font-medium text-white">
                      Acepto los <a href="#" className="text-amber-400 underline hover:text-amber-300">términos y condiciones</a>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-400 text-xs mt-2">{errors.terms}</p>
                  )}
                </div>

                {/* BOTÓN DE PAGO CON DEBUG */}
                <button
                  type="submit"
                  onClick={(e) => {
                    console.log('🔘 BOTÓN CLICKEADO');
                    console.log('📝 isAgreed:', isAgreed);
                    console.log('📝 isSubmitting:', isSubmitting);
                    console.log('📝 customerName:', formData.customerName);
                    console.log('📝 email:', formData.email);
                    console.log('📝 phone:', formData.phone);
                    
                    if (!isAgreed) {
                      console.log('❌ Términos no aceptados');
                      return;
                    }
                    
                    handleSubmit(e);
                  }}
                  disabled={isSubmitting || !isAgreed}
                  className={`w-full mt-6 px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 transform ${
                    isSubmitting || !isAgreed
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 text-white'
                  }`}
                  style={{ fontFamily: arabicFont }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {isSubmitting ? 'Procesando...' : 'Pagar con MercadoPago'}
                  </div>
                </button>

                <p className="text-amber-200/70 text-xs text-center mt-3">
                  Serás redirigido a MercadoPago para completar el pago de forma segura
                </p>

                {/* BOTONES DE SIMULACIÓN TEMPORAL - PARA TESTING */}
                <div className="mt-6 pt-4 border-t border-amber-400/20">
                  <p className="text-amber-300 text-sm font-bold mb-3 text-center">Testing - Simular Estados de Pago</p>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        window.location.href = `${window.location.origin}/payment/success?collection_status=approved&collection_id=TEST123&payment_id=TEST456`;
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      ✅ Simular Pago Exitoso
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = `${window.location.origin}/payment/failure?collection_status=rejected&collection_id=TEST123`;
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      ❌ Simular Pago Rechazado
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = `${window.location.origin}/payment/pending?collection_status=pending&collection_id=TEST123`;
                      }}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      ⏳ Simular Pago Pendiente
                    </button>
                  </div>
                  <p className="text-amber-200/50 text-xs text-center mt-2">
                    (Eliminar estos botones en producción)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}