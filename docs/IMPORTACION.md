# Importación inicial

La exportación histórica se encuentra en `recovery/d1-export-v72.json`. El importador es repetible: conserva el identificador histórico en cada registro y actualiza ese mismo registro si se ejecuta de nuevo.

## Secuencia en el VPS

1. Copiar `.env.example` como `.env` y sustituir la contraseña de PostgreSQL por una única y segura.
2. Iniciar solamente la base de datos: `docker compose up -d db`.
3. Esperar a que el estado sea saludable: `docker compose ps`.
4. Construir y ejecutar una importación: `docker compose run --rm app npm run import:legacy`.
5. Revisar el resumen que imprime el importador antes de levantar la aplicación con `docker compose up -d app`.

La importación no borra información de la base de datos. Aun así, se realizará una sola vez en la puesta en marcha y se verificará contra los conteos del respaldo.
