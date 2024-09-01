document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizaran 
    const barraBusqueda = document.getElementById('barraBusqueda'); // Input para buscar especies
    const botonBusqueda = document.getElementById('botonBusqueda'); // Botón para iniciar la búsqueda
    const containerEspecies = document.getElementById('containerEspecies'); // Contenedor donde se muestran las tarjetas
    const especiesDetalles = document.getElementById('especiesDetalles'); // Contenedor para mostrar los detalles de las especies
    const paginasTodas = document.querySelector('#paginas .pagination'); // Contenedor para las páginas
    const aplicarFiltros = document.getElementById('aplicarFiltros'); // Botón para aplicar los filtros 

    let especies = []; // Array para almacenar los datos desde el API
    let especiesMostradas = []; // Array para guardar los datos que se muestran
    let paginaActual = 1; //Pagina actual de todas las páginas 
    let itemsPorPagina = 9; // Número de personajes mostrados por página 

    // Función para obtener todos las especies desde la API 
    async function obtenerEspecies(url = 'https://swapi.dev/api/species/') {
        try {
            const respuesta = await fetch(url); // Obtengo los datos de la API
            const data = await respuesta.json(); // Se convierten en JSON 
            especies = especies.concat(data.results); // Se van guardando las especies en el array

            if (data.next) {
                await obtenerEspecies(data.next); // En caso de hacer mas páginas llamar recursivamente a la función
            } else {
                especiesMostradas = especies; // Cuando se obtiene todos las especies, se guardan en el array de las especies a mostrar 
                mostrarEspecies(); // Función que muestra las especies en la página 
                crearPaginas(); // Función que crea los controles de paginación
            }
        } catch (error) {
            console.error('Error al traer las especies:', error); // Manejo de errores en caso de alguna falla 
        }
    }

    function mostrarEspecies(pagina = 1) {
        containerEspecies.innerHTML = ''; // Limpia el contenedor de especies
        const inicio = (pagina - 1) * itemsPorPagina; // Calcula el indice de inicio para la página actual  
        const fin = inicio + itemsPorPagina; // Calcula el indice final de la página actual 
        const especiesPorPagina = especiesMostradas.slice(inicio, fin); // Obtiene las especies para la página actual 

        especiesPorPagina.forEach(especie => {
            const tarjetaEspecie = document.createElement('div'); // Crea un div para la tarjeta de la especie
            tarjetaEspecie.className = 'col-md-4 mb-4'; // Aplica la clase de Bootstrap para el diseño de la tarjeta

            // ID de la especie para la URL de la imagen
            const idEspecie = obtenerIdEspecie(especie.url);
            const urlImagen = `https://starwars-visualguide.com/assets/img/species/${idEspecie}.jpg`;
            const urlImagenDefault = 'https://starwars-visualguide.com/assets/img/placeholder.jpg'; // URL de la imagen por defecto

            tarjetaEspecie.innerHTML = `
            <div class="card especie-tarjeta">
                <img src="${urlImagen}" class="card-img-top" alt="${especie.name}" onerror="this.onerror=null; this.src='${urlImagenDefault}';">
                <div class="card-body">
                    <h5 class="card-title">${especie.name}</h5>
                    <button class="btn btn-primary" data-url="${especie.url}">View details</button>
                </div>
            </div>
        `;
            containerEspecies.appendChild(tarjetaEspecie); // Se añade la tarjeta al contenedor de especies
        });

        // Se añade un evento al hacer clic a cada uno de los botones de las tarjetas de las especies
        document.querySelectorAll('.especie-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const especieURL = this.getAttribute('data-url');
                mostrarDetallesEspecies(especieURL); // Se muestran los detalles de la especie al hacer clic
            });
        });
    }

    // Función para extraer el ID de la especie de la URL 
    function obtenerIdEspecie(url) {
        const partes = url.split('/');
        return partes[partes.length - 2]; // Se retorna el penútimo elemento que es el ID 
    }

    // Función para crear los controles de páginación 
    function crearPaginas() {
        const totalPaginas = Math.ceil(especiesMostradas.length / itemsPorPagina); // Calcula el número total de páginas
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
                mostrarEspecies(paginaActual); // Muestra las especies de la nueva página 
                crearPaginas(); // Actualiza la paginación para reflejar la página actual 
            });
        }
    }

    // Función para mostrar los detalles de las especies en el modal 
    function mostrarDetallesEspecies(url) {
        fetch(url)
            .then(response => response.json()) 
            .then(data => {
                especiesDetalles.innerHTML = `
                    <h2>${data.name}</h2>
                    <p><strong>Classification:</strong> ${data.classification}</p>
                    <p><strong>Designation:</strong> ${data.designation}</p>
                    <p><strong>Eye colors:</strong> ${data.eye_colors}</p>
                    <p><strong>Hair colors:</strong> ${data.hair_colors}</p>
                    <p><strong>Language:</strong> ${data.language}</p>
                    <p><strong>Skin colors:</strong> ${data.skin_colors}</p>
                    <p><strong>Average lifespan:</strong> ${data.average_lifespan} years</p>
                `;
                const detalleEspecieModal = new bootstrap.Modal(document.getElementById('detalleEspecieModal')); // Instancia del componente modal
                detalleEspecieModal.show(); // Muestra el modal con los detalles de la especie
            })
            .catch(error => console.error('Error al mostrar los detalles de la especie', error)); // Manejo de errores 
    }

    // Evento del boton de busqueda
    botonBusqueda.addEventListener('click', function () {
        const query = barraBusqueda.value.toLowerCase(); // Se obtiene el valor de búsqueda en minuscula
        especiesMostradas = especies.filter(especie => especie.name.toLowerCase().includes(query)); // Se filtran las especies por nombre

        if (especiesMostradas.length > 0) {
            paginaActual = 1; // Se resetea a la primera página 
            mostrarEspecies(paginaActual); // Se muestran las especies filtradas
            crearPaginas(); // Se crean los controles de paginación 
        } else {
            containerEspecies.innerHTML = '<p class="text-center text-white">No species found</p>'; // Mensaje si no se encuentran las especies
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

        // Copia superficial del array especies si no se aplica filtro
        if (filtro === "") {
            especiesMostradas = [...especies];
        } else {
            // Si se aplica un filtro, vacía el array de especies mostradas
            especiesMostradas = [];
            for (let especie of especies) {
                if (especie.classification.toLowerCase().includes(filtro)) {
                    especiesMostradas.push(especie); // Filtra por clasificacion
                } else if (especie.eye_colors.toLowerCase().includes(filtro)){
                    especiesMostradas.push(especie); // Filtra por color de ojos
                } else if (especie.language.toLowerCase().includes(filtro)){
                    especiesMostradas.push(especie); // Filtra por idioma
                }
            }
        }

        // Actualiza la vista con las especies filtradas
        if (especiesMostradas.length > 0) {
            paginaActual = 1;
            mostrarEspecies(paginaActual);
            crearPaginas();
        } else {
            containerEspecies.innerHTML = '<p class="text-center text-white">No species found</p>'; // En caso de que no se encuentren especies
            paginasTodas.innerHTML = '';
        }
    });

    obtenerEspecies(); // Iniciar la obtención de especies al cargar la página
});
