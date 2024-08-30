document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizaran 
    const barraBusqueda = document.getElementById('barraBusqueda'); // Input para buscar personajes
    const botonBusqueda = document.getElementById('botonBusqueda'); // Botón para iniciar la búsqueda
    const containerPersonajes = document.getElementById('containerPersonajes'); // Contenedor donde se muestran las tarjetas
    const personajesDetalles = document.getElementById('personajesDetalles'); // Contenedor para mostrar los detalles de los personajes
    const paginasTodas = document.querySelector('#paginas .pagination'); // Contenedor para las páginas
    const aplicarFiltros = document.getElementById('aplicarFiltros'); // Botón para aplicar los filtros 

    let personajes = []; // Array para almacenar los datos desde el API
    let personajesMostrados = []; // Array para guardar los datos que se muestran
    let paginaActual = 1; //Pagina actual de todas las páginas 
    let itemsPorPagina = 9; // Número de personajes mostrados por página 

    // Función para obtener todos los personajes desde la API 
    async function obtenerPersonajes(url = 'https://swapi.dev/api/people/') {
        try {
            const respuesta = await fetch(url); // Obtengo los datos de la API
            const data = await respuesta.json(); // Se convierten en JSON 
            personajes = personajes.concat(data.results); // Se van guardando los personajes en el array

            if (data.next) {
                await obtenerPersonajes(data.next); // En caso de hacer mas páginas llamar recursivamente a la función
            } else {
                personajesMostrados = personajes; // Cuando se obtiene todos los personajes, se guardan en el array de los personajes a mostrar 
                mostrarPersonajes(); // Función que muestra los personajes en la página 
                crearPaginas(); // Función que crea los controles de paginación
            }
        } catch (error) {
            console.error('Error al traer los personajes:', error); // Manejo de errores en caso de alguna falla 
        }
    }

    function mostrarPersonajes(pagina = 1) {
        containerPersonajes.innerHTML = ''; // Limpia el contenedor de personajes
        const inicio = (pagina - 1) * itemsPorPagina; // Calcula el indice de inicio para la página actual  
        const fin = inicio + itemsPorPagina; // Calcula el indice final de la página actual 
        const personajesPorPagina = personajesMostrados.slice(inicio, fin); // Obtiene los personajes para la página actual 

        personajesPorPagina.forEach(personaje => {
            const tarjetaPersonaje = document.createElement('div'); // Crea un div para la tarjeta del personaje
            tarjetaPersonaje.className = 'col-md-4 mb-4'; // Aplica la clase de Bootstrap para el diseño de la tarjeta

            // ID del personaje para la URL de la imagen
            const idPersonaje = obtenerIdPersonaje(personaje.url);
            const urlImagen = `https://starwars-visualguide.com/assets/img/characters/${idPersonaje}.jpg`;
            const urlImagenDefault = 'https://starwars-visualguide.com/assets/img/placeholder.jpg'; // URL de la imagen por defecto

            tarjetaPersonaje.innerHTML = `
            <div class="card personaje-tarjeta">
                <img src="${urlImagen}" class="card-img-top" alt="${personaje.name}" onerror="this.onerror=null; this.src='${urlImagenDefault}';">
                <div class="card-body">
                    <h5 class="card-title">${personaje.name}</h5>
                    <button class="btn btn-primary" data-url="${personaje.url}">View details</button>
                </div>
            </div>
        `;
            containerPersonajes.appendChild(tarjetaPersonaje); // Se añade la tarjeta al contenedor de personajes
        });

        // Se añade un evento al hacer clic a cada uno de los botones de las tarjetas de los personajes
        document.querySelectorAll('.personaje-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const personajeURL = this.getAttribute('data-url');
                mostrarDetallesPersonajes(personajeURL); // Se muestran los detalles del personaje al hacer clic
            });
        });
    }

    // Función para extraer el ID del personaje de la URL 
    function obtenerIdPersonaje(url) {
        const partes = url.split('/');
        return partes[partes.length - 2]; // Se retorna el penútimo elemento que es el ID 
    }

    // Función para crear los controles de páginación 
    function crearPaginas() {
        const totalPaginas = Math.ceil(personajesMostrados.length / itemsPorPagina); // Calcula el número total de páginas
        paginasTodas.innerHTML = ''; // Limpia el contenedor de la páginación 

        for (let i = 1; i <= totalPaginas; i++) {
            const itemPagina = document.createElement('li'); // Nuevo elemento de lista para la pagina
            itemPagina.className = `page-item ${i === paginaActual ? 'active' : ''}`; // Aplicar la clave activa a la página actual 
            itemPagina.innerHTML = `<a class='page-link' href='#'>${i}</a>`; // Se crea el enlace para la pagina 
            paginasTodas.appendChild(itemPagina); // Se añade el elemento al contenedor de paginación 

            // Evento de clic al elemento de la lista de la página
            itemPagina.addEventListener('click', function (e) {
                e.preventDefault(); // Previene el comportamiento por defecto del enlace
                paginaActual = i; // Se actualiza la página actual 
                mostrarPersonajes(paginaActual); // Muestra los personajes de la nueva página 
                crearPaginas(); // Actualiza la paginación para reflejar la página actual 
            });
        }
    }

    // Función para mostrar los detalles de los personajes en el modal 
    function mostrarDetallesPersonajes(url) {
        fetch(url)
            .then(response => response.json()) 
            .then(data => {
                personajesDetalles.innerHTML = `
                    <h2>${data.name}</h2>
                    <p><strong>Height:</strong> ${data.height} cm</p>
                    <p><strong>Mass:</strong> ${data.mass} kg</p>
                    <p><strong>Hair color:</strong> ${data.hair_color}</p>
                    <p><strong>Skin color:</strong> ${data.skin_color}</p>
                    <p><strong>Eye color:</strong> ${data.eye_color}</p>
                    <p><strong>Birth year:</strong> ${data.birth_year}</p>
                    <p><strong>Gender:</strong> ${data.gender}</p>
                `;
                const detallePersonajeModal = new bootstrap.Modal(document.getElementById('detallePersonajeModal')); // Instancia del componente modal
                detallePersonajeModal.show(); // Muestra el modal con los detalles del personaje
            })
            .catch(error => console.error('Error al mostrar los detalles del personaje', error)); // Manejo de errores 
    }

    // Evento del boton de busqueda
    botonBusqueda.addEventListener('click', function () {
        const query = barraBusqueda.value.toLowerCase(); // Se obtiene el valor de búsqueda en minuscula
        personajesMostrados = personajes.filter(personaje => personaje.name.toLowerCase().includes(query)); // Se filtran los personajes por nombre

        if (personajesMostrados.length > 0) {
            paginaActual = 1; // Se resetea a la primera página 
            mostrarPersonajes(paginaActual); // Se muestran los personajes filtrados 
            crearPaginas(); // Se crean los controles de paginación 
        } else {
            containerPersonajes.innerHTML = '<p class="text-center text-white">No characters found</p>'; // Mensaje si no se encuentran los personajes
            paginasTodas.innerHTML = ''; // Se limpian los controles de paginación 
        }
    });

    // Evento para el botón de aplicar filtros 
    aplicarFiltros.addEventListener('click', async function () {
        const filtros = document.getElementsByName('filtro'); // Se obtienen todos los filtros 
        let filtro = null;

        // Se determina que filtro esta seleccionado 
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
                    personajesMostrados.push(personaje); // Filtra por genero 
                } else if (["tatooine", "alderaan", "naboo", "human", "droid", "wookie"].includes(filtro)) {
                    switch (filtro) {
                        // Filtra por plnaneta 
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
                        // Filtra por especie 
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

        // Actualiza la vista con los personajes filtrados 
        if (personajesMostrados.length > 0) {
            paginaActual = 1;
            mostrarPersonajes(paginaActual);
            crearPaginas();
        } else {
            containerPersonajes.innerHTML = '<p class="text-center text-white">No characters found</p>'; // En caso de que no se encuentren personajes
            paginasTodas.innerHTML = '';
        }
    });

    obtenerPersonajes(); // Iniciar la obtención de personajes al cargar la página
});
