# README.md del proyecto.

## Tecnologías

Framework: **React con Vite.**

Lenguaje: **JavaScript.**

Base de datos: [Firebase](https://firebase.google.com)

Backend: con **Cloud Functions** de [Firebase](https://firebase.google.com)
según lo requiera 


## Paquetes de dependencias

El proyecto cuenta con package.json, por lo que con solo instalar ```npm install```
deberia tener todas las dependencias, se adjuntan de todas formas: 

- npm : ```npm install```

- Iconos : ```npm install lucide-react```

- Cambios de ventanas : ```npm install react-router-dom```

- Firebase : ```npm install firebase```




## Estructura recomendada de la base de datos

La base de datos del proyecto es Firestore de [Firebase](https://firebase.google.com)


| productos                 | pedidos                   |  Colegios*      
| :---:                     | :---:                     |  :---: 
| id_producto(PK) = string  | id_pedido = string        |  id_colegio = string                                
| nombre = string           | nombre = string           |  nombre = string                  
| precio = int64            | fono = string             |                 
| talla = string            | fecha_registro = string   |
| active = boolean         | fecha_programada = string |
| stock = int64             | abono = int64             |
| id_colegio(FK) = string   | total = int64             |
|                           | comentarios = string      |
|                           | tipo = string             |
|                           | entregado = boolean       |
|                           | fecha_entregado = string  |
|                           | id_producto(FK) = string  |

En colegios* puede ser el tipo que requiera, en nuestro caso como la actividad principal de la empresa son los uniformes escolares usamos los colegios para asignarlos a cualquier producto segun lo requiera, asi ademas filtramos mejor cuando lo necesitemos luego.


