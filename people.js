document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizarán
    const barraBusqueda = document.getElementById('barraBusqueda');
    const botonBusqueda = document.getElementById('botonBusqueda');
    const containerPersonajes = document.getElementById('containerPersonajes');
    const personajesOverlay = document.getElementById('personajesOverlay');
    const personajesDetalles = document.getElementById('personajesDetalles');
    const cerrarOverlay = document.getElementById('cerrarOverlay');
    const paginasTodas = document.querySelector('#paginas .pagination');
    const aplicarFiltros = document.getElementById('aplicarFiltros'); // Añadido para el botón de filtros

    let personajes = [];
    let personajesMostrados = [];
    let paginaActual = 1;
    let itemsPorPagina = 9;

    async function obtenerPersonajes(url = 'https://swapi.dev/api/people/') {
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            personajes = personajes.concat(data.results);

            if (data.next) {
                await obtenerPersonajes(data.next); // Esperar a que se resuelva la llamada recursiva
            } else {
                personajesMostrados = personajes;
                mostrarPersonajes();
                crearPaginas();
            }
        } catch (error) {
            console.error('Error al traer los personajes:', error);
        }
    }

    function mostrarPersonajes(pagina = 1) {
        containerPersonajes.innerHTML = '';
        const inicio = (pagina - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const personajesPorPagina = personajesMostrados.slice(inicio, fin);

        personajesPorPagina.forEach(personaje => {
            const tarjetaPersonaje = document.createElement('div');
            tarjetaPersonaje.className = 'col-md-4 mb-4';

            // ID del personaje para la URL de la imagen
            const idPersonaje = obtenerIdPersonaje(personaje.url);
            const urlImagen = `https://starwars-visualguide.com/assets/img/characters/${idPersonaje}.jpg`;
            const urlImagenDefault = 'https://starwars-visualguide.com/assets/img/placeholder.jpg'; // URL de la imagen por defecto

            tarjetaPersonaje.innerHTML = `
            <div class="card personaje-tarjeta">
                <img src="${urlImagen}" class="card-img-top" alt="${personaje.name}" onerror="this.onerror=null; this.src='${urlImagenDefault}';">
                <div class="card-body">
                    <h5 class="card-title">${personaje.name}</h5>
                    <button class="btn btn-primary" data-url="${personaje.url}">Ver Detalles</button>
                </div>
            </div>
        `;
            containerPersonajes.appendChild(tarjetaPersonaje);
        });

        document.querySelectorAll('.personaje-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const personajeURL = this.getAttribute('data-url');
                mostrarDetallesPersonajes(personajeURL);
            });
        });
    }

    function obtenerIdPersonaje(url) {
        const partes = url.split('/');
        return partes[partes.length - 2];
    }

    function crearPaginas() {
        const totalPaginas = Math.ceil(personajesMostrados.length / itemsPorPagina);
        paginasTodas.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const itemPagina = document.createElement('li');
            itemPagina.className = `page-item ${i === paginaActual ? 'active' : ''}`;
            itemPagina.innerHTML = `<a class='page-link' href='#'>${i}</a>`;
            paginasTodas.appendChild(itemPagina);

            itemPagina.addEventListener('click', function (e) {
                e.preventDefault();
                paginaActual = i;
                mostrarPersonajes(paginaActual);
                crearPaginas(); // Para actualizar la clase active en la paginación
            });
        }
    }

    function mostrarDetallesPersonajes(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                personajesDetalles.innerHTML = `
                    <h2>${data.name}</h2>
                    <p><strong>Height:</strong> ${data.height} cm</p>
                    <p><strong>Mass:</strong> ${data.mass} kg</p>
                    <p><strong>Hair Color:</strong> ${data.hair_color}</p>
                    <p><strong>Skin Color:</strong> ${data.skin_color}</p>
                    <p><strong>Eye Color:</strong> ${data.eye_color}</p>
                    <p><strong>Birth Year:</strong> ${data.birth_year}</p>
                    <p><strong>Gender:</strong> ${data.gender}</p>
                `;
                personajesOverlay.style.display = 'flex';
            })
            .catch(error => console.error('Error al mostrar los detalles del personaje', error));
    }

    cerrarOverlay.addEventListener('click', function () {
        personajesOverlay.style.display = 'none';
    });

    botonBusqueda.addEventListener('click', function () {
        const query = barraBusqueda.value.toLowerCase();
        personajesMostrados = personajes.filter(personaje => personaje.name.toLowerCase().includes(query));

        if (personajesMostrados.length > 0) {
            paginaActual = 1;
            mostrarPersonajes(paginaActual);
            crearPaginas();
        } else {
            containerPersonajes.innerHTML = '<p class="text-center">No characters found</p>';
            paginasTodas.innerHTML = '';
        }
    });

    aplicarFiltros.addEventListener('click', async function () {
        const filtros = document.getElementsByName('filtro');
        let filtro = null;

        for (let i = 0; i < filtros.length; i++) {
            if (filtros[i].checked) {
                filtro = filtros[i].value;
            }
        }

        // Copia superficial del array personajes si no se aplica filtro
        if (filtro === "") {
            personajesMostrados = [...personajes];
        } else {
            // Si se aplica un filtro, vacía el array de personajes mostrados
            personajesMostrados = [];

            for (let personaje of personajes) {
                if (filtro === personaje.gender.toLowerCase()) {
                    personajesMostrados.push(personaje);
                } else if (["tatooine", "alderaan", "naboo", "human", "droid", "wookie"].includes(filtro)) {
                    switch (filtro) {
                        case "tatooine":
                            if (personaje.homeworld === "https://swapi.dev/api/planets/1/")
                                personajesMostrados.push(personaje);
                            break;
                        case "alderaan":
                            if (personaje.homeworld === "https://swapi.dev/api/planets/2/")
                                personajesMostrados.push(personaje);
                            break;
                        case "naboo":
                            if (personaje.homeworld === "https://swapi.dev/api/planets/8/")
                                personajesMostrados.push(personaje);
                            break;
                        case "human":
                            personaje.species.forEach(url => {
                                if (url === "https://swapi.dev/api/species/1/") {
                                    personajesMostrados.push(personaje);
                                }
                            })
                            break;
                        case "droid":
                            personaje.species.forEach(url => {
                                if (url === "https://swapi.dev/api/species/2/") {
                                    personajesMostrados.push(personaje);
                                }
                            })
                            break;
                        case "wookie":
                            personaje.species.forEach(url => {
                                if (url === "https://swapi.dev/api/species/3/") {
                                    personajesMostrados.push(personaje);
                                }
                            })
                            break;
                    }
                }
            }
        }

        if (personajesMostrados.length > 0) {
            paginaActual = 1;
            mostrarPersonajes(paginaActual);
            crearPaginas();
        } else {
            containerPersonajes.innerHTML = '<p class="text-center">No characters found</p>';
            paginasTodas.innerHTML = '';
        }
    });

    obtenerPersonajes(); // Iniciar la obtención de personajes al cargar la página
});
