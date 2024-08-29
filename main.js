const URL='https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_YzDCYYUgq891AmGLVjNN5H5tKToPdPyQTVHNXTt2koJV3ypiQNlpykfiviGfmtQH';

async function LoadCatImage(){
    try{
        const res = await fetch (URL);
        const data = await res.json();

        console.log (data)
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

LoadCatImage();