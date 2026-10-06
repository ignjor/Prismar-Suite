## Este archivo es una Bitácora de la correcta guía del desarrollo.

## Objetivos y Orden de Prioridades✅❌

- [x] 1. Conexión con Firebase y Base de datos en Firestore.

- [x] 2. Crear la estructura de Colegios / Empresas

- [x] 3. Crear la estructura de Tipos de Prendas / Productos.

- [X] 4. Crear la estructura de Productos

- [ ] 5. Crear la estructura de Pedidos

- [ ] 6. Crear la estructura de Cuentas

- [ ] 7. Crear la estructura de Home

- [ ] 8. Crear la estructura del Login.

- [ ] 9. Asegurar la seguridad y la escalabilidad del sistema antes de sacar a producción.


## Orden y estructura para el desarrollo

<img src="/Fotos%20Readme/Diagrama.jpg" width="700">


-  1. El botón de navegación lo definimos como global en toda la app, de esa forma ahorramos líneas de código en los otros componentes y no necesitamos llamarlo repetidamente en todas las ventanas, lo que puede provocar bugs.

-  2. Primero organicemos la estructura de colegios y luego la de productos, ¿por qué? Porque toda la estructura depende de los productos, pero productos depende de los colegios. De productos dependen los pedidos y las cuentas. Entonces primero organizamos dentro de Firestore la estructura de productos y las funciones para leerlos, crearlos, borrarlos y modificarlos. No prioricemos aún lo visual; luego nos encargamos de eso para seguir la misma guía visual en todo el proyecto.

-  3. Luego de que los productos funcionen bien nos aseguramos de los pedidos, ya que pedidos utiliza productos necesitamos que para crear un pedido podamos llamarlo lógicamente, y dentro de su estructura para crear un pedido necesitamos que, por ejemplo, podamos ir a crear productos para cuando nos falte 1 o sea personalizado.

-  4. Cuentas depende de productos y pedidos, así que lo dejamos para casi el final, sin problema.

-  5. Home depende de todo, quiero que tenga un calendario de 1 semana arriba y que se mueva con la fecha, mostrando los pedidos de esa semana. También quiero que tenga resúmenes de cuentas y notificaciones, si podemos implementarlas con Cloud Functions.

-  6. Luego con todas las funciones listas nos enfocamos en lo visual, si no sigue la línea de minimalismo útil que queremos, buscando una mezcla correcta de rendimiento, animaciones y estilos.

-  7. Para terminar preparamos producción y capacitamos a la empresa de Prismar para el correcto uso.

---

# 📅 Historial 2026

### 28 de agosto.

- Feat de paginado para todas las páginas que lean de Firestore para no sobrecargar las lecturas de Firestore, pensé en un size de 6 por página.

- Asegúrate de que en tipo de productos y en pedidos, NO cargue todo de inmediato en la vista previa cuando abramos la ventana de productos y pedidos, porque de lo contrario va a generar un consumo elevado de lecturas de Firestore. ES PRIORIDAD.

### 10 de septiembre.

- Agrega fecha de actualización a todos los componentes pequeños y que se actualicen automáticamente al editarlos o crearlos, para listarlos mejor dentro del modal de selección y para encontrarlos más rápido dentro de sus propias ventanas.

- Crea modal de Doble confirmacion para eliminar, estandarizado y reutilizable dentro de todo el proyecto

- Crea modal de confirmación para Editar o Crear, estandarizado y reutilizable dentro de todo el proyecto, así evitamos crear o editar algo por accidente.

- El modal de foto de agregar no funciona, corrígelo; el modal intenta buscar una ID que aún no existe porque el documento todavía no ha sido creado. 

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

- Para buenas prácticas, las funciones de Click solo escuchan cuando el menú está abierto.

- Creamos los archivos AgregarPedido y AgregarProducto para las pruebas.

<img src="/Fotos%20Readme/08-08.png" width="400">

### Sábado 15 de Agosto

- Agregamos nueva estructura para el proyecto y organización.

### Domingo 16 de Agosto

- Mejoramos la estructura de las carpetas con su css para cada archivo.

- Agregamos Modal para los gastos, para agregar colegios y dentro de paginas AdminColegios

### Lunes 17 de Agosto

- Agregamos la estructura verdadera y correcta de los estilos para ver los colegios desde Firestore, esperamos como diseño final basándonos en un balance entre estilos minimalistas y rendimiento

- Agregamos el boton Agregar Colegios dentro de los estilos NO FUNCIONALES, pero esta en la ventana al final, lo agregamos al final de la estructura, lo decidimos así porque los colegios o empresas afiliadas a los productos no son muchas y cuando no hayan agregados ese boton sube en consecuencia, tambien lo elegimos asi para no complicarnos demas con codigo, pensamos en agregarlo sobre el botton nav pero seria cambiar mucha estructura y agregar codigo innecsario que puede facilitar los bugs, como mencioanmos, balance entre rendimiento, estilo y funcionalidad.

- <img src="/Fotos%20Readme/colegiosvista.png" width="600">

### Lunes 17 de Agosto v2

- Dejamos el paso hecho para crear los modals, creamos carpeta para modals donde queremos meter el modal para crear colegios, y un modal reutilizable para confirmar la eliminación de cualquier cosa, que sea con una confirmación doble, sea de colegio, de producto o de pedidos. De esa forma evitamos, primero, una reiteración de código y, segundo, mantenemos una línea visual.

### Martes 18 de Agosto

- Detectamos problemas de seguridad en la creación del modal, por lo que pausamos la creación de colegios, productos y pedidos para solucionar los problemas de seguridad, nuestro objetivo es evitar las inserciones de codigo dentro de los input, tenemos que ser muy cuidadosos sobretodo al no tener un backend puro y usar firebase.

### Miercoles 19 de Agosto

- Desarrollamos un Diagrama UML para guiarnos dentro del desarrollo, detectamos el tema de los tipos de prendas, por ejemplo asignar distintas CRUD para medidas en cada pedido, sea un vestido usa medidas distintas que un pantalón, sea espalda, ancho, caderas, cada tipo de prenda activa tipos distintos de medidas. Afortunadamente detectamos el problema antes de desarrollar los productos. Así que tenemos que asignarlo a cada producto, creamos la clase TipoPrenda

### Miercoles 19 de Agosto v2

- Agregamos toda la estructura necesario del modal para poder Crear Colegios y poder editarlos, ademas modificamos las reglas de Firestore para hacerlo mas seguro


<img src="/Fotos%20Readme/modalvista.png" width="400">

### Viernes 20 de Agosto

- Descartamos la idea de un modal doble, creamos la bitácora de bugs para poder registrar nuestros bugs e ir mejorando poco a poco nuestro criterio. Hoy principalmente debugeamos, arreglamos un bug del modal que más que de uso era visual; se debía a que no limpiábamos los state del input al cerrar el modal con el click fuera del modal, esa función que cerraba el modal no limpiaba el input.

- También arreglamos un bug de Firestore que no me permitía escribir en la base de datos. Después de revisarlo en detalle, detecté que el problema estaba en las reglas de Firestore. ES IMPORTANTE REVISAR LAS REGLAS DE FIRESTORE.





### Sábado 22 de Agosto

- Hoy no incorporamos mucho código, prácticamente nada, además de solucionar un detalle menor en la base de datos. Detecté que tenemos nombreLimpio para guardar, pero a la hora de guardar llamamos a la variable sin limpiar con trim(). Se corrigió. No lo considero un bug relevante para registrar en el Bestiario de bugs.

- Creamos la estructura REAL del proyecto, hasta el momento hemos avanzado poco en código porque nos hemos asegurado de dejar todo claro. Como este proyecto es un proyecto real para PRISMAR, vamos a manejar una estructura de usuario real para mejorar primero la principal deficiencia en seguridad que tenemos a fecha de hoy. El problema es que eso nos va a atrasar unos días el proyecto, pero prefiero hacerlo ahora antes que después. Vamos a manejar los usuarios con una arquitectura RBAC, creamos los usuarios con Cloud Functions, y Firestore valida qué rol tiene asignado y qué puede hacer con cada rol. También consideramos manejar los datos desde Cloud Functions.

- Tenemos la pared de la pieza llena de papeles con diagramas; buscamos que el proyecto quede lo mejor posible.





### Domingo 23 de Agosto

- Descartamos la idea de aplicar directamente en el desarrollo el tema del login por el momento. Al final, cuando tengamos todo estructurado, vamos a dedicar el tiempo necesario al login y la estructura de RBAC de los datos. Preparamos algunos diagramas y los pegamos en la pared.





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

- Refactorizamos completamente la sección de Admin colegios, quedó bien estructurada, variables y funciones claras, sin comentarios redundantes e innecesarios.

### Miercoles 26 de Agosto v2

- Comenzamos la Refactorización de Modal para crear colegio, no lo completamos por resfrío. Pero separamos la función que estaba con un if, la cambiamos a 2 distintas más claras para ser más claro.

### Jueves 27 de Agosto

- Refactor completo del modal agregar colegio, funciona bien y quedó mucho más legible y mejor estructurado

- Refactor de todas las carpetas del proyecto, de la redistribucion.



### Viernes 28 de Agosto

- Refactor completo del componte  de TipoPrenda.jsx

### Viernes 28 de Agosto v2

- Refactor no completo del modal para agregar tipo de prenda, falta completarlo.

### Sabado 29 de Agosto

- Terminamos el refactor del modal para agregar y editar tipo de prenda, renombramos y solucionamos bugs de ambos archivos, tipoprenda y modal de tipo prenda, quedó funcionando, y completamos oficialmente todo el refactor de todo el código que teníamos hasta este momento dentro del proyecto.

### Sabado 29 de Agosto v2

- feat: buscador completo funcional para tipo de prenda y para colegio, por el momento lo implementamos así, busca dentro de todo lo que trajo Firestore, cuando hagamos la paginación, al no traer todo de Firestore vamos a tener que usar otra forma para buscar sin necesidad de traer todo de Firestore, pensé en índices, pero queda pendiente evaluarlo.

- doc: Vamos a comenzar con la estructura de productos, la idea es que tengamos la ventana previa típica que tenemos como en tipoprenda y colegios, pero en lugar del botón editar que tengamos un botón para ver, y que nos abra a otra ventana con su ID, algo como /producto/id=XXXXXX, una estructura similar. 

- feat: Comenzamos oficialmente con la estructura de productos, puede ser la más desafiante del proyecto porque esta misma la podemos usar como base para pedidos, creamos la carpeta VerProducto, EditarProducto y AgregarProducto.

### Domingo 30 de Agosto

- doc: Mejoramos el diagrama UML agregando tallas, lo creamos igual que colegios pero lo guardanos dentro de producto con precio por talla como un map

- feat: crea tallas, usamos la base de colegios, ahora para crear productos podemos asignarle la talla y registrar precio segun la talla, importante antes de comenzar con el desarrollo de productos.

### Lunes 31 de Agosto

- feat: agrega la estructura para leer productos y el buscador solo por nombre, y hasta el momento vemos solo el nombre

- styles: modifica los estilos de los atributos dentro de la tarjeta de tipo de prenda, mas profesional y minimalista.

- feat: agrega leer las tallas y los precios de las tallas dentro del apartado de productos, aplica funcion para número y poner el . en donde corresponda en el precio

### Lunes 31 de Agosto v2

- feat: agrega lectura de colegio especifico segun la id asignada dentro del producto, por lo que si se actualiza en colegios, se actualiza en los productos, falta testear el consumo real en lecturas.

- refactor: rehace el sistema para leer los productos, ahora rescata y reutiliza las lecturas dentro de los productos si alguno comparte colegio, ahorramos aproximadamente así un 50% de lecturas.

### Martes 01 de Septiembre

- feat: agrega la redireccion /ver-producto/id=XXXXX cuando apretamos Ver dentro de productos, vamos a crear primero Crear Producto para usarla de base para Ver, por ahora solo pasa la Id.

- refactor: ordena y prepara los componentes y sus carpetas para empezar con la implementacion de TanStack Query

### Martes 01 de Septiembre v2

- feat: crea useColegios y colegios.query, falta testarlos, modificar Colegios.jsx y asegurarnos de que este cacheando bien colegios, cacheando colegios tenemos la estructura para todo el proyecto.

### Miercoles 02 de Septiembre

- refactor: Colegios.jsx usa TanStackQuery para leer los colegios, colegios se guarda en la cache de query y mas adelante la idea es que los otros componentes lean esa cache en lugar de leer la db directamente

- refactor: quitamos recargarpagina desde el modal porque no lo necesitamos, como recarga desde cache lo unico que hace esa funcion es recargar innesariamente desde firestore, ahorra lecturas y ademas como antes usamos la cache, es innecesaria

### Miercoles 02 de Septiembre v2

- refactor: Tallas.jsx usa TanStackQuery para leer los colegios, colegios se guarda en la cache de query y mas adelante la idea es que los otros componentes lean esa cache en lugar de leer la db directamente, ademas el modal ya no necesita recargar las lecturas de la db

### Jueves 03 de Septiembre

- refactor: TipoPrenda.jsx ahora usa TanStackQuery al igual que los otros componentes, los componetes que usa otra coleccion los dejamos como infinite y ademas como onSnapshot para que esten siempre disponibles y actualizados cuando los necesite

### Viernes 04 de Septiembre

- refactor: Productos.jsx lee la cache para cargar productos, si no lo encuentra llama a la funcion que lo carga desde firestore, tenemos que solucionar que llama todos los colegios y todos los tipo prenda, pero una vez cargados no lo vuelve a hacer, tambien ahora muestra el tipo de tipo_prenda dentro de la tarjeta para identicar el producto tambien.

### Sabado 05 de Septiembre

- feat, refactor: agrega verProducto, agrega Storage de firebase como nueva db para guardar datos, como las fotos de los productos que son visibles dentro de verProducto y dentro de Productos en su vistas previas ahora mismo. Ademas, refactoriza todos los estilos ordenandolo los bloques y haciendolo mas facil de leer sin tanto espacios y cometarios.

### Sabado 05 de Septiembre v2 

- feat: agrega modal para agregar foto en el producto, la convierte en 400x400 y en .webp antes de subirla storage.

### Domingo 06 de Septiembre

- feat: producto y verProducto muestra los precios en orden de menor a mayor.

- feat: muestra las medidas de tipo de prenda dentro de verProducto

### Lunes 07 de Septiembre

- feat: crear producto función con Firestore, falta configurar el modal de la foto para que sirva cuando aún no tenemos ID de producto, intenté hacerlo lo más parecido a verProducto, pero no me convencen los estilos.

- feat: agrega boton cancelar dentro de agregar-producto, y quita el bottom nav dentro de esa pagina para evitar salir por accidente cuando estes agregando un producto

### Martes 08 de Septiembre

- feat: crea ModalSelector, un selector que reemplaza al label típico, así estandarizamos para que se vea igual en móvil y en PC. Falta modificar el modalFoto para correrlo directamente desde agregar foto. Todo lo esencial de crear producto para funcionar quedó funcional y estable.

### Miercoles 09 de Septiembre

- feat: crear EditarProducto, usa la base de agregar producto pero con otra url para editar producto, agregar el boton editarproducto dentro de ver producto y quita el boton eliminar desde productos.

### Jueves 10 de Septiembre

- feat: crea Pedidos.jsx, lee el pedido que ingresamos manual dentro de Firestore, hay que hacer que los pedidos se lean de vista horizontal por filas. Cambia el Diagrama UML que prepara la estructura de pedidos.

### Viernes 11 de Septiembre

- feat: agrega modal eliminacion con doble confirmacion, dentro de colegios quedo funcional, falta agregarlo dentro de los otros componentes.

- feat, fix: agrega modal eliminacion con doble confirmacion, dentro de tallas, tipo prenda, y soluciona errores dentro del hidden del scroll dentro de los modals

- feat: agrega ScrollTop, asegura que siempre que cambiemos de página la página esté sin scroll, mejora la UX. Cambiamos los estilos dentro de verProducto; los botones de editar y eliminar están abajo a la derecha.

- feat: agregar borrar dentro de verProducto, borra tanto el doc de Firestore como el doc de Storage, producto manejamos borrado definitivo porque no es un dato indispensable.

### Domingo 13 de Septiembre

- feat: crea AgregarPedido y todos los componentes, se dividio en 3 componentes distintos y 1 padre, crea el primer componente para escribir el nombre del cliente, elcolegio y el número, ordena la estructura del proyecto para hacer modal selector reutilizable en todo el proyecto

### Lunes 14 de Septiembre

- feat, fix: agregamos libreria para estandarizar numeros de clientes, solucionamos errores en el selector de colegios.

- styles: agrega textos claros de titulo de cada bloque, editar producto, pedido y editar

### Miercoles 16 de Septiembre

- styles, fix: oculta la barra de scroll, soluciona bug al imprimir el colegio seleccionado en agregar pedido.

### Viernes 18 de Septiembre

- feat: define la estructuras para el correcto desarrollo de pedidos, divide los bloques por columnas, añade los botones cancelar y agregar dentro de pedidos.

- feat: Añade modal selector de productos funcional, falta poder filtrar busqueda por colegio y tipo de prenda y añadir botones de crear producto y editar producto dentro. Añade AgregarPedidoProductos listando los productos y limpiandolos para pasarlos al padre y poder guardarlos (lo hace independiente de productos con un snapshot historico y convierte las id en los nombres correspodientes.)

- feat, styles: agrega mensajes de error al seleccionar productos sin tipo de prenda, y productos repetidos, hicimos redondos las fotos dentro del modal selector de productos. Cambia los mensajes de Salir de {...} por solo Volver.

- feat: agrega cantidad maxima dentro de PedidoProducto, agrega impresion de colegio/empresa dentro del modal Selector de Productos.

### Sabado 19 de Septiembre

- feat: agrega fecha de entrega dentro de los datos de cliente en agregar pedido.

- feat: agregar guardar como borrador dentro de las funciones, el boton tomar medidas guarda el borrador.

- feat: agrega modal para guardar borrador al salir de la ventana de agregar pedido solo cuando tienes nombre del cliente y un pedido por lo menos. Lo guarda con el estado_guardado:"borrador".

### Domingo 20 de Septiembre

- fix: agregarpedidoCliente ahora envia el nombre cliente de la misma forma que telefono, cuando tiene un error NO lo envia al padre. Antes lo enviaba al padre aunque tuviera digitos especiales.

- fix, feat: quita el autoComplete dentro de Tallas, Tipoprenda, Pedidos y Productos. Agrega CuentasBancarias, agrega modal para crear cuentas bancarias. Se hizo antes de pedidos para poder crear los pagos dentro de pedidos asignandoles la cuenta bancaria a ese pago especifico.

### Martes 22 de Septiembre

- feat: agregar las medidas_asig dentro de agregar producto con un toggle y el boton EDITAR MEDIDAS dentro del toggle, que no aparece si un producto no tiene tipo prenda asignado por cualquier cosa

- fix, feat: fix: arregla duplicado de productos, se volvio a activar por si algun pedido requiere mismo producto y misma talla pero distintas medidas (2 hijos o gemelos), feat: agrega modal para las medidas asignadas, actualiza del map solo el dato, no el nombre, ya que ese se modifica dentro de  tipo prenda.

- refactor: el modal eliminar NO ELIMINA si alguna id del dato se llama en otro sitio, por ej no borra un colegio si un producto lo esta usando, asi evitamos "Sin afiliado", y preparamos el camino para los comprobante de pagos a ciertas cuentas bancarias especificas, asi no podemos borrar las cuentas.

- fix: arregla bug que permitia guardar pedido como borrador sin ningun producto.

### Miercoles 23 de Septiembre

- fix: arregla bug que no permitia borrar productos aunque no esten relacionados (se agrego indixe de firestore para acceder a la subcollecion de productos dentro de pedidos)

- refactor, fix: el modal para agregar fotos ahora NO guarda directamente en storage, lo hace el padre, el modal entrega el blob con la foto procesada y el padre se encarga, ahora agregar producto puede agregar foto sin el bug de doc no encontrado.

### Domingo 27 de Septiembre

- feat, fix: agrega Pedido pagos, falta crear el modal para crear el pago, arregla el bug del selector de la cuenta bancaria.

- feat: agrega modalagregarpago, agrega dentro de agregar pedido pagos reestricciones para agregar pagos, en pedido produtos el boton eliminar se movio a la esquina derecha.

### Lunes 28 de Septiembre

- feat: guarda pedido/pagos en firestore y storage, agrega los estodos de pago dentro de firestore comparando el total del pedido con el total pagado.

- feat: agrega boton para guardar como guardado y borrador, al guardar con el modal borrador se guarda con el estado borrador, al guardar con boton agregar se guarda con estado guardado y se muestra en la ventana primera de pedidos.

- fix: modal selector de cuentas bancarias ya no muestra el boton para crear cuenta y ademas solo muestra las cuentas activas.

### Martes 29 de Septiembre

- feat: agrega pedidos y las vistas previas de los pedidos, cambia los estados guardado borrador por Guardado Borrador. Modifica las query de pedidos para poder cargar en cache las subcolecciones de pedidos.

### Viernes 2 de Octubre

- feat: agrega filtros de busqueda dentro de pedidos, de PROCESO, ENTREGA, y PAGO.

- feat: conectamos con firebase hosting la rama main de github. 

### Domingo 4 de Octubre

- feat, refactor: agregar VerPedido completo, la seccion es solo visual, revisar comprobante envia redirige al link del comprobante de pago, gestionar redirecciona al pedido dentro del producto. Se modificaron las querys de pedidos para mantener productos y pagos dentro del snapshot de firestore

- fix: arregla bug de listener del snapshot de pedidos, al agregar un pedido se perdia e listener de las subcolecciones

- feat: agrega GestionarProducto, permite ver el producto que esta dentro del pedido y ver su estado y sus medidas asigandas, falta que permita cambiar el estado a completado. Agregar numero_pedido, un identificador simple visual con datenow de 7 digitos, es solo para caracter visual y reconocerlo en caso de necesitar buscar un pedido. Se agrego dentro de Pedido, verPedido y GestionarProducto

- fix: arregla el que borrador guarda slice 7 y pedido completo a 6, se definio a 7.

### Luneas 5 de Octubre

- feat: agregar botones dentro de Gestionar Producto para cambiar el estado del producto, agrega ModalConfirmar para confirmar el cambio de estado.

### Lunes 5 de Octubre v2

- feat, fix: Agrega functions, agrega los componentes y cambios necesarios para aislar el eslint del backend(functions) con el del frontend(vitejs), la funcion detecta cambios dentro de productos pedidos y cambia el estado del pedido cuando esta completado.

- doc: cambiamos la bitacora de desarrollo por un DEVELOPMENT_LOG mas profesional y acorde al proyecto

- refactor, feat: refactor de functions separando la arquitectura de index.js para prepararla para mas functions. Agrega function para calcular total de pago y total del pedido mediante cloud, siendo independiente del front end. Modifica los componentes que usan la estructura antigua para usar la nueva.

- fix, style: cambiamos las maxinstances de functions de 10 a solo 1 por cualquier cosa, no necesitamos mas practicamente. Cambiamos size del icono dentro de modal confirmar

- feat: agregar cuantos dias faltan para la entrega o hace cuantos dias fue la entrega o si el pedido esta entregado en Pedidos y VerPedido

- feat: agrega boton de cambiar estado de entrega dentro de verPedido

### Martes 6 de Octubre

- feat, styles: agregar editar medidas dentro gestionar productos, cambia del boton para cambiar estado de produto, agrega boton Gestionar Pagos dentro de VerPedidos no funcional aun.