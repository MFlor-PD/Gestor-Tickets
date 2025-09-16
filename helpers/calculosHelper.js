const VIP = 80000;
const GENERAL = 70000;

function calcularReserva(entradas) {
    const vipAdult = (entradas.VIP?.Adult || 0) * VIP;
    const vipChild = (entradas.VIP?.Child || 0) * VIP;
    const totalVIP = vipAdult + vipChild;

    const genAdult = (entradas.GENERAL?.Adult || 0) * GENERAL;
    const genChild = (entradas.GENERAL?.Child || 0) * GENERAL;
    const totalGENERAL = genAdult + genChild;

    const totalFinal = totalVIP + totalGENERAL;

    return {
        VIP: { Adult: vipAdult, Child: vipChild, total: totalVIP },
        GENERAL: { Adult: genAdult, Child: genChild, total: totalGENERAL },
        TOTAL: totalFinal
    };
}

module.exports = { calcularReserva, VIP, GENERAL };
