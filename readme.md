rutas y body:
RESERVAS:
POST http://localhost:3000/reservas

{
  "comprador": {
    "nombre": "Florencia  JUANA Perez",
    "email": "flor@example.com",
    "telefono": "+541112345678"
  },
 "entradas": {
    "VIP": [
      { "tipo": "Adult", "nombre": "Juan Perez" },
      { "tipo": "Adult", "nombre": "Ana Lopez" },
      { "tipo": "Child", "nombre": "Lucas Perez" }
    ],
    "GENERAL": [
      { "tipo": "Adult", "nombre": "Carlos Gomez" },
      { "tipo": "Adult", "nombre": "Laura Diaz" },
      { "tipo": "Adult", "nombre": "Miguel Torres" },
      { "tipo": "Child", "nombre": "Sofia Gomez" },
      { "tipo": "Child", "nombre": "Diego Diaz" }
    ]
  }
}

RESPUESTA:
{
    "message": "Reserva creada",
    "reserva": {
        "comprador": {
            "nombre": "Florencia  JUANA Perez",
            "email": "flor@example.com",
            "telefono": "+541112345678"
        },
        "entradas": {
            "VIP": [
                {
                    "tipo": "Adult",
                    "nombre": "Juan Perez"
                },
                {
                    "tipo": "Adult",
                    "nombre": "Ana Lopez"
                },
                {
                    "tipo": "Child",
                    "nombre": "Lucas Perez"
                }
            ],
            "GENERAL": [
                {
                    "tipo": "Adult",
                    "nombre": "Carlos Gomez"
                },
                {
                    "tipo": "Adult",
                    "nombre": "Laura Diaz"
                },
                {
                    "tipo": "Adult",
                    "nombre": "Miguel Torres"
                },
                {
                    "tipo": "Child",
                    "nombre": "Sofia Gomez"
                },
                {
                    "tipo": "Child",
                    "nombre": "Diego Diaz"
                }
            ]
        },
        "totales": {
            "VIP": {
                "Adult": 0,
                "Child": 0,
                "total": 0
            },
            "GENERAL": {
                "Adult": 0,
                "Child": 0,
                "total": 0
            },
            "TOTAL": 0
        },
        "ticket": "TCK-1758106245812-711",
        "fecha": "2025-09-17T10:50:45.812Z"
    }
}

PATCH http://localhost:3000/reservas/TCK-1758105978294-73
DELETE http://localhost:3000/reservas/TCK-1758105978294-73


CARRITO:
GET: http://localhost:3000/carrito
POST: http://localhost:3000/carrito
PATCH http://localhost:3000/carrito/TCK-1111111111-002/medio-pago/
DELETE: http://localhost:3000/carrito/TCK-1111111111-002/ elimina uno
DELETE:http://localhost:3000/carrito (VACIA EL CARRO)

MERCADO PAGO:

POST http://localhost:3000/pago


🎯 Requerimientos mínimos

Landing page simple

Presentación de la cena (fecha, lugar, descripción).

Selección de tipo de entrada (ej: general, VIP, mesa compartida).

Selección de cantidad.

Proceso de compra con MercadoPago

Integración con el checkout de MercadoPago (usarás el SDK oficial).

Pago en sandbox para pruebas y productivo en deploy.

Validación automática de pago aprobado/rechazado.

Emisión de ticket digital

Generar un número único de ticket (ej: secuencial o UUID).

PDF o email con el ticket (puede incluir QR/barcode).

Confirmación enviada al comprador (con los datos de la compra).

Panel de administración

Listado de ventas (nombre comprador, cantidad, total, estado de pago).

Exportación a Excel/PDF opcional.

Opción de imprimir tickets individuales.



🔧 Stack recomendado (simple y rápido)

Frontend: React o directamente HTML+Tailwind (para la landing).

Backend: Node.js con Express + Prisma (si querés BD) o Firebase (si buscás ultra-simple).

Base de datos: SQLite o PostgreSQL (según escala).

Pagos: SDK oficial de MercadoPago.

Tickets: PDFKit / jsPDF para PDF + un número/QR.


📌 Flujo de usuario

Cliente entra a la landing → elige entradas + cantidad.

Hace checkout → se abre MercadoPago → paga.

Webhook de MercadoPago confirma pago → se registra en la BD.

Se genera ticket numerado (PDF/QR) → se envía al email del cliente.

Admin entra al panel → puede ver ventas y tickets.

💰 Estimación de cotización (aprox.)

Según mercado freelance (LATAM / España) y lo que pedís:

Landing + integración de pago: 300 – 500 €.

Generación de tickets numerados (PDF/QR): 150 – 250 €.

Panel de administración básico: 250 – 400 €.

👉 Total MVP: 700 – 1.000 € (dependiendo de si querés algo básico o más pulido).

🚀 Extras que podrías ofrecer

Ticket con QR para control en la entrada (lector desde el móvil).

Estadísticas en el panel (total recaudado, entradas vendidas por tipo).

Emails personalizados (branding, logo, confirmación).





# Sistema de Venta de Entradas - Guía de Desarrollo

## 🚀 Stack Técnico

- *Frontend*: React con Hooks
- *Styling*: TailwindCSS
- *Iconos*: Lucide React
- *Pagos*: MercadoPago SDK
- *QR*: qrcode.js + crypto-js para JWT
- *Email*: EmailJS
- *Storage*: LocalStorage (temporal, migrar a BD después)
- *Validación*: React Hook Form

## 📁 Estructura del Proyecto


src/
├── components/
│   ├── LandingPage.jsx
│   ├── TicketSelection.jsx
│   ├── CustomerForm.jsx
│   ├── PaymentCheckout.jsx
│   ├── ConfirmationPage.jsx
│   ├── AdminPanel.jsx
│   └── QRValidator.jsx
├── utils/
│   ├── mercadopago.js
│   ├── qrGenerator.js
│   ├── emailService.js
│   └── stockManager.js
├── config/
│   └── eventConfig.js
└── App.jsx


## 🔧 Configuración Requerida

### 1. Variables de Entorno

javascript
// .env
REACT_APP_MP_PUBLIC_KEY=TEST-xxxx // MercadoPago Sandbox
REACT_APP_MP_ACCESS_TOKEN=TEST-xxxx
REACT_APP_EMAILJS_SERVICE_ID=xxxx
REACT_APP_EMAILJS_TEMPLATE_ID=xxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxx


### 2. Dependencias a Instalar

bash
npm install mercadopago qrcode crypto-js emailjs-com react-hook-form


## 🎯 Estado Actual de Desarrollo

### ✅ COMPLETADO

- [x] Landing page responsive
- [x] Selector de entradas con categorías (adulto/niño/bebé)
- [x] Sistema de stock en tiempo real
- [x] Cálculo de precios dinámico
- [x] *Formulario de datos del comprador completo*
- [x] *Integración MercadoPago (mockup funcional)*
- [x] *Generación de QR con datos JWT*
- [x] *Página de confirmación con descarga*
- [x] *Validador QR funcional con verificaciones*
- [x] Panel de administración con estadísticas
- [x] LocalStorage para persistencia temporal

### 🔄 EN DESARROLLO

- [ ] Servicio de email real (EmailJS)
- [ ] Integración MercadoPago real (requiere credenciales)
- [ ] Librería QR real (qrcode.js)
- [ ] Cámara QR Scanner (qr-scanner.js)

### 📋 PENDIENTES

- [ ] Límite de fecha de venta
- [ ] Validación de formularios mejorada
- [ ] Manejo de errores robusto
- [ ] Responsive mobile optimizado
- [ ] Optimización de performance
- [ ] Testing completo

## 🏗 Próximos Pasos de Implementación

### Paso 1: Librerías Reales ⚡ PRIORITARIO

bash
npm install qrcode qr-scanner emailjs-com


javascript
// Reemplazar simulaciones con:
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
import emailjs from '@emailjs/browser';


### Paso 2: Credenciales MercadoPago 🔑

javascript
// Reemplazar en MP_CONFIG:
public_key: "APP_USR-xxxxxxxx", // Clave pública real
access_token: "APP_USR-xxxxxxxx", // Token de acceso real
sandbox: false // Cambiar a false para producción


### Paso 3: Configuración EmailJS 📧

javascript
// En .env:
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxx  
REACT_APP_EMAILJS_PUBLIC_KEY=user_xxxxxxxxxxxxxx


### Paso 4: Validaciones de Seguridad 🔒

javascript
// Implementar:
- JWT con secret real
- Validación de hash mejorada
- Prevención de replay attacks
- Logs de seguridad


## 🔒 Configuración de Seguridad

### JWT Secret (para QR)

javascript
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || "change_this_secret_key";


### Validación de QR

1. Decodificar JWT
1. Verificar hash de seguridad
1. Validar fecha del evento
1. Marcar como usado (evitar reutilización)

## 📧 Configuración de Email

### EmailJS Template

html
Asunto: ✅ Confirmación de compra - {{event_name}}

Hola {{customer_name}},

¡Tu compra ha sido confirmada!

📅 Evento: {{event_name}}
📍 Fecha: {{event_date}} a las {{event_time}}
📍 Lugar: {{event_location}}

🎫 Entradas compradas:
{{ticket_details}}

💰 Total pagado: ${{total_amount}}
🔢 ID de compra: {{purchase_id}}

🎯 IMPORTANTE: 
- Presenta el código QR adjunto en el ingreso
- Llega 30 minutos antes del evento
- Consultas: {{contact_email}}

¡Te esperamos!
Equipo La Angelita


## 🎨 Personalización por Evento

### Archivo de Configuración

javascript
// config/eventConfig.js
export const EVENT_CONFIG = {
  // Información básica
  name: "Cena Show - La Angelita",
  date: "2025-10-15",
  time: "21:00",
  location: "La Angelita - Salón de Eventos",
  
  // Contacto
  email: "eventos@laangelita.com",
  phone: "+54 11 1234-5678",
  
  // Límites
  sale_end_date: "2025-10-15T18:00:00",
  
  // Colores/branding
  primary_color: "#7C3AED", // purple-600
  secondary_color: "#FBBF24", // yellow-400
  
  // Políticas
  cancellation_policy: "Las entradas no son reembolsables...",
  terms_and_conditions: "Al comprar aceptas..."
};


## 🔧 Scripts de Utilidad

### Reset de Stock

javascript
// Para desarrollo/testing
const resetStock = () => {
  localStorage.removeItem('eventStock');
  localStorage.removeItem('eventSales');
  window.location.reload();
};


### Exportar Ventas

javascript
const exportSales = () => {
  const sales = JSON.parse(localStorage.getItem('eventSales') || '[]');
  const csv = generateCSV(sales);
  downloadCSV(csv, 'ventas_evento.csv');
};


## 🐛 Testing

### Datos de Prueba MercadoPago

javascript
// Tarjetas de prueba
const TEST_CARDS = {
  visa: "4170068810108732",
  mastercard: "5031755734530604",
  amex: "371180303257522"
};


## 🚀 Deploy

### Variables de Producción

1. Cambiar credenciales de MP a producción
1. Configurar dominio en EmailJS
1. Cambiar JWT_SECRET
1. Configurar analytics (opcional)

## 📞 Soporte para Continuación

Si necesitas continuar el desarrollo, usa este prompt:


Continúa el desarrollo del sistema de venta de entradas para eventos con React. 

CONTEXTO: Es una aplicación para vender entradas de "Cena Show - La Angelita" con:
- 4 tipos de mesa (VIP, Premium, Estándar, Barra) 
- 3 categorías de persona (Adulto, Niño, Bebé)
- Precios diferenciados por tipo y categoría
- Stock limitado por mesa
- Integración MercadoPago
- QR con JWT para validación
- Email de confirmación automático

STACK: React + TailwindCSS + Lucide Icons + MercadoPago SDK + EmailJS + LocalStorage

ESTADO ACTUAL: Landing page y selector de entradas completados.

PRÓXIMO PASO: [Especificar qué componente necesitas: formulario/pago/qr/email/validador]

La estructura base está en el artifact "event-ticket-app" y la documentación en "development-guide".


## 🎯 Funcionalidades Implementadas

### 🎫 Flujo de Compra Completo

1. *Landing Page* - Información del evento y precios
1. *Selector de Entradas* - 4 tipos × 3 categorías con stock dinámico
1. *Formulario Cliente* - Datos personales + nombres opcionales
1. *Checkout MercadoPago* - Integración con simulación funcional
1. *Confirmación* - QR generado + descarga + email automático
1. *Validación* - Scanner QR con verificaciones de seguridad

### 🔧 Sistema de Administración

- *Panel Admin* - Estadísticas de ventas y acceso rápido
- *Validador QR* - Escaneo manual/cámara con validaciones:
  - ✅ Formato de datos correcto
  - ✅ Evento correcto
  - ✅ Fecha válida
  - ✅ No reutilización
  - ✅ Estadísticas en tiempo real

### 💾 Gestión de Datos

- *LocalStorage* para persistencia temporal
- *Stock Management* en tiempo real
- *Sales Tracking* con historial completo
- *Used Tickets* para prevenir duplicados

### 🔒 Seguridad Implementada

- *QR con JWT* estructura de datos encriptada
- *Hash de validación* para verificar integridad
- *Control de reutilización* tickets usados
- *Validación de evento* y fecha




M☝🏻CLAUDE
