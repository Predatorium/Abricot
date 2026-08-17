import styles from "./TaskIA.module.css"
import IconText from "@/components/Utils/IconText";

export default function TaskIA() {
    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <p className={styles.title}>Nom de la tâche</p>
                <p className={styles.description}>Description de la tâche</p>
            </div>
            <div className={styles.actions}>
                <IconText icon="Delete" text="Supprimer" width={18} height={18}/>
                <hr className={styles.separator} />
                <IconText icon="Edit" text="Modifier" width={18} height={18}/>
            </div>
        </div>
    )
}