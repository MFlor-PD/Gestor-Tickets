import React, { useState, useEffect } from 'react';

export default function LandingPage({ onStart, onAdminClick, eventInfo }) {
  // Debug: Verificar que las props lleguen correctamente
  console.log('LandingPage props:', { onStart: !!onStart, onAdminClick: !!onAdminClick, eventInfo });
  
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [vipTickets, setVipTickets] = useState(0);

  const ADULT_PRICE = 70000;
  const CHILD_PRICE = 50000;
  const VIP_PRICE = 80000;

  const totalPrice = (adultTickets * ADULT_PRICE) + (childTickets * CHILD_PRICE) + (vipTickets * VIP_PRICE);

  // Cargar tipografías
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  
  const arabicFont = "'Amiri', 'Scheherazade New', serif";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* FONDO AZUL UNIFORME */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 50%, #000000 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-black/40" />
      </div>

      {/* MANDALA FIJO - Desde el borde izquierdo, simulando que entra */}
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
        <div className="w-full max-w-2xl mx-auto px-6 py-10 lg:py-14">
          <div className="text-center space-y-8">
            
            {/* Header fecha */}
            <div>
              <span
                className="inline-block bg-gradient-to-r from-amber-400 to-yellow-600 text-black px-8 py-3 rounded-full text-base font-bold tracking-wider shadow-lg"
                style={{ fontFamily: arabicFont }}
              >
                1 DE NOVIEMBRE
              </span>
            </div>

            {/* Título */}
            <div>
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight leading-tight"
                style={{ fontFamily: arabicFont }}
              >
                <span className="block text-amber-400 text-xl md:text-3xl lg:text-4xl font-normal mb-2 tracking-widest">GRAN</span>
                <span className="block leading-none tracking-wider font-bold">CENA SHOW</span>
                <span className="block text-amber-400 text-4xl md:text-5xl lg:text-6xl tracking-wider font-bold">ÁRABE</span>
              </h1>
            </div>

            {/* Logo + subtítulo */}
            <div className="space-y-4">
              <img
                src="/saa.png"
                alt="SAM - Sociedad Árabe La Angelita"
                className="h-16 md:h-20 lg:h-24 mx-auto"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(212,175,55,.3))' }}
              />
              <p
                className="text-amber-200 text-sm md:text-base tracking-wide"
                style={{ fontFamily: arabicFont }}
              >
                SOCIEDAD ÁRABE LA ANGELITA
              </p>
            </div>

            {/* Artistas */}
            <div className="space-y-4">
              <h2
                className="text-amber-400 text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider"
                style={{ fontFamily: arabicFont }}
              >
                BASSAM
              </h2>
              <p className="text-white text-xl lg:text-2xl" style={{ fontFamily: arabicFont }}>
                y su orquesta al Nogum
              </p>
              <div
                className="text-amber-200 text-base lg:text-lg space-y-1"
                style={{ fontFamily: arabicFont }}
              >
                <p>Samira Belidans</p>
                <p>Grupo Haiat</p>
                <p>Shams Suria</p>
              </div>
            </div>

            {/* Selector de entradas */}
            <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-amber-400/20 p-6 md:p-8 lg:p-10 shadow-2xl">
                <h3
                  className="text-xl lg:text-2xl font-bold text-center text-amber-200 mb-6 tracking-wide"
                  style={{ fontFamily: arabicFont }}
                >
                  Selecciona tus entradas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6">
                  {/* VIP - Ahora primero */}
                  <div className="flex flex-col justify-between bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg 
                  p-4 md:p-5 lg:p-6 text-white border border-white/10 
                  min-h-[120px] md:min-h-[160px] lg:min-h-[180px]">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs md:text-sm font-bold">VIP</span>
                      </div>
                      <p className="text-xl md:text-2xl lg:text-3xl font-extrabold">${VIP_PRICE.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-3 md:space-x-4 mt-3">
                      <button
                        onClick={() => setVipTickets(Math.max(0, vipTickets - 1))}
                        className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 hover:bg-white/30 
                        border border-white/40 transition-colors text-lg md:text-xl font-bold"
                      >−</button>
                      <span className="text-2xl md:text-3xl lg:text-4xl font-bold min-w-[2rem] text-center">{vipTickets}</span>
                      <button
                        onClick={() => setVipTickets(vipTickets + 1)}
                        className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 hover:bg-white/30 
                        border border-white/40 transition-colors text-lg md:text-xl font-bold"
                      >+</button>
                    </div>
                  </div>

                  {/* Adultos - Ahora segundo */}
                  <div className="flex flex-col justify-between bg-white/10 backdrop-blur-sm rounded-xl border border-amber-400/20 
                  p-4 md:p-5 lg:p-6 min-h-[120px] md:min-h-[160px] lg:min-h-[180px]">
                    <div>
                      <h4 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-2" style={{ fontFamily: arabicFont }}>Adultos</h4>
                      <p className="text-xl md:text-2xl lg:text-3xl font-extrabold text-amber-400">${ADULT_PRICE.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-3 md:space-x-4 mt-3">
                      <button
                        onClick={() => setAdultTickets(Math.max(0, adultTickets - 1))}
                        className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100/20 hover:bg-amber-100/30 
                        text-amber-200 border border-amber-300/40 transition-colors text-lg md:text-xl font-bold"
                      >−</button>
                      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white min-w-[2rem] text-center">{adultTickets}</span>
                      <button
                        onClick={() => setAdultTickets(adultTickets + 1)}
                        className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100/20 hover:bg-amber-100/30 
                        text-amber-200 border border-amber-300/40 transition-colors text-lg md:text-xl font-bold"
                      >+</button>
                    </div>
                  </div>

                  {/* Niños - Ahora tercero */}
                  <div className="flex flex-col justify-between bg-white/10 backdrop-blur-sm rounded-xl border border-amber-400/20 
                  p-4 md:p-5 lg:p-6 min-h-[120px] md:min-h-[160px] lg:min-h-[180px]">
                    <div>
                      <h4 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-1" style={{ fontFamily: arabicFont }}>Niños</h4>
                      <p className="text-xl md:text-2xl lg:text-3xl font-extrabold text-amber-400">${CHILD_PRICE.toLocaleString()}</p>
                      <p className="text-amber-200/80 text-sm md:text-base lg:text-lg mt-1">Hasta 12 años</p>
                    </div>
                    <div className="flex items-center justify-center space-x-3 md:space-x-4 mt-3">
                      <button
                        onClick={() => setChildTickets(Math.max(0, childTickets - 1))}
                        className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100/20 hover:bg-amber-100/30 
                        text-amber-200 border border-amber-300/40 transition-colors text-lg md:text-xl font-bold"
                      >−</button>
                      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white min-w-[2rem] text-center">{childTickets}</span>
                      <button
                        onClick={() => setChildTickets(childTickets + 1)}
                        className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100/20 hover:bg-amber-100/30 
                        text-amber-200 border border-amber-300/40 transition-colors text-lg md:text-xl font-bold"
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Total */}
                {(adultTickets > 0 || childTickets > 0 || vipTickets > 0) && (
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-lg p-5 text-center mb-6 border border-amber-300">
                    <h4 className="text-lg font-bold text-black mb-1 tracking-wide" style={{ fontFamily: arabicFont }}>
                      Total a pagar
                    </h4>
                    <p className="text-4xl font-extrabold text-black">${totalPrice.toLocaleString()}</p>
                    <p className="text-black/70 text-sm mt-1">
                      {vipTickets > 0 && `${vipTickets} VIP`}
                      {vipTickets > 0 && (adultTickets > 0 || childTickets > 0) && ' + '}
                      {adultTickets > 0 && `${adultTickets} adulto${adultTickets > 1 ? 's' : ''}`}
                      {adultTickets > 0 && childTickets > 0 && ' + '}
                      {childTickets > 0 && `${childTickets} niño${childTickets > 1 ? 's' : ''}`}
                    </p>
                  </div>
                )}

                {/* Botón compra */}
                <button
                  onClick={() => onStart({
                    vipTickets,
                    adultTickets, 
                    childTickets,
                    totalPrice,
                    prices: { VIP_PRICE, ADULT_PRICE, CHILD_PRICE }
                  })}
                  disabled={adultTickets === 0 && childTickets === 0 && vipTickets === 0}
                  className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-800 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 tracking-wide"
                  style={{ fontFamily: arabicFont }}
                >
                  {(adultTickets > 0 || childTickets > 0 || vipTickets > 0) ? 'Proceder al Pago' : 'Selecciona tus entradas'}
                </button>
              </div>
            </div>

            {/* Info adicional */}
            <div className="text-center text-amber-200/80 text-sm space-y-2" style={{ fontFamily: arabicFont }}>
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Viernes 1 de Noviembre - Salón Haiat
              </p>
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                Apertura de puertas: 20:00hs
              </p>
              <p className="text-amber-300 font-semibold tracking-wide">Pago seguro con MercadoPago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón ADMIN fijo */}
      <button
        onClick={() => {
          console.log('Admin button clicked, onAdminClick:', onAdminClick);
          if (onAdminClick) {
            onAdminClick();
          } else {
            console.error('onAdminClick prop is not defined');
            alert('Error: onAdminClick prop is missing');
          }
        }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-50 
        bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
        text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-2xl 
        transition-all duration-300 transform hover:scale-105 active:scale-95
        border border-red-500/30 backdrop-blur-sm"
        style={{ fontFamily: arabicFont }}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm md:text-base font-bold tracking-wider">ADMIN</span>
        </div>
      </button>
    </div>
  );
}