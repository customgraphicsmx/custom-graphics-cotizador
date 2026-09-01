# Auditoría de recuperación · versión 72

Fecha: 1 de septiembre de 2026

## Recuperación confirmada

- El código fuente del cotizador se recuperó desde el proyecto original.
- El sitio original permanece activo en la versión 72.
- La base de datos original contiene:
  - Materias primas y su historial de costos
  - Catálogos Arlon y LX
  - Materiales rígidos y costos laborales
  - Proveedores, clientes, cotizaciones y órdenes de compra
  - Usuarios y configuración de la organización

## Validación técnica

La recuperación local compiló correctamente.

- Compilación: correcta
- Pruebas automáticas: 10 de 10 correctas
- Rutas API recuperadas: materiales, rígidos, Arlon, LX, proveedores, clientes, cotizaciones, órdenes de compra, usuarios y configuración.

## Hallazgo clave

El código recuperado usa bindings de Cloudflare D1 y un entorno de despliegue temporal. No es seguro ni conveniente ejecutarlo directamente en el VPS como sistema productivo.

## Decisión de migración

La aplicación nueva conservará las reglas comerciales y los datos, pero cambiará la infraestructura:

- Aplicación web en contenedores Docker.
- Base de datos PostgreSQL propia en el VPS.
- Copias de seguridad y variables de entorno fuera del repositorio.
- Despliegue reproducible desde la rama principal.
- Los módulos de estructura, instalación y revisión final se implementarán sobre esta base estable.

## Prioridad inmediata

1. Exportar y resguardar datos del sistema anterior.
2. Crear la aplicación con PostgreSQL y autenticación propia.
3. Migrar catálogo de costos y cotizaciones.
4. Reconstruir el flujo de Gran Formato, luego Rígidos, estructura e instalación.
