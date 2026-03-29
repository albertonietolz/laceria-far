import React, { useState, useRef } from 'react'
import styles from './RuleModal.module.css'
import { t } from '../i18n'

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
        placeholder={t('modal.destinationPlaceholder')}
      />
      <button type="button" className={styles.btnFolderSm} onClick={pick} title="Seleccionar carpeta">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 3.5h3.5l1 1.5H13a.5.5 0 01.5.5v6a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5v-8A.5.5 0 011 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

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

  const tokens = [
    { label: t('modal.tokenName'),     value: '{name}'     },
    { label: t('modal.tokenExt'),      value: '{ext}'      },
    { label: t('modal.tokenDate'),     value: '{date}'     },
    { label: t('modal.tokenDatetime'), value: '{datetime}' },
  ]

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
        {tokens.map(tok => (
          <button
            key={tok.value}
            type="button"
            className={styles.tokenBtn}
            onClick={() => insert(tok.value)}
          >
            {tok.label}
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
    setConditions(prev => prev.map((c, idx) => {
      if (idx !== i) return c
      if (field === 'field') {
        const validOps = getOperatorsForField(value)
        const op = validOps.includes(c.operator) ? c.operator : validOps[0]
        return { ...c, field: value, operator: op }
      }
      return { ...c, [field]: value }
    }))

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
    if (!name.trim()) { setError(t('modal.errorName')); return }
    if (!watchPath.trim()) { setError(t('modal.errorPath')); return }
    const pathExists = await window.laceria.checkPath(watchPath.trim())
    if (!pathExists) { setError(t('modal.errorPathNotFound')); return }
    if (conditions.length === 0) { setError(t('modal.errorNoConditions')); return }
    if (actions.length === 0) { setError(t('modal.errorNoActions')); return }
    const renameAction = actions.find(a => a.type === 'rename')
    if (renameAction) {
      const invalidChars = /[<>"/\\|?*]/
      const patternWithoutTokens = (renameAction.pattern ?? '').replace(/\{name\}|\{ext\}|\{date\}|\{datetime\}/g, '')
      if (invalidChars.test(patternWithoutTokens)) { setError(t('modal.errorRenamePattern')); return }
    }
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
      setError(e.message || t('modal.errorSave'))
      setSaving(false)
    }
  }

  const fieldOptions = [
    { value: 'extension', label: t('field.extension') },
    { value: 'name',      label: t('field.name')      },
    { value: 'size',      label: t('field.size')      },
    { value: 'createdAt', label: t('field.createdAt') },
  ]

  const operatorOptions = [
    { value: 'equals',      label: t('op.equals')      },
    { value: 'contains',    label: t('op.contains')    },
    { value: 'startsWith',  label: t('op.startsWith')  },
    { value: 'endsWith',    label: t('op.endsWith')    },
    { value: 'greaterThan', label: t('op.greaterThan') },
    { value: 'lessThan',    label: t('op.lessThan')    },
  ]

  const TEXT_OPERATORS = ['equals', 'contains', 'startsWith', 'endsWith']
  const NUM_OPERATORS  = ['equals', 'greaterThan', 'lessThan']

  function getOperatorsForField(field) {
    return (field === 'size' || field === 'createdAt') ? NUM_OPERATORS : TEXT_OPERATORS
  }

  function operatorOptionsFor(field) {
    const allowed = getOperatorsForField(field)
    return operatorOptions.filter(o => allowed.includes(o.value))
  }

  const actionTypes = [
    { value: 'move',   label: t('action.move')   },
    { value: 'copy',   label: t('action.copy')   },
    { value: 'rename', label: t('action.rename') },
    { value: 'delete', label: t('action.delete') },
    { value: 'unzip',  label: t('action.unzip')  },
  ]

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{rule ? t('modal.editRule') : t('modal.newRule')}</h3>
        </div>

        <div className={styles.body}>
          <div className={styles.fieldRow}>
            <label className={styles.label}>{t('modal.labelName')}</label>
            <input
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('modal.namePlaceholder')}
              autoFocus
            />
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.label}>{t('modal.labelWatchPath')}</label>
            <FolderInput
              value={watchPath}
              onChange={setWatchPath}
              placeholder={t('modal.watchPathPlaceholder')}
            />
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.label}>{t('modal.labelOperator')}</label>
            <select
              className={styles.select}
              value={conditionOperator}
              onChange={e => setConditionOperator(e.target.value)}
            >
              <option value="AND">{t('modal.opAnd')}</option>
              <option value="OR">{t('modal.opOr')}</option>
            </select>
          </div>

          {/* Conditions */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{t('modal.sectionConditions')}</span>
              <button className={styles.btnAdd} type="button" onClick={addCondition}>
                {t('modal.addCondition')}
              </button>
            </div>

            {conditions.length === 0 && (
              <p className={styles.sectionEmpty}>{t('modal.noConditions')}</p>
            )}

            <div className={styles.itemList}>
              {conditions.map((cond, i) => (
                <div key={i} className={styles.row}>
                  <select
                    className={styles.selectSm}
                    value={cond.field}
                    onChange={e => updateCondition(i, 'field', e.target.value)}
                  >
                    {fieldOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <select
                    className={styles.selectSm}
                    value={cond.operator}
                    onChange={e => updateCondition(i, 'operator', e.target.value)}
                  >
                    {operatorOptionsFor(cond.field).map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <input
                    className={styles.inputSm}
                    value={cond.value}
                    onChange={e => updateCondition(i, 'value', e.target.value)}
                    placeholder={t('modal.condValuePlaceholder')}
                  />
                  <button
                    className={styles.btnRemove}
                    type="button"
                    onClick={() => removeCondition(i)}
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
              <span className={styles.sectionTitle}>{t('modal.sectionActions')}</span>
              <button className={styles.btnAdd} type="button" onClick={addAction}>
                {t('modal.addAction')}
              </button>
            </div>

            {actions.length === 0 && (
              <p className={styles.sectionEmpty}>{t('modal.noActions')}</p>
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
                      {actionTypes.map(o => (
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
                          {t('modal.deleteOriginal')}
                        </label>
                      </div>
                    )}

                    <button
                      className={styles.btnRemove}
                      type="button"
                      onClick={() => removeAction(i)}
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
            {t('modal.cancel')}
          </button>
          <button className={styles.btnSave} type="button" onClick={handleSave} disabled={saving}>
            {saving ? t('modal.saving') : t('modal.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
