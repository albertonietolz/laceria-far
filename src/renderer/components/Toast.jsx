import React, { useEffect } from 'react'
import styles from './Toast.module.css'

function Toast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <span className={styles.message}>{toast.message}</span>
      <button className={styles.close} type="button" onClick={() => onRemove(toast.id)}>×</button>
    </div>
  )
}

export default function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null
  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
