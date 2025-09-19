const express = require('express');
const router = express.Router();
const { leerVentas } = require('../model/ventasModel');
const ExcelJS = require('exceljs');

// Contraseña de administrador (cambia por una contraseña segura)
const ADMIN_PASSWORD = 'cena_arabe_2024';

// POST /api/admin/login - Verificar contraseña de admin
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
      res.json({ 
        success: true, 
        message: 'Login exitoso' 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Contraseña incorrecta' 
      });
    }
  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor' 
    });
  }
});

// GET /api/admin/sales - Obtener todas las ventas y estadísticas
router.get('/sales', async (req, res) => {
  try {
    const ventas = await leerVentas();
    
    // Filtrar solo las ventas exitosas/aprobadas
    const ventasExitosas = ventas.filter(venta => 
      venta.estado === 'approved' || venta.paymentStatus === 'approved'
    );

    // Calcular estadísticas
    const stats = {
      totalSales: ventasExitosas.length,
      totalRevenue: ventasExitosas.reduce((sum, venta) => sum + (venta.totalPrice || 0), 0),
      totalTickets: ventasExitosas.reduce((sum, venta) => 
        sum + (venta.vipTickets || 0) + (venta.adultTickets || 0) + (venta.childTickets || 0), 0
      ),
      totalVipTickets: ventasExitosas.reduce((sum, venta) => sum + (venta.vipTickets || 0), 0),
      totalAdultTickets: ventasExitosas.reduce((sum, venta) => sum + (venta.adultTickets || 0), 0),
      totalChildTickets: ventasExitosas.reduce((sum, venta) => sum + (venta.childTickets || 0), 0)
    };

    res.json({
      success: true,
      sales: ventasExitosas,
      stats: stats
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las ventas' 
    });
  }
});

// GET /api/admin/export - Descargar Excel con todas las ventas
router.get('/export', async (req, res) => {
  try {
    const ventas = await leerVentas();
    
    // Filtrar solo las ventas exitosas
    const ventasExitosas = ventas.filter(venta => 
      venta.estado === 'approved' || venta.paymentStatus === 'approved'
    );

    // Crear el libro de Excel
    const workbook = new ExcelJS.Workbook();
    
    // Hoja 1: Ventas detalladas
    const worksheetVentas = workbook.addWorksheet('Ventas Detalladas');
    
    // Configurar columnas
    worksheetVentas.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Nombre', key: 'nombre', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Entradas VIP', key: 'vipTickets', width: 12 },
      { header: 'Entradas Adultos', key: 'adultTickets', width: 15 },
      { header: 'Entradas Niños', key: 'childTickets', width: 15 },
      { header: 'Total Entradas', key: 'totalTickets', width: 15 },
      { header: 'Precio Total', key: 'totalPrice', width: 15 },
      { header: 'ID Pago', key: 'paymentId', width: 20 },
      { header: 'Estado', key: 'estado', width: 10 }
    ];

    // Agregar datos
    ventasExitosas.forEach(venta => {
      const totalTickets = (venta.vipTickets || 0) + (venta.adultTickets || 0) + (venta.childTickets || 0);
      
      worksheetVentas.addRow({
        fecha: new Date(venta.fecha).toLocaleDateString('es-AR'),
        nombre: venta.nombre || venta.buyerName,
        email: venta.email || venta.buyerEmail,
        telefono: venta.telefono || venta.buyerPhone,
        vipTickets: venta.vipTickets || 0,
        adultTickets: venta.adultTickets || 0,
        childTickets: venta.childTickets || 0,
        totalTickets: totalTickets,
        totalPrice: venta.totalPrice || 0,
        paymentId: venta.paymentId || venta.payment_id,
        estado: venta.estado || venta.paymentStatus
      });
    });

    // Formatear encabezados
    worksheetVentas.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Hoja 2: Resumen estadístico
    const worksheetStats = workbook.addWorksheet('Resumen');
    
    const stats = {
      totalVentas: ventasExitosas.length,
      ingresoTotal: ventasExitosas.reduce((sum, venta) => sum + (venta.totalPrice || 0), 0),
      totalEntradas: ventasExitosas.reduce((sum, venta) => 
        sum + (venta.vipTickets || 0) + (venta.adultTickets || 0) + (venta.childTickets || 0), 0
      ),
      entradasVIP: ventasExitosas.reduce((sum, venta) => sum + (venta.vipTickets || 0), 0),
      entradasAdultos: ventasExitosas.reduce((sum, venta) => sum + (venta.adultTickets || 0), 0),
      entradasNiños: ventasExitosas.reduce((sum, venta) => sum + (venta.childTickets || 0), 0)
    };

    worksheetStats.addRow(['RESUMEN EJECUTIVO - CENA SHOW ÁRABE']);
    worksheetStats.addRow(['Fecha de reporte:', new Date().toLocaleDateString('es-AR')]);
    worksheetStats.addRow([]);
    worksheetStats.addRow(['ESTADÍSTICAS GENERALES']);
    worksheetStats.addRow(['Total de ventas exitosas:', stats.totalVentas]);
    worksheetStats.addRow(['Ingreso total:', `$${stats.ingresoTotal.toLocaleString()}`]);
    worksheetStats.addRow(['Total de entradas vendidas:', stats.totalEntradas]);
    worksheetStats.addRow([]);
    worksheetStats.addRow(['DESGLOSE POR TIPO DE ENTRADA']);
    worksheetStats.addRow(['Entradas VIP:', stats.entradasVIP]);
    worksheetStats.addRow(['Entradas Adultos:', stats.entradasAdultos]);
    worksheetStats.addRow(['Entradas Niños:', stats.entradasNiños]);

    // Formatear la hoja de resumen
    worksheetStats.getCell('A1').font = { bold: true, size: 16 };
    worksheetStats.getCell('A4').font = { bold: true, size: 12 };
    worksheetStats.getCell('A9').font = { bold: true, size: 12 };

    // Configurar respuesta HTTP
    const fecha = new Date().toISOString().split('T')[0];
    const filename = `ventas_cena_arabe_${fecha}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Enviar el archivo
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error al exportar Excel:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al generar el archivo Excel' 
    });
  }
});

module.exports = router;