<div align="center">

<img src="src/assets/tray-icon.png" width="96" alt="Laceria FAR" />

# Laceria FAR

**Reglas de automatización de archivos — silencioso, preciso, siempre activo.**

</div>

---

> **En desarrollo.** Laceria FAR está actualmente en desarrollo activo y en fase de pruebas. Es posible encontrar errores, funcionalidades incompletas y cambios que rompan la compatibilidad entre versiones.

---

## ¿Qué es Laceria FAR?

Laceria FAR es una herramienta de automatización de escritorio para Windows que vigila carpetas y actúa sobre los archivos según reglas que tú defines. Deja caer un archivo en una carpeta y se mueve, renombra, copia o extrae solo — de forma automática, mientras la aplicación corre en silencio en segundo plano.

El nombre viene de la **lacería nazarí** — los patrones geométricos entrelazados de la arquitectura andaluza, donde cada pieza encaja con precisión en la siguiente para formar un todo mayor que se repite. Una regla en Laceria FAR funciona igual: una condición lleva a una acción, una acción encadena con otra, y juntas forman un patrón que funciona solo.

---

## Funcionalidades

| | |
|---|---|
| **Vigilancia de carpetas** | Monitoriza cualquier carpeta del sistema. Los archivos que entren disparan el motor de reglas al instante. |
| **Condiciones AND / OR** | Filtra por nombre, extensión, tamaño o fecha de creación. Combina condiciones con AND (todas deben cumplirse) o OR (basta con una). |
| **Acciones encadenadas** | Apila varias acciones por regla. Mueve un archivo, luego renómbralo, luego descomprímelo — en secuencia. |
| **Icono en bandeja del sistema** | Vive como icono en la bandeja. Sin ventana en la barra de tareas. Clic derecho para pausar reglas, abrir la interfaz o cerrar la app. |
| **Modo background** | Cerrar la ventana no detiene la app. Las reglas siguen activas mientras el equipo esté encendido. |
| **Arranque automático** | Inicio con Windows opcional. Actívalo desde Ajustes y la app arranca en silencio al encender el equipo. |
| **Constructor visual de reglas** | Crea reglas desde una interfaz limpia. Selector de carpeta para las rutas, botones de variables para los patrones de renombrado. |
| **Registro de actividad** | Cada acción ejecutada por una regla queda registrada en tiempo real — tipo de acción, nombre de la regla, archivo, marca de tiempo y detalle del error si algo falla. Almacena hasta 500 entradas y puede borrarse en cualquier momento. |
| **Tema claro / oscuro** | Cambia entre apariencia clara y oscura desde Ajustes. La elección se guarda y se aplica al siguiente inicio. |

---

## Cómo funciona — un ejemplo real

> **Objetivo:** Que cualquier PDF que llegue a `Descargas` se mueva a `Documentos\PDFs` y se renombre con la fecha de hoy.

**1. Crea una regla nueva**
Abre la app, ve a *Reglas*, pulsa **Nueva regla**.

**2. Configura la carpeta vigilada**
Pulsa el icono de carpeta junto a *Ruta vigilada* y selecciona `C:\Users\tu_usuario\Descargas`.

**3. Añade una condición**
- Campo: `Extensión` · Operador: `es igual a` · Valor: `pdf`

**4. Añade las acciones**
- Acción 1 → **Mover** → `C:\Users\tu_usuario\Documentos\PDFs`
- Acción 2 → **Renombrar** → `{date}_{name}{ext}` *(resultado: `2025-03-29_factura.pdf`)*

**5. Actívala y olvídate**
Pon el toggle en activo. A partir de ahora, cada `.pdf` que caiga en Descargas se mueve y renombra solo.

---

## Instalación

### Desde el instalador

Descarga `Laceria FAR Setup x.x.x.exe` desde la página de releases y ejecútalo. Por defecto no requiere permisos de administrador.

### Desde el código fuente

```bash
git clone https://github.com/tu-usuario/laceria-far.git
cd laceria-far
npm install
npm run dev        # modo desarrollo con recarga automática
npm run build      # genera el instalador → release/
```

**Requisitos:** Node.js 18+, Windows 10/11.

---

## Construido con

- [Electron](https://www.electronjs.org/) — shell de escritorio
- [React](https://react.dev/) — interfaz de usuario
- [Vite](https://vitejs.dev/) — compilación y desarrollo
- [Chokidar](https://github.com/paulmillr/chokidar) — vigilancia del sistema de archivos
- [adm-zip](https://github.com/cthackers/adm-zip) — extracción de ZIP

---

## Lacería

> *Los patrones geométricos de la lacería nazarí — el origen visual del nombre de este proyecto.*

![Image](https://github.com/user-attachments/assets/9c54359a-ff54-4247-8c3b-09e8cb08a0d3)

---

<div align="center">

