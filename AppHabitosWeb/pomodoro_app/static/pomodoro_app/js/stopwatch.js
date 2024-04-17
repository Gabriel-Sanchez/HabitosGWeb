var ciclos ; 
var tiempoTrabajo ; 
var tiempoDescanso ; 
var ciclos_global 

var objeto_habito
var inicio_pom = false

var corriendo = false;
var reset_pom = false
var intervalo;

function definirDatosIniciales(objHabito){

    console.log('se dee')
    ciclos =  objHabito.count
    ciclos_global = ciclos
    tiempoTrabajo = 0
    tiempoDescanso = objHabito.short_break * 60;

    objeto_habito = objHabito
    console.log(objeto_habito)
    document.getElementById('temporizador').title =  objHabito.nombre

    pomodoro_()
    boton_cerrar()
   


}


var div_tiempo = document.getElementById('pom');
div_tiempo.style.backgroundColor = 'color_deseado'; 

var tiempoRestante = 0;  
var enDescanso;
function gurdar_salir(){

    if (inicio_pom){
        
        var tiempo = 0
        console.log(enDescanso)
        if (!enDescanso) {
            tiempo = tiempoRestante
            console.log(tiempo)
            registrar_habito(objeto_habito.id+"", tiempo)
            .then(() => {
                console.log("va a guardar")
                registrar_Fin_habito(objeto_habito.id+"")
                // Esta línea se ejecutará después de que miFuncionAsincrona haya terminado
                console.log('La función asíncrona ha terminado de ejecutarse. Ahora se ejecutará esta línea.');
                window.location.href = "/habitos/";
            });
        } 
        else {
                tiempo =  tiempoRestante
                console.log(tiempo)
                registrar_habito_descanso(objeto_habito.id+"", tiempo)
                .then(() => {
                    console.log("va a guardar")
                    registrar_Fin_habito(objeto_habito.id+"")
                    // Esta línea se ejecutará después de que miFuncionAsincrona haya terminado
                    console.log('La función asíncrona ha terminado de ejecutarse. Ahora se ejecutará esta línea.');
                    window.location.href = "/habitos/";
                });
            }
        }else{
            window.location.href = "/habitos/";
            console.log('salir sin guardar')
        }

    }




function pomodoro_(){

    corriendo = false;
    reset_pom = false
    intervalo;
 
    enDescanso = false;

    tiempoRestante = 0;  

    var minutos = Math.floor(tiempoRestante / 60);
    var segundos = tiempoRestante % 60;
    document.getElementById("temporizador").textContent = (minutos < 10 ? "0" : "") +  minutos + ":" + (segundos < 10 ? "0" : "") + segundos;
    var html_ciclos = document.getElementById("ciclos")
    html_ciclos.textContent =  (ciclos < 10 ? "0" : "") + ciclos
    var audio = document.getElementById('myAudio');
        

    var boton_pausa_h = document.getElementById("iniciarPausar")



    document.getElementById("iniciarPausar").addEventListener("click", function() {

    console.log('entra boton')


    if (!inicio_pom){
        console.log('guardar inicio')
        registrar_Inicio_habito(objeto_habito.id+"")
        inicio_pom = true
    }


    if (corriendo) {
        clearInterval(intervalo);
        this.innerHTML  = '<i class="material-icons">play_arrow</i>';
        div_tiempo.style.backgroundColor = 'orange';
    } else {
        
        this.innerHTML  = '<i class="material-icons">pause</i>';
        console.log('actuva pausa')
   
        if (enDescanso) {
            div_tiempo.style.backgroundColor = 'green';
            console.log('cambio de color 1')
        }else{
            div_tiempo.style.backgroundColor = 'red';
            console.log('cambio de color 2')
        }



        intervalo = setInterval(function() {
            tiempoRestante++;
            var minutos = Math.floor(tiempoRestante / 60);
            var segundos = tiempoRestante % 60;
            document.getElementById("temporizador").textContent = (minutos < 10 ? "0" : "") + minutos + ":" + (segundos < 10 ? "0" : "") + segundos;
            // if (tiempoRestante <= 0) {
            //     // audio.play();
            //     clearInterval(intervalo);
            //     if (enDescanso) {
            //         tiempoRestante = tiempoTrabajo;
            //         // Si estaba en descanso, vuelve al tiempo de trabajo
            //         console.log('va a guardar habito Si descanso')
            //         console.log(tiempoRestante)
            //         enDescanso = false;
                    
            //         registrar_habito_descanso(objeto_habito.id+"", tiempoDescanso)
            //         div_tiempo.style.backgroundColor = 'red';
            //         ciclos--;
                    
            //     } else {
            //         tiempoRestante = tiempoDescanso;
            //         console.log('va a guardar habito no descanso')
            //         console.log(tiempoRestante)
            //         // Si estaba trabajando, pasa al tiempo de descanso
            //         enDescanso = true;
                    
            //         registrar_habito(objeto_habito.id+"", tiempoTrabajo)
            //         div_tiempo.style.backgroundColor = 'green';
            //     }
            //     if (ciclos > 0) {
            //         // Si aún quedan ciclos, reinicia el intervalo
            //         intervalo = setInterval(arguments.callee, 1000);
            //         console.log(ciclos)
            //         html_ciclos.textContent = (ciclos < 10 ? "0" : "") + ciclos
            //     } else {
            //         registrar_Fin_habito(objeto_habito.id+"")
            //         boton_pausa_h.innerHTML  = '<i class="material-icons">play_arrow</i>';
            //         console.log('boton arrow')
            //         console.log(this)
            //         div_tiempo.style.backgroundColor = 'purple';
            //         tiempoRestante = tiempoTrabajo;
            //         corriendo = !corriendo;
                    
            //         var minutos = Math.floor(tiempoRestante / 60);
            //         var segundos = tiempoRestante % 60;
            //         document.getElementById("temporizador").textContent = (minutos < 10 ? "0" : "") +  minutos + ":" + (segundos < 10 ? "0" : "") + segundos;
            //         ciclos = ciclos_global
            //         console.log(ciclos)
            //         html_ciclos.textContent = (ciclos < 10 ? "0" : "") + ciclos
            //         console.log('finalizo')
            //         reset_pom = true
            //     }
            // }
        }, 1000);
        
    }
    corriendo = !corriendo;
    });



}


function boton_cerrar(){

        
    document.getElementById("cerrar").addEventListener("click", function() {
        gurdar_salir()

        clearInterval(intervalo);
        // var boton_pausa_h = document.getElementById("iniciarPausar")
        // var html_ciclos = document.getElementById("ciclos")
        // boton_pausa_h.innerHTML  = '<i class="material-icons">play_arrow</i>';
        //         console.log('boton arrow')
        //         console.log(this)
        //         div_tiempo.style.backgroundColor = 'purple';
        //         tiempoRestante = tiempoTrabajo;
        //         corriendo = false;
                
        //         var minutos = Math.floor(tiempoRestante / 60);
        //         var segundos = tiempoRestante % 60;
        //         document.getElementById("temporizador").textContent = (minutos < 10 ? "0" : "") +  minutos + ":" + (segundos < 10 ? "0" : "") + segundos;
        //         ciclos = ciclos_global
        //         console.log(ciclos)
        //         html_ciclos.textContent = (ciclos < 10 ? "0" : "") + ciclos
        //         console.log('finalizo')
        //         reset_pom = true
        //         enDescanso = false

    });
}


