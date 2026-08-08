import styles from "./Tag.module.css"

export default function Tag({style, content}) {
    return (
        <p className={`${styles.tag} ${styles[style]}`}>{content}</p>
    )
}

export function UserIconTag({style, content}) {
    return (
        <div className={`${styles.userIcon} ${styles[style]}`}>
            <p>{content}</p>
        </div>
    )
}