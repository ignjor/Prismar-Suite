# EN DESARROLLO - Prismar Sistema Web. 
## Este archivo NO ES DOCUMENTACION, es una vitacora para la correcta guia del desarrollo, luego creamos la documentación inicial.


### Todos los cambios y todo el código que se aplican en el proyecto se tienen que documentar. Todas las solicitudes de pull son bienvenidas.

---


## Objetivos y Orden de Prioridades✅❌

- [x] 1. Conexión con Firebase y Base de datos en Firestore.

- [ ] 2. Crear la estructura primero de PRODUCTOS, agregar, modificar y eliminar, y conectarla con Firestore

- [ ] 3. Crear estructura de CREAR PEDIDO, modificarlo y eliminarlo, que cada producto se pueda listar, y claro se usen los Productos agregados previamente en PRODUCTOS. Con la opción de redirigir a crear Producto.

- [ ] 4. En base a los Pedidos, crear CUENTAS, con resumenes mensuales, semanas o como requiera el cliente. Exportaciónes periodicas a Firebase

- [ ] 5. Conectar a CLOUD FUNCTIONS según requiera para notificaciones en el celular, al ser de navegador es mas complejo pero puede ser con mensajes o correos.




## Orden y estructura para el desarrollo


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

### Lunes 17 de Agosto v2

- Dejamos el paso hecho para crear los modals, creamos carpeta para modals donde queremos meter el modal para crear colegios, y un modal reutilizable para confirmar la eliminacio nde cualquier cosa, que sea con una confirmacion doble, sea de colegio, de producto o de pedidos. De esa forma evitamos primero, una hiteracion de codigo y segundo, mantenemos una linea visual.

### Martes 18 de Agosto

- Detectamos problemas de seguridad en la creación del modal, por lo que pausamos la creación de colegios, productos y pedidos para solucionar los problemas de seguridad, nuestro objetivo es evitar las inserciones de codigo dentro de los input, tenemos que ser muy cuidadosos sobretodo al no tener un backend puro y usar firebase.









