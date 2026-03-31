const STORAGE_KEY = 'laceria_lang'

let currentLang = localStorage.getItem(STORAGE_KEY) || 'es'

const subscribers = new Set()

const strings = {
  es: {
    // Header
    'header.pauseAll':  'Pausar todo',
    'header.resumeAll': 'Reanudar',

    // Tabs
    'tabs.rules':    'Reglas',
    'tabs.activity': 'Actividad',
    'tabs.settings': 'Ajustes',

    // Activity
    'activity.heading':       'Actividad',
    'activity.clearBtn':      'Limpiar historial',
    'activity.clearConfirm':  '¿Limpiar todo el historial de actividad?',
    'activity.emptyTitle':    'Sin actividad registrada',
    'activity.emptyDesc':     'Las acciones ejecutadas aparecerán aquí.',
    'activity.statusSuccess': 'Éxito',
    'activity.statusError':   'Error',
    'activity.labelRule':     'Regla',
    'activity.labelFile':     'Archivo',

    // Rules view
    'rules.heading':       'Reglas',
    'rules.newRule':       'Nueva regla',
    'rules.emptyTitle':    'Sin reglas todavía',
    'rules.emptyDesc':     'Crea una regla para empezar a automatizar archivos',
    'rules.active':        'Activa',
    'rules.paused':        'Pausada',
    'rules.noPath':        'sin ruta configurada',
    'rules.condition':     'condición',
    'rules.conditions':    'condiciones',
    'rules.rule':          'regla',
    'rules.rules':         'reglas',
    'rules.edit':          'Editar',
    'rules.deleteConfirm': '¿Eliminar la regla "{{name}}"?',

    // Categories
    'categories.noCategory':      'Sin categoría',
    'categories.deleteTitle':     'Eliminar categoría',
    'categories.deleteMsg':       'Se eliminará la categoría "{{name}}" junto con sus {{count}} {{rulesWord}}. Esta acción no se puede deshacer.',
    'categories.deleteConfirmBtn':'Eliminar categoría',
    'categories.emptyGroup':      'Esta categoría no tiene reglas aún.',
    'categories.newCategory':     '+ Nueva categoría',
    'categories.namePlaceholder': 'Nombre de la categoría',

    // Modal
    'modal.newRule':             'Nueva regla',
    'modal.editRule':            'Editar regla',
    'modal.labelName':           'Nombre',
    'modal.namePlaceholder':     'Mi regla',
    'modal.labelWatchPath':      'Ruta vigilada',
    'modal.watchPathPlaceholder':'C:\\Users\\...\\Descargas',
    'modal.labelOperator':       'Operador de condiciones',
    'modal.opAnd':               'AND — todas deben cumplirse',
    'modal.opOr':                'OR — basta con una',
    'modal.sectionConditions':   'Condiciones',
    'modal.addCondition':        '+ Añadir condición',
    'modal.noConditions':        'Sin condiciones — se aplicará a todos los archivos.',
    'modal.condValuePlaceholder':'valor',
    'modal.sectionActions':      'Acciones',
    'modal.addAction':           '+ Añadir acción',
    'modal.noActions':           'Sin acciones.',
    'modal.destinationPlaceholder': 'Ruta de destino',
    'modal.deleteOriginal':      'Eliminar original',
    'modal.tokenName':           'Nombre original',
    'modal.tokenExt':            'Extensión',
    'modal.tokenDate':           'Fecha',
    'modal.tokenDatetime':       'Fecha y hora',
    'modal.cancel':              'Cancelar',
    'modal.save':                'Guardar',
    'modal.saving':              'Guardando…',
    'modal.labelCategory':       'Categoría',
    'modal.noCategory':          'Sin categoría',
    'modal.createCategory':      'Crear',
    'modal.ignoreProcessed':     'Ignorar archivos creados por Laceria',
    'modal.ignoreProcessedDesc': 'Evita que esta regla se dispare sobre archivos que la app acaba de procesar.',
    'modal.errorName':           'El nombre es obligatorio.',
    'modal.errorPath':           'La ruta vigilada es obligatoria.',
    'modal.errorPathNotFound':   'La ruta vigilada no existe en el sistema de archivos.',
    'modal.errorNoConditions':   'Se necesita al menos una condición.',
    'modal.errorNoActions':      'Se necesita al menos una acción.',
    'modal.errorRenamePattern':  'El patrón contiene caracteres no válidos para nombres de archivo.',
    'modal.errorSave':           'Error al guardar.',

    // Toasts
    'toast.success': 'Regla "{{rule}}" — {{action}} completado.',
    'toast.error':   'Error en regla "{{rule}}": {{message}}',

    // Field options
    'field.extension': 'Extensión',
    'field.name':      'Nombre',
    'field.size':      'Tamaño (bytes)',
    'field.createdAt': 'Fecha de creación',

    // Operators
    'op.equals':      'es igual a',
    'op.contains':    'contiene',
    'op.startsWith':  'empieza por',
    'op.endsWith':    'termina en',
    'op.greaterThan': 'mayor que',
    'op.lessThan':    'menor que',

    // Action types
    'action.move':   'Mover',
    'action.copy':   'Copiar',
    'action.rename': 'Renombrar',
    'action.delete': 'Eliminar',
    'action.unzip':  'Descomprimir',

    // Settings
    'settings.heading':           'Ajustes',
    'settings.loginItem':         'Arrancar con Windows',
    'settings.loginItemDesc':     'Inicia Laceria FAR automáticamente al encender el equipo.',
    'settings.language':          'Idioma',
    'settings.languageDesc':      'Elige el idioma de la interfaz.',
    'settings.langEs':            'Español',
    'settings.langEn':            'English',
    'credit':                     'Realizado por: Alberto Nieto Lozano',
    'settings.appearance':        'Apariencia',
    'settings.appearanceDesc':    'Elige entre modo claro y oscuro.',
    'settings.themeLight':        'Claro',
    'settings.themeDark':         'Oscuro',

    // Tray
    'tray.open':         'Abrir',
    'tray.pauseRules':   'Pausar reglas',
    'tray.resumeRules':  'Reanudar reglas',
    'tray.quit':         'Salir',
  },
  en: {
    // Header
    'header.pauseAll':  'Pause all',
    'header.resumeAll': 'Resume',

    // Tabs
    'tabs.rules':    'Rules',
    'tabs.activity': 'Activity',
    'tabs.settings': 'Settings',

    // Activity
    'activity.heading':       'Activity',
    'activity.clearBtn':      'Clear history',
    'activity.clearConfirm':  'Clear all activity history?',
    'activity.emptyTitle':    'No activity recorded',
    'activity.emptyDesc':     'Executed actions will appear here.',
    'activity.statusSuccess': 'Success',
    'activity.statusError':   'Error',
    'activity.labelRule':     'Rule',
    'activity.labelFile':     'File',

    // Rules view
    'rules.heading':       'Rules',
    'rules.newRule':       'New rule',
    'rules.emptyTitle':    'No rules yet',
    'rules.emptyDesc':     'Create a rule to start automating files',
    'rules.active':        'Active',
    'rules.paused':        'Paused',
    'rules.noPath':        'no path configured',
    'rules.condition':     'condition',
    'rules.conditions':    'conditions',
    'rules.rule':          'rule',
    'rules.rules':         'rules',
    'rules.edit':          'Edit',
    'rules.deleteConfirm': 'Delete rule "{{name}}"?',

    // Categories
    'categories.noCategory':      'Uncategorized',
    'categories.deleteTitle':     'Delete category',
    'categories.deleteMsg':       'Deleting "{{name}}" will also delete its {{count}} {{rulesWord}}. This cannot be undone.',
    'categories.deleteConfirmBtn':'Delete category',
    'categories.emptyGroup':      'This category has no rules yet.',
    'categories.newCategory':     '+ New category',
    'categories.namePlaceholder': 'Category name',

    // Modal
    'modal.newRule':             'New rule',
    'modal.editRule':            'Edit rule',
    'modal.labelName':           'Name',
    'modal.namePlaceholder':     'My rule',
    'modal.labelWatchPath':      'Watched path',
    'modal.watchPathPlaceholder':'C:\\Users\\...\\Downloads',
    'modal.labelOperator':       'Condition operator',
    'modal.opAnd':               'AND — all must match',
    'modal.opOr':                'OR — any one is enough',
    'modal.sectionConditions':   'Conditions',
    'modal.addCondition':        '+ Add condition',
    'modal.noConditions':        'No conditions — applies to all files.',
    'modal.condValuePlaceholder':'value',
    'modal.sectionActions':      'Actions',
    'modal.addAction':           '+ Add action',
    'modal.noActions':           'No actions.',
    'modal.destinationPlaceholder': 'Destination path',
    'modal.deleteOriginal':      'Delete original',
    'modal.tokenName':           'Original name',
    'modal.tokenExt':            'Extension',
    'modal.tokenDate':           'Date',
    'modal.tokenDatetime':       'Date & time',
    'modal.cancel':              'Cancel',
    'modal.save':                'Save',
    'modal.saving':              'Saving…',
    'modal.labelCategory':       'Category',
    'modal.noCategory':          'No category',
    'modal.createCategory':      'Create',
    'modal.ignoreProcessed':     'Ignore files created by Laceria',
    'modal.ignoreProcessedDesc': 'Prevents this rule from triggering on files the app just processed.',
    'modal.errorName':           'Name is required.',
    'modal.errorPath':           'Watch path is required.',
    'modal.errorPathNotFound':   'The watched path does not exist on the file system.',
    'modal.errorNoConditions':   'At least one condition is required.',
    'modal.errorNoActions':      'At least one action is required.',
    'modal.errorRenamePattern':  'The pattern contains characters that are invalid in file names.',
    'modal.errorSave':           'Error saving.',

    // Toasts
    'toast.success': 'Rule "{{rule}}" — {{action}} completed.',
    'toast.error':   'Error in rule "{{rule}}": {{message}}',

    // Field options
    'field.extension': 'Extension',
    'field.name':      'Name',
    'field.size':      'Size (bytes)',
    'field.createdAt': 'Creation date',

    // Operators
    'op.equals':      'equals',
    'op.contains':    'contains',
    'op.startsWith':  'starts with',
    'op.endsWith':    'ends with',
    'op.greaterThan': 'greater than',
    'op.lessThan':    'less than',

    // Action types
    'action.move':   'Move',
    'action.copy':   'Copy',
    'action.rename': 'Rename',
    'action.delete': 'Delete',
    'action.unzip':  'Extract',

    // Settings
    'settings.heading':           'Settings',
    'settings.loginItem':         'Start with Windows',
    'settings.loginItemDesc':     'Starts Laceria FAR automatically when you turn on your computer.',
    'settings.language':          'Language',
    'settings.languageDesc':      'Choose the interface language.',
    'settings.langEs':            'Español',
    'settings.langEn':            'English',
    'credit':                     'Made by: Alberto Nieto Lozano',
    'settings.appearance':        'Appearance',
    'settings.appearanceDesc':    'Choose between light and dark mode.',
    'settings.themeLight':        'Light',
    'settings.themeDark':         'Dark',

    // Tray
    'tray.open':         'Open',
    'tray.pauseRules':   'Pause rules',
    'tray.resumeRules':  'Resume rules',
    'tray.quit':         'Quit',
  },
}

export function t(key, vars = {}) {
  const lang = strings[currentLang] || strings.es
  const str = lang[key] ?? strings.es[key] ?? key
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
}

export function getLanguage() {
  return currentLang
}

export function setLanguage(lang) {
  if (!strings[lang]) return
  currentLang = lang
  localStorage.setItem(STORAGE_KEY, lang)
  subscribers.forEach(cb => cb(lang))
}

export function subscribe(cb) {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}
