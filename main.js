const URL_RANDOM='https://api.thecatapi.com/v1/images/search?limit=3&api_key=en vivo_ JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSj dJWd';

const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=en vivo_JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSj dJWd';

const spanError = document.getElementById('error')
async function loadRandomMichis(){
    try{
        const res = await fetch (URL_RANDOM);
        const data = await res.json();

        console.log ('Random' , data)
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const img4 = document.getElementById('img4');
        
        img1.src = data [0].url;
        img2.src = data [1].url;
        img3.src = data [2].url;
        img4.src = data [3].url;

        document.getElementById('reloadButton').onclick= function(){
        location.reload();
        }
    } catch (error){
        console.log('Error al obtener la imagen del gato:', error);
    }
}

async function loadFavoritesMichis() {
    try {
        const res = await fetch(API_URL_FAVORITES, {
            method: 'GET',
            headers: {
                'x-api-key': 'en vivo_ JhwdQVyHytfX6G94RW69DjvBwpa0PHGqMCvWhDRfWCBbOHu4J0J0R38pNKSj dJWd',
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


loadRandomMichis();
loadFavoritesMichis();