import React, { useState, useEffect, useReducer, useCallback } from 'react'
import styles from './App.module.css'
import logo from '../assets/tray-icon.png'
import { t, subscribe } from './i18n'
import RulesList from './components/RulesList'
import ActivityLog from './components/ActivityLog'
import Settings from './components/Settings'
import ToastContainer from './components/Toast'

export default function App() {
  const [tab, setTab] = useState('rules')
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [toasts, setToasts] = useState([])

  useEffect(() => subscribe(forceUpdate), [])

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random()
    setToasts(prev => {
      const next = [...prev, { id, type, message }]
      return next.length > 2 ? next.slice(next.length - 2) : next
    })
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  useEffect(() => {
    return window.laceria.onNotification((data) => {
      if (data.type === 'success') {
        addToast('success', t('toast.success', { rule: data.rule, action: data.action }))
      } else if (data.type === 'error') {
        addToast('error', t('toast.error', { rule: data.rule, message: data.message }))
      }
    })
  }, [addToast])

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <img src={logo} className={styles.logoMark} alt="" />
        </div>
        <nav className={styles.tabs}>
          <button
            className={tab === 'rules' ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => setTab('rules')}
          >
            {t('tabs.rules')}
          </button>
          <button
            className={tab === 'activity' ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => setTab('activity')}
          >
            {t('tabs.activity')}
          </button>
          <button
            className={tab === 'settings' ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => setTab('settings')}
          >
            {t('tabs.settings')}
          </button>
        </nav>
      </header>
      <main className={styles.main}>
        {tab === 'rules'    && <RulesList />}
        {tab === 'activity' && <ActivityLog />}
        {tab === 'settings' && <Settings />}
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
