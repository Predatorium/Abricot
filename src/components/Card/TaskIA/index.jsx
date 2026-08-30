'use client';
import { useState } from "react";
import styles from "./TaskIA.module.css"
import IconText from "@/components/Utils/IconText";
import InputLabel from "@/components/Utils/InputLabel";

export default function TaskIA({ name, description, onChangeName, onChangeDescription, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                {isEditing ? (
                    <>
                        <InputLabel type="text" content={"Titre"} value={name} onChange={(e) => onChangeName(e.target.value)}/>
                        <InputLabel type="textarea" content={"Description"} value={description} onChange={(e) => onChangeDescription(e.target.value)}/>
                    </>
                ) : (
                    <>
                        <p className={styles.title}>{name}</p>
                        <p className={styles.description}>{description}</p>
                    </>
                )}
            </div>
            <div className={styles.actions}>
                <button type="button" onClick={onDelete} className={styles.actionButton}>
                    <IconText icon="Delete" text="Supprimer" width={18} height={18}/>
                </button>
                <hr className={styles.separator} />
                <button
                    type="button"
                    onClick={() => setIsEditing(prev => !prev)}
                    className={styles.actionButton}
                >
                    <IconText icon="Edit" text={isEditing ? "Valider" : "Modifier"} width={18} height={18}/>
                </button>
            </div>
        </div>
    )
}