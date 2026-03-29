<div align="center">

<img src="src/assets/tray-icon.png" width="96" alt="Laceria FAR" />

# Laceria FAR

**File Automation Rules — quiet, precise, always running.**

</div>

---

## What is Laceria FAR?

Laceria FAR is a desktop automation tool for Windows that watches folders and acts on files according to rules you define. Drop a file into a folder and it moves, renames, copies, or extracts itself — automatically, while the app runs silently in the background.

The name comes from **lacería nazarí** — the geometric interlace patterns of Andalusian architecture, where each piece fits precisely with the next to form a larger, repeating whole. A rule in Laceria FAR works the same way: a condition leads to an action, an action chains into another, and together they form a pattern that runs without you thinking about it.

---

## ✦ Features

| | |
|---|---|
| 📂 **Folder watching** | Monitor any folder on your system. Files added to it trigger the rule engine instantly. |
| 🔀 **AND / OR conditions** | Filter by file name, extension, size, or creation date. Combine conditions with AND (all must match) or OR (any is enough). |
| ⛓️ **Chained actions** | Stack multiple actions per rule. Move a file, then rename it, then unzip it — in sequence. |
| 🪟 **System tray** | Runs as a tray icon. No window in your taskbar. Right-click to pause rules, open the interface, or quit. |
| 🌑 **Background mode** | Closing the window doesn't stop the app. Rules keep running as long as your machine is on. |
| 🚀 **Autostart** | Optional Windows login item. Enable it from Settings and the app starts silently on boot. |
| 🗂️ **Visual rule builder** | Build rules through a clean interface. Folder picker for paths, token buttons for rename patterns. |

---

## ⚙️ How it works — a real example

> **Goal:** Any PDF dropped into `Downloads` should be moved to `Documents\PDFs` and renamed with today's date.

**1. Create a new rule**
Open the app, go to *Rules*, click **New rule**.

**2. Set the watch folder**
Click the folder icon next to *Watched path* and select `C:\Users\you\Downloads`.

**3. Add a condition**
- Field: `Extension` · Operator: `equals` · Value: `pdf`

**4. Add actions**
- Action 1 → **Move** → `C:\Users\you\Documents\PDFs`
- Action 2 → **Rename** → `{date}_{name}{ext}` *(e.g. `2025-03-29_invoice.pdf`)*

**5. Enable and forget**
Toggle the rule on. From now on, every `.pdf` landing in Downloads moves and renames itself.

---

## 🛠️ Installation

### From installer

Download `Laceria FAR Setup x.x.x.exe` from the releases page and run it. No admin rights required by default.

### From source

```bash
git clone https://github.com/your-user/laceria-far.git
cd laceria-far
npm install
npm run dev        # development mode with hot reload
npm run build      # build installer → release/
```

**Requirements:** Node.js 18+, Windows 10/11.

---

## 🏗️ Built with

- [Electron](https://www.electronjs.org/) — desktop shell
- [React](https://react.dev/) — UI
- [Vite](https://vitejs.dev/) — build tooling
- [Chokidar](https://github.com/paulmillr/chokidar) — file system watching
- [adm-zip](https://github.com/cthackers/adm-zip) — ZIP extraction

---

## 📸 Lacería

> *The geometric patterns of lacería — the visual origin of this project's name.*

![Image](https://github.com/user-attachments/assets/9c54359a-ff54-4247-8c3b-09e8cb08a0d3)

---

<div align="center">

Las cosas tienen vida propia, todo es cuestión de despertarle el ánima. — Federico García Lorca

</div>
