# Prismar Sistema Web. 


Sistema administrable para la empresa Prismar

### Todos los cambios y todo el código que se aplican en el proyecto se tienen que documentar.

---
## Tecnologías

Framework: **React con Vite.**

Lenguaje: **JavaScript.**

Base de datos: [Firebase](https://firebase.google.com)

Sin backend como tal, pero con **Cloud Functions** de [Firebase](https://firebase.google.com)
según lo requiera 

## Paquetes de dependencias

El proyecto cuenta con package.json, por lo que con solo instalar ```npm install```
deberia tener todas las dependencias, se adjuntan de todas formas: 

- npm : ```npm install```

- Iconos : ```npm install lucide-react```

- Cambios de ventanas : ```npm install react-router-dom```


## Objetivos y Orden de Prioridades✅❌

- [x] 1. Conexión con Firebase y Base de datos en Firestore.

- [ ] 2. Crear la estructura primero de PRODUCTOS, agregar, modificar y eliminar, y conectarla con Firestore

- [ ] 3. Crear estructura de CREAR PEDIDO, modificarlo y eliminarlo, que cada producto se pueda listar, y claro se usen los Productos agregados previamente en PRODUCTOS. Con la opción de redirigir a crear Producto.

- [ ] 4. En base a los Pedidos, crear CUENTAS, con resumenes mensuales, semanas o como requiera el cliente. Exportaciónes periodicas a Firebase

- [ ] 5. Conectar a CLOUD FUNCTIONS según requiera para notificaciones en el celular, al ser de navegador es mas complejo pero puede ser con mensajes o correos.






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








## Estructura recomendada de la base de datos

La base de datos del proyecto es Firestore de [Firebase](https://firebase.google.com)


| productos             | pedidos                   |        
| :---:                 | :---:                     |        
| id_producto = string  | id_pedido                 |                                  
| nombre = string       | nombre = string           |                   
| precio = int64        | fono = string             |               
| talla = string        | fecha_registro = string   |
| colegio = string      | fecha_entrega = string    |
| active = boolean      | abono = int64             |
| stock = int64         | total = int64             |
|                       | comentarios = string      |
