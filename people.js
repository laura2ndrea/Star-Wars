document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizarán
    const barraBusqueda = document.getElementById('barraBusqueda');
    const botonBusqueda = document.getElementById('botonBusqueda');
    const containerPersonajes = document.getElementById('containerPersonajes');
    const personajesOverlay = document.getElementById('personajesOverlay');
    const personajesDetalles = document.getElementById('personajesDetalles');
    const cerrarOverlay = document.getElementById('cerrarOverlay');
    const paginasTodas = document.getElementById('paginas');

    let personajes = []; // Variable que guarda todos los personajes 
    let personajesMostrados = []; // Variable que guarda los personajes mostrados en la página actual 
    let paginaActual = 1; // Para guardar la página actual
    let itemsPorPagina = 9; // Cantidad de personajes que se mostrarán por página

    // Función para obtener todos los personajes 
    async function obtenerPersonajes(url = 'https://swapi.dev/api/people/') {
        try {
            const respuesta = await fetch(url); // petición a la API y guarda la respuesta
            const data = await respuesta.json(); // guarda los datos si la respuesta fue positiva y los convierte en un objeto json 
            personajes = personajes.concat(data.results); // agrega todos los personajes de la API a la lista personajes

            // Recorro todas las páginas hasta obtener todos los personajes
            if (data.next) {
                obtenerPersonajes(data.next);
            } else {
                personajesMostrados = personajes; // para mostrar todos los personajes
                mostrarPersonajes();
                crearPaginas();
            }
        } catch (error) {
            console.error('Error al traer los personajes:', error);
        }
    }

    function mostrarPersonajes(pagina = 1) {
        containerPersonajes.innerHTML = ''; // limpia el contenido del contenedor; 
        const inicio = (pagina - 1) * itemsPorPagina; // determina desde qué índice de la lista personajesMostrados se debe comenzar a mostrar los personajes
        const fin = inicio + itemsPorPagina; // determina hasta qué índice se mostrarán los personajes 
        const personajesPorPagina = personajesMostrados.slice(inicio, fin); // guardo los personajes que se mostrarán en la página actual 

        // Itera sobre cada elemento de la lista y crea una tarjeta para cada personaje 
        personajesPorPagina.forEach(personaje => {
            const tarjetaPersonaje = document.createElement('div');
            tarjetaPersonaje.className = 'col-md-4 mb-4';
            tarjetaPersonaje.innerHTML = `
                    <div class="card personaje-tarjeta">
                        <img src="https://starwars-visualguide.com/assets/img/characters/${obtenerIdPersonaje(personaje.url)}.jpg" class="card-img-top" alt="${personaje.name}">
                        <div class="card-body">
                            <h5 class="card-title">${personaje.name}</h5>
                            <button class="btn btn-primary" data-url="${personaje.url}">Ver Detalles</button>
                        </div>
                    </div>
                `;
            containerPersonajes.appendChild(tarjetaPersonaje);
        });

        // Agrega los event listeners a cada botón (en las tarjetas de los personajes)
        document.querySelectorAll('.personaje-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const personajeURL = this.getAttribute('data-url');
                mostrarDetallesPersonajes(personajeURL);
            });
        });
    }

    // Función para obtener el ID del personaje 
    function obtenerIdPersonaje(url) {
        const partes = url.split('/');
        return partes[partes.length - 2];
    }

    // Función para crear las páginas necesarias para mostrar los personajes 
    function crearPaginas() {
        const totalPaginas = Math.ceil(personajesMostrados.length / itemsPorPagina);
        paginasTodas.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const itemPagina = document.createElement('li');
            itemPagina.className = `item-pagina ${i === paginaActual ? 'active' : ''}`;
            itemPagina.innerHTML = `<a class='link-pagina' href='#'>${i}</a>`;
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
        const genero = filtroGenero.value.toLowerCase();
        const planeta = filtroPlaneta.value.toLowerCase();
        const especie = filtroEspecie.value.toLowerCase();

        personajesMostrados = [];

        for (let personaje of personajes) {
            let coincide = true;

            // Filtrar por Género
            if (genero && personaje.gender.toLowerCase() !== genero) {
                coincide = false;
            }

            // Filtrar por Planeta
            if (planeta && coincide) {
                try {
                    const response = await fetch(personaje.homeworld);
                    const data = await response.json();
                    if (data.name.toLowerCase() !== planeta) {
                        coincide = false;
                    }
                } catch (error) {
                    console.error('Error al filtrar por planeta:', error);
                    coincide = false;
                }
            }

            // Filtrar por Especie
            if (especie && coincide) {
                let especieCoincide = false;

                if (personaje.species.length > 0) {
                    try {
                        for (let url of personaje.species) {
                            const response = await fetch(url);
                            const data = await response.json();
                            if (data.name.toLowerCase() === especie) {
                                especieCoincide = true;
                                break;
                            }
                        }

                        if (!especieCoincide) {
                            coincide = false;
                        }
                    } catch (error) {
                        console.error('Error al filtrar por especie:', error);
                        coincide = false;
                    }
                } else {
                    coincide = false; // Si no tiene especies registradas y se filtra por especie
                }
            }

            if (coincide) {
                personajesMostrados.push(personaje);
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

    obtenerPersonajes();
});
