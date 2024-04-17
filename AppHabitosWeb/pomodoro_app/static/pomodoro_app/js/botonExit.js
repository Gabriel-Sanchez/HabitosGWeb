

    console.log('pantalla --------------------')
    let botonExpandir = document.getElementById('Pantalla_completa')
 
    let = LaPantallaEstaCompleta = false

    let pantalla = document.getElementById('pom')

    function pantalla_c(){
        console.log('pantalla --------------------')
        if (!LaPantallaEstaCompleta ) {
           
            
        if (pantalla.webkitRequestFullscreen){
            pantalla.webkitRequestFullscreen()
            console.log('este1')
            LaPantallaEstaCompleta = true
        } else if (pantalla.requestFullscreen){
            pantalla.requestFullscreen()
            LaPantallaEstaCompleta = true
        }

        navigator.wakeLock.request('screen').then(()=> {
            console.log('activado')
        }).catch((error)=> {
            console.log('pos no')
        })
        botonExpandir.innerHTML  = '<i class="material-icons">fullscreen_exit</i>';
    } else {
        if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
            console.log('EXTI1')
        } else if ( document.exitFullscreen){
            document.exitFullscreen()
            console.log('EXTI')
        }
        console.log('intenta')
        LaPantallaEstaCompleta = false
        navigator.wakeLock.release().then(()=> {

            console.log('wake liverado')
        })

        botonExpandir.innerHTML  = '<i class="material-icons">fullscreen</i>';

    }
    }

