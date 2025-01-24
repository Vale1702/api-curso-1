const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
  });

api.defaults.headers.common['x-api-key']='live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd';

const URL_RANDOM='https://api.thecatapi.com/v1/images/search?limit=4';

const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';

const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const URL_DELETE = (id) =>`https://api.thecatapi.com/v1/favourites/${id}`;

const spanError = document.getElementById('error')

// Guardar Favoritos

async function saveFavoriteMichi(id) {
    const {data, status} = await api.post('/favourites',{
        image_id: id,
    });

    console.log('Save')
    // console.log(res)
  
    if (status !== 200) {
      spanError.innerHTML = "Hubo un error: " + status + data.message;
    } else {
      console.log('Michi guardado en favoritos')
      loadFavoriteMichis();
    }
  }
//Eliminar Favoritos
async function deleteFavoriteMichi(id) {
    const res = await fetch (URL_DELETE(id), {
        method: 'DELETE',
        headers:{
            'x-api-key':'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd',
        }
    });
    const data = await res.json();
    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + (data.message ? data.message : data);
    } else {
        console.log('Michi eliminado de favoritos', data);
        loadFavoriteMichis();
    }
}
//Creacion de Cards
function createCatCard(michi, isFavorite = false) {
    const article = document.createElement('article');
    article.classList.add('cat-card');

    const img = document.createElement('img');
    img.src = michi.image ? michi.image.url : michi.url; // Compatibilidad con datos de favoritos y aleatorios
    img.alt = 'Un lindo michi';

    const btn = document.createElement('button');
    btn.classList.add('cat-card__btn');
     // O la lógica que tengas para determinar si es favorito

    if (isFavorite) {
        
        // Si es un favorito, el botón eliminará al michi
        btn.textContent = '❌';
        btn.onclick = () => deleteFavoriteMichi(michi.id);
    } else {
        // Si no es favorito, el botón lo agregará a favoritos
        btn.textContent = '❤️';
        btn.onclick = () => saveFavoriteMichi(michi.id);
    }

    article.appendChild(img);
    article.appendChild(btn);

    return article;
}

//Gatitos Aleatorios
async function loadRandomMichis() {
    try {
        const res = await fetch(URL_RANDOM);
        const data = await res.json();

        console.log('Random', data);

        const section = document.getElementById('random-michis');
        section.innerHTML = ''; // Limpiar contenido previo

        data.forEach(michi => {
            const card = createCatCard(michi);
            section.appendChild(card);
        });

    } catch (error) {
        console.error('Error al obtener la imagen del gato:', error);
        spanError.innerHTML = 'Hubo un error al cargar los michis aleatorios';
    }
}
//Gatitos Favoritos
async function loadFavoriteMichis() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd',
        },
    });
    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`;
    } else {
        const section = document.getElementById('favorite-michis');
        section.innerHTML = ''; // Limpiar contenido previo

        data.forEach(michi => {
            const card = createCatCard(michi, true); // isFavorite = true
            section.appendChild(card);
        });
    }
    console.log('Favoritos', data);
}

// Manejo de miniaturas al cargar imágenes desde un input de tipo file
const fileInput = document.getElementById('file'); // Seleccionamos el input de archivo
const thumbnail = document.getElementById('thumbnail'); // Seleccionamos la imagen de vista previa

fileInput.addEventListener('change', (event) => {
    // Obtenemos el archivo seleccionado
    const file = event.target.files[0]; 

    // Verificamos si se seleccionó un archivo
    if (file) {
        // Creamos una URL de objeto temporal para mostrar la imagen seleccionada
        const objectURL = URL.createObjectURL(file);
        // Asignamos la URL al src de la imagen
        thumbnail.src = objectURL; 
    }
});

async function uploadMichiFoto() {
    // Seleccionamos el formulario de subida
    const form = document.getElementById('uploadingForm'); 
    // Creamos un objeto FormData con los datos del formulario
    const formData = new FormData(form); 

    // Mostramos el archivo seleccionado en la consola
    console.log(formData.get('file')); 

    // Realizamos una solicitud POST a la API para subir la foto
    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': 'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd', // Clave de API para autenticación
        },
        // Enviamos el FormData como cuerpo de la solicitud
        body: formData, 
    });
    // Parseamos la respuesta a JSON
    const data = await res.json(); 

    if (res.status !== 201) {
        // Mostramos el error si ocurre
        spanError.innerHTML = "Hubo un error: " + res.status + (data.message ? data.message : data); 
    } else {
        // Confirmamos que la foto fue subida
        console.log('Foto de michi subida'); 
        // Mostramos los datos obtenidos en la consola
        console.log({ data }); 
        // Mostramos la URL de la imagen subida
        console.log(data.url); 
        // Guardamos la foto subida como favorita
        saveFavoriteMichi(data.id); 
    }
}


// Cargamos los gatos aleatorios y favoritos al inicio
loadRandomMichis();
loadFavoriteMichis();

const id = `${Math.random}`; // Generamos un ID único (aunque no se utiliza en este caso)