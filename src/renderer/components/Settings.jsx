import React, { useState, useEffect, useReducer } from 'react'
import styles from './Settings.module.css'
import { t, getLanguage, setLanguage } from '../i18n'
import { getTheme, setTheme, subscribeTheme } from '../theme'

export default function Settings() {
  const [loginItem, setLoginItem] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState(getLanguage())
  const [theme, setThemeState] = useState(getTheme())
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    window.laceria.getLoginItem().then(value => {
      setLoginItem(value)
      setLoading(false)
    })
  }, [])

  useEffect(() => subscribeTheme((t) => { setThemeState(t); forceUpdate() }), [])

  const handleLoginToggle = async (e) => {
    const value = e.target.checked
    setLoginItem(value)
    await window.laceria.setLoginItem(value)
  }

  const handleLangChange = async (newLang) => {
    setLang(newLang)
    setLanguage(newLang)
    await window.laceria.setLanguage(newLang)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{t('settings.heading')}</h2>

      <div className={styles.card}>
        {/* Login item */}
        <div className={styles.row}>
          <div className={styles.info}>
            <span className={styles.rowLabel}>{t('settings.loginItem')}</span>
            <span className={styles.rowDesc}>{t('settings.loginItemDesc')}</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={loginItem}
              onChange={handleLoginToggle}
              disabled={loading}
            />
            <span className={styles.toggleTrack}>
              <span className={styles.toggleThumb} />
            </span>
          </label>
        </div>

        <div className={styles.divider} />

        {/* Appearance */}
        <div className={styles.row}>
          <div className={styles.info}>
            <span className={styles.rowLabel}>{t('settings.appearance')}</span>
            <span className={styles.rowDesc}>{t('settings.appearanceDesc')}</span>
          </div>
          <div className={styles.langGroup}>
            <button
              className={theme === 'light' ? `${styles.langBtn} ${styles.langBtnActive}` : styles.langBtn}
              onClick={() => handleThemeChange('light')}
            >
              {t('settings.themeLight')}
            </button>
            <button
              className={theme === 'dark' ? `${styles.langBtn} ${styles.langBtnActive}` : styles.langBtn}
              onClick={() => handleThemeChange('dark')}
            >
              {t('settings.themeDark')}
            </button>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Language */}
        <div className={styles.row}>
          <div className={styles.info}>
            <span className={styles.rowLabel}>{t('settings.language')}</span>
            <span className={styles.rowDesc}>{t('settings.languageDesc')}</span>
          </div>
          <div className={styles.langGroup}>
            <button
              className={lang === 'es' ? `${styles.langBtn} ${styles.langBtnActive}` : styles.langBtn}
              onClick={() => handleLangChange('es')}
            >
              {t('settings.langEs')}
            </button>
            <button
              className={lang === 'en' ? `${styles.langBtn} ${styles.langBtnActive}` : styles.langBtn}
              onClick={() => handleLangChange('en')}
            >
              {t('settings.langEn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
