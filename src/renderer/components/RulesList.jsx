import React, { useState, useEffect, useCallback } from 'react'
import styles from './RulesList.module.css'
import { t } from '../i18n'
import RuleModal from './RuleModal'

// ── Icons ──────────────────────────────────────────────────────────────────

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

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 3.5h9M5.5 3.5V2.5h2v1M3.5 3.5l.5 7h5l.5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Rule card ──────────────────────────────────────────────────────────────

function RuleCard({ rule, onToggle, onEdit, onDelete }) {
  const condCount = rule.conditions?.length ?? 0
  const condLabel = `${condCount} ${condCount === 1 ? t('rules.condition') : t('rules.conditions')}`

  return (
    <article className={`${styles.card} ${rule.enabled ? styles.cardOn : styles.cardOff}`}>
      <div className={styles.cardTop}>
        <div className={styles.nameRow}>
          <span className={`${styles.dot} ${rule.enabled ? styles.dotOn : styles.dotOff}`} />
          <span className={styles.ruleName}>{rule.name}</span>
          <span className={`${styles.statusLabel} ${rule.enabled ? styles.statusOn : styles.statusOff}`}>
            {rule.enabled ? t('rules.active') : t('rules.paused')}
          </span>
        </div>
        <div className={styles.controls}>
          <label className={styles.toggle} title={rule.enabled ? t('rules.paused') : t('rules.active')}>
            <input
              type="checkbox"
              checked={!!rule.enabled}
              onChange={() => onToggle(rule.id)}
            />
            <span className={styles.toggleTrack}>
              <span className={styles.toggleThumb} />
            </span>
          </label>
          <button className={styles.btnEdit} onClick={() => onEdit(rule)}>
            {t('rules.edit')}
          </button>
          <button
            className={styles.btnDelete}
            onClick={() => onDelete(rule.id, rule.name)}
            title={t('rules.deleteConfirm', { name: rule.name })}
          >
            <TrashIcon />
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
}

// ── Category delete confirmation modal ────────────────────────────────────

function ConfirmDeleteCategory({ name, count, onConfirm, onCancel }) {
  const rulesWord = count === 1 ? t('rules.rule') : t('rules.rules')
  return (
    <div className={styles.overlay}>
      <div className={styles.confirmModal}>
        <div className={styles.confirmHeader}>
          <h3 className={styles.confirmTitle}>{t('categories.deleteTitle')}</h3>
        </div>
        <div className={styles.confirmBody}>
          <p className={styles.confirmMessage}>
            {t('categories.deleteMsg', { name, count, rulesWord })}
          </p>
        </div>
        <div className={styles.confirmFooter}>
          <button className={styles.btnCancelConfirm} type="button" onClick={onCancel}>
            {t('modal.cancel')}
          </button>
          <button className={styles.btnDeleteConfirm} type="button" onClick={onConfirm}>
            {t('categories.deleteConfirmBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function RulesList() {
  const [rules, setRules] = useState([])
  const [categories, setCategories] = useState([])
  const [collapsed, setCollapsed] = useState({})
  const [pausedCategories, setPausedCategories] = useState(new Set())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [paused, setPaused] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadData = useCallback(async () => {
    const [rulesData, catsData] = await Promise.all([
      window.laceria.getRules(),
      window.laceria.getCategories(),
    ])
    setRules(rulesData)
    setCategories(catsData)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleToggle = async (id) => {
    await window.laceria.toggleRule(id)
    loadData()
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(t('rules.deleteConfirm', { name }))) return
    await window.laceria.deleteRule(id)
    loadData()
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
    loadData()
  }

  const handlePauseCategory = async (categoryId) => {
    if (pausedCategories.has(categoryId)) {
      await window.laceria.resumeCategory(categoryId)
      setPausedCategories(prev => { const s = new Set(prev); s.delete(categoryId); return s })
    } else {
      await window.laceria.pauseCategory(categoryId)
      setPausedCategories(prev => new Set([...prev, categoryId]))
    }
  }

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteConfirm) return
    await window.laceria.deleteCategory(deleteConfirm.id)
    setDeleteConfirm(null)
    loadData()
  }

  const toggleCollapse = (key) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Group rules by categoryId
  const grouped = {}
  for (const rule of rules) {
    const key = rule.categoryId || '__none__'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(rule)
  }
  const uncategorized = grouped['__none__'] || []

  return (
    <div className={styles.container}>
      {/* Top bar */}
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

      {/* Empty state */}
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

      {/* Grouped list */}
      <div className={styles.groups}>
        {/* Named category groups */}
        {categories.map(cat => {
          const catRules = grouped[cat.id] || []
          const isCollapsed = !!collapsed[cat.id]
          const isCatPaused = pausedCategories.has(cat.id)
          const rulesWord = catRules.length === 1 ? t('rules.rule') : t('rules.rules')

          return (
            <div key={cat.id} className={styles.group}>
              <div
                className={`${styles.groupHeader} ${isCatPaused ? styles.groupHeaderPaused : ''}`}
                style={{ borderLeftColor: cat.color }}
              >
                <button
                  className={styles.collapseToggle}
                  onClick={() => toggleCollapse(cat.id)}
                  title={isCollapsed ? 'Expandir' : 'Contraer'}
                >
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
                  >
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={styles.catColorDot} style={{ background: cat.color }} />
                <span className={styles.catName}>{cat.name}</span>
                <span className={styles.catCount}>{catRules.length} {rulesWord}</span>
                <div className={styles.groupControls}>
                  <button
                    className={`${styles.btnCatAction} ${isCatPaused ? styles.btnCatPaused : ''}`}
                    onClick={() => handlePauseCategory(cat.id)}
                    title={isCatPaused ? t('header.resumeAll') : t('header.pauseAll')}
                  >
                    {isCatPaused ? t('header.resumeAll') : t('header.pauseAll')}
                  </button>
                  <button
                    className={styles.btnCatDelete}
                    onClick={() => setDeleteConfirm({ id: cat.id, name: cat.name, count: catRules.length })}
                    title={t('categories.deleteTitle')}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className={styles.groupBody}>
                  {catRules.length > 0
                    ? catRules.map(rule => (
                        <RuleCard
                          key={rule.id}
                          rule={rule}
                          onToggle={handleToggle}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))
                    : <p className={styles.groupEmpty}>{t('categories.emptyGroup')}</p>
                  }
                </div>
              )}
            </div>
          )
        })}

        {/* Uncategorized group — only shown when there are uncategorized rules */}
        {uncategorized.length > 0 && (
          <div className={styles.group}>
            <div
              className={styles.groupHeader}
              style={{ borderLeftColor: 'var(--border-muted)' }}
            >
              <button
                className={styles.collapseToggle}
                onClick={() => toggleCollapse('__none__')}
              >
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transform: collapsed['__none__'] ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
                >
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className={styles.catName}>{t('categories.noCategory')}</span>
              <span className={styles.catCount}>
                {uncategorized.length} {uncategorized.length === 1 ? t('rules.rule') : t('rules.rules')}
              </span>
            </div>
            {!collapsed['__none__'] && (
              <div className={styles.groupBody}>
                {uncategorized.map(rule => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rule editor modal */}
      {modalOpen && (
        <RuleModal
          rule={editingRule}
          onSaved={handleSaved}
          onCancel={() => setModalOpen(false)}
        />
      )}

      {/* Category delete confirmation */}
      {deleteConfirm && (
        <ConfirmDeleteCategory
          name={deleteConfirm.name}
          count={deleteConfirm.count}
          onConfirm={handleDeleteCategoryConfirm}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}
