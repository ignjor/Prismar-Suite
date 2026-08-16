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


| productos             | pedidos                   |        
| :---:                 | :---:                     |        
| id_producto = string  | id_pedido = string        |                                  
| nombre = string       | nombre = string           |                   
| precio = int64        | fono = string             |               
| talla = string        | fecha_registro = string   |
| colegio = string      | fecha_programada = string |
| active = boolean      | abono = int64             |
| stock = int64         | total = int64             |
|                       | comentarios = string      |
|                       | tipo = string             |
|                       | entregado = boolean       |
|                       | fecha_entregado = string  |




