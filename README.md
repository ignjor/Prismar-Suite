# EN DESARROLLO - Prismar Suite.

## Tecnologías

Framework: **React con Vite.**

Lenguaje: **JavaScript.**

Base de datos: [Firebase](https://firebase.google.com)

Backend: con **Cloud Functions** de [Firebase](https://firebase.google.com)
según lo requiera 


## Paquetes de dependencias

- React
- Vite
- Firebase
- React Router DOM
- Lucide React

```bash
git clone <https://github.com/ignjor/Prismar-Suite.git>
cd prismar-suite
npm install
npm run dev
```


## Modelo de Datos

### Diagrama UML
![Diagrama UML](./Fotos%20Readme/Diagrama.jpg)


La base de datos del proyecto es Firestore de [Firebase](https://firebase.google.com)


| productos                 | pedidos                   |  Colegios*      
| :---:                     | :---:                     |  :---: 
| id_producto = string      | id_pedido = string        |  id_colegio = string                                
| nombre = string           | nombre = string           |  nombre = string                  
| precio = int64            | fono = string             |                 
| talla = string            | fecha_registro = string   |
| active = boolean          | fecha_programada = string |
| stock = int64             | abono = int64             |
| id_colegio = string       | total = int64             |
|                           | comentarios = string      |
|                           | tipo = string             |
|                           | entregado = boolean       |
|                           | fecha_entregado = string  |
|                           | id_producto     = string  |

Los documentos utilizan IDs generados automáticamente por Firestore.
Esto permite delegar la generación de identificadores al servicio y evitar
tener que administrar manualmente los IDs desde la aplicación.

En colegios* puede ser el tipo que requiera, en nuestro caso como la actividad principal de la empresa son los uniformes escolares usamos los colegios para asignarlos a cualquier producto segun lo requiera, asi ademas filtramos mejor cuando lo necesitemos luego.


