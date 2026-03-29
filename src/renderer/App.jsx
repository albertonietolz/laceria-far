import React, { useState } from 'react'
import styles from './App.module.css'
import logo from '../assets/tray-icon.png'
import RulesList from './components/RulesList'
import Settings from './components/Settings'

export default function App() {
  const [tab, setTab] = useState('rules')

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
            Reglas
          </button>
          <button
            className={tab === 'settings' ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => setTab('settings')}
          >
            Ajustes
          </button>
        </nav>
      </header>
      <main className={styles.main}>
        {tab === 'rules' ? <RulesList /> : <Settings />}
      </main>
    </div>
  )
}
