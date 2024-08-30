document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizaran 
    const barraBusqueda = document.getElementById('barraBusqueda'); // Input para buscar personajes
    const botonBusqueda = document.getElementById('botonBusqueda'); // Botón para iniciar la búsqueda
    const containerPlanetas = document.getElementById('containerPlanetas'); // Contenedor donde se muestran las tarjetas
    const planetasDetalles = document.getElementById('planetasDetalles'); // Contenedor para mostrar los detalles de los planetas
    const paginasTodas = document.querySelector('#paginas .pagination'); // Contenedor para las páginas
    const aplicarFiltros = document.getElementById('aplicarFiltros'); // Botón para aplicar los filtros 

    let planetas = []; // Array para almacenar los datos desde el API
    let planetasMostrados = []; // Array para guardar los datos que se muestran
    let paginaActual = 1; //Pagina actual de todas las páginas 
    let itemsPorPagina = 9; // Número de personajes mostrados por página 

    // Función para obtener todos los personajes desde la API 
    async function obtenerPlanetas(url = 'https://swapi.dev/api/planets/') {
        try {
            const respuesta = await fetch(url); // Obtengo los datos de la API
            const data = await respuesta.json(); // Se convierten en JSON 
            planetas = planetas.concat(data.results); // Se van guardando los planetas en el array

            if (data.next) {
                await obtenerPlanetas(data.next); // En caso de hacer mas páginas llamar recursivamente a la función
            } else {
                planetasMostrados = planetas; // Cuando se obtiene todos los planetas, se guardan en el array de los planetas a mostrar 
                mostrarPlanetas(); // Función que muestra los planetas en la página 
                crearPaginas(); // Función que crea los controles de paginación
            }
        } catch (error) {
            console.error('Error al traer los planetas:', error); // Manejo de errores en caso de alguna falla 
        }
    }

    function mostrarPlanetas(pagina = 1) {
        containerPersonajes.innerHTML = ''; // Limpia el contenedor de planetas
        const inicio = (pagina - 1) * itemsPorPagina; // Calcula el indice de inicio para la página actual  
        const fin = inicio + itemsPorPagina; // Calcula el indice final de la página actual 
        const planetasPorPagina = planetasMostrados.slice(inicio, fin); // Obtiene los planetas para la página actual 

        planetasPorPagina.forEach(planeta => {
            const tarjetaPlaneta = document.createElement('div'); // Crea un div para la tarjeta del planeta
            tarjetaPlaneta.className = 'col-md-4 mb-4'; // Aplica la clase de Bootstrap para el diseño de la tarjeta

            // ID del planeta para la URL de la imagen
            const idPlaneta = obtenerIdPlaneta(planeta.url);
            const urlImagen = `https://starwars-visualguide.com/assets/img/planets/${idPlaneta}.jpg`;
            const urlImagenDefault = 'https://starwars-visualguide.com/assets/img/placeholder.jpg'; // URL de la imagen por defecto

            tarjetaPlaneta.innerHTML = `
            <div class="card planeta-tarjeta">
                <img src="${urlImagen}" class="card-img-top" alt="${planeta.name}" onerror="this.onerror=null; this.src='${urlImagenDefault}';">
                <div class="card-body">
                    <h5 class="card-title">${planeta.name}</h5>
                    <button class="btn btn-primary" data-url="${planeta.url}">View details</button>
                </div>
            </div>
        `;
            containerPlanetas.appendChild(tarjetaPlaneta); // Se añade la tarjeta al contenedor de planetas
        });

        // Se añade un evento al hacer clic a cada uno de los botones de las tarjetas de los planetas
        document.querySelectorAll('.planeta-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const planetaURL = this.getAttribute('data-url');
                mostrarDetallesPlanetas(planetaURL); // Se muestran los detalles del planeta al hacer clic
            });
        });
    }

    // Función para extraer el ID del planeta de la URL 
    function obtenerIdPlaneta(url) {
        const partes = url.split('/');
        return partes[partes.length - 2]; // Se retorna el penútimo elemento que es el ID 
    }

    // Función para crear los controles de páginación 
    function crearPaginas() {
        const totalPaginas = Math.ceil(planetasMostrados.length / itemsPorPagina); // Calcula el número total de páginas
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
                mostrarPlanetas(paginaActual); // Muestra los planetas de la nueva página 
                crearPaginas(); // Actualiza la paginación para reflejar la página actual 
            });
        }
    }

    // Función para mostrar los detalles de los planetas en el modal 
    function mostrarDetallesPlanetas(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                planetasDetalles.innerHTML = `
                    <h2>${data.name}</h2>
                    <p><strong>Climate:</strong> ${data.climate}</p>
                    <p><strong>Diameter:</strong> ${data.diameter}</p>
                    <p><strong>Gravity:</strong> ${data.gravity}</p>
                    <p><strong>Population:</strong> ${data.population}</p>
                    <p><strong>Rotation Period:</strong> ${data.rotation_period}</p>
                    <p><strong>Surface Water:</strong> ${data.surface_water}</p>
                    <p><strong>Terrain:</strong> ${data.terrain}</p>
                `;
                const detallePlanetaModal = new bootstrap.Modal(document.getElementById('detallePlanetaModal')); // Instancia del componente modal
                detallePlanetaModal.show(); // Muestra el modal con los detalles del planeta
            })
            .catch(error => console.error('Error al mostrar los detalles del planeta', error)); // Manejo de errores 
    }

    // Evento del boton de busqueda
    botonBusqueda.addEventListener('click', function () {
        const query = barraBusqueda.value.toLowerCase(); // Se obtiene el valor de búsqueda en minuscula
        planetasMostrados = planetas.filter(planeta => planeta.name.toLowerCase().includes(query)); // Se filtran los planetas por nombre

        if (planetasMostrados.length > 0) {
            paginaActual = 1; // Se resetea a la primera página 
            mostrarPlanetas(paginaActual); // Se muestran los planetas filtrados 
            crearPaginas(); // Se crean los controles de paginación 
        } else {
            containerPlanetas.innerHTML = '<p class="text-center text-white">No planets found</p>'; // Mensaje si no se encuentran los planetas
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

        // Copia superficial del array planetas si no se aplica filtro
        if (filtro === "") {
            planetasMostrados = [...planetas];
        } else {
            // Si se aplica un filtro, vacía el array de planetas mostrados
            planetasMostrados = [];

            for (let planeta of planetas) {
                if (planeta.climate.includes(filtro)) {
                    planetasMostrados.push(planeta); // Filtra por clima
                } else if (planeta.terrain.includes(filtro)){
                    planetasMostrados.push(planeta); // Filtra por terreno
                }
                else if (["hope", "jedi", "clones"].includes(filtro)) {
                    switch (filtro) {
                        // Filtra por peliculas
                        case "hope":
                            planeta.films.forEach(url => {
                                if (url === "https://swapi.dev/api/films/1/") {
                                    planetasMostrados.push(planeta);
                                }
                            })
                            break;
                        case "jedi":
                            planeta.films.forEach(url => {
                                if (url === "https://swapi.dev/api/films/3/") {
                                    planetasMostrados.push(planeta);
                                }
                            })
                            break;
                        case "clones":
                            planeta.films.forEach(url => {
                                if (url === "https://swapi.dev/api/films/5/") {
                                    planetasMostrados.push(planeta);
                                }
                            })
                            break;
                    }
                }
            }
        }

        // Actualiza la vista con los planetas filtrados 
        if (planetasMostrados.length > 0) {
            paginaActual = 1;
            mostrarPlanetas(paginaActual);
            crearPaginas();
        } else {
            containerPlanetas.innerHTML = '<p class="text-center text-white">No planets found</p>'; // En caso de que no se encuentren planetas
            paginasTodas.innerHTML = '';
        }
    });

    obtenerPlanetas(); // Iniciar la obtención de planetas al cargar la página
});
