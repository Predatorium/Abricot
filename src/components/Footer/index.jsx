import { LogoFooter } from "../Logo"
import styles from "./Footer.module.css"

export default function Header() {
    return (
        <div className={styles.footer}>
            <LogoFooter />
            <p className={styles.content}>Abricot 2025</p>
        </div>
    )
}