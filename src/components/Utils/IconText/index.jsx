import Image from "next/image";
import styles from "./Icontext.module.css"

export default function IconText({icon, text, width, height, black = false}) {
    return (
        <p className={`${styles.group} ${black ? styles.black : ''}`}>
            <Image  
                src={`/images/${icon}${black ? '_Black' : ''}.svg`} 
                alt={`Icon ${text}`} 
                width={width}
                height={height} 
                loading="eager"/>
            {text}
        </p>
    )
}