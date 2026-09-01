# Custom Graphics · Cotizador

Sistema interno para cotizar proyectos de **Gran Formato**, **Materiales Rígidos**, **Señalética** y, posteriormente, **Letreros 3D**.

## Objetivo

Concentrar clientes, proveedores, materias primas, cotizaciones, órdenes de compra, producción y ventas en una aplicación propia, alojada en el VPS de Custom Graphics.

## Flujo de cotización

1. Cliente y vendedor
2. Sistema aplicable
3. Diseño
4. Impresión o material principal
5. Acabados y complementos
6. Estructura
7. Instalación
8. Revisión final y PDF

## Módulos prioritarios

- Catálogo central de materias primas con historial de costos
  - Gran formato
  - Vinil de corte por marca y serie
  - Materiales rígidos
  - Herrería y consumibles
- Proveedores y órdenes de compra
- Cotizador de Gran Formato
- Cotizador de Materiales Rígidos
- Costeo de estructura de herrería
- PDF comercial y orden de producción
- Usuarios y permisos

## Principios de costeo

- Los precios de compra se capturan por su presentación real: rollo, lámina, barra, pieza o unidad.
- El sistema calcula y utiliza el costo normalizado por m², metro lineal, pieza u hora.
- Cada actualización conserva historial y promedio de costos.
- Las cotizaciones nuevas toman el costo vigente; las cotizaciones guardadas conservan su costo histórico.
- El resumen final clasifica los costos por materia prima, mano de obra, procesos e indirectos.

## Infraestructura

- Código: repositorio privado de GitHub.
- Servidor: VPS propio de Custom Graphics.
- Despliegue: contenedores Docker y HTTPS.
- Base de datos: migración de los catálogos y registros existentes, seguida de base de datos propia.

## Estado de recuperación

El sitio anterior permanece activo en la versión 72. Su base de datos contiene catálogos, proveedores, clientes, cotizaciones y órdenes de compra que serán respaldados antes de la migración.
