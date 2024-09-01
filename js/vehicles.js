document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizarán
    const barraBusqueda = document.getElementById('barraBusqueda');
    const botonBusqueda = document.getElementById('botonBusqueda');
    const containerVehicles = document.getElementById('containerVehicles');
    const vehiclesDetalles = document.getElementById('vehiclesDetalles');
    const paginasTodas = document.querySelector('#paginas .pagination');
    const aplicarFiltros = document.getElementById('aplicarFiltros');

    let vehicles = [];
    let vehiclesMostrados = [];
    let paginaActual = 1;
    const itemsPorPagina = 9;

    async function obtenerVehicles(url = 'https://swapi.dev/api/vehicles/') {
        try {
            let nextUrl = url;
            while (nextUrl) {
                const respuesta = await fetch(nextUrl);
                const data = await respuesta.json();
                vehicles = vehicles.concat(data.results);
                nextUrl = data.next ? data.next : null;
            }
            vehiclesMostrados = vehicles;
            mostrarVehicles();
            crearPaginas();
        } catch (error) {
            console.error('Error al traer los vehículos:', error);
            containerVehicles.innerHTML = '<p class="text-center">Error loading details. Please try again later</p>';
        }
    }

    function mostrarVehicles(pagina = 1) {
        containerVehicles.innerHTML = '';
        const inicio = (pagina - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const vehiclesPorPagina = vehiclesMostrados.slice(inicio, fin);

        if (vehiclesPorPagina.length === 0) {
            containerVehicles.innerHTML = '<p class="text-center">No vehicles found</p>';
            paginasTodas.innerHTML = '';
            return;
        }

        vehiclesPorPagina.forEach(vehicle => {
            const tarjetaVehicles = document.createElement('div');
            tarjetaVehicles.className = 'col-md-4 mb-4';

            // La URL de la imagen puede no estar disponible en la API, así que usa una imagen predeterminada
            const urlImagen = `https://starwars-visualguide.com/assets/img/vehicles/${obtenerIdVehicle(vehicle.url)}.jpg`;
            const urlImagenDefault = '../recursos/no-imagen.png'; // URL de la imagen por defecto

            tarjetaVehicles.innerHTML = `
            <div class="card vehicle-tarjeta">
                <img src="${urlImagen}" class="card-img-top" alt="${vehicle.name}" onerror="this.onerror=null; this.src='${urlImagenDefault}';">
                <div class="card-body">
                    <h5 class="card-title">${vehicle.name}</h5>
                    <button class="btn btn-primary" data-url="${vehicle.url}">View details</button>
                </div>
            </div>
        `;
            containerVehicles.appendChild(tarjetaVehicles);
        });

        document.querySelectorAll('.vehicle-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const vehicleURL = this.getAttribute('data-url');
                mostrarDetallesVehicle(vehicleURL);
            });
        });
    }

    function obtenerIdVehicle(url) {
        const partes = url.split('/');
        return partes[partes.length - 2];
    }

    function crearPaginas() {
        const totalPaginas = Math.ceil(vehiclesMostrados.length / itemsPorPagina);
        paginasTodas.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const itemPagina = document.createElement('li');
            itemPagina.className = `page-item ${i === paginaActual ? 'active' : ''}`;
            itemPagina.innerHTML = `<a class='page-link' href='#'>${i}</a>`;
            paginasTodas.appendChild(itemPagina);

            itemPagina.addEventListener('click', function (e) {
                e.preventDefault();
                paginaActual = i;
                mostrarVehicles(paginaActual);
                crearPaginas();
            });
        }
    }

    function mostrarDetallesVehicle(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                vehiclesDetalles.innerHTML = `
                    <h2>${data.name}</h2>
                    <p><strong>Model:</strong> ${data.model}</p>
                    <p><strong>Manufacturer:</strong> ${data.manufacturer}</p>
                    <p><strong>Cost in Credits:</strong> ${data.cost_in_credits}</p>
                    <p><strong>Length:</strong> ${data.length}</p>
                    <p><strong>Crew:</strong> ${data.crew}</p>
                    <p><strong>Passengers:</strong> ${data.passengers}</p>
                    <p><strong>Max Atmosphering Speed:</strong> ${data.max_atmosphering_speed}</p>
                    <p><strong>Cargo Capacity:</strong> ${data.cargo_capacity}</p>
                    <p><strong>Consumables:</strong> ${data.consumables}</p>
                `;
                const detalleVehicleModal = new bootstrap.Modal(document.getElementById('detalleVehicleModal'));
                detalleVehicleModal.show();
            })
            .catch(error => {
                console.error('Error displaying vehicle details', error);
                vehiclesDetalles.innerHTML = '<p class="text-center">Error loading details. Please try again later.</p>';
            });
    }

    aplicarFiltros.addEventListener('click', function () {
        const modeloFiltro = document.getElementById('filtroModelo').value.toLowerCase();
        const fabricanteFiltro = document.getElementById('filtroFabricante').value.toLowerCase();
        const costoFiltro = document.getElementById('filtroCosto').value;
        const velocidadFiltro = document.getElementById('filtroVelocidad').value;

        vehiclesMostrados = vehicles.filter(vehicle => {
            const costoInCredits = parseInt(vehicle.cost_in_credits) || 0;
            const velocidadMaxima = parseInt(vehicle.max_atmosphering_speed) || 0;

            let costoValido = true;
            if (costoFiltro) {
                const [minCosto, maxCosto] = costoFiltro.split('-').map(Number);
                costoValido = (maxCosto ? costoInCredits <= maxCosto : costoInCredits >= minCosto) && (minCosto ? costoInCredits >= minCosto : true);
            }

            let velocidadValida = true;
            if (velocidadFiltro) {
                const [minVelocidad, maxVelocidad] = velocidadFiltro.split('-').map(Number);
                velocidadValida = (maxVelocidad ? velocidadMaxima <= maxVelocidad : velocidadMaxima >= minVelocidad) && (minVelocidad ? velocidadMaxima >= minVelocidad : true);
            }

            return (
                vehicle.model.toLowerCase().includes(modeloFiltro) &&
                vehicle.manufacturer.toLowerCase().includes(fabricanteFiltro) &&
                costoValido &&
                velocidadValida
            );
        });

        paginaActual = 1;
        mostrarVehicles(paginaActual);
        crearPaginas();
    });

    botonBusqueda.addEventListener('click', function () {
        const query = barraBusqueda.value.toLowerCase();
        vehiclesMostrados = vehicles.filter(vehicle => vehicle.name.toLowerCase().includes(query));

        if (vehiclesMostrados.length > 0) {
            paginaActual = 1;
            mostrarVehicles(paginaActual);
            crearPaginas();
        } else {
            containerVehicles.innerHTML = '<p class="text-center">No vehicles found</p>';
            paginasTodas.innerHTML = '';
        }
    });

    obtenerVehicles(); // Iniciar la obtención de vehículos al cargar la página
});