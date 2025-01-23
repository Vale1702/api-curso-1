const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
  });

api.defaults.headers.common['x-api-key']='live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd';

const URL_RANDOM='https://api.thecatapi.com/v1/images/search?limit=4';

const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';

const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const URL_DELETE = (id) =>`https://api.thecatapi.com/v1/favourites/${id}`;

const spanError = document.getElementById('error')

async function loadRandomMichis() {
    try {
        // Realizamos una solicitud a la API para obtener datos de gatos aleatorios
        const res = await fetch(URL_RANDOM); 
        const data = await res.json(); // Parseamos la respuesta a formato JSON

        console.log('Random', data); // Mostramos los datos obtenidos en la consola para depuración

        // Obtenemos las referencias de las imágenes por sus IDs
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const img4 = document.getElementById('img4');

        // Obtenemos las referencias de los botones por sus IDs
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');
        const btn4 = document.getElementById('btn4');
        
        // Asignamos las URLs de las imágenes obtenidas de la API a los elementos <img>
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;
        img4.src = data[3].url;

        // Asignamos eventos de clic a cada botón para guardar un gato favorito
        // Al hacer clic, se llama a la función saveFavoriteMichi con el ID del gato correspondiente
        btn1.onclick = () => saveFavoriteMichi(data[0].id);
        btn2.onclick = () => saveFavoriteMichi(data[1].id);
        btn3.onclick = () => saveFavoriteMichi(data[2].id);
        btn4.onclick = () => saveFavoriteMichi(data[3].id);

        // Asignamos un evento de clic al botón de recarga para recargar la página
        document.getElementById('reloadButton').onclick = function () {
            location.reload(); // Recargamos la página para obtener nuevos gatos
        };
    } catch (error) {
        // Capturamos e informamos cualquier error que ocurra durante la ejecución
        console.log('Error al obtener la imagen del gato:', error);
    }
}

async function loadFavoriteMichis() {
        const res = await fetch (API_URL_FAVORITES, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key':'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd',
            },
        });
        const data = await res.json();

        if (res.status !== 200) {
            spanError.innerHTML="Hubo un error: "+ res.status + data.message;
        } else{
            const section= document.getElementById('favorite-michis')
            section.innerHTML="";

            const h2 = document.createElement('h2');
            const h2Text = document.createTextNode('Michis Favoritos');
            h2.appendChild(h2Text);
            section.appendChild(h2);

            data.forEach(michi=> {
                const article = document.createElement('article');
                const img = document.createElement('img');
                const btn = document.createElement('button');
                const btntext = document.createTextNode('Quitar de ⭐');
                
                img.src= michi.image.url
                btn.appendChild(btntext);
                btn.onclick = () => deleteFavoriteMichi(michi.id);
                article.appendChild(img);
                article.appendChild(btn);
                section.appendChild(article);
            });
        }
        console.log('Favoritos', data);

    } 


async function saveFavoriteMichi(id) {
    // const res = await fetch(API_URL_FAVORITES, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key':'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd',
    // },
    //   body: JSON.stringify({
    //     image_id: id
    //   }),
    // });
    // const data = await res.json();
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

const fileInput = document.getElementById('file');
const thumbnail = document.getElementById('thumbnail');

// Escuchar el cambio en el input de tipo file para generar la miniatura
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    // Verificar si se seleccionó un archivo
    if (file) {
        // Crear una URL de objeto temporal para mostrar la imagen
        const objectURL = URL.createObjectURL(file);
        thumbnail.src = objectURL;
    }
});

async function uploadMichiFoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'))

    const res = await fetch(API_URL_UPLOAD,{
        method:'POST',
        headers:{
            'x-api-key': 'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd',
        },
        body: formData,
    })
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status + (data.message ? data.message : data);
    } else {
        console.log('Foto de michi subida ');
        console.log({data})
        console.log(data.url)
        saveFavoriteMichi(data.id);
    }
}

loadRandomMichis();    
loadFavoriteMichis();


const id = `${Math.random}`