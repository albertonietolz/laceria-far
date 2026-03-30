import React, { useState, useEffect, useCallback } from 'react'
import styles from './RulesList.module.css'
import { t } from '../i18n'
import RuleModal from './RuleModal'

function ActionIcon({ type }) {
  switch (type) {
    case 'move':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path d="M1.5 5.5h8M6.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'copy':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <rect x="1" y="3" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M4 3V2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      )
    case 'rename':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path d="M7.5 1.5l2 2-5.5 5.5H2v-2L7.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'delete':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path d="M1.5 3h8M4.5 3V2h2v1M3 3l.5 6.5h4L8 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'unzip':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path d="M5.5 1.5v6M3 5l2.5 2.5L8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 9.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      )
    default:
      return null
  }
}

export default function RulesList() {
  const [rules, setRules] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [paused, setPaused] = useState(false)

  const loadRules = useCallback(async () => {
    const data = await window.laceria.getRules()
    setRules(data)
  }, [])

  useEffect(() => { loadRules() }, [loadRules])

  const handleToggle = async (id) => {
    await window.laceria.toggleRule(id)
    loadRules()
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(t('rules.deleteConfirm', { name }))) return
    await window.laceria.deleteRule(id)
    loadRules()
  }

  const handleNew = () => {
    setEditingRule(null)
    setModalOpen(true)
  }

  const handleEdit = (rule) => {
    setEditingRule(rule)
    setModalOpen(true)
  }

  const handleSaved = () => {
    setModalOpen(false)
    loadRules()
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h2 className={styles.heading}>{t('rules.heading')}</h2>
          {rules.length > 0 && (
            <span className={styles.countBadge}>{rules.length}</span>
          )}
        </div>
        <div className={styles.topBarRight}>
          <button
            className={paused ? `${styles.btnPause} ${styles.btnPaused}` : styles.btnPause}
            onClick={() => {
              if (paused) { window.laceria.resumeWatchers(); setPaused(false) }
              else        { window.laceria.pauseWatchers();  setPaused(true)  }
            }}
          >
            {paused ? t('header.resumeAll') : t('header.pauseAll')}
          </button>
          <button className={styles.btnNew} onClick={handleNew}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            {t('rules.newRule')}
          </button>
        </div>
      </div>

      {rules.length === 0 && (
        <div className={styles.empty}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="7" y="5" width="22" height="26" rx="3" stroke="#d1d5db" strokeWidth="1.5"/>
            <path d="M12 13h12M12 18h12M12 23h7" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className={styles.emptyTitle}>{t('rules.emptyTitle')}</p>
          <span className={styles.emptyDesc}>{t('rules.emptyDesc')}</span>
        </div>
      )}

      <div className={styles.list}>
        {rules.map(rule => {
          const condCount = rule.conditions?.length ?? 0
          const condLabel = `${condCount} ${condCount === 1 ? t('rules.condition') : t('rules.conditions')}`

          return (
            <article
              key={rule.id}
              className={`${styles.card} ${rule.enabled ? styles.cardOn : styles.cardOff}`}
            >
              <div className={styles.cardTop}>
                <div className={styles.nameRow}>
                  <span className={`${styles.dot} ${rule.enabled ? styles.dotOn : styles.dotOff}`} />
                  <span className={styles.ruleName}>{rule.name || t('rules.noPath')}</span>
                  <span className={`${styles.statusLabel} ${rule.enabled ? styles.statusOn : styles.statusOff}`}>
                    {rule.enabled ? t('rules.active') : t('rules.paused')}
                  </span>
                </div>
                <div className={styles.controls}>
                  <label className={styles.toggle} title={rule.enabled ? t('rules.paused') : t('rules.active')}>
                    <input
                      type="checkbox"
                      checked={!!rule.enabled}
                      onChange={() => handleToggle(rule.id)}
                    />
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </label>
                  <button className={styles.btnEdit} onClick={() => handleEdit(rule)}>
                    {t('rules.edit')}
                  </button>
                  <button
                    className={styles.btnDelete}
                    onClick={() => handleDelete(rule.id, rule.name)}
                    title={t('rules.deleteConfirm', { name: rule.name })}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M2 3.5h9M5.5 3.5V2.5h2v1M3.5 3.5l.5 7h5l.5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles.pathRow}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                  <path d="M1 8V4.5a.5.5 0 01.5-.5H4l1-1.5h4.5a.5.5 0 01.5.5V8a.5.5 0 01-.5.5h-8A.5.5 0 011 8z" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                <span>{rule.watchPath || <em>{t('rules.noPath')}</em>}</span>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.condInfo}>
                  <span className={styles.opBadge}>{rule.conditionOperator ?? 'AND'}</span>
                  <span className={styles.condCount}>{condLabel}</span>
                </div>
                {rule.actions?.length > 0 && (
                  <div className={styles.chips}>
                    {rule.actions.map((action, i) => (
                      <span key={i} className={`${styles.chip} ${styles[`chip_${action.type}`]}`}>
                        <ActionIcon type={action.type} />
                        {t(`action.${action.type}`) || action.type}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {modalOpen && (
        <RuleModal
          rule={editingRule}
          onSaved={handleSaved}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
