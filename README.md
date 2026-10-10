# Prismar Suite. 


[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.17-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.102-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Node.js](https://img.shields.io/badge/Node.js-22.22.3-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

<div align="center">

### Proyecto en desarrollo

</div>


### Descripción General

Prismar Suite es una aplicación web empresarial desarrollada para Prismar, diseñada como sistema de gestión interna que centraliza el 100% de procesos administrativos de la empresa (la administración de productos, pedidos de clientes, cuentas bancarias y finanzas). El sistema implementa una arquitectura basada en roles con seguridad empresarial y optimizaciones avanzadas para minimizar costos.

### Propósito del Proyecto
 
- **Digitalización completa de procesos** empresariales tradicionales de Prismar
- **Reducción de errores logisticos** en gestión de pedidos y finanzas de la empresa
- **Control financiero** con seguimiento de pagos y estados de entrega

---
### 📦 Gestión de Productos (Sistema de 3 Componentes)

#### 1. **Empresas / Colegios**
- Creación y gestión de instituciones afiliadas
- Vinculación directa con productos y pedidos
- Especialmente diseñado para uniformes escolares con diseños específicos por institución

#### 2. **Tipos de Prenda / Productos**
- Sistema de **medidas personalizables** por tipo de prenda
- Mapas de medidas reutilizables (ej: Vestido usa "Largo", "Caderas", "Hombros")
- Asignación dinámica de medidas según el tipo de producto en pedidos

#### 3. **Unidades de Medida / Tallas**
- Gestión de múltiples tallas dentro de un solo producto
- **Precios variables** por talla/unidad de medida
- Elimina la necesidad de crear productos duplicados por talla

---
### 🛒 Gestión Avanzada de Pedidos

- **Información del cliente** con validación y estandarización de números telefónicos
- **Selector inteligente de productos** con filtros por colegio y tipo de prenda
- **Toma de medidas personalizadas** por producto según el tipo de prenda
- **Sistema de borradores** para pedidos incompletos
- **Cálculo automático** de estados de pago mediante Cloud Functions
- **Seguimiento de entrega** con contador de días restantes/atrasados
- **Múltiples productos** por pedido con tallas y medidas independientes
- **Comprobantes de pago** con gestión de archivos en Firebase Storage

---
### 💰 Gestión Financiera

- **Cuentas bancarias** múltiples para diferentes operaciones de finanzas
- **Pagos registrados** con asignación a cuenta bancaria específica
- **Resumen financiero** con barra de progreso de pagos
- **Historial de transacciones** por pedido

---
### 🏠 Dashboard Principal (En Desarrollo)

- Calendario semanal de pedidos
- Resúmenes financieros
- Sistema de notificaciones (mediante Cloud Functions)


## Arquitectura Técnica

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.8 | Biblioteca UI principal |
| **Vite** | 8.2.0 | Build tool ultrarrápido |
| **JavaScript ES6+** | Nativo | Lenguaje de programación |
| **Node.js** | 22.22.3 | Desarrollo |
| **React Router DOM** | 7.18.2 | Enrutamiento SPA |
| **TanStack Query** | 5.102.8 | Gestión de estado del servidor y caché |
| **Lucide React** | 1.30.0 | Biblioteca de iconos moderna |
| **libphonenumber-js** | 1.13.13 | Estandarización de números telefónicos |

---
### Backend y Infraestructura Cloud
| Servicio | Uso |
|----------|-----|
| **Firestore** | Base de datos NoSQL principal |
| **Firebase Storage** | Almacenamiento de imágenes y comprobantes |
| **Cloud Functions** | Lógica de negocio sensible y triggers |
| **Firebase Authentication** | Autenticación de usuarios (Google) |
| **Firebase Hosting** | Despliegue de la aplicación |


## Seguridad y Autorización

### Estructura RBAC

El sistema implementa 4 roles principales con permisos granulares:

| Rol | Responsabilidades |
|-----|-------------------|
| **Admin** | Control total del sistema, gestión de usuarios |
| **Manager** | Administración de productos, pedidos y finanzas |
| **Tienda** | Gestión de pedidos y productos |
| **Contabilidad** | Administración de cuentas y pagos |


| Users                      | Admin   | Other Users |          
| :---:                     | :---:   |   :---:     |     
| CREATE                    | ✔️      |   ✖️       |                        
| READ                      | ✔️      |   ✖️       |            
| UPDATE                    | ✔️      |   ✖️       |
| DELETE                    | ✔️      |   ✖️       |


 
Tipo de Prenda                      | Admin   | Manager     | Tienda |    Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |  :---:
| CREATE                    | ✔️      |   ✔️       |  ✖️    |    ✖️               
| READ                      | ✔️      |   ✔️       |  ✖️    |    ✖️   
| UPDATE                    | ✔️      |   ✔️       |  ✖️    |   ✖️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✖️



| Colegio                      | Admin   | Manager     | Tienda |   Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |   :---:
| CREATE                    | ✔️      |   ✔️       |  ✖️    |   ✖️               
| READ                      | ✔️      |   ✔️       |  ✖️    |   ✖️   
| UPDATE                    | ✔️      |   ✔️       |  ✖️    |   ✖️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✖️



| Producto                      | Admin   | Manager     | Tienda |   Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |   :---:
| CREATE                    | ✔️      |   ✔️       |  ✖️    |   ✖️               
| READ                      | ✔️      |   ✔️       |  ✔️    |   ✖️   
| UPDATE                    | ✔️      |   ✔️       |  ✔️    |   ✖️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✖️


| Pedidos                      | Admin   | Manager     | Tienda |   Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |   :---:
| CREATE                    | ✔️      |   ✔️       |  ✔️    |   ✖️               
| READ                      | ✔️      |   ✔️       |  ✔️    |   ✖️   
| UPDATE                    | ✔️      |   ✔️       |  ✔️    |   ✖️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✖️


| Contabilidad                      | Admin   | Manager     | Tienda |   Contabilidad       
| :---:                     | :---:   |   :---:     | :---:  |   :---:
| CREATE                    | ✔️      |   ✔️       |  ✖️    |   ✔️               
| READ                      | ✔️      |   ✔️       |  ✖️    |   ✔️   
| UPDATE                    | ✔️      |   ✔️       |  ✖️    |   ✔️
| DELETE                    | ✔️      |   ✔️       |  ✖️    |   ✔️


### Medidas de Seguridad

-  **Reglas de Firestore** para validación de acceso a datos
-  **Cloud Functions** para operaciones sensibles (creación de usuarios)
-  **Autenticación Auth** con Google
-  **Sanitización de inputs** para prevenir inyección de código
-  **Confirmaciones dobles** para operaciones destructivas


##  CI/CD y Despliegue

### Pipeline Automatizado con GitHub Actions

- **Despliegue automático** a Firebase Hosting en merge a `main`
- **Preview deployments** para cada Pull Request
- **Validación de código** con ESLint
- **Build optimizado** con Vite

---

## Documentación Adicional

- [Bitácora de Desarrollo](./DEVELOPMENT_LOG.md) - Historial detallado del desarrollo


### ¿Por qué estas tecnologías?

- **React + Vite**: Combinación moderna para desarrollo rápido con hot reload instantáneo
- **TanStack Query**: Manejo eficiente de estado del servidor con caché inteligente
- **Firebase**: Backend serverless que permite desarrollo rápido sin infraestructura
- **Cloud Functions**: Lógica de negocio segura y escalable
- **React Router v7**: Enrutamiento moderno con data loading integrado


## Desarrollador

**Ignacio Jorquera Díaz**
- LinkedIn: [Ignacio Jorquera Díaz](https://www.linkedin.com/in/ignacio-jorquera-d%C3%ADaz-88646640a/)
- Email: ignaciojorqueradiaz.ij@gmail.com

---

<div align="center">

### Proyecto en desarrollo
[Solicitar Feature o Reportar Bug](https://github.com/ignjor/Prismar-Suite/issues)

</div>
