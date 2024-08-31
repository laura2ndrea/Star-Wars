document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM que se utilizarán
    const barraBusqueda = document.getElementById('barraBusqueda');
    const botonBusqueda = document.getElementById('botonBusqueda');
    const containerPeliculas = document.getElementById('containerPeliculas');
    const peliculasDetalles = document.getElementById('peliculasDetalles');
    const paginasTodas = document.querySelector('#paginas .pagination');
    const aplicarFiltros = document.getElementById('aplicarFiltros');

    let peliculas = [];
    let peliculasMostradas = [];
    let paginaActual = 1;
    let itemsPorPagina = 9;

    async function obtenerPeliculas(url = 'https://swapi.dev/api/films/') {
        try {
            let nextUrl = url;
            while (nextUrl) {
                const respuesta = await fetch(nextUrl);
                const data = await respuesta.json();
                peliculas = peliculas.concat(data.results);
                nextUrl = data.next ? data.next : null;
            }
            peliculasMostradas = peliculas;
            mostrarPeliculas();
            crearPaginas();
        } catch (error) {
            console.error('Error al traer las películas:', error);
            containerPeliculas.innerHTML = '<p class="text-center">Error loading films. Please try again later.</p>';
        }
    }

    function mostrarPeliculas(pagina = 1) {
        containerPeliculas.innerHTML = '';
        const inicio = (pagina - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const peliculasPorPagina = peliculasMostradas.slice(inicio, fin);

        peliculasPorPagina.forEach(pelicula => {
            const tarjetaPelicula = document.createElement('div');
            tarjetaPelicula.className = 'col-md-4 mb-4';

            const urlImagen = `https://starwars-visualguide.com/assets/img/films/${obtenerIdPelicula(pelicula.url)}.jpg`;
            const urlImagenDefault = 'https://starwars-visualguide.com/assets/img/placeholder.jpg'; // URL de la imagen por defecto

            tarjetaPelicula.innerHTML = `
            <div class="card_pelicula_tarjeta">
                <img src="${urlImagen}" class="card-img-top" alt="${pelicula.title}" onerror="this.onerror=null; this.src='${urlImagenDefault}';">
                <div class="card-body">
                    <h5 class="card-title">${pelicula.title}</h5>
                    <button class="btn btn-primary" data-url="${pelicula.url}">See Details</button>
                </div>
            </div>
        `;
            containerPeliculas.appendChild(tarjetaPelicula);
        });

        document.querySelectorAll('.pelicula-tarjeta button').forEach(button => {
            button.addEventListener('click', function () {
                const peliculaURL = this.getAttribute('data-url');
                mostrarDetallesPelicula(peliculaURL);
            });
        });
    }

    function obtenerIdPelicula(url) {
        const partes = url.split('/');
        return partes[partes.length - 2];
    }

    function crearPaginas() {
        const totalPaginas = Math.ceil(peliculasMostradas.length / itemsPorPagina);
        paginasTodas.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const itemPagina = document.createElement('li');
            itemPagina.className = `page-item ${i === paginaActual ? 'active' : ''}`;
            itemPagina.innerHTML = `<a class='page-link' href='#'>${i}</a>`;
            paginasTodas.appendChild(itemPagina);

            itemPagina.addEventListener('click', function (e) {
                e.preventDefault();
                paginaActual = i;
                mostrarPeliculas(paginaActual);
                crearPaginas();
            });
        }
    }

    function mostrarDetallesPelicula(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                peliculasDetalles.innerHTML = `
                    <h2>${data.title}</h2>
                    <p><strong>Episode:</strong> ${data.episode_id}</p>
                    <p><strong>Director:</strong> ${data.director}</p>
                    <p><strong>Producer:</strong> ${data.producer}</p>
                    <p><strong>Release Date:</strong> ${data.release_date}</p>
                    <p><strong>Opening Crawl:</strong> ${data.opening_crawl}</p>
                `;
                const detallePeliculaModal = new bootstrap.Modal(document.getElementById('detallePeliculaModal'));
                detallePeliculaModal.show();
            })
            .catch(error => {
                console.error('Error al mostrar los detalles de la película', error);
                peliculasDetalles.innerHTML = '<p class="text-center">Error loading details. Please try again later.</p>';
            });
    }

    botonBusqueda.addEventListener('click', function () {
        const query = barraBusqueda.value.toLowerCase();
        peliculasMostradas = peliculas.filter(pelicula => pelicula.title.toLowerCase().includes(query));

        if (peliculasMostradas.length > 0) {
            paginaActual = 1;
            mostrarPeliculas(paginaActual);
            crearPaginas();
        } else {
            containerPeliculas.innerHTML = '<p class="text-center">No films found.</p>';
            paginasTodas.innerHTML = '';
        }
    });

    aplicarFiltros.addEventListener('click', function () {
        const filtros = document.getElementsByName('filtro');
        let filtroSeleccionado = "";

        for (let i = 0; i < filtros.length; i++) {
            if (filtros[i].checked) {
                filtroSeleccionado = filtros[i].value;
                break;
            }
        }

        if (filtroSeleccionado === "") {
            peliculasMostradas = [...peliculas];
        } else {
            peliculasMostradas = peliculas.filter(pelicula => {
                switch (filtroSeleccionado) {
                    case "original_trilogy":
                        return pelicula.episode_id >= 4 && pelicula.episode_id <= 6; // Ejemplo para trilogía original
                    case "prequel_trilogy":
                        return pelicula.episode_id >= 1 && pelicula.episode_id <= 3; // Ejemplo para trilogía de precuelas
                    case "1900s":
                        return parseInt(pelicula.release_date.split('-')[0]) >= 1900 && parseInt(pelicula.release_date.split('-')[0]) < 2000;
                    case "2000s":
                        return parseInt(pelicula.release_date.split('-')[0]) >= 2000 && parseInt(pelicula.release_date.split('-')[0]) < 2100;
                    default:
                        return true; // Si no hay filtro aplicado
                }
            });
        }

        if (peliculasMostradas.length > 0) {
            paginaActual = 1;
            mostrarPeliculas(paginaActual);
            crearPaginas();
        } else {
            containerPeliculas.innerHTML = '<p class="text-center">No se encontraron películas.</p>';
            paginasTodas.innerHTML = '';
        }
    });

    obtenerPeliculas(); // Iniciar la obtención de películas al cargar la página
});

