let users = [
    { id: 1, name: 'Amancio', lastName: 'Lorenzo', email: 'amancio2@gmail.com', password: '123456', type: 'registered', miles: 0 },
    { id: 2, name: 'Ronald', lastName: 'Hache', email: 'ronaldhache@gmail.com', password: '123456', type: 'corporate', miles: 5000 },
    { id: 3, name: 'Carlos', lastName: 'Rodríguez', email: 'agente@gmail.com', password: '123456', type: 'agent', miles: 0 },
];

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

let reservations = [];
let currentUser = null;
let nextFlightId = 6;
let nextReservationId = 1;


// ============ GESTIÓN DE SESIÓN ============
function saveSession() {
    if (currentUser) {
        // Guardar todos los datos del usuario
        const userToSave = {
            id: currentUser.id,
            name: currentUser.name,
            lastName: currentUser.lastName,
            email: currentUser.email,
            type: currentUser.type,
            miles: currentUser.miles
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userToSave));
        console.log('💾 Sesión guardada:', userToSave); // Para depurar
    }
}

function loadSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('✅ Sesión cargada:', currentUser); // Para depurar
            return true;
        } catch (error) {
            console.error('Error al cargar sesión:', error);
            return false;
        }
    }
    return false;
}

function clearSession() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userTypeDisplay').textContent = 'Visitante';
    document.getElementById('userNameDisplay').textContent = '';
}

// Olvido de contraseña
function mostrarResetPassword() {
    hideAllTabs();
    document.getElementById('publicNav').style.display = 'flex';
    document.getElementById('authNav').style.display = 'none';
    document.getElementById('resetPasswordTab').style.display = 'block';
    document.getElementById('resetPasswordTab').classList.add('active');
}

function resetPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    const messageDiv = document.getElementById('resetMessage');
    
    if (!email) {
        messageDiv.style.display = 'block';
        messageDiv.innerHTML = '<div class="alert alert-error">❌ Ingrese un correo electrónico</div>';
        return;
    }
    
    // Buscar usuario
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = savedUsers.find(u => u.email === email);
    
    if (!user) {
        messageDiv.style.display = 'block';
        messageDiv.innerHTML = '<div class="alert alert-error">❌ No existe una cuenta con este correo</div>';
        return;
    }
    
    // Generar nueva contraseña temporal
    const nuevaPassword = Math.random().toString(36).substring(2, 10);
    
    // Actualizar usuario
    const updatedUsers = savedUsers.map(u => {
        if (u.email === email) {
            u.password = nuevaPassword;
        }
        return u;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    users = updatedUsers;
    
    // Enviar correo con la nueva contraseña (usando Formspree)
    fetch("https://formspree.io/f/TU_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            subject: "Recuperación de Contraseña - Dominican Sky",
            message: `Hola ${user.name},\n\nTu nueva contraseña temporal es: ${nuevaPassword}\n\nInicia sesión y cámbiala por una propia.\n\nDominican Sky`
        })
    });
    
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = '<div class="alert alert-success">✅ Se ha enviado una nueva contraseña a tu correo. Revisa tu bandeja de entrada.</div>';
    
    document.getElementById('resetForm').reset();
}

// ============ NAVEGACIÓN ============
function hideAllTabs() {
    // Ocultar TODAS las pestañas completamente
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    // Desactivar todos los botones de navegación
    const allButtons = document.querySelectorAll('.tab-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });
}

function showPublicTab(tab) {
    // Ocultar todo primero
    hideAllTabs();
    
    // Mostrar navegación pública, ocultar autenticada
    document.getElementById('publicNav').style.display = 'flex';
    document.getElementById('authNav').style.display = 'none';
    
    // Mostrar solo la pestaña seleccionada
    switch(tab) {
        case 'flights':
            document.querySelector('#publicNav button:nth-child(1)').classList.add('active');
            document.getElementById('flightsTab').style.display = 'block';
            document.getElementById('flightsTab').classList.add('active');
            displayAllFlights();
            break;
        case 'search':
            document.querySelector('#publicNav button:nth-child(2)').classList.add('active');
            document.getElementById('searchTab').style.display = 'block';
            document.getElementById('searchTab').classList.add('active');
            break;
        case 'login':
            document.querySelector('#publicNav button:nth-child(3)').classList.add('active');
            document.getElementById('loginTab').style.display = 'block';
            document.getElementById('loginTab').classList.add('active');
            break;
        case 'register':
            document.querySelector('#publicNav button:nth-child(4)').classList.add('active');
            document.getElementById('registerTab').style.display = 'block';
            document.getElementById('registerTab').classList.add('active');
            break;
    }
}

function showAuthTab(tab) {
    console.log('🔍 Cambiando a pestaña:', tab);
    
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
    
    // Mostrar/ocultar gestión
    const manageBtn = document.getElementById('manageFlightsTabBtn');
    if (manageBtn) {
        if (currentUser && currentUser.type === 'agent') {
        manageBtn.style.display = 'inline-block';
    }    else {
        manageBtn.style.display = 'none';
    }
}   
    
    // Activar pestaña seleccionada
    if (tab === 'flights') {
        document.querySelector('#authNav button:nth-child(1)').classList.add('active');
        document.getElementById('flightsTab').style.display = 'block';
        document.getElementById('flightsTab').classList.add('active');
        displayAllFlights();
    } 
    else if (tab === 'search') {
        document.querySelector('#authNav button:nth-child(2)').classList.add('active');
        document.getElementById('searchTab').style.display = 'block';
        document.getElementById('searchTab').classList.add('active');
    } 
 else if (tab === 'reservations') {
    document.querySelector('#authNav button:nth-child(3)').classList.add('active');
    document.getElementById('reservationsTab').style.display = 'block';
    document.getElementById('reservationsTab').classList.add('active');
    
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(function() {
        displayReservations();
    }, 100);
}
    else if (tab === 'manageFlights' && currentUser && currentUser.type === 'agent') {
        document.querySelector('#authNav button:nth-child(4)').classList.add('active');
        document.getElementById('manageFlightsTab').style.display = 'block';
        document.getElementById('manageFlightsTab').classList.add('active');
        displayManageFlights();
    }
}

function searchFlightsMain(event) {
    event.preventDefault();
    
    // Obtener valores de los campos
    const origin = document.getElementById('searchOrigin').value.toLowerCase().trim();
    const destination = document.getElementById('searchDestination').value.toLowerCase().trim();
    const date = document.getElementById('searchDate').value;
    
    console.log('Buscando:', { origin, destination, date }); // Para depurar
    
    // Filtrar vuelos
    let results = flights;
    
    if (origin) {
        results = results.filter(f => f.origin.toLowerCase().includes(origin));
    }
    if (destination) {
        results = results.filter(f => f.destination.toLowerCase().includes(destination));
    }
    if (date) {
        results = results.filter(f => f.departure.startsWith(date));
    }
    
    console.log('Resultados:', results.length); // Para depurar
    
    // Mostrar resultados
    const container = document.getElementById('mainSearchResults');
    
    if (!container) {
        console.error('No se encontró el contenedor mainSearchResults');
        return;
    }
    
    if (results.length === 0) {
        container.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 8px; margin-top: 20px; text-align: center;">
                <p style="font-size: 18px;"> No se encontraron vuelos</p>
                <p style="color: #6c757d;">Intente con diferentes fechas o destinos</p>
            </div>`;
    } else {
        let html = `
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3 style="margin-bottom: 15px;"> ${results.length} vuelo(s) encontrado(s)</h3>
                <div class="flight-list">`;
        
        results.forEach(flight => {
            html += createFlightCard(flight);
        });
        
        html += `
                </div>
            </div>`;
        
        container.innerHTML = html;
    }
}
// ============ AUTENTICACIÓN ============
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    console.log('🔐 Login:', email);
    
    // Recargar usuarios
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (savedUsers.length > 0) {
        users = savedUsers;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            type: user.type,
            miles: user.miles
        };
        
        console.log('✅ Usuario logueado:', currentUser);
        
        // Guardar sesión
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Actualizar UI
        updateUIForLoggedUser();
        
        alert('✅ Bienvenido ' + currentUser.name + ' ' + currentUser.lastName);
    } else {
        alert('❌ Credenciales incorrectas');
        console.log('❌ No encontrado. Usuarios:', users);
    }
}

function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const userType = document.getElementById('regUserType').value;
    
    if (!name || !lastName || !email || !password || !userType) {
        alert('❌ Complete todos los campos');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        alert('❌ El email ya está registrado');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name: name,
        lastName: lastName,
        email: email,
        password: password,
        type: userType,
        miles: userType === 'corporate' ? 1000 : 0
    };
    
    users.push(newUser);
    saveAllData(); // Guardar en localStorage
    
    console.log('✅ Nuevo usuario registrado:', newUser); // Para depurar
    
    alert('✅ Cuenta creada exitosamente. Bienvenido ' + name + ' ' + lastName);
    document.getElementById('registerForm').reset();
    showPublicTab('login');
}

function logout() {
    clearSession(); // LIMPIAR SESIÓN
    alert('👋 Sesión cerrada exitosamente');
    showPublicTab('flights');
    displayAllFlights();
}

function updateUIForLoggedUser() {
    if (!currentUser) {
        console.log('❌ No hay usuario');
        return;
    }
    
    console.log('🔄 Actualizando UI para:', currentUser.name, currentUser.type);
    
    // Mostrar botón de cerrar sesión
    document.getElementById('logoutBtn').style.display = 'inline-block';
    
    // Actualizar textos
    const typeMap = {
        'registered': 'Cliente Registrado',
        'corporate': 'Cliente Corporativo',
        'agent': 'Agente de Viaje'
    };
    
    document.getElementById('userTypeDisplay').textContent = typeMap[currentUser.type] || 'Usuario';
    document.getElementById('userNameDisplay').textContent = currentUser.name + ' ' + currentUser.lastName;
    
    // Cambiar navegación
    document.getElementById('publicNav').style.display = 'none';
    document.getElementById('authNav').style.display = 'flex';
    
    // Mostrar/ocultar gestión
    if (currentUser.type === 'agent') {
        document.getElementById('manageFlightsTabBtn').style.display = 'inline-block';
    } else {
        document.getElementById('manageFlightsTabBtn').style.display = 'none';
    }
    
    // Mostrar vuelos
    showAuthTab('flights');
}
// ============ VUELOS ============
function displayAllFlights() {
    const container = document.getElementById('allFlightsList');
    
    if (!container) {
        console.error('❌ No se encontró allFlightsList');
        return;
    }
    
    // Recargar vuelos desde localStorage
    const savedFlights = JSON.parse(localStorage.getItem('flights') || '[]');
    if (savedFlights.length > 0) {
        flights = savedFlights;
    }
    
    console.log('✈️ Mostrando', flights.length, 'vuelos');
    
    if (flights.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✈️</div>
                <p>No hay vuelos disponibles</p>
            </div>`;
        return;
    }
    
    container.innerHTML = flights.map(flight => createFlightCard(flight)).join('');
}

function createFlightCard(flight) {
    const departureDate = new Date(flight.departure).toLocaleString('es-DO');
    const arrivalDate = new Date(flight.arrival).toLocaleString('es-DO');
    const seatsClass = flight.seats > 20 ? 'seats-good' : flight.seats > 5 ? 'seats-few' : 'seats-none';
    const seatsText = flight.seats > 20 ? 'Disponible' : flight.seats > 5 ? 'Pocos' : 'Agotado';
    
    const reserveButton = currentUser && currentUser.type !== 'agent' 
        ? `<button class="btn btn-primary btn-sm" onclick="reserveFlight(${flight.id})">Reservar Ahora</button>`
        : !currentUser 
            ? `<button class="btn btn-outline btn-sm" onclick="showPublicTab('login')">Iniciar Sesión</button>`
            : '';
    
    return `
        <div class="flight-card">
            <div class="flight-info">
                <div class="flight-number">${flight.airline} · ${flight.number}</div>
                <div class="flight-route">
                    <span class="flight-city">${flight.origin}</span>
                    <span class="flight-arrow"></span>
                    <span class="flight-city">${flight.destination}</span>
                </div>
                <div class="flight-details">
                    <div class="flight-detail-item">
                        <span></span>
                        <span>Salida: ${departureDate}</span>
                    </div>
                    <div class="flight-detail-item">
                        <span></span>
                        <span>Llegada: ${arrivalDate}</span>
                    </div>
                </div>
            </div>
            <div class="flight-price-section">
                <div class="flight-price">$${flight.price} <span>USD</span></div>
                <div class="per-person">por persona</div>
                <div class="seats-available">
                    <span></span>
                    <span class="seats-badge ${seatsClass}">${flight.seats} asientos - ${seatsText}</span>
                </div>
                ${reserveButton}
            </div>
        </div>
    `;
}

function searchFlights(event) {
    event.preventDefault();
    
    const origin = (document.getElementById('searchOrigin2')?.value || '').toLowerCase().trim();
    const destination = (document.getElementById('searchDestination2')?.value || '').toLowerCase().trim();
    const date = document.getElementById('searchDate2')?.value || '';
    const returnDate = document.getElementById('searchReturnDate2')?.value || '';
    const maxPrice = parseFloat(document.getElementById('searchMaxPrice')?.value) || 0;
    
    // Validar fechas
    if (date && returnDate && returnDate < date) {
        alert('❌ La fecha de regreso no puede ser anterior a la fecha de ida');
        return;
    }
    
    let results = flights;
    
    if (origin) results = results.filter(f => f.origin.toLowerCase().includes(origin));
    if (destination) results = results.filter(f => f.destination.toLowerCase().includes(destination));
    if (date) results = results.filter(f => f.departure.startsWith(date));
    if (maxPrice > 0) results = results.filter(f => f.price <= maxPrice);
    
    const container = document.getElementById('searchResults');
    
    if (!container) return;
    
    let searchCriteria = [];
    if (origin) searchCriteria.push(`Origen: ${origin}`);
    if (destination) searchCriteria.push(`Destino: ${destination}`);
    if (date) searchCriteria.push(`Fecha ida: ${new Date(date + 'T00:00:00').toLocaleDateString('es-DO')}`);
    if (returnDate) searchCriteria.push(`Fecha regreso: ${new Date(returnDate + 'T00:00:00').toLocaleDateString('es-DO')}`);
    if (maxPrice > 0) searchCriteria.push(`Hasta $${maxPrice}`);
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="margin-top: 30px;">
                <div class="empty-state-icon">🔍</div>
                <p>No se encontraron vuelos</p>
                ${searchCriteria.length > 0 ? 
                    `<p style="color: #6c757d; font-size: 13px;">${searchCriteria.join(' | ')}</p>` : ''}
                <p style="font-size: 14px;">Intente con diferentes fechas o destinos</p>
            </div>`;
    } else {
        container.innerHTML = `
            <div style="margin: 20px 0;">
                <h3 style="color: #0B1D3A; margin-bottom: 10px;">
                    ${results.length} vuelo(s) encontrado(s)
                </h3>
                ${searchCriteria.length > 0 ? 
                    `<p style="color: #6c757d; font-size: 14px;">${searchCriteria.join(' | ')}</p>` : ''}
                ${returnDate ? 
                    '<p style="color: #0B1D3A; font-size: 13px; margin-top: 10px;">💡 Mostrando vuelos de ida. Para vuelos de regreso, busque con las fechas correspondientes.</p>' : ''}
            </div>
            <div class="flight-list">
                ${results.map(flight => createFlightCard(flight)).join('')}
            </div>`;
    }
}

// ============ RESERVAS ============
function reserveFlight(flightId) {
    if (!currentUser) {
        alert('❌ Debe iniciar sesión para reservar');
        showPublicTab('login');
        return;
    }
    
    const flight = flights.find(f => f.id === flightId);
    
    if (!flight) {
        alert('❌ Vuelo no encontrado');
        return;
    }
    
    if (flight.seats <= 0) {
        alert('❌ No hay asientos disponibles');
        return;
    }
    
    // Guardar datos del vuelo seleccionado para la página de reserva
    const flightData = {
        id: flight.id,
        number: flight.number,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination,
        departure: flight.departure,
        arrival: flight.arrival,
        basePrice: flight.price,
        taxes: flight.price * 0.16,
        discount: 0
    };
    
    // Si es corporativo, calcular descuento
    if (currentUser.type === 'corporate' && currentUser.miles >= 1000) {
        if (confirm('¿Usar 1000 millas para 20% descuento?')) {
            flightData.discount = flight.price * 0.2;
        }
    }
    
    // Guardar en localStorage para que reservar.html lo lea
    localStorage.setItem('selectedFlight', JSON.stringify(flightData));
    
    console.log('📍 Redirigiendo a reservar.html con vuelo:', flightData);
    
    // Redirigir a la página de reserva
    window.location.href = 'reservar.html';
}

function sendConfirmationEmail(reservation) {
    console.log('═══════════════════════════════════════');
    console.log('📧 SISTEMA DE CORREO ELECTRÓNICO');
    console.log('═══════════════════════════════════════');
    console.log(`Para: ${currentUser.email}`);
    console.log(`Asunto: Confirmación de Reserva #${reservation.id} - Dominican Sky`);
    console.log('───────────────────────────────────────');
    console.log(`Estimado/a ${currentUser.name}:`);
    console.log('');
    console.log(`Su reserva ha sido confirmada:`);
    console.log(`🔢 Número de Reserva: ${reservation.id}`);
    console.log(`✈️ Vuelo: ${reservation.flightNumber}`);
    console.log(`🛫 Ruta: ${reservation.origin} → ${reservation.destination}`);
    console.log(`📅 Salida: ${new Date(reservation.departure).toLocaleString('es-DO')}`);
    console.log(`💰 Precio Total: $${reservation.price}`);
    console.log('');
    console.log('¡Gracias por volar con Dominican Sky! ✈️');
    console.log('═══════════════════════════════════════');
}

function enviarCorreoConfirmacion(reserva) {
    fetch("https://formspree.io/f/mzdoqlyb", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: currentUser.email,
            nombre: currentUser.name + " " + currentUser.lastName,
            codigo: reserva.code,
            vuelo: reserva.flightNumber,
            ruta: reserva.origin + " → " + reserva.destination,
            salida: new Date(reserva.departure).toLocaleString("es-DO"),
            precio: "$" + reserva.price,
            asiento: reserva.seat || "No asignado"
        })
    })
    .then(response => {
        if (response.ok) {
            console.log("✅ Correo enviado a " + currentUser.email);
        }
    })
    .catch(error => {
        console.log("❌ Error:", error);
    });
}

function displayReservations() {
    var container = document.getElementById('myReservations');
    
    if (!container) {
        console.error('No se encontró myReservations');
        return;
    }
    
    // LIMPIAR
    container.innerHTML = '';
    
    if (!currentUser) {
        container.innerHTML = '<p style="text-align:center; padding:30px;">Inicie sesión para ver sus reservas</p>';
        return;
    }
    
    // Cargar desde localStorage
    var todasLasReservas = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    console.log('Todas las reservas:', todasLasReservas);
    console.log('Usuario actual ID:', currentUser.id);
    
    // Filtrar manualmente
    var misReservas = [];
    for (var i = 0; i < todasLasReservas.length; i++) {
        var r = todasLasReservas[i];
        console.log('Comparando reserva userId:', r.userId, 'con currentUser.id:', currentUser.id, 'tipo userId:', typeof r.userId, 'tipo currentUser.id:', typeof currentUser.id);
        
        // Comparar como número
        if (Number(r.userId) === Number(currentUser.id) && r.status === 'active') {
            misReservas.push(r);
        }
    }
    
    console.log('Mis reservas encontradas:', misReservas.length);
    
    if (misReservas.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🎫</div><p>No tiene reservaciones activas</p></div>';
        return;
    }
    
    // Construir HTML con strings simples
    var html = '';
    for (var i = 0; i < misReservas.length; i++) {
        var r = misReservas[i];
        html += '<div style="background: white; border: 2px solid #28a745; border-radius: 10px; padding: 20px; margin-bottom: 15px;">';
        html += '<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">';
        html += '<strong>🎫 Reserva #' + r.id + ' - ' + (r.code || '') + '</strong>';
        html += '<span style="background: #d4edda; color: #155724; padding: 5px 12px; border-radius: 15px; font-size: 12px;">✅ Activa</span>';
        html += '</div>';
        html += '<div style="font-size: 18px; font-weight: 600; margin: 10px 0;">' + r.origin + ' ✈️ ' + r.destination + '</div>';
        html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">';
        html += '<div><strong>Vuelo:</strong> ' + r.flightNumber + '</div>';
        html += '<div><strong>Precio:</strong> $' + r.price + '</div>';
        html += '<div><strong>Asiento:</strong> ' + (r.seat || 'No asignado') + '</div>';
        html += '<div><strong>Salida:</strong> ' + new Date(r.departure).toLocaleString('es-DO') + '</div>';
        html += '</div>';
        html += '<div style="text-align: right; margin-top: 15px;">';
        html += '<button class="btn btn-danger btn-sm" onclick="cancelReservation(' + r.id + ')">❌ Cancelar</button>';
        html += '</div>';
        html += '</div>';
    }
    
    console.log('HTML generado:', html.substring(0, 100) + '...');
    
    container.innerHTML = html;
    console.log('✅ Reservas mostradas en el contenedor');
}

function cancelReservation(reservationId) {
    // Recargar desde localStorage
    let savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Buscar la reserva
    const reservation = savedReservations.find(r => r.id == reservationId);
    
    if (!reservation) {
        alert('❌ Reservación no encontrada');
        return;
    }
    
    if (!confirm(`¿Cancelar la reserva #${reservationId}?\n\nVuelo: ${reservation.flightNumber}\nRuta: ${reservation.origin} → ${reservation.destination}\n\nSe realizará devolución del 100%.`)) {
        return;
    }
    
    // Marcar como cancelada
    savedReservations = savedReservations.map(r => {
        if (r.id == reservationId) {
            r.status = 'cancelled';
            r.cancelledAt = new Date().toISOString();
        }
        return r;
    });
    
    // Guardar en localStorage
    localStorage.setItem('reservations', JSON.stringify(savedReservations));
    reservations = savedReservations;
    
    // Liberar asiento
    let savedFlights = JSON.parse(localStorage.getItem('flights') || '[]');
    const flight = savedFlights.find(f => f.id == reservation.flightId);
    if (flight) {
        flight.seats += 1;
        localStorage.setItem('flights', JSON.stringify(savedFlights));
        flights = savedFlights;
    }
    
    console.log('✅ Reserva cancelada:', reservationId);
    
    alert('✅ Reservación cancelada. Devolución procesada.');
    
    // Actualizar vistas
    displayAllFlights();
    displayReservations();
}

// ============ GESTIÓN DE VUELOS (AGENTE) ============
function addFlight(event) {
    event.preventDefault();
    
    if (!currentUser || currentUser.type !== 'agent') {
        alert('❌ Solo los agentes de viaje pueden gestionar vuelos');
        return;
    }
    
    const number = document.getElementById('flightNumber').value.trim();
    const airline = document.getElementById('flightAirline').value.trim();
    const origin = document.getElementById('flightOrigin').value.trim();
    const destination = document.getElementById('flightDestination').value.trim();
    const departure = document.getElementById('flightDeparture').value;
    const arrival = document.getElementById('flightArrival').value;
    const price = parseFloat(document.getElementById('flightPrice').value);
    const seats = parseInt(document.getElementById('flightSeats').value);
    
    if (!number || !airline || !origin || !destination || !departure || !arrival || !price || !seats) {
        alert('❌ Complete todos los campos');
        return;
    }
    
    if (arrival <= departure) {
        alert('❌ La fecha de llegada debe ser posterior a la de salida');
        return;
    }
    
    if (flights.find(f => f.number === number)) {
        alert('❌ Ya existe un vuelo con el número ' + number);
        return;
    }
    
    const newFlight = {
        id: nextFlightId++,
        number: number,
        airline: airline,
        origin: origin,
        destination: destination,
        departure: departure,
        arrival: arrival,
        price: price,
        seats: seats
    };
    
    flights.push(newFlight);
    saveAllData();
    
    alert('✅ Vuelo ' + number + ' agregado exitosamente');
    document.getElementById('addFlightForm').reset();
    displayAllFlights();
    displayManageFlights();
}

function displayManageFlights() {
    const container = document.getElementById('manageFlightsList');
    
    if (!container) return;
    
    if (!currentUser || currentUser.type !== 'agent') {
        container.innerHTML = '<p style="color: red;">❌ Acceso denegado</p>';
        return;
    }
    
    if (flights.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay vuelos registrados</p>
            </div>`;
        return;
    }
    
    let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse;">';
    html += `
        <thead>
            <tr style="background: #0B1D3A; color: white;">
                <th style="padding: 10px;">Vuelo</th>
                <th style="padding: 10px;">Ruta</th>
                <th style="padding: 10px;">Salida</th>
                <th style="padding: 10px;">Asientos</th>
                <th style="padding: 10px;">Precio</th>
                <th style="padding: 10px;">Acciones</th>
            </tr>
        </thead>
        <tbody>`;
    
    flights.forEach((flight, index) => {
        const bgColor = index % 2 === 0 ? '#f8f9fa' : 'white';
        html += `
            <tr style="background: ${bgColor};">
                <td style="padding: 10px;"><strong>${flight.number}</strong></td>
                <td style="padding: 10px;">${flight.origin} → ${flight.destination}</td>
                <td style="padding: 10px; font-size: 13px;">${new Date(flight.departure).toLocaleString('es-DO')}</td>
                <td style="padding: 10px; text-align: center;">${flight.seats}</td>
                <td style="padding: 10px; text-align: center; font-weight: bold;">$${flight.price}</td>
                <td style="padding: 10px; text-align: center;">
                    <button class="btn btn-warning btn-sm" onclick="editFlight(${flight.id})">✏️ Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFlight(${flight.id})">🗑️ Eliminar</button>
                </td>
            </tr>`;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function editFlight(flightId) {
    if (!currentUser || currentUser.type !== 'agent') {
        alert('❌ Solo los agentes pueden editar vuelos');
        return;
    }
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight) {
        alert('❌ Vuelo no encontrado');
        return;
    }
    
    const newPrice = prompt(`EDITAR VUELO ${flight.number}\nRuta: ${flight.origin} → ${flight.destination}\n\nPrecio actual: $${flight.price}\nNuevo precio:`, flight.price);
    if (newPrice === null) return;
    
    const newSeats = prompt(`EDITAR VUELO ${flight.number}\nRuta: ${flight.origin} → ${flight.destination}\n\nAsientos actuales: ${flight.seats}\nNuevos asientos:`, flight.seats);
    if (newSeats === null) return;
    
    if (isNaN(newPrice) || newPrice <= 0) {
        alert('❌ Precio inválido');
        return;
    }
    
    if (isNaN(newSeats) || newSeats < 0) {
        alert('❌ Número de asientos inválido');
        return;
    }
    
    flight.price = parseFloat(newPrice);
    flight.seats = parseInt(newSeats);
    saveAllData();
    
    alert('✅ Vuelo ' + flight.number + ' actualizado');
    displayAllFlights();
    displayManageFlights();
}

function deleteFlight(flightId) {
    if (!currentUser || currentUser.type !== 'agent') {
        alert('❌ Solo los agentes pueden eliminar vuelos');
        return;
    }
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight) {
        alert('❌ Vuelo no encontrado');
        return;
    }
    
    if (!confirm(`¿Eliminar vuelo ${flight.number}?\n${flight.origin} → ${flight.destination}`)) {
        return;
    }
    
    flights = flights.filter(f => f.id !== flightId);
    saveAllData();
    
    alert('✅ Vuelo eliminado');
    displayAllFlights();
    displayManageFlights();
}

function saveData() {
    localStorage.setItem('flights', JSON.stringify(flights));
    localStorage.setItem('reservations', JSON.stringify(reservations));
    localStorage.setItem('users', JSON.stringify(users));
}

function saveAllData() {
    localStorage.setItem('flights', JSON.stringify(flights));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

function loadData() {
    const savedFlights = localStorage.getItem('flights');
    const savedReservations = localStorage.getItem('reservations');
    const savedUsers = localStorage.getItem('users');
    
    if (savedFlights) flights = JSON.parse(savedFlights);
    if (savedReservations) reservations = JSON.parse(savedReservations);
    if (savedUsers) users = JSON.parse(savedUsers);
}


// ============ INICIALIZACIÓN ============
window.onload = function() {
    console.log('🚀 Dominican Sky iniciado');
    
    // Cargar datos
    loadAllData();
    
    // Intentar cargar sesión
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('✅ Sesión cargada:', currentUser.name, currentUser.type);
        updateUIForLoggedUser();
    } else {
        console.log('👤 No hay sesión guardada');
        showPublicTab('flights');
    }
};

function loadAllData() {
    const savedFlights = localStorage.getItem('flights');
    if (savedFlights) {
        flights = JSON.parse(savedFlights);
    } else {
        // Vuelos por defecto
        flights = [
            { id: 1, number: 'DM101', airline: 'Dominican Sky', origin: 'Santo Domingo', destination: 'Madrid', departure: '2026-05-12T08:00', arrival: '2026-05-13T09:00', price: 550, seats: 120 },
            { id: 2, number: 'DM202', airline: 'Dominican Sky', origin: 'Santiago', destination: 'New York', departure: '2026-05-13T10:00', arrival: '2026-05-14T10:45', price: 290, seats: 80 },
            { id: 3, number: 'DM303', airline: 'Caribbean Air', origin: 'Santo Domingo', destination: 'Miami', departure: '2026-05-15T14:00', arrival: '2026-05-16T16:30', price: 250, seats: 200 },
            { id: 4, number: 'DM404', airline: 'Dominican Sky', origin: 'Punta Cana', destination: 'Dubai', departure: '2026-05-20T09:00', arrival: '2026-05-21T09:30', price: 480, seats: 60 },
            { id: 5, number: 'DM505', airline: 'Caribbean Air', origin: 'Puerto Plata', destination: 'Medellin', departure: '2026-05-24T11:00', arrival: '2026-05-25T11:45', price: 120, seats: 90 }
        ];
    }
    
    // Cargar usuarios
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Usuarios por defecto - AQUÍ DEBEN ESTAR LOS 3 TIPOS
        users = [
            { id: 1, name: 'Amancio', lastName: 'Lorenzo', email: 'amancio2@gmail.com', password: '123456', type: 'registered', miles: 0 },
            { id: 2, name: 'Ronald', lastName: 'Hache', email: 'ronaldhache@gmail.com', password: '123456', type: 'corporate', miles: 5000 },
            { id: 3, name: 'Carlos', lastName: 'Rodríguez', email: 'agente@gmail.com', password: '123456', type: 'agent', miles: 0 }
        ];
        localStorage.setItem('users', JSON.stringify(users));
        console.log('👥 Usuarios creados por defecto:', users);
    }
    
    // Cargar reservas
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
        reservations = JSON.parse(savedReservations);
        if (reservations.length > 0) {
            nextReservationId = Math.max(...reservations.map(r => r.id)) + 1;
        }
    }
}

function saveAllData() {
    localStorage.setItem('flights', JSON.stringify(flights));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

