import Image from "next/image";
import styles from "./layout.module.css"

export default function AuthLayout({ children }) {
  return (
    <div className={styles.authContainer}>
      <div className={styles.leftSide}>
        
        {children}
      </div>
      <Image  src="/images/Background_log.jpg" alt="background" fill style={{ objectFit: 'fill'}} loading="eager"/>
    </div>
  );
}