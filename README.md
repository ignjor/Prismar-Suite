# EN DESARROLLO - Prismar Suite.

Desarrollo de sistema empresarial interno para gestión de productos, pedidos y finanzas. Diseño de modelo de datos en Firestore, autorización basada en roles y reglas de seguridad, junto con optimización de lecturas mediante cache por TanStack Query

## Características principales

### Gestión de Productos

El sistema para la correcta gestión de productos y evitar la iteración de datos se divide en 3 componentes:

- Empresas / Colegios
- Tipos de Prenda / Productos
- Unidades de Medida / Tallas

#### Empresas / Colegios
El sistema permite crear sea una empresa o un colegio para luego afiliarlo a un producto especifico, ademas, los pedidos se pueden asignar completos a una empresa o colegio, lo que permite relacionarlos inmediatamente con el diseño (sobretodo para los uniformes escolares).

#### Tipos de Prenda / Productos
El sistema permite crear Tipos de Prenda o productos para luego asignarlos a un producto, estos tipos de prenda incluyen un map con medidas asignadas, medidas que se pueden asignar a un tipo de producto especifico, para luego al tomar el pedido, se puedan anotar las medidas que corresponden dentro del producto del pedido segun el tipo de prenda que corresponda, por ej para un Vestido de Cueca especifico que tiene asignado tipo de prenda Vestido, las medidas disponibles al tomar el pedido serian Largo del Vestido, Caderas, Hombros, segun las medidas que el usuario estipule para ese tipo de prenda, componente reutilizable en todos los productos que se necesiten.

#### Unidades de Medida / Tallas
El sistema permite crear Tallas o Unides de medidas para luego asignar varias a un producto y un producto a cada talla, eso permite no tener que crear varios productos identicos solo para diferenciar la talla y el precio, podemos crear un solo producto con distintos precios segun cualquier unidad de medida segun estipule el usuario.

### Productos






## Tecnologías

Framework: **React con Vite.**

Lenguaje: **JavaScript.**

Base de datos: [Firestore de Firebase](https://firebase.google.com)

Backend: con **Cloud Functions** de [Firebase](https://firebase.google.com)
según lo requiera para la creación de usuarios.

Manejo de Cache y Lecturas: Tan Stack Query.


## Paquetes de dependencias

- React
- Vite
- Firebase
- React Router DOM
- TanStack Query
- Lucide React
- Libphonenumber

```bash
git clone https://github.com/ignjor/Prismar-Suite.git
cd prismar-suite
npm install
npm run dev
```


## Arquitectura

### Diagrama UML

La base de datos del proyecto es Firestore de [Firebase](https://firebase.google.com)

![Diagrama UML](./Fotos%20Readme/Diagrama.jpg)




### Estructura RBAC

Usuarios - Mediante Cloud Functions.
| CRUD                      | Admin   | Other Users |          
| :---:                     | :---:   |   :---:     |     
| CREATE                    | ✔️      |   ✖️       |                        
| READ                      | ✔️      |   ✖️       |            
| UPDATE                    | ✔️      |   ✖️       |
| DELETE                    | ✔️      |   ✖️       |


Tipo de Prenda
| CRUD                      | Admin   | Manager     | Tienda |    Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |  :---:
| CREATE                    | ✔️      |   ✔️       |  ✖️    |    ✖️               
| READ                      | ✔️      |   ✔️       |  ✖️    |    ✖️   
| UPDATE                    | ✔️      |   ✔️       |  ✖️    |   ✖️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✖️


Colegio
| CRUD                      | Admin   | Manager     | Tienda |   Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |   :---:
| CREATE                    | ✔️      |   ✔️       |  ✖️    |   ✖️               
| READ                      | ✔️      |   ✔️       |  ✖️    |   ✖️   
| UPDATE                    | ✔️      |   ✔️       |  ✖️    |   ✖️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✖️


Producto
| CRUD                      | Admin   | Manager     | Tienda |   Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |   :---:
| CREATE                    | ✔️      |   ✔️       |  ✖️    |   ✖️               
| READ                      | ✔️      |   ✔️       |  ✔️    |   ✖️   
| UPDATE                    | ✔️      |   ✔️       |  ✔️    |   ✖️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✖️


Pedidos
| CRUD                      | Admin   | Manager     | Tienda |   Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |   :---:
| CREATE                    | ✔️      |   ✔️       |  ✔️    |   ✖️               
| READ                      | ✔️      |   ✔️       |  ✔️    |   ✖️   
| UPDATE                    | ✔️      |   ✔️       |  ✔️    |   ✖️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✖️

Contabilidad
| CRUD                      | Admin   | Manager     | Tienda |   Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |   :---:
| CREATE                    | ✔️      |   ✔️       |  ✖️    |   ✔️               
| READ                      | ✔️      |   ✔️       |  ✖️    |   ✔️   
| UPDATE                    | ✔️      |   ✔️       |  ✖️    |   ✔️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✔️


## Seguridad

### Reglas de Firestore (Sujetas a Cambios).

> ⚠️ Estas reglas corresponden al estado actual del desarrollo y no representan todavía la configuración definitiva para producción. El acceso será restringido mediante autenticación y RBAC antes del despliegue.

```Firebase
En desarrollo.
```
### Login (en desarrrollo).


La autenticación de usuarios se realiza mediante Google utilizando Firebase Authentication, solo el administrador tiene acceso a la ventana de usuarios.

La autorización de acceso a los recursos se controla mediante roles y Firebase Security Rules.

Las operaciones administrativas relacionadas con usuarios se ejecutan mediante Cloud Functions, evitando realizar directamente estas operaciones sensibles desde el cliente.