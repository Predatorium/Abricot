import Image from "next/image";
import styles from "./Logo.module.css"
import Link from "next/link";

export function LogoAuth() {
  return (
    <div className={styles.logo}>
      <Image  src="/images/Logo_Auth.svg" alt="Logo Abricot" fill style={{ objectFit: 'none'}} loading="eager"/>
    </div>
  )
}

export function LogoHeader() {
  return (
    <Link href="/" className={styles.logoHeader}>
      <Image  src="/images/Logo_Header.svg" alt="Logo Abricot" fill style={{ objectFit: 'none'}} loading="eager"/>
    </Link>
  )
}

export function LogoFooter() {
  return (
    <div className={styles.LogoFooter}>
      <Image  src="/images/Logo_Footer.svg" alt="Logo Abricot" fill style={{ objectFit: 'none'}} loading="eager"/>
    </div>
  )
}