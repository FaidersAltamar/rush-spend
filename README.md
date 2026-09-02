# RUSH Spend

Extensión de Chrome para compradores de tráfico: gastos, límites y estados de todas las cuentas de Facebook Ads en una sola ventana.

Versión basada en ADStip Spend 1.14.1, traducida al español y adaptada a la comunidad [RUSH Escuela](https://www.skool.com/rush).

## Características

- **Cuentas** — gasto de hoy, ayer, 7 y 30 días, límites, saldo y estado de cada cuenta
- **Estadísticas** — métricas agregadas por campaña, anuncio o cuenta
- **Activos** — páginas, píxeles, catálogos y Business Managers en un solo lugar
- **Píxel** — diagnóstico y gestión básica del píxel de Facebook
- **Categorías** — organiza tus cuentas con etiquetas personalizadas
- **Moneda** — tipos de cambio y vista consolidada en USD
- **Más** — token, exportación CSV, integración Binom y ajustes

## Instalación

1. Descarga o clona este repositorio
2. Abre Chrome y ve a `chrome://extensions`
3. Activa **Modo de desarrollador** (esquina superior derecha)
4. Pulsa **Cargar descomprimida** y selecciona la carpeta del proyecto
5. Abre Ads Manager en Facebook y usa el icono de la extensión

## Uso rápido

1. Abre [Facebook Ads Manager](https://adsmanager.facebook.com/)
2. Haz clic en el icono **RUSH Spend** en la barra de Chrome
3. En el asistente inicial, pulsa **Capturar token** (o pégalo manualmente en **Más**)
4. Espera a que carguen las cuentas

El token se guarda solo en tu navegador; no se envía a servidores externos.

## Estructura del proyecto

```
├── app.html          # Interfaz principal (popup)
├── app.js            # Lógica de la extensión
├── app.css           # Estilos (tema negro y amarillo RUSH)
├── background.js     # Service worker en segundo plano
├── manifest.json     # Configuración de la extensión
├── icons/            # Iconos 16, 48 y 128 px
├── generate-icons.py # Generador de iconos {R}
└── run-full-pipeline.js  # Pipeline de traducción al español
```

## Desarrollo

### Regenerar iconos

```bash
python generate-icons.py
```

### Pipeline de traducción

Si partes del código fuente en ruso:

```bash
node run-full-pipeline.js
```

## Permisos

| Permiso | Motivo |
|---------|--------|
| `storage` | Guardar token y preferencias localmente |
| `scripting` | Capturar token de la sesión de Ads Manager |
| `tabs` | Leer pestañas de Facebook abiertas |
| `graph.facebook.com` | Consultar la API de Facebook |
| `*.facebook.com` | Acceder al Ads Manager |

## Comunidad

Herramienta gratuita de la comunidad **RUSH**.

- Escuela: [skool.com/rush](https://www.skool.com/rush)

## Licencia

Proyecto derivado con fines educativos para la comunidad RUSH. El código original pertenece a sus respectivos autores.
