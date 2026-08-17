'use client'

import styles from "./tasks.module.css"
import { useState } from "react";
import SearchArea from "@/components/Utils/SearchArea"
import MyTask from "@/components/Card/Task"
import { useDashboard } from "@/contexts/DashboardContext"
import { removeAccents } from "@/services/utils"

export default function Tasks() {
    const { assignedTasks, loading, error } = useDashboard();
    const [query, setQuery] = useState('');

    const filteredTasks = assignedTasks.filter(task =>
        removeAccents(task.title.toLowerCase()).includes(removeAccents(query.toLowerCase()))
    );

    return (
        <div className={styles.tasks}>
            <div className={styles.head}>
                <div className={styles.left}>
                    <h2 className={styles.title}>Mes tâches assignées</h2>
                    <p className={styles.subtitle}>Par ordre de priorité</p>
                </div>
                <SearchArea onSearch={setQuery}/>
            </div>
            <div className={styles.myTasks}>
                {loading && <p>Chargement...</p>}
                {error && <p>Erreur : {error}</p>}
                {filteredTasks.map((task) => (
                    <MyTask key={task.id} task={task} />
                ))}
            </div>
        </div>
    )
}