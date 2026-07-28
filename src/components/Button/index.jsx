import styles from './Button.module.css'
import Link from "next/link";

export function Button({ content, outline = false, type = 'button', onClick  }) {
  return (
    <button type={type} onClick={onClick} className={`${styles.button} ${outline ? styles.outline : styles.simple}`}>{content}</button>
  )
}

export function ButtonLink({ content, outline, link }) {
  return (
    <Link href={link} className={`${styles.button} ${outline ? styles.outline : styles.simple}`}>{content}</Link>
  )
}