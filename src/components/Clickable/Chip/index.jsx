import Image from "next/image"
import styles from './Chips.module.css'

export function Chip({icon, text, isActive, onClick}) {
    return (
        <button type='button' onClick={onClick} className={`${styles.chip} ${isActive ? styles.active : ""}`}>
            <Image  
                src={`/images/${icon}.svg`} 
                alt={`Icon ${text}`} 
                width={18}
                height={18} 
                loading="eager"/>
            {text}
        </button>
    )
}