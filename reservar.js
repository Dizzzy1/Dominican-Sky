let flights = [
    {
        id: 1,
        number: 'DM101',
        airline: 'Dominican Sky',
        origin: 'Santo Domingo',
        destination: 'Madrid',
        departure: '2026-05-12T08:00',
        arrival: '2026-05-13T09:00',
        price: 550,
        seats: 120
    },
    {
        id: 2,
        number: 'DM202',
        airline: 'Dominican Sky',
        origin: 'Santiago',
        destination: 'New York',
        departure: '2026-05-13T10:00',
        arrival: '2026-05-14T10:45',
        price: 290,
        seats: 80
    },
    {
        id: 3,
        number: 'DM303',
        airline: 'Caribbean Air',
        origin: 'Santo Domingo',
        destination: 'Miami',
        departure: '2026-05-15T14:00',
        arrival: '2026-05-16T16:30',
        price: 250,
        seats: 200
    },
    {
        id: 4,
        number: 'DM404',
        airline: 'Dominican Sky',
        origin: 'Punta Cana',
        destination: 'Dubai',
        departure: '2026-05-20T09:00',
        arrival: '2026-05-21T09:30',
        price: 480,
        seats: 60
    },
    {
        id: 5,
        number: 'DM505',
        airline: 'Caribbean Air',
        origin: 'Puerto Plata',
        destination: 'Medellin',
        departure: '2026-05-24T11:00',
        arrival: '2026-05-25T11:45',
        price: 120,
        seats: 90
    }
];
let selectedSeat = null;
let seatPrice = 0;
let totalPrice = 0;


// ============ INICIALIZACIÓN ============
window.onload = function() {
    loadFlightData();
    generateSeats();
    updateTotal();
};

function loadFlightData() {
    // Intentar cargar datos de localStorage (enviados desde index.html)
    const savedFlight = localStorage.getItem('selectedFlight');
    if (savedFlight) {
        flightData = JSON.parse(savedFlight);
    }
    
    // Actualizar UI con los datos del vuelo
    document.getElementById('departureTime').textContent = formatTime(flightData.departure);
    document.getElementById('arrivalTime').textContent = formatTime(flightData.arrival);
    document.getElementById('originCity').textContent = flightData.origin;
    document.getElementById('destinationCity').textContent = flightData.destination;
    document.getElementById('departureDate').textContent = formatDate(flightData.departure);
    document.getElementById('arrivalDate').textContent = formatDate(flightData.arrival);
    document.getElementById('flightNumber').textContent = flightData.number;
    document.getElementById('airline').textContent = flightData.airline;
    document.getElementById('duration').textContent = calculateDuration(flightData.departure, flightData.arrival);
    
    document.getElementById('basePrice').textContent = `$${flightData.basePrice.toFixed(2)}`;
    document.getElementById('taxes').textContent = `$${flightData.taxes.toFixed(2)}`;
    
    if (flightData.discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountAmount').textContent = `-$${flightData.discount.toFixed(2)}`;
    }
    
    document.getElementById('confirmFlight').textContent = `${flightData.number} - ${flightData.origin} → ${flightData.destination}`;
}

// ============ GENERAR ASIENTOS ============
function generateSeats() {
    // Primera Clase (1 fila con 2 asientos)
    const firstClass = document.getElementById('firstClass');
    firstClass.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
        const seat = createSeatElement(`1${String.fromCharCode(64+i)}`, 'premium', 30);
        firstClass.appendChild(seat);
    }
    
    // Economy Premium (2 filas con 3 asientos)
    const premiumEconomy = document.getElementById('premiumEconomy');
    premiumEconomy.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
        const seat = createSeatElement(`2${String.fromCharCode(64+i)}`, 'regular', 15);
        premiumEconomy.appendChild(seat);
    }
    
    // Economy (resto de asientos)
    const economySeats = document.getElementById('economySeats');
    economySeats.innerHTML = '';
    const occupiedSeats = ['3A', '3C', '4B', '5A', '6C']; // Asientos ocupados de ejemplo
    
    for (let row = 3; row <= 10; row++) {
        for (let col = 0; col < 3; col++) {
            const seatCode = `${row}${String.fromCharCode(65+col)}`;
            const isOccupied = occupiedSeats.includes(seatCode);
            const seat = createSeatElement(seatCode, 'regular', 0, isOccupied);
            economySeats.appendChild(seat);
        }
    }
}

function createSeatElement(seatCode, type, price, occupied = false) {
    const button = document.createElement('button');
    button.className = 'seat-btn';
    button.textContent = seatCode;
    button.dataset.seat = seatCode;
    button.dataset.price = price;
    
    if (type === 'premium') {
        button.classList.add('premium');
    }
    
    if (occupied) {
        button.classList.add('occupied');
        button.disabled = true;
    } else {
        button.onclick = function() { selectSeat(seatCode, price, this); };
    }
    
    return button;
}

function selectSeat(seatCode, price, element) {
    // Deseleccionar anterior
    document.querySelectorAll('.seat-btn.selected').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Seleccionar nuevo
    element.classList.add('selected');
    selectedSeat = seatCode;
    seatPrice = price;
    
    // Actualizar información
    document.getElementById('selectedSeatDisplay').textContent = `Asiento: ${seatCode}`;
    document.getElementById('seatPriceDisplay').textContent = price > 0 ? `Costo adicional: +$${price}.00` : 'Sin costo adicional';
    document.getElementById('confirmSeat').textContent = seatCode;
    
    updateTotal();
}

// ============ ACTUALIZAR TOTAL ============
function updateTotal() {
    let extrasTotal = 0;
    
    if (document.getElementById('extraBaggage')?.checked) extrasTotal += 35;
    if (document.getElementById('extraMeal')?.checked) extrasTotal += 18;
    if (document.getElementById('extraPriority')?.checked) extrasTotal += 12;
    if (document.getElementById('extraInsurance')?.checked) extrasTotal += 22;
    
    totalPrice = flightData.basePrice + flightData.taxes + seatPrice + extrasTotal - flightData.discount;
    
    document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
    document.getElementById('finalTotal').textContent = `$${totalPrice.toFixed(2)}`;
    document.getElementById('confirmTotal').textContent = `$${totalPrice.toFixed(2)}`;
}

// ============ PAGO ============
function selectPayment(method) {
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value;
}

function processPayment() {
    // Validaciones
    const name = document.getElementById('passengerName').value.trim();
    const lastName = document.getElementById('passengerLastName').value.trim();
    const email = document.getElementById('passengerEmail').value.trim();
    
    if (!name || !lastName || !email) {
        alert('❌ Complete todos los datos del pasajero');
        return;
    }
    
    if (!selectedSeat) {
        alert('❌ Seleccione un asiento');
        return;
    }
    
    // Generar código de reserva
    const code = 'DSK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('confirmCode').textContent = code;
    
    // Obtener el usuario actual
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Obtener reservas existentes
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Calcular próximo ID
    const nextId = existingReservations.length > 0 
        ? Math.max(...existingReservations.map(r => r.id)) + 1 
        : 1;
    
    // Crear reserva
    const reservation = {
        id: nextId,
        userId: currentUser ? currentUser.id : 1,
        userName: currentUser ? (currentUser.name + ' ' + currentUser.lastName) : (name + ' ' + lastName),
        userEmail: email,
        flightId: flightData.id || 1,
        flightNumber: flightData.number,
        airline: flightData.airline,
        origin: flightData.origin,
        destination: flightData.destination,
        departure: flightData.departure,
        arrival: flightData.arrival,
        price: totalPrice,
        seat: selectedSeat,
        status: 'active',
        milesUsed: flightData.discount > 0 ? 1000 : 0,
        date: new Date().toISOString(),
        code: code
    };
    
    console.log('💾 Guardando reserva:', reservation);
    
    // Agregar al array
    existingReservations.push(reservation);
    
    // GUARDAR en localStorage
    localStorage.setItem('reservations', JSON.stringify(existingReservations));
    
    // Actualizar asientos del vuelo
    const savedFlights = JSON.parse(localStorage.getItem('flights') || '[]');
    const flightIndex = savedFlights.findIndex(f => f.id == flightData.id);
    if (flightIndex !== -1 && savedFlights[flightIndex].seats > 0) {
        savedFlights[flightIndex].seats -= 1;
        localStorage.setItem('flights', JSON.stringify(savedFlights));
    }
    
    // Actualizar millas del usuario si es corporativo
    if (currentUser && currentUser.type === 'corporate') {
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = savedUsers.findIndex(u => u.id == currentUser.id);
        if (userIndex !== -1) {
            if (flightData.discount > 0) {
                savedUsers[userIndex].miles -= 1000;
            }
            savedUsers[userIndex].miles += 500;
            localStorage.setItem('users', JSON.stringify(savedUsers));
            
            currentUser.miles = savedUsers[userIndex].miles;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
    
    // ============ AQUÍ SE LLAMA AL CORREO ============
    enviarCorreoConfirmacion(reservation);
    
    // Mostrar modal de confirmación
    document.getElementById('confirmationModal').classList.add('show');
    
    document.getElementById('confirmFlight').textContent = flightData.number + ' - ' + flightData.origin + ' → ' + flightData.destination;
    document.getElementById('confirmSeat').textContent = selectedSeat;
    document.getElementById('confirmTotal').textContent = '$' + totalPrice.toFixed(2);
}

function enviarCorreoConfirmacion(reserva) {
    fetch("https://formspree.io/f/mzdoqlyb", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: reserva.userEmail,
            nombre: reserva.userName,
            codigo: reserva.code,
            vuelo: reserva.flightNumber,
            ruta: reserva.origin + " → " + reserva.destination,
            salida: new Date(reserva.departure).toLocaleString("es-DO"),
            precio: "$" + reserva.price,
            asiento: reserva.seat
        })
    })
    .then(response => {
        if (response.ok) {
            console.log("✅ Correo enviado a " + reserva.userEmail);
        }
    })
    .catch(error => {
        console.log("❌ Error:", error);
    });
}

// ============ UTILIDADES ============
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function calculateDuration(departure, arrival) {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = Math.abs(arr - dep);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function goBackToMain() {
    window.location.href = 'index.html';
}