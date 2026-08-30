import styles from "./not-found.module.css"
import Link from "next/link";

export default function NotFound() {
  return (
    <div className={styles.notfound}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.content}>Page introuvable</p>
      <Link href={"/"} className={styles.link}>Retour</Link>
    </div>
  );
}