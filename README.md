# EN DESARROLLO - Prismar Suite.

Desarrollo de sistema empresarial interno para gestión de productos, pedidos y finanzas. Diseño de modelo de datos en Firestore, autorización basada en roles y reglas de seguridad, junto con optimización de lecturas mediante cache por TanStack Query

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
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

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
    
    match /tipo_prenda/{tipo_prendaId} {

      allow read: if true;

      allow create: if
        request.resource.data.keys().hasOnly([
          "tipo", "medidas_asig"
        ])
        && request.resource.data.tipo is string
        && request.resource.data.tipo.size() >= 2
        && request.resource.data.tipo.size() <= 20
        && request.resource.data.medidas_asig is map
        && request.resource.data.medidas_asig.size() <= 8;


      allow update: if
        request.resource.data.keys().hasOnly([
          "tipo", "medidas_asig"
        ])
        && request.resource.data.tipo is string
        && request.resource.data.tipo.size() >= 2
        && request.resource.data.tipo.size() <= 20
        && request.resource.data.medidas_asig is map
        && request.resource.data.medidas_asig.size() <= 8;

      allow delete: if true;
    }

  }
}
```
### Login (en desarrrollo).


La autenticación de usuarios se realiza mediante Google utilizando Firebase Authentication, solo el administrador tiene acceso a la ventana de usuarios.

La autorización de acceso a los recursos se controla mediante roles y Firebase Security Rules.

Las operaciones administrativas relacionadas con usuarios se ejecutan mediante Cloud Functions, evitando realizar directamente estas operaciones sensibles desde el cliente.
