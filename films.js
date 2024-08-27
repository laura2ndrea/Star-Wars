/*document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizarán
    const barraBusqueda = document.getElementById('barraBusqueda');
    const botonBusqueda = document.getElementById('botonBusqueda');
    const containerPersonajes = document.getElementById('containerPersonajes');
    const personajesOverlay = document.getElementById('personajesOverlay');
    const personajesDetalles = document.getElementById('personajesDetalles');
    const cerrarOverlay = document.getElementById('cerrarOverlay');
    const paginasTodas = document.getElementById('paginas');

    let peliculas = []; // Variable que guarda todos los peliculas 
    let peliculasMostradas = []; // Variable que guarda los peliculas mostrados en la página actual 
    let paginaActual = 1; // Para guardar la página actual
    let itemsPorPagina = 9; // Cantidad de peliculas que se mostrarán por página

    // Función para obtener todos los peliculas 
    async function obtenerPeliculas(url = 'https://swapi.dev/api/films/') {
        try {
            const respuesta = await fetch(url); // petición a la API y guarda la respuesta
            const data = await respuesta.json(); // guarda los datos si la respuesta fue positiva y los convierte en un objeto json 
            peliculas = peliculas.concat(data.results); // agrega todos los peliculas de la API a la lista peliculas

            // Recorro todas las páginas hasta obtener todos los peliculas
            if (data.next) {
                obtenerPeliculas(data.next);
            } else {
                peliculasMostradas = peliculas; // para mostrar todos los peliculas
                mostrarPeliculas();
                crearPaginas();
            }
        } catch (error) {
            console.error('Error al traer los peliculas:', error);
        }
    }

    function mostrarPeliculas(pagina = 1) {
        containerPersonajes.innerHTML = ''; // limpia el contenido del contenedor; 
        const inicio = (pagina - 1) * itemsPorPagina; // determina desde qué índice de la lista peliculasMostradas se debe comenzar a mostrar los peliculas
        const fin = inicio + itemsPorPagina; // determina hasta qué índice se mostrarán los peliculas 
        const personajesPorPagina = peliculasMostradas.slice(inicio, fin); // guardo los peliculas que se mostrarán en la página actual 

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

        // Agrega los event listeners a cada botón (en las tarjetas de los peliculas)
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

    // Función para crear las páginas necesarias para mostrar los peliculas 
    function crearPaginas() {
        const totalPaginas = Math.ceil(peliculasMostradas.length / itemsPorPagina);
        paginasTodas.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const itemPagina = document.createElement('li');
            itemPagina.className = `item-pagina ${i === paginaActual ? 'active' : ''}`;
            itemPagina.innerHTML = `<a class='link-pagina' href='#'>${i}</a>`;
            paginasTodas.appendChild(itemPagina);

            itemPagina.addEventListener('click', function (e) {
                e.preventDefault();
                paginaActual = i;
                mostrarPeliculas(paginaActual);
                crearPaginas(); // Para actualizar la clase active en la paginación
            });
        }
    }

    /*function mostrarDetallesPersonajes(url) {
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
        peliculasMostradas = peliculas.filter(personaje => personaje.name.toLowerCase().includes(query));

        if (peliculasMostradas.length > 0) {
            paginaActual = 1;
            mostrarPeliculas(paginaActual);
            crearPaginas();
        } else {
            containerPersonajes.innerHTML = '<p class="text-center">No characters found</p>';
            paginasTodas.innerHTML = '';
        }
    });

    obtenerPeliculas();
});*/

document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizarán
    const barraBusqueda = document.getElementById('barraBusqueda');
    const botonBusqueda = document.getElementById('botonBusqueda');
    const containerPeliculas = document.getElementById('containerPeliculas');
    const peliculasOverlay = document.getElementById('peliculasOverlay');
    const peliculasDetalles = document.getElementById('peliculasDetalles');
    const cerrarOverlay = document.getElementById('cerrarOverlay');
    const paginasTodas = document.getElementById('paginas');

    let peliculas = []; // Lista de películas
    let peliculasMostradas = []; // Películas mostradas en la página actual
    let paginaActual = 1; // Página actual
    let itemsPorPagina = 9; // Cantidad de películas por página

    // Función para obtener todas las películas
    async function obtenerPeliculas(url = 'https://swapi.dev/api/films/') {
        try {
            const respuesta = await fetch(url); // petición a la API y guarda la respuesta
            const data = await respuesta.json(); // guarda los datos si la respuesta fue positiva y los convierte en un objeto JSON
            peliculas = peliculas.concat(data.results); // agrega todas las películas de la API a la lista películas

            // Recorre todas las páginas hasta obtener todas las películas
            if (data.next) {
                obtenerPeliculas(data.next);
            } else {
                peliculasMostradas = peliculas; // para mostrar todas las películas
                mostrarPeliculas();
                crearPaginas();
            }
        } catch (error) {
            console.error('Error al traer las películas:', error);
        }
    }

    // Función para mostrar las películas en la página actual
    function mostrarPeliculas(pagina = 1) {
        containerPeliculas.innerHTML = ''; // limpia el contenido del contenedor
        const inicio = (pagina - 1) * itemsPorPagina; // determina desde qué índice de la lista peliculasMostradas se debe comenzar a mostrar las películas
        const fin = inicio + itemsPorPagina; // determina hasta qué índice se mostrarán las películas
        const peliculasPorPagina = peliculasMostradas.slice(inicio, fin); // guardo las películas que se mostrarán en la página actual

        // Itera sobre cada elemento de la lista y crea una tarjeta para cada película
        peliculasPorPagina.forEach(pelicula => {
            const tarjetaPelicula = document.createElement('div');
            tarjetaPelicula.className = 'col-md-4 mb-4';
            tarjetaPelicula.innerHTML = `
                <div class="card pelicula-tarjeta">
                    <img src="https://starwars-visualguide.com/assets/img/films/${obtenerIdPelicula(pelicula.url)}.jpg" class="card-img-top" alt="${pelicula.title}">
                    <div class="card-body">
                        <h5 class="card-title">${pelicula.title}</h5>
                        <button class="btn btn-primary" data-url="${pelicula.url}">Ver Detalles</button>
                    </div>
                </div>
            `;
            containerPeliculas.appendChild(tarjetaPelicula);
        });

        // Agrega los event listeners a cada botón (en las tarjetas de las películas)
        document.querySelectorAll('.pelicula-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const peliculaURL = this.getAttribute('data-url');
                mostrarDetallesPelicula(peliculaURL);
            });
        });
    }

    // Función para obtener el ID de la película
    function obtenerIdPelicula(url) {
        const partes = url.split('/');
        return partes[partes.length - 2];
    }

    // Función para crear las páginas necesarias para mostrar las películas
    function crearPaginas() {
        const totalPaginas = Math.ceil(peliculasMostradas.length / itemsPorPagina);
        paginasTodas.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const itemPagina = document.createElement('li');
            itemPagina.className = `item-pagina ${i === paginaActual ? 'active' : ''}`;
            itemPagina.innerHTML = `<a class='link-pagina' href='#'>${i}</a>`;
            paginasTodas.appendChild(itemPagina);

            itemPagina.addEventListener('click', function (e) {
                e.preventDefault();
                paginaActual = i;
                mostrarPeliculas(paginaActual);
                crearPaginas(); // Para actualizar la clase active en la paginación
            });
        }
    }

    // Función para mostrar los detalles de una película
    function mostrarDetallesPelicula(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                peliculasDetalles.innerHTML = `
                    <h2>${data.title}</h2>
                    <p><strong>Director:</strong> ${data.director}</p>
                    <p><strong>Producer:</strong> ${data.producer}</p>
                    <p><strong>Release Date:</strong> ${data.release_date}</p>
                    <p><strong>Episode:</strong> ${data.episode_id}</p>
                    <p><strong>Opening Crawl:</strong> ${data.opening_crawl}</p>
                `;
                peliculasOverlay.style.display = 'flex';
            })
            .catch(error => console.error('Error al mostrar los detalles de la película', error));
    }

    cerrarOverlay.addEventListener('click', function () {
        peliculasOverlay.style.display = 'none';
    });

    botonBusqueda.addEventListener('click', function () {
        const query = barraBusqueda.value.toLowerCase();
        peliculasMostradas = peliculas.filter(pelicula => pelicula.title.toLowerCase().includes(query));

        if (peliculasMostradas.length > 0) {
            paginaActual = 1;
            mostrarPeliculas(paginaActual);
            crearPaginas();
        } else {
            containerPeliculas.innerHTML = '<p class="text-center">No movies found</p>';
            paginasTodas.innerHTML = '';
        }
    });

    obtenerPeliculas();
});
