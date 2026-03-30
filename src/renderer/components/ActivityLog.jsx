import React, { useState, useEffect, useCallback } from 'react'
import styles from './ActivityLog.module.css'
import { t, getLanguage } from '../i18n'

const ACTION_COLORS = {
  move:   'move',
  copy:   'copy',
  rename: 'rename',
  delete: 'delete',
  unzip:  'unzip',
}

function formatTimestamp(iso) {
  const d = new Date(iso)
  const lang = getLanguage()
  return d.toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function basename(filePath) {
  return filePath.replace(/\\/g, '/').split('/').pop() || filePath
}

export default function ActivityLog() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.laceria.getActivity().then(data => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  const handleNew = useCallback((entry) => {
    setEntries(prev => {
      const next = [entry, ...prev]
      if (next.length > 500) next.length = 500
      return next
    })
  }, [])

  useEffect(() => window.laceria.onActivityNew(handleNew), [handleNew])

  const handleClear = () => {
    if (!window.confirm(t('activity.clearConfirm'))) return
    window.laceria.clearActivity()
    setEntries([])
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h2 className={styles.heading}>{t('activity.heading')}</h2>
        {entries.length > 0 && (
          <button className={styles.btnClear} onClick={handleClear}>
            {t('activity.clearBtn')}
          </button>
        )}
      </div>

      {loading ? null : entries.length === 0 ? (
        <div className={styles.empty}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className={styles.emptyTitle}>{t('activity.emptyTitle')}</p>
          <p className={styles.emptyDesc}>{t('activity.emptyDesc')}</p>
        </div>
      ) : (
        <div className={styles.list}>
          {entries.map(entry => (
            <div key={entry.id} className={`${styles.entry} ${styles[`entry_${entry.status}`]}`}>
              <span className={`${styles.statusDot} ${styles[`dot_${entry.status}`]}`} aria-hidden="true" />
              <div className={styles.entryMain}>
                <div className={styles.entryTop}>
                  <span className={`${styles.actionBadge} ${styles[`badge_${ACTION_COLORS[entry.action] || 'move'}`]}`}>
                    {t(`action.${entry.action}`)}
                  </span>
                  <span className={styles.ruleName} title={entry.ruleName}>{entry.ruleName}</span>
                  <span className={styles.timestamp}>{formatTimestamp(entry.timestamp)}</span>
                </div>
                <div className={styles.filePath} title={entry.filePath}>
                  {basename(entry.filePath)}
                </div>
                {entry.status === 'error' && entry.message && (
                  <div className={styles.errorMsg}>{entry.message}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
