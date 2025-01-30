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
// Seleccionamos el input de archivo
const fileInput = document.getElementById('file-input'); 
const previewImg = document.getElementById('previewImg'); 
const uploadBtn = document.querySelector('.btn-upload');
const deleteBtn = document.querySelector(".btn-delete")
const dropArea = document.getElementById('dropArea');

// Manejo de selección de archivo
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    showPreview(file);
});

// Función para mostrar la imagen en la vista previa
function showPreview(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = "inline-block";
            uploadBtn.style.display = "inline-block";
            deleteBtn.style.display = "inline-block";
        };
        reader.readAsDataURL(file);
    }
}

function removePreview(){
    previewImg.src = "";
    previewImg.style.display = "none";
    uploadBtn.style.display = "none";
    deleteBtn.style.display = "none";
    fileInput.value = "";
}

// Manejo de arrastrar y soltar
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");
    const file = event.dataTransfer.files[0];
    fileInput.files = event.dataTransfer.files;
    showPreview(file);
});

async function uploadMichiFoto() {
    const form = document.getElementById('uploadingForm'); 
    const formData = new FormData(form); 

    try {
        const res = await fetch(API_URL_UPLOAD, {
            method: 'POST',
            headers: {
                'x-api-key': 'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd', 
            },
            body: formData, 
        });

        const data = await res.json();

        if (res.status !== 201) {
            console.error("Error al subir: ", res.status, data.message);
        } else {
            console.log('Foto subida exitosamente', data);
            console.log('URL de la imagen subida:', data.url);
            saveFavoriteMichi(data.id);
            removePreview();
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
}


// Cargamos los gatos aleatorios y favoritos al inicio
loadRandomMichis();
loadFavoriteMichis();

const id = `${Math.random}`; // Generamos un ID único (aunque no se utiliza en este caso)