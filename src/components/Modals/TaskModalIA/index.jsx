'use client';
import { Button } from "@/components/Clickable/Button"
import { Fragment, useState } from 'react';
import { useTaskModalIA } from '@/contexts/TaskModalIAContext';
import TaskIA from "@/components/Card/TaskIA"
import Modal from '@/components/Modals';
import Image from "next/image";
import styles from "./TaskModalIA.module.css"

export default function TaskModalIA() {
    const { isOpen, closeModalIA } = useTaskModalIA();
    const [isHovered, setIsHovered] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [content, setContent] = useState("");

    const title = (
    <>
        <Image
        src={`/images/IA_orange.svg`}
        alt={`Icon IA`}
        width={21}
        height={21}
        loading="eager"
        />
        {submit ? "Vos tâches..." : "Créer une tâche"}
    </>
    );

    const action = () => {
        setSubmit(false);
        setContent('');
        closeModalIA();
        return { error: null };
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={action}
            title={title}
        >
            <div className={styles.content}>
                <div className={styles.tasks}>
                    {submit && 
                        <Fragment>
                            <TaskIA />
                            <TaskIA />
                            <TaskIA />
                        </Fragment>
                    }
                </div>
                {submit && <Button content="+ Ajouter les tâches" onClick={action} />}
            </div>
            {submit && <hr className={styles.separator} />}
            <div className={styles.InputIA}>
                <textarea
                    name="message"
                    className={styles.AreaInputIA}
                    placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button 
                    type="button" 
                    onClick={() => setSubmit(true)} 
                    className={styles.iconIA}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Image
                        src={`/images/IA${isHovered ? "_orange" : ""}.svg`}
                        alt={`Icon IA`}
                        width={9}
                        height={9}
                        loading="eager"
                    />
                </button>
            </div>
        </Modal>
    )
}