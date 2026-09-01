## Este archivo NO ES DOCUMENTACION, es una Bitácora para la correcta guia del desarrollo.


### Todos los cambios y todo el código que se aplican en el proyecto se tienen que documentar. Todas las solicitudes de pull son bienvenidas.

---

## Comentarios de PARTES PENDIENTES del desarrollo.

### 28 de agosto.

- Feat de paginado para todas las paginas que lean de firestore para no sobrecargar las lecturas de Firestore, pense ne un size de 6 cada pagina.

- Asegurate de que en tipo de productos y en pedidos, NO cargue todo de inmediato en la vista previa cuando abramos la ventan de productos y pedidos, porque o sino va a chupar lecturas de firestore COMO LOCO. ES PRIORIDAD.


## Objetivos y Orden de Prioridades✅❌

- [x] 1. Conexión con Firebase y Base de datos en Firestore.

- [x] 2. Crear la estructura de Colegios / Empresas

- [x] 3. Crear la estructura de Tipos de Prendas / Productos.

- [ ] 4. Crear la esutructura de Productos

- [ ] 5. Crear la estructura de Pedidos

- [ ] 6. Crear la estructura de Cuentas

- [ ] 7. Crear la estructura de Home

- [ ] 8. Crear la estructura del Login.

- [ ] 9. Asegurar la seguridad y la estabilidad del sistema antes de sacarlo a produccion.



## Orden y estructura para el desarrollo

<img src="/Fotos%20Readme/Diagrama.jpg" width="700">


-  1. El boton de navegacion lo definimos como global en toda la app, de esa forma ahorramos lineas de codigo en los otros docs y no necesitamos llamarlo a cada rato en toodas las ventanas, lo que puede provocar bugs.
 
-  2. Primero organicemos la estructura colegioss y luego de los productos, por que? prque toda la estructura depende de los productos, pero productos depende de los colegios obvio. de productos los pedidos depende de ello, la cuentas. Entonces primero organizamos dentro de firestore la estrucutra de productos y las funciones para leer, para crearlos borrarlos y modificarlos, no te preocupes mucho por lo visual aun, luego nos encargamos de eso así seguimos la misma guia visual para todo el proyecto
 
-  3. Luego de los productos que funcioen bien nos aseguramos de los pedidos obvio, ya que pedidos usa a productos necesitamos que para crear un pedido podamos llamarlo logicamente, y dentro de su estructura para crear un pedido necesitamos que por ej podamos irnos a crear productos para cuando nos falte 1 o sea personalizado.
 
-  4. Cuentas depende de productos y pedidos asi que lo dejamos para casi el final, no problema.
 
-  5. Home depende de todo, quiero que tenga un calendario de 1 semana arriba y que obvio se mueva con la fecha, mostrando los pedidos de esa semana, tambien quiero que tenga reusmenes de cuentas. Notiicaciones si podemos con los clouds functions y eso.
 
-  6. Luego con todas las funciones listas nos enfocamos en lo visual si se ve feo y no sigue la linea minimalismo util que queremos, una mezcla correcta de rendimiento animaciones y estilos.
 
-  7. Para terminar preparamos produccion y capacitamos a la empresa de Prismar para el correcto uso.
 





---
# 📅 Historial 2026

### Viernes 07 de Agosto

- Creación del proyecto en React Vite con JS, nombre del proyecto: prismar-app
- Se instalaron los iconos de ```npm install lucide-react```
- Se instalo la dependencia ```npm install react-router-dom```

- Se creo toda la estructura inicial del proyecto con los archivos dentro de /src/Pages
- Se creo el archivo Global para la correcta navegación entre las ventanas.



### Viernes 07 de Agosto v2

- Se agregaron las fuentes de texto dentro de index.css para que se vea mejor el proyecto.
- Se comento todo el codigo de BottomNav.jsx.


### Viernes 07 de Agosto v3 

- Se establecio la conexión de Firebase y Firestore
- Se creo la ventana Productos.
- Se conecto la ventana Productos con Firestore.
- Se agrego la lectura de documentos de la colección productos.
- Se agregaron estilos minimalistas.
- Se comprobo que los productos se muestran correctamente.

<img src="/Fotos%20Readme/07-08.png" width="400">


### Sábado 08 de Agosto

- Agregamos boton junto a la barra de navegación para agregar productos y pedidos.
- Para buena practicas las funciones de Click solo escuchan cuando el menu esta abierto.
- Creamos los archivos AgregarPedido y AgregarProducto para las pruebas.
<img src="/Fotos%20Readme/08-08.png" width="400">

### Sábado 15 de Agosto

- Agregamos nueva estructura para el proyecto y orden.

### Domingo 16 de Agosto

- Mejoramos la estructura de las carpetas con su css para cada archivo.

- Agregamos Modal para los gastos, para agregar colegios y dentro de paginas AdminColegios

### Lunes 17 de Agosto

- Agregamos la estructura verdadera y correcta de los estilos para ver los colegios desde Firestore, esperamos como diseño final basándonos en un balance entre estilos minimalistas y rendimiento

- Agregamos el boton Agregar Colegios dentro de los estilos NO FUNCIONALES, pero esta en la ventana al final, lo agregamos al final de la estructura, lo decidimos así porque los colegios o empresas afiliadas a los productos no son muchas y cuando no hayan agregados ese boton sube en consecuencia, tambien lo elegimos asi para no complicarnos demas con codigo, pensamos en agregarlo sobre el botton nav pero seria cambiar mucha estructura y agregar codigo innecsario que puede facilitar los bugs, como mencioanmos, balance entre rendimiento, estilo y funcionalidad.
- <img src="/Fotos%20Readme/colegiosvista.png" width="600">

### Lunes 17 de Agosto v2

- Dejamos el paso hecho para crear los modals, creamos carpeta para modals donde queremos meter el modal para crear colegios, y un modal reutilizable para confirmar la eliminacio nde cualquier cosa, que sea con una confirmacion doble, sea de colegio, de producto o de pedidos. De esa forma evitamos primero, una hiteracion de codigo y segundo, mantenemos una linea visual.

### Martes 18 de Agosto

- Detectamos problemas de seguridad en la creación del modal, por lo que pausamos la creación de colegios, productos y pedidos para solucionar los problemas de seguridad, nuestro objetivo es evitar las inserciones de codigo dentro de los input, tenemos que ser muy cuidadosos sobretodo al no tener un backend puro y usar firebase.

### Miercoles 19 de Agosto

- Desarrollamos un Diagrama UML para guiarnos dentro del desarrollo, detectamos el tema de los tipos de prendas, por ej asignar distintas crud para medidas en cada pedido, sea un vestido usa medidas distintas que un pantalon, sea espalda, ancho, caderas, cada tipo de prenda activa tipos distintos de medidas, menos mal detectamos el problema antes de desarrollar los productos. Así que tenemos que asignarlo a cada producto, creamos la clase TipoPrenda

### Miercoles 19 de Agosto v2

- Agregamos toda la estructura necesario del modal para poder Crear Colegios y poder editarlos, ademas modificamos las reglas de Firestore para hacerlo mas seguro

```Firebase Security Rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
// Claves de seguridad para la base de datos, especificamente para los input, asi limitamos las insercioens de codigo


		// Validaciones para los inputs dentro de la collecion de COLEGIOS, colegios solo tiene NOMBRE como su
    // dato input tipo string, le colocamos un varchar de 64 para no exedernos
    // y limitamos el unico dato que puede tener COLEGIO, a NOMBRE, entonces evitamos si alguien quiere meter algun otro dato
    match /colegios/{colegioId} {

      allow read: if true;

      allow create: if
        request.resource.data.keys().hasOnly([
          "nombre"
        ])
        && request.resource.data.nombre is string
        && request.resource.data.nombre.size() >= 2
        && request.resource.data.nombre.size() <= 64;

      allow update: if
        request.resource.data.keys().hasOnly([
          "nombre"
        ])
        && request.resource.data.nombre is string
        && request.resource.data.nombre.size() >= 2
        && request.resource.data.nombre.size() <= 64;

      allow delete: if true;
    }
  }
}
```
<img src="/Fotos%20Readme/modalvista.png" width="400">

### Viernes 20 de Agosto

-	DEscartamos la idea de un modal doble, creamos la vitacora de bugs para poder registrar nuestro bugs e ir mejorando poco a poco nuestro criterio, hoy principalmete debugeamos, arreglamos un bug del modal que mas que de uso era visual, era que simplemente no limpiamos los state del input al cerrar el modal con el click fuera del modal, esa funcion que cerraba el modal no limpiaba el input.

-	Tambien arreglamos un bug de firestore que no me dejaba escribir en la base de datos, despues de cranearla como loco, las reglas de firestore me dejaron como imbecil porque solo era eso JJAJAJAJ, TEN CUIDADO CON LAS REGLAS DE FIRESTORE.

  

### Sábado 22 de Agosto

-	Hoy no tiramos mucho codigo, casi nada practicamente ademas de solucionar una tontera en la base de datos, me di cuenta que claro, tenemos nombreLimpio para guardar pero a la hora de guardar llamamos a la variable sin limpiar con trim(), todo mal, solucionado, demasiado vergonzoso para anotarlo en el Bestiario de bugs

-	Nos creanos la estructura REAL del proyecto, hasta el momento hemos avanzado poco en codigo porque nos hemos asegurado de dejar todo claro, como este proyecto es un proyecto real par PRISMAR, vamos a manejar una estructura de usuario real para mejorar primero, LA CLARA DEFICIENCIA en seguridad que tenemos a fecha de hoy, el problema esque eso nos va a atrasar unos días el proyecto pero prefiero hacerlo ahora antes que despues, vamos a manejar los usuarios con una arquitectura RBAC, creamos los usuarios con Cloud Functions, y firestore valida que rol tiene accignado y que puede hacer con cada rol, la idea de manejar los datos desde Cloud Functios nos coquetea bonito.

-	Tenemos la pared de la pieza llena de papeles de diagramas, si el proyecto no queda lo mejor posible me pongo a llorar ajajajaja



### Domingo 23 de Agosto

- Descargarmos la idea de hacer directamente aplicar en el desarrollo el tema del login claro POR AHORA, solo POR AHORA, al final cuando tengamos todo estructurado vamos a dedicar el tiempo necesesario al login y la estrucutra de RBAC de los daots. Peparamos algunos diagramas y lo pegamos en la pared jasjd



### Domingo 23 de Agosto v2

- Avanzamos directamente la estructura del modal de ModalAgregarProducto, usamos una estructura de array para listar y guardar los atributos, los limpiamos con un trim() y luego los convertimos a un map con .forEach para que se convierta en la estructura MAP que necesitamos para guardar dentro de firestore.



### Domingo 23 de Agosto v3

- La estructura de crear modal tipo de prenda quedo bien, falta testearla bajo estres para confirmar que no tiene bugs, las reglas de firestore hasta el momento (sin login), estas seguras dentro de lo posible.


<img src="/Fotos%20Readme/modaltipocolegio.png" width="400">



### Martes 25 de Agosto

- Creamos la doc oficial para el sistema dentro de Readme.md
- Refactorizamos completo Botton nav aplicando las 5S de Clean Code.
- 

### Miercoles 26 de Agosto

- Refactorizamos el completamente la seccion de Admin colegios, quedo pro, variables y funciones claras, sin comentarios redundantes e innesesarios.

### Miercoles 26 de Agosto v2

- Comenzamos la Refactiracion de Modal para crear colegio, no lo completamos por resfrio. Pero separamos la funcion que estaba con un if, la cambiamos a 2 distintas mas claras para ser mas claro.

### Jueves 27 de Agosto

- Refactor completo del modal agrar colegio, funciona bien y quedo mucho mas legible y mejor estructurado

- Refactor de todas las carpetas del proyecto, de la redistribucion.


### Viernes 28 de Agosto

- Refactor completo del componte  de TipoPrenda.jsx

### Viernes 28 de Agosto v2

- Refactor no completo del modal para agregar tipo de prenda, falta completarlo.

### Sabado 29 de Agosto

- Terminamos el refactor del modal para agregar y editar tipo de prenda, renombramos y solucionamos bugs de ambos archivos, tipoprenda y modal de tipo prenda, quedo funcionando, y completamos oficialmente todo el refactor de todo el codigo que teniamos hasta este momento dentro del proyecto.

### Sabado 29 de Agosto v2

- feat: buscador completo funcional para tipo de prenda y para colegio, por el momento lo hicimos así, busca dentro de todo lo que trajo firestore, cuando hagamos la paginacion, al no traer todo de firestore vamos a tener que usar otra forma para buscar sin necedidad de traer todo de firestore, pense en indices pero hay que verlo luego.
  
- doc: Vamos a comenzar con la estructura de productos, la idea es que tengamos la ventana previa tipida que tenemos como en tipoprenda y colegios, pero en lugar del boton editar que tengamos un boton para ver, y que nos abra a otra ventana con su id, algo como /producto/id=XXXXXX, una cosa asi. 

- feat: Comenzamos ofialmente con la estructura de productos, puede ser la mas desafiante del proyecto porque esta misma la podemos usar como base para pedidos, creamos la carpeta VerProducto, EditarProducto y AgregarProducto.

### Domingo 30 de Agosto

- doc: Mejoramos el diagrama UML agregando tallas, lo creamos igual que colegios pero lo guardanos dentro de producto con precio por talla como un map

- feat: crea tallas, usamos la base de colegios, ahora para crear productos podemos asignarle la talla y registrar precio segun la talla, importante antes de comenzar con el desarrollo de productos.

### Lunes 31 de Agosto

- feat: agrega la estructura para leer productos y el buscador solo por nombre, y hasta el momento vemos solo el nombre

- styles: modifica los estilos de los atributos dentro de la tarjeta de tipo de prenda, mas profesional y minimalista.

- feat: agrega leer las tallas y los precios de las tallas dentro del apartado de productos, aplica funcion para número y poner el . en donde corresponda en el precio

### Lunes 31 de Agosto v2

- feat: agrega lectura de colegio especifico segun la id asignada dentro del producto, por lo que si se actualiza en colegios, se actualiza en los productos, falta testear el consumo real en lecturas.











