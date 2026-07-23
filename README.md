# Apps Hub

Panel de control central para tus aplicaciones desplegadas, construido con Astro.
Cada app se muestra como una tarjeta con nombre, logo, descripción y enlace directo.
El hub mismo (nombre y logo) también es personalizable.

## Personalizar

Todo se edita desde **`data/config.json`** — no hace falta tocar código ni volver
a compilar la imagen si usas Docker con el volumen montado (ver más abajo).

```json
{
  "hub": {
    "name": "serbaros",
    "tagline": "Panel de control de aplicaciones",
    "logo": "/default-logo.svg"
  },
  "apps": [
    {
      "name": "Fisio",
      "description": "Gestión de citas de fisioterapia para Sara.",
      "url": "https://fisio.apps.serbaros.com",
      "logo": "https://fisio.apps.serbaros.com/logo.png",
      "status": "online"
    }
  ]
}
```

Campos por app:
- **name**: nombre visible
- **description**: descripción corta (1-2 líneas)
- **url**: enlace completo (con `https://`)
- **logo**: URL de imagen (opcional — si se omite, se muestran las iniciales del nombre)
- **status**: `online`, `offline`, o se omite para "sin verificar"

El logo del hub (`hub.logo`) también acepta una ruta local dentro de `public/`
(ej. `/mi-logo.svg`) o una URL externa.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:4321`.

## Desplegar en tu VPS con Coolify

**Opción A — Docker Compose (recomendada):**

1. Sube esta carpeta a un repositorio Git (GitHub, Azure DevOps, etc.) o cópiala
   directamente al VPS.
2. En Coolify: **New Resource → Docker Compose** (o conecta el repo Git y elige
   "Docker Compose" como build pack).
3. Coolify detecta `docker-compose.yml` automáticamente.
4. Asigna el dominio, por ejemplo `hub.apps.serbaros.com`.
5. Despliega. El archivo `data/config.json` queda montado como volumen, así que
   puedes editarlo directamente en el servidor sin reconstruir la imagen:

   ```bash
   nano data/config.json
   # los cambios se reflejan en la siguiente petición, sin reiniciar
   ```

**Opción B — Dockerfile simple:**

Si prefieres que Coolify construya solo desde el `Dockerfile` (sin volumen
editable), elige **Dockerfile** como build pack. En ese caso, cualquier cambio
a `data/config.json` requiere un nuevo despliegue.

## Variables de entorno

- `CONFIG_PATH`: ruta al archivo de configuración (por defecto `./data/config.json`,
  o `/app/data/config.json` dentro del contenedor).
- `PORT`: puerto del servidor (por defecto `4321`).
