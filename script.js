// ============ DATOS DEL SISTEMA ============
let users = [
    { id: 1, name: 'Juan', lastName: 'Pérez', email: 'cliente@email.com', password: '123456', type: 'registered', miles: 0 },
    { id: 2, name: 'María', lastName: 'García', email: 'corporativo@email.com', password: '123456', type: 'corporate', miles: 5000 },
    { id: 3, name: 'Carlos', lastName: 'Rodríguez', email: 'agente@email.com', password: '123456', type: 'agent', miles: 0 }
];

let flights = [
    {
        id: 1,
        number: 'DM101',
        airline: 'Dominican Sky',
        origin: 'Santo Domingo - ',
        destination: 'Sau Paulo',
        departure: '2024-12-20T08:00',
        arrival: '2024-12-20T09:00',
        price: 350,
        seats: 120
    },
    {
        id: 2,
        number: 'DM202',
        airline: 'Dominican Sky',
        origin: 'Santiago - ',
        destination: 'New York',
        departure: '2024-12-21T10:00',
        arrival: '2024-12-21T10:45',
        price: 290,
        seats: 80
    },
    {
        id: 3,
        number: 'DM303',
        airline: 'Caribbean Air',
        origin: 'Santo Domingo - ',
        destination: 'Miami',
        departure: '2024-12-22T14:00',
        arrival: '2024-12-22T16:30',
        price: 350,
        seats: 200
    },
    {
        id: 4,
        number: 'DM404',
        airline: 'Dominican Sky',
        origin: 'Punta Cana - ',
        destination: 'Bogota',
        departure: '2024-12-23T09:00',
        arrival: '2024-12-23T09:30',
        price: 80,
        seats: 60
    },
    {
        id: 5,
        number: 'DM505',
        airline: 'Caribbean Air',
        origin: 'Puerto Plata - ',
        destination: 'Ciudad de Mexico',
        departure: '2024-12-24T11:00',
        arrival: '2024-12-24T11:45',
        price: 95,
        seats: 90
    }
];

let reservations = [];
let currentUser = null;
let nextFlightId = 6;
let nextReservationId = 1;

// ============ NAVEGACIÓN PÚBLICA (Para todos) ============
function showPublicTab(tab) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Desactivar todos los botones de navegación
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar navegación pública
    document.getElementById('publicNav').style.display = 'flex';
    document.getElementById('authNav').style.display = 'none';
    
    switch(tab) {
        case 'flights':
            document.querySelector('#publicNav button:nth-child(1)').classList.add('active');
            document.getElementById('flightsTab').classList.add('active');
            document.getElementById('flightsTab').style.display = 'block';
            displayAllFlights();
            break;
        case 'search':
            document.querySelector('#publicNav button:nth-child(2)').classList.add('active');
            document.getElementById('searchTab').classList.add('active');
            document.getElementById('searchTab').style.display = 'block';
            break;
        case 'login':
            document.querySelector('#publicNav button:nth-child(3)').classList.add('active');
            document.getElementById('loginTab').classList.add('active');
            document.getElementById('loginTab').style.display = 'block';
            break;
        case 'register':
            document.querySelector('#publicNav button:nth-child(4)').classList.add('active');
            document.getElementById('registerTab').classList.add('active');
            document.getElementById('registerTab').style.display = 'block';
            break;
    }
}

function showAuthTab(tab) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar navegación autenticada
    document.getElementById('publicNav').style.display = 'none';
    document.getElementById('authNav').style.display = 'flex';
    
    // Mostrar/ocultar pestañas según tipo de usuario
    document.getElementById('flightsTab').style.display = 'block';
    document.getElementById('searchTab').style.display = 'block';
    document.getElementById('reservationsTab').style.display = 'block';
    
    if (currentUser && currentUser.type === 'agent') {
        document.getElementById('manageFlightsTab').style.display = 'block';
        document.getElementById('manageFlightsTabBtn').style.display = 'inline-block';
    } else {
        document.getElementById('manageFlightsTab').style.display = 'none';
        document.getElementById('manageFlightsTabBtn').style.display = 'none';
    }
    
    switch(tab) {
        case 'flights':
            document.querySelector('#authNav button:nth-child(1)').classList.add('active');
            document.getElementById('flightsTab').classList.add('active');
            displayAllFlights();
            break;
        case 'search':
            document.querySelector('#authNav button:nth-child(2)').classList.add('active');
            document.getElementById('searchTab').classList.add('active');
            break;
        case 'reservations':
            document.querySelector('#authNav button:nth-child(3)').classList.add('active');
            document.getElementById('reservationsTab').classList.add('active');
            displayReservations();
            break;
        case 'manageFlights':
            if (currentUser && currentUser.type === 'agent') {
                document.querySelector('#authNav button:nth-child(4)').classList.add('active');
                document.getElementById('manageFlightsTab').classList.add('active');
                displayManageFlights();
            }
            break;
    }
}

// ============ FUNCIONES DE AUTENTICACIÓN ============
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('loginUserType').value;
    
    const user = users.find(u => u.email === email && u.password === password && u.type === userType);
    
    if (user) {
        currentUser = user;
        updateUIForLoggedUser();
        alert('Inicio de sesión exitoso. Bienvenido ' + user.name);
    } else {
        alert('Credenciales incorrectas o tipo de usuario no coincide');
    }
}

function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const userType = document.getElementById('regUserType').value;
    
    if (users.find(u => u.email === email)) {
        alert(' El email ya está registrado');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        lastName,
        email,
        password,
        type: userType,
        miles: userType === 'corporate' ? 1000 : 0
    };
    
    users.push(newUser);
    alert(' Cuenta creada exitosamente. Ahora puede iniciar sesión.');
    
    document.getElementById('registerForm').reset();
    showPublicTab('login');
}

function logout() {
    currentUser = null;
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userTypeDisplay').textContent = 'Visitante';
    document.getElementById('userNameDisplay').textContent = '';
    
    alert(' Sesión cerrada exitosamente');
    showPublicTab('flights');
    displayAllFlights();
}

function updateUIForLoggedUser() {
    document.getElementById('logoutBtn').style.display = 'inline-block';
    
    const typeMap = {
        'registered': 'Cliente Registrado',
        'corporate': 'Cliente Corporativo',
        'agent': 'Agente de Viaje'
    };
    
    document.getElementById('userTypeDisplay').textContent = typeMap[currentUser.type];
    document.getElementById('userNameDisplay').textContent = currentUser.name + ' ' + currentUser.lastName;
    
    // Cambiar a vista autenticada
    showAuthTab('flights');
    displayAllFlights();
    displayReservations();
}

// ============ VUELOS (Visible para todos) ============
function displayAllFlights() {
    const container = document.getElementById('allFlightsList');
    
    if (flights.length === 0) {
        container.innerHTML = '<div class="empty-state"><p></p><p>No hay vuelos disponibles</p></div>';
        return;
    }
    
    container.innerHTML = flights.map(flight => createFlightCard(flight)).join('');
}

function createFlightCard(flight) {
    const departureDate = new Date(flight.departure).toLocaleString('es-DO');
    const arrivalDate = new Date(flight.arrival).toLocaleString('es-DO');
    const seatsAvailable = flight.seats;
    const seatsClass = seatsAvailable > 20 ? 'badge-success' : seatsAvailable > 5 ? 'badge-warning' : 'badge-error';
    
    return `
        <div class="flight-card">
            <div class="flight-info">
                <div class="flight-route">
                    ${flight.origin}  ${flight.destination}
                    <span class="badge badge-info">${flight.number}</span>
                </div>
                <div class="flight-details">
                    <span> ${flight.airline}</span>
                    <span> Salida: ${departureDate}</span>
                    <span> Llegada: ${arrivalDate}</span>
                    <span> Asientos: <span class="badge ${seatsClass}">${flight.seats}</span></span>
                </div>
            </div>
            <div style="text-align: right;">
                <div class="flight-price">$${flight.price}</div>
                ${currentUser && currentUser.type !== 'agent' ? 
                    `<button class="btn btn-success btn-sm mt-20" onclick="reserveFlight(${flight.id})">Reservar Ahora</button>` :
                    !currentUser ?
                    `<button class="btn btn-sm mt-20" onclick="showPublicTab('login')">Iniciar Sesión para Reservar</button>` :
                    ''}
            </div>
        </div>
    `;
}

function searchFlights(event) {
    event.preventDefault();
    
    const origin = document.getElementById('searchOrigin').value.toLowerCase();
    const destination = document.getElementById('searchDestination').value.toLowerCase();
    const date = document.getElementById('searchDate').value;
    const maxPrice = parseFloat(document.getElementById('searchMaxPrice').value);
    
    let results = flights;
    
    if (origin) results = results.filter(f => f.origin.toLowerCase().includes(origin));
    if (destination) results = results.filter(f => f.destination.toLowerCase().includes(destination));
    if (date) results = results.filter(f => f.departure.startsWith(date));
    if (maxPrice) results = results.filter(f => f.price <= maxPrice);
    
    const container = document.getElementById('searchResults');
    
    if (results.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>🔍</p><p>No se encontraron vuelos con esos criterios</p><p style="font-size: 14px;">Intente con diferentes fechas o destinos</p></div>';
    } else {
        container.innerHTML = `
            <h3 style="margin: 20px 0;">Resultados encontrados: <span class="badge badge-success">${results.length} vuelos</span></h3>
            ${results.map(flight => createFlightCard(flight)).join('')}
        `;
    }
}

// ============ RESERVAS (Solo usuarios autenticados) ============
function reserveFlight(flightId) {
    if (!currentUser) {
        alert('Debe iniciar sesión para reservar');
        showPublicTab('login');
        return;
    }
    
    const flight = flights.find(f => f.id === flightId);
    
    if (!flight) {
        alert('Vuelo no encontrado');
        return;
    }
    
    if (flight.seats <= 0) {
        alert('No hay asientos disponibles para este vuelo');
        return;
    }
    
    let finalPrice = flight.price;
    let message = '';
    
    // Aplicar descuento para clientes corporativos con millas
    if (currentUser.type === 'corporate' && currentUser.miles >= 1000) {
        if (confirm(`Usted tiene ${currentUser.miles} millas acumuladas.\n\n¿Desea canjear 1000 millas para obtener un 20% de descuento?\n\nPrecio original: $${flight.price}\nPrecio con descuento: $${(flight.price * 0.8).toFixed(2)}`)) {
            finalPrice = flight.price * 0.8;
            currentUser.miles -= 1000;
            message = ' (con descuento del 20% por canje de millas)';
        }
    }
    
    // Crear reservación
    const reservation = {
        id: nextReservationId++,
        userId: currentUser.id,
        flightId: flight.id,
        flightNumber: flight.number,
        origin: flight.origin,
        destination: flight.destination,
        departure: flight.departure,
        arrival: flight.arrival,
        price: finalPrice,
        date: new Date().toISOString()
    };
    
    reservations.push(reservation);
    flight.seats--;
    
    // Acumular millas para cliente corporativo
    if (currentUser.type === 'corporate') {
        currentUser.miles += 500;
        message += ` | +500 millas acumuladas (Total: ${currentUser.miles})`;
    }
    
    // Enviar confirmación
    sendConfirmationEmail(reservation);
    
    alert(` ¡Reservación confirmada!${message}\n\nSe ha enviado un correo con los detalles a ${currentUser.email}`);
    displayAllFlights();
    displayReservations();
}

function sendConfirmationEmail(reservation) {
    console.log('═══════════════════════════════════════');
    console.log(' SISTEMA DE CORREO ELECTRÓNICO');
    console.log('═══════════════════════════════════════');
    console.log(`Para: ${currentUser.email}`);
    console.log(`Asunto: Confirmación de Reserva #${reservation.id} - Dominican Sky`);
    console.log('───────────────────────────────────────');
    console.log(`Estimado/a ${currentUser.name} ${currentUser.lastName}:`);
    console.log('');
    console.log(`Su reserva ha sido confirmada exitosamente:`);
    console.log(` Número de Reserva: ${reservation.id}`);
    console.log(` Vuelo: ${reservation.flightNumber}`);
    console.log(` Ruta: ${reservation.origin} → ${reservation.destination}`);
    console.log(` Salida: ${new Date(reservation.departure).toLocaleString('es-DO')}`);
    console.log(` Llegada: ${new Date(reservation.arrival).toLocaleString('es-DO')}`);
    console.log(` Precio Total: $${reservation.price}`);
    console.log('');
    console.log('¡Gracias por volar con Dominican Sky! ✈️');
    console.log('═══════════════════════════════════════');
}

function displayReservations() {
    const container = document.getElementById('myReservations');
    
    if (!currentUser) {
        container.innerHTML = '<div class="empty-state"><p></p><p>Inicie sesión para ver sus reservaciones</p></div>';
        return;
    }
    
    const myReservations = reservations.filter(r => r.userId === currentUser.id);
    
    if (myReservations.length === 0) {
        container.innerHTML = '<div class="empty-state"><p></p><p>No tiene reservaciones activas</p><p style="font-size: 14px;">Busque vuelos disponibles y realice su primera reserva</p></div>';
        return;
    }
    
    container.innerHTML = myReservations.map(reservation => `
        <div class="reservation-card">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div>
                    <h3> Reserva #${reservation.id}</h3>
                    <p><strong>Vuelo:</strong> ${reservation.flightNumber}</p>
                    <p><strong>Ruta:</strong>  ${reservation.origin} → ${reservation.destination} 🛬</p>
                    <p><strong>Salida:</strong> ${new Date(reservation.departure).toLocaleString('es-DO')}</p>
                    <p><strong>Llegada:</strong> ${new Date(reservation.arrival).toLocaleString('es-DO')}</p>
                    <p><strong>Precio:</strong> <span style="color: #28a745; font-weight: bold;">$${reservation.price}</span></p>
                    <p><small>Reservado el: ${new Date(reservation.date).toLocaleString('es-DO')}</small></p>
                </div>
                <div>
                    <button class="btn btn-danger" onclick="cancelReservation(${reservation.id})">
                         Cancelar Reservación
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function cancelReservation(reservationId) {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
        alert(' Reservación no encontrada');
        return;
    }
    
    if (confirm(`¿Está seguro de cancelar la reserva #${reservationId}?\n\nVuelo: ${reservation.flightNumber}\nRuta: ${reservation.origin} → ${reservation.destination}\n\nSe realizará la devolución del 100%.`)) {
        // Devolver el asiento al vuelo
        const flight = flights.find(f => f.id === reservation.flightId);
        if (flight) {
            flight.seats++;
        }
        
        // Eliminar reservación
        reservations = reservations.filter(r => r.id !== reservationId);
        
        alert(' Reservación cancelada exitosamente.\n Devolución procesada.\n Se ha enviado un correo de confirmación de cancelación.');
        displayAllFlights();
        displayReservations();
        displayManageFlights();
    }
}

// ============ GESTIÓN DE VUELOS (AGENTE) ============
function addFlight(event) {
    event.preventDefault();
    
    if (!currentUser || currentUser.type !== 'agent') {
        alert(' Solo los agentes de viaje pueden gestionar vuelos');
        return;
    }
    
    const newFlight = {
        id: nextFlightId++,
        number: document.getElementById('flightNumber').value,
        airline: document.getElementById('flightAirline').value,
        origin: document.getElementById('flightOrigin').value,
        destination: document.getElementById('flightDestination').value,
        departure: document.getElementById('flightDeparture').value,
        arrival: document.getElementById('flightArrival').value,
        price: parseFloat(document.getElementById('flightPrice').value),
        seats: parseInt(document.getElementById('flightSeats').value)
    };
    
    flights.push(newFlight);
    alert(` Vuelo ${newFlight.number} agregado exitosamente`);
    document.getElementById('addFlightForm').reset();
    displayAllFlights();
    displayManageFlights();
}

function displayManageFlights() {
    const container = document.getElementById('manageFlightsList');
    
    if (!currentUser || currentUser.type !== 'agent') return;
    
    if (flights.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay vuelos para gestionar</p></div>';
        return;
    }
    
    container.innerHTML = flights.map(flight => `
        <div class="flight-card">
            <div class="flight-info">
                <div class="flight-route">
                    ${flight.origin} → ${flight.destination}
                    <span class="badge badge-info">${flight.number}</span>
                </div>
                <div class="flight-details">
                    <span> ${flight.airline}</span>
                    <span> Asientos: ${flight.seats}</span>
                    <span> Precio: $${flight.price}</span>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-warning btn-sm" onclick="editFlight(${flight.id})">✏️ Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteFlight(${flight.id})">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

function editFlight(flightId) {
    if (!currentUser || currentUser.type !== 'agent') return;
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return;
    
    const newPrice = prompt(`Modificar precio del vuelo ${flight.number}\nPrecio actual: $${flight.price}\nNuevo precio:`, flight.price);
    if (newPrice === null) return;
    
    const newSeats = prompt(`Modificar asientos del vuelo ${flight.number}\nAsientos actuales: ${flight.seats}\nNuevos asientos:`, flight.seats);
    if (newSeats === null) return;
    
    if (newPrice && newSeats) {
        flight.price = parseFloat(newPrice);
        flight.seats = parseInt(newSeats);
        alert(`Vuelo ${flight.number} actualizado exitosamente`);
        displayAllFlights();
        displayManageFlights();
    }
}

function deleteFlight(flightId) {
    if (!currentUser || currentUser.type !== 'agent') return;
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return;
    
    if (confirm(`¿Está seguro de eliminar el vuelo ${flight.number}?\nRuta: ${flight.origin} → ${flight.destination}\n\nEsta acción no se puede deshacer.`)) {
        // Cancelar todas las reservaciones de este vuelo
        const flightReservations = reservations.filter(r => r.flightId === flightId);
        if (flightReservations.length > 0) {
            if (confirm(`Hay ${flightReservations.length} reservaciones activas para este vuelo. ¿Desea eliminarlas y notificar a los clientes?`)) {
                reservations = reservations.filter(r => r.flightId !== flightId);
            } else {
                return;
            }
        }
        
        flights = flights.filter(f => f.id !== flightId);
        alert(`Vuelo ${flight.number} eliminado exitosamente`);
        displayAllFlights();
        displayManageFlights();
    }
}

// ============ INICIALIZACIÓN ============
window.onload = function() {
    // Iniciar en la vista pública de consulta de vuelos
    showPublicTab('flights');
    displayAllFlights();
};