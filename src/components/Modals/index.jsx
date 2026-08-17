'use client';
import { useEffect } from 'react';
import styles from './Modals.module.css';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fermer">
            ×
          </button>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}