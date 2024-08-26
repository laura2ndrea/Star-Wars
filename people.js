document.addEventListener('DOMContentLoaded', function(){
    // Elementos del DOM que se utilizaran 
    const barraBusqueda = document.getElementById('barraBusqueda'); 
    const botonBusqueda = document.getElementById('botonBusqueda'); 
    const containerPersonajes = document.getElementById('containerPersonajes'); 
    const personajesOverlay = document.getElementById('personajesOverlay'); 
    const personajesDetalles = documentgetElementById('personajesDetalles'); 
    const cerrarOverlay = documentgetElementById('cerrarOverlay'); 
    const paginasTodas = document.getElementById('paginas');

    let personajes = []; // Variable que guarda todos los personajes 
    let personajesMostrados = []; // Variable que guarda los personajes mostrados en la página actual 
    let paginaActual = 1; // Para guardar la página actual
    let itemsPorPagina = 9; // Cantidad de personajes que se mostraran por pagina

    // Función para obtener todos los personajes 
    async function obtenerPersonajes(url = 'https://swapi.dev/api/people/') {
        try {
            const respuesta = await fetch(url); // peticion a la API y guarda la respuesta
            const data = await respuesta.json(); // guarda los datos si la respuesta fue positiva y los convierte en un objeto json 
            personajes = personajes.concat(data.results); // agrega todos los personajes de la API a la lista personajes

            // Recorro todas las páginas hasta obtener todos los personajes
            if(data.next){
                obtenerPersonajes(data.next); 
            } 
            else {
                personajesMostrados = personajes; // para mostrar todos los personajes
                mostrarPersonajes(); 
                crearPaginas(); 
            }
        } catch(error){
            console.error('Error al traer los personajes:', error); 
        }
    }
})

function mostrarPersonajes(pagina = 1){
    containerPersonajes.innerHTML = ''; // limpia el contenido del contenedor; 
    const inicio = (pagina - 1) * itemsPorPagina; // determina desde que indice de la lista personajesMostrados se debe comenzar a mostrar los personajes
    const fin = inicio + itemsPorPagina; // determina hasta que indice se mostraran los personajes 
    const personajesPorPagina = personajesMostrados.slice(start, end); // guardo los personajes que se mostraran en la pagina actual 
    // Itera sobre cada elemento de la lista y crea una tarjeta para cada personaje 
    personajesPorPagina.forEach(personaje => {
        const tarjetaPersonaje = document.createElement('div'); 
        tarjetaPersonaje.className = 'col-md-4 mb-4'; 
        characterCard.innerHTML = `
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
    // Agrega los event listers a cada boton (en las tarjetas de los personajes)
    document.querySelectorAll('.personaje-tarjeta button').forEach(button => {
        button.addEventListener('click', function(){
            const personajeURL = this.getAtributte('data-url'); 
            mostrarPersonajes(personajeURL); 
        })
    })

    // Funcion para obtener el ID del personaje 
    function obtenerIdPersonaje(url){
        const partes = url.split('/'); 
        return partes[partes.length - 2]; 
    }

    // Función para crear las páginas necesarias para mostrar los personajes 
    function crearPaginas(){
        const totalPaginas = Math.ceil(personajesMostrados / itemsPorPagina); 
        paginasTodas.innerHTML = ''; 

        for (let i = 1; i <= totalPaginas; i++){
            const itemPagina = document.createElement('li'); 
            itemPagina.className = `item - pagina ${i === paginaActual ? 'active': ''}`; 
            itemPagina.innerHTML = `<a class = 'link - pagina' href = '#'>${i}</a>`; 
            paginasTodas.appendChild(itemPagina); 
        }
    }
}



/*


   

    function createPagination() {
        const totalPages = Math.ceil(displayedCharacters.length / itemsPerPage);
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pagination.appendChild(pageItem);

            pageItem.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                displayCharacters(currentPage);
            });
        }
    }

    function fetchCharacterDetails(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                characterDetails.innerHTML = `
                    <h2>${data.name}</h2>
                    <p><strong>Altura:</strong> ${data.height} cm</p>
                    <p><strong>Peso:</strong> ${data.mass} kg</p>
                    <p><strong>Color de cabello:</strong> ${data.hair_color}</p>
                    <p><strong>Color de piel:</strong> ${data.skin_color}</p>
                    <p><strong>Color de ojos:</strong> ${data.eye_color}</p>
                    <p><strong>Año de nacimiento:</strong> ${data.birth_year}</p>
                    <p><strong>Género:</strong> ${data.gender}</p>
                `;
                characterOverlay.style.display = 'flex';
            })
            .catch(error => console.error('Error fetching character details:', error));
    }

    closeOverlay.addEventListener('click', function() {
        characterOverlay.style.display = 'none';
    });

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        displayedCharacters = allCharacters.filter(character => character.name.toLowerCase().includes(query));

        if (displayedCharacters.length > 0) {
            currentPage = 1; // Reset to first page
            displayCharacters(currentPage);
            createPagination();
        } else {
            charactersContainer.innerHTML = '<p class="text-center">No se encontraron personajes</p>';
            pagination.innerHTML = ''; // Clear pagination if no results
        }
    });

    fetchAllCharacters();
});*/