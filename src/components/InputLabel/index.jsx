import styles from './InputLabel.module.css'

export default function InputLabel({ type, nameId, content, isRequired }) {
  return (
    <div className={styles.label}>
        <label htmlFor={nameId} className={styles.title}>{content}</label>
        <input id={nameId} name={nameId} type={type} className={styles.input} required={isRequired} />
    </div>
  )
}