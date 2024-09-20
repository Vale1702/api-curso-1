const URL_RANDOM='https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd';

const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites?&api_key=live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd';

const spanError = document.getElementById('error')
async function loadRandomMichis(){
    try{
        const res = await fetch (URL_RANDOM);
        const data = await res.json();

        console.log ('Random', data)
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        
        img1.src = data [0].url;
        img2.src = data [1].url;
        img3.src = data [2].url;

        document.getElementById('reloadButton').onclick= function(){
        location.reload();
        }
    } catch (error){
        console.log('Error al obtener la imagen del gato:', error);
    }
}

async function loadFavoriteMichis() {
    try {
        const res = await fetch(API_URL_FAVORITES, {
            method: 'GET',
            headers: {
                'x-api-key':'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd',
            }
        });

        // Verificar si la respuesta es exitosa
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();
        console.log('Favoritos', data);

    } catch (error) {
        console.log('Error al obtener la imagen del gato favorito:', error);
    }
}

async function saveFavoriteMichis() {
    const res = await fetch (API_URL_FAVORITES, {
        method: 'POST',
        headers:{
            'x-api-key':'live_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSjdJWd',
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            image_id:'rh'
        }),
    });

    // Verificar el tipo de contenido
    const contentType = res.headers.get('Content-Type');

    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await res.json(); // Si es JSON, lo parseamos
    } else {
        data = await res.text(); // Si es texto, obtenemos el texto
        console.log('Texto plano de la respuesta:', data);
    }

    console.log('Save');
    console.log(res);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + (data.message ? data.message : data);
    }
}

loadRandomMichis();
loadFavoriteMichis();
