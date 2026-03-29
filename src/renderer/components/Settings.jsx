import React, { useState, useEffect } from 'react'
import styles from './Settings.module.css'

export default function Settings() {
  const [loginItem, setLoginItem] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.laceria.getLoginItem().then(value => {
      setLoginItem(value)
      setLoading(false)
    })
  }, [])

  const handleToggle = async (e) => {
    const value = e.target.checked
    setLoginItem(value)
    await window.laceria.setLoginItem(value)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Ajustes</h2>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.info}>
            <span className={styles.rowLabel}>Arrancar con Windows</span>
            <span className={styles.rowDesc}>
              Inicia Laceria FAR automáticamente al encender el equipo.
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={loginItem}
              onChange={handleToggle}
              disabled={loading}
            />
            <span className={styles.toggleTrack}>
              <span className={styles.toggleThumb} />
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
