import React, { useState, useRef } from 'react'
import styles from './RuleModal.module.css'

const FIELD_OPTIONS = [
  { value: 'extension', label: 'Extensión' },
  { value: 'name', label: 'Nombre' },
  { value: 'size', label: 'Tamaño (bytes)' },
  { value: 'createdAt', label: 'Fecha de creación' },
]

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'es igual a' },
  { value: 'contains', label: 'contiene' },
  { value: 'startsWith', label: 'empieza por' },
  { value: 'endsWith', label: 'termina en' },
  { value: 'greaterThan', label: 'mayor que' },
  { value: 'lessThan', label: 'menor que' },
]

const ACTION_TYPES = [
  { value: 'move', label: 'Mover' },
  { value: 'copy', label: 'Copiar' },
  { value: 'rename', label: 'Renombrar' },
  { value: 'delete', label: 'Eliminar' },
  { value: 'unzip', label: 'Descomprimir' },
]

function emptyCondition() {
  return { field: 'extension', operator: 'equals', value: '' }
}

function emptyAction() {
  return { type: 'move', destination: '' }
}

function FolderInput({ value, onChange, placeholder }) {
  const pick = async () => {
    const path = await window.laceria.selectFolder()
    if (path !== null) onChange(path)
  }

  return (
    <div className={styles.folderInput}>
      <input
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button type="button" className={styles.btnFolder} onClick={pick} title="Seleccionar carpeta">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 3.5h3.5l1 1.5H13a.5.5 0 01.5.5v6a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5v-8A.5.5 0 011 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

function FolderInputSm({ value, onChange }) {
  const pick = async () => {
    const path = await window.laceria.selectFolder()
    if (path !== null) onChange(path)
  }

  return (
    <div className={styles.folderInputSm}>
      <input
        className={styles.inputSm}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Ruta de destino"
      />
      <button type="button" className={styles.btnFolderSm} onClick={pick} title="Seleccionar carpeta">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 3.5h3.5l1 1.5H13a.5.5 0 01.5.5v6a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5v-8A.5.5 0 011 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

const RENAME_TOKENS = [
  { label: 'Nombre original', value: '{name}' },
  { label: 'Extensión',       value: '{ext}'  },
  { label: 'Fecha',           value: '{date}' },
  { label: 'Fecha y hora',    value: '{datetime}' },
]

function RenameInput({ value, onChange }) {
  const inputRef = useRef(null)

  const insert = (token) => {
    const input = inputRef.current
    if (!input) return
    const start = input.selectionStart ?? value.length
    const end   = input.selectionEnd   ?? value.length
    const next  = value.slice(0, start) + token + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      input.focus()
      input.setSelectionRange(start + token.length, start + token.length)
    })
  }

  return (
    <div className={styles.renameBuilder}>
      <input
        ref={inputRef}
        className={styles.inputSm}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="informe_{date}{ext}"
      />
      <div className={styles.tokenRow}>
        {RENAME_TOKENS.map(t => (
          <button
            key={t.value}
            type="button"
            className={styles.tokenBtn}
            onClick={() => insert(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function RuleModal({ rule, onSaved, onCancel }) {
  const [name, setName] = useState(rule?.name ?? '')
  const [watchPath, setWatchPath] = useState(rule?.watchPath ?? '')
  const [conditionOperator, setConditionOperator] = useState(rule?.conditionOperator ?? 'AND')
  const [conditions, setConditions] = useState(
    rule?.conditions?.length ? rule.conditions : [emptyCondition()]
  )
  const [actions, setActions] = useState(
    rule?.actions?.length ? rule.actions : [emptyAction()]
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const updateCondition = (i, field, value) =>
    setConditions(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c))

  const addCondition = () =>
    setConditions(prev => [...prev, emptyCondition()])

  const removeCondition = (i) =>
    setConditions(prev => prev.filter((_, idx) => idx !== i))

  const updateAction = (i, field, value) =>
    setActions(prev => prev.map((a, idx) => {
      if (idx !== i) return a
      if (field === 'type') return { type: value }
      return { ...a, [field]: value }
    }))

  const addAction = () =>
    setActions(prev => [...prev, emptyAction()])

  const removeAction = (i) =>
    setActions(prev => prev.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    if (!name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!watchPath.trim()) { setError('La ruta vigilada es obligatoria.'); return }
    setSaving(true)
    setError('')
    try {
      const ruleData = {
        ...(rule?.id ? { id: rule.id } : {}),
        name: name.trim(),
        watchPath: watchPath.trim(),
        conditionOperator,
        conditions,
        actions,
        enabled: rule?.enabled ?? true,
      }
      await window.laceria.saveRule(ruleData)
      onSaved()
    } catch (e) {
      setError(e.message || 'Error al guardar.')
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{rule ? 'Editar regla' : 'Nueva regla'}</h3>
        </div>

        <div className={styles.body}>
          <div className={styles.fieldRow}>
            <label className={styles.label}>Nombre</label>
            <input
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Mi regla"
              autoFocus
            />
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.label}>Ruta vigilada</label>
            <FolderInput
              value={watchPath}
              onChange={setWatchPath}
              placeholder="C:\Users\...\Descargas"
            />
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.label}>Operador de condiciones</label>
            <select
              className={styles.select}
              value={conditionOperator}
              onChange={e => setConditionOperator(e.target.value)}
            >
              <option value="AND">AND — todas deben cumplirse</option>
              <option value="OR">OR — basta con una</option>
            </select>
          </div>

          {/* Conditions */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Condiciones</span>
              <button className={styles.btnAdd} type="button" onClick={addCondition}>
                + Añadir condición
              </button>
            </div>

            {conditions.length === 0 && (
              <p className={styles.sectionEmpty}>Sin condiciones — se aplicará a todos los archivos.</p>
            )}

            <div className={styles.itemList}>
              {conditions.map((cond, i) => (
                <div key={i} className={styles.row}>
                  <select
                    className={styles.selectSm}
                    value={cond.field}
                    onChange={e => updateCondition(i, 'field', e.target.value)}
                  >
                    {FIELD_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <select
                    className={styles.selectSm}
                    value={cond.operator}
                    onChange={e => updateCondition(i, 'operator', e.target.value)}
                  >
                    {OPERATOR_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <input
                    className={styles.inputSm}
                    value={cond.value}
                    onChange={e => updateCondition(i, 'value', e.target.value)}
                    placeholder="valor"
                  />
                  <button
                    className={styles.btnRemove}
                    type="button"
                    onClick={() => removeCondition(i)}
                    title="Eliminar condición"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Acciones</span>
              <button className={styles.btnAdd} type="button" onClick={addAction}>
                + Añadir acción
              </button>
            </div>

            {actions.length === 0 && (
              <p className={styles.sectionEmpty}>Sin acciones.</p>
            )}

            <div className={styles.itemList}>
              {actions.map((action, i) => (
                <div key={i} className={styles.actionBlock}>
                  {i > 0 && <div className={styles.chainArrow}>↓</div>}
                  <div className={styles.row}>
                    <select
                      className={styles.selectSm}
                      value={action.type}
                      onChange={e => updateAction(i, 'type', e.target.value)}
                    >
                      {ACTION_TYPES.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>

                    {(action.type === 'move' || action.type === 'copy') && (
                      <FolderInputSm
                        value={action.destination ?? ''}
                        onChange={val => updateAction(i, 'destination', val)}
                      />
                    )}

                    {action.type === 'rename' && (
                      <RenameInput
                        value={action.pattern ?? ''}
                        onChange={val => updateAction(i, 'pattern', val)}
                      />
                    )}

                    {action.type === 'unzip' && (
                      <div className={styles.unzipWrap}>
                        <FolderInputSm
                          value={action.destination ?? ''}
                          onChange={val => updateAction(i, 'destination', val)}
                        />
                        <label className={styles.checkLabel}>
                          <input
                            type="checkbox"
                            checked={!!action.deleteOriginal}
                            onChange={e => updateAction(i, 'deleteOriginal', e.target.checked)}
                          />
                          Eliminar original
                        </label>
                      </div>
                    )}

                    <button
                      className={styles.btnRemove}
                      type="button"
                      onClick={() => removeAction(i)}
                      title="Eliminar acción"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.btnSave} type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
