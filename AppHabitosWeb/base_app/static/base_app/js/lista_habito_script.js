

function llenar_lista_habitos(nombre_lista, hecho, IsHabitoArchivado, data) {

      numero_racha_h = 0

      var lista = document.getElementById(nombre_lista);

      for (let index = 0; index < data.length; index++) {
          const element = data[index];
      var li = document.createElement("li");
      li.classList.add('elemento_lista')
      li.id = data[index].orden_n

      let objStr = JSON.stringify(data[index]);

      // Agregar la cadena de texto al atributo data-obj del elemento
      li.dataset.obj = objStr;



      var div_item_h = document.createElement('div')
      var div_botones = document.createElement('div')
      div_botones.classList.add('div_botones')
      li.appendChild(div_item_h)
      lista.appendChild(li);
      var Nombre_habito = document.createElement('div')
      var Nombre_habito_h1 = document.createElement('h1')
      var racha_habito_p = document.createElement('h6')
      Nombre_habito.classList.add('titulo_habito')
      Nombre_habito_h1.classList.add('titulo_habito_texto')
      racha_habito_p.classList.add('racha_habito_texto')
      var texto_nombre = document.createTextNode(data[index].nombre)
      var texto_numero_racha = document.createTextNode( numero_racha_h)
      racha_habito_p.appendChild(texto_numero_racha)

      var boton_config = document.createElement("button")
      boton_config.style.backgroundColor = data[index].color
      //boton_config.innerHTML = '<index class="material-icons">settings</index>';
      boton_config.classList.add('boton_config')
      Nombre_habito_h1.appendChild(texto_nombre)
      Nombre_habito_h1.title = data[index].work_time
      Nombre_habito.appendChild(Nombre_habito_h1)
      Nombre_habito.appendChild(racha_habito_p)
      div_item_h.appendChild(boton_config);
      div_item_h.appendChild(Nombre_habito);
      var botn = document.createElement("button")
      var botn_graf = document.createElement("button")


      document.body.append(botn);
      div_item_h.appendChild(div_botones)

      botn_graf.innerHTML = '<i class="material-icons">calendar_today</i>';
      document.body.append(botn_graf);


      // Asignar un valor al botón
      botn.value = data[index];
      botn_graf.value = data[index];
      div_botones.appendChild(botn)
      div_botones.appendChild(botn_graf)

      div_color = document.createElement('div')
      div_color.classList.add('div_color_habito')
      div_color.style.backgroundColor = data[index].color
      div_botones.appendChild(div_color)

      let objeto = data[index]

      botn.classList.add('boton_habito')
      botn_graf.classList.add('boton_habito')

      boton_config.addEventListener('click', function () {
        configurar_habito(objeto)
        cambiarVentana('ventana2')
      })


      if (data[index].type__numero == 1) {
        div_item_h.classList.add('item_habito')
        botn.innerHTML = '<i class="material-icons">alarm</i>';
        botn.addEventListener('click', function () {
          
          ipcRenderer.send('abrir-ventana-secundaria', objeto)
        })
      } else {
        div_item_h.classList.add('item_habito_check')
        botn.innerHTML = '';
        botn.innerHTML = '<i class="material-icons">check</i>';
        botn.addEventListener('click', function () {

          registrar_Habitos_checker(objeto)
          // actualizar_listas()
          definir(objeto)
          
        })

      }

      botn_graf.addEventListener('click', function () {

      definir(objeto)


      
      generarGraficoDuracionPorAnio(objeto.id+'', objeto.objetivo);
      graficar_semana(objeto.id+'', objeto.objetivo);
      // mientras
      
      //mostrar_flechas()
      })

      }
}


function fetch_lista_habitos(){

        var url = '/habitos/getHabitosR/';
        fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('La solicitud falló');
            }
            return response.json();
        })
        .then(function(data) {
            // Maneja la respuesta exitosa
            // var fragment = document.createDocumentFragment();
            llenar_lista_habitos('miLista', false, false, data.Habitos_por_hacer)
            llenar_lista_habitos('miLista_hechos', false, false, data.Habitos_hechos)
            // lista.appendChild(fragment)
        })
        .catch(function(error) {
            console.error('Error:', error);
        });

}   