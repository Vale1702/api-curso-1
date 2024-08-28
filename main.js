const URL='https://api.thecatapi.com/v1/images/search?';

async function LoadCatImage(){
    try{
        const rest = await fetch (URL);
        const data = await rest.json();
        const img = document.querySelector('img');
        img.src = data [0].url;
        document.getElementById('reloadButton').onclick= function(){
        location.reload();
        }
    }catch (error){
        console.log('Error al obtener la imagen del gato:', error);
    }
}



LoadCatImage();