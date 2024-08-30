document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizarán
    const barraBusqueda = document.getElementById('barraBusqueda');
    const botonBusqueda = document.getElementById('botonBusqueda');
    const containerStarships = document.getElementById('containerStarships');
    const starshipsDetalles = document.getElementById('starshipsDetalles');
    const paginasTodas = document.querySelector('#paginas .pagination');
    const aplicarFiltros = document.getElementById('aplicarFiltros');

    let starships = [];
    let starshipsMostrados = [];
    let paginaActual = 1;
    const itemsPorPagina = 9;

    async function obtenerStarships(url = 'https://swapi.dev/api/starships/') {
        try {
            let nextUrl = url;
            while (nextUrl) {
                const respuesta = await fetch(nextUrl);
                const data = await respuesta.json();
                starships = starships.concat(data.results);
                nextUrl = data.next ? data.next : null;
            }
            starshipsMostrados = starships;
            mostraStarship();
            crearPaginas();
        } catch (error) {
            console.error('Error al traer los starships:', error);
            containerStarships.innerHTML = '<p class="text-center">Error al cargar los starships. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    }

    function mostraStarship(pagina = 1) {
        containerStarships.innerHTML = '';
        const inicio = (pagina - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const starshipsPorPagina = starshipsMostrados.slice(inicio, fin);

        if (starshipsPorPagina.length === 0) {
            containerStarships.innerHTML = '<p class="text-center">No se encontraron starships.</p>';
            paginasTodas.innerHTML = '';
            return;
        }

        starshipsPorPagina.forEach(starship => {
            const tarjetaStarship = document.createElement('div');
            tarjetaStarship.className = 'col-md-4 mb-4';

            const urlImagen = `https://starwars-visualguide.com/assets/img/starships/${obtenerIdStarship(starship.url)}.jpg`;
            const urlImagenDefault = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';

            tarjetaStarship.innerHTML = `
            <div class="card_starships_tarjeta">
                <img src="${urlImagen}" class="card-img-top" alt="${starship.name}" onerror="this.onerror=null; this.src='${urlImagenDefault}';">
                <div class="card-body">
                    <h5 class="card-title">${starship.name}</h5>
                    <button class="btn btn-primary" data-url="${starship.url}">Ver detalles</button>
                </div>
            </div>
        `;
            containerStarships.appendChild(tarjetaStarship);
        });

        document.querySelectorAll('.starship-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const starshipURL = this.getAttribute('data-url');
                mostrarDetallesStarship(starshipURL);
            });
        });
    }

    function obtenerIdStarship(url) {
        const partes = url.split('/');
        return partes[partes.length - 2];
    }

    function crearPaginas() {
        const totalPaginas = Math.ceil(starshipsMostrados.length / itemsPorPagina);
        paginasTodas.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const itemPagina = document.createElement('li');
            itemPagina.className = `page-item ${i === paginaActual ? 'active' : ''}`;
            itemPagina.innerHTML = `<a class='page-link' href='#'>${i}</a>`;
            paginasTodas.appendChild(itemPagina);

            itemPagina.addEventListener('click', function (e) {
                e.preventDefault();
                paginaActual = i;
                mostraStarship(paginaActual);
                crearPaginas();
            });
        }
    }

    function mostrarDetallesStarship(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                starshipsDetalles.innerHTML = `
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
                const detalleStarshipModal = new bootstrap.Modal(document.getElementById('detalleStarshipModal'));
                detalleStarshipModal.show();
            })
            .catch(error => {
                console.error('Error al mostrar los detalles del starship', error);
                starshipsDetalles.innerHTML = '<p class="text-center">Error al cargar los detalles. Por favor, inténtalo de nuevo más tarde.</p>';
            });
    }

    aplicarFiltros.addEventListener('click', function () {
        const modeloFiltro = document.getElementById('filtroModelo').value.toLowerCase();
        const fabricanteFiltro = document.getElementById('filtroFabricante').value.toLowerCase();
        const costoFiltro = document.getElementById('filtroCosto').value;
        const velocidadFiltro = document.getElementById('filtroVelocidad').value;

        starshipsMostrados = starships.filter(starship => {
            const costoInCredits = parseInt(starship.cost_in_credits) || 0;
            const velocidadMaxima = parseInt(starship.max_atmosphering_speed) || 0;

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
                starship.model.toLowerCase().includes(modeloFiltro) &&
                starship.manufacturer.toLowerCase().includes(fabricanteFiltro) &&
                costoValido &&
                velocidadValida
            );
        });

        paginaActual = 1;
        mostraStarship(paginaActual);
        crearPaginas();
    });

    botonBusqueda.addEventListener('click', function () {
        const query = barraBusqueda.value.toLowerCase();
        starshipsMostrados = starships.filter(starship => starship.name.toLowerCase().includes(query));

        if (starshipsMostrados.length > 0) {
            paginaActual = 1;
            mostraStarship(paginaActual);
            crearPaginas();
        } else {
            containerStarships.innerHTML = '<p class="text-center">No se encontraron starships.</p>';
            paginasTodas.innerHTML = '';
        }
    });

    obtenerStarships(); // Iniciar la obtención de starships al cargar la página
});
