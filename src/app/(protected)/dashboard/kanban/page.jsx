'use client'

import Tag from "@/components/Utils/Tag";
import styles from "./kanban.module.css"
import MyTask from "@/components/Card/Task"
import { useDashboard } from "@/contexts/DashboardContext"

export default function Kanban() {
    const { assignedTasks, loading, error } = useDashboard();

    const todoTasks = assignedTasks.filter((task) => task.status === "TODO");
    const inProgressTasks = assignedTasks.filter((task) => task.status === "IN_PROGRESS");
    const doneTasks = assignedTasks.filter((task) => task.status === "DONE");

    return (
        <div className={styles.kanban}>
            <div className={styles.section}>
                <div className={styles.head}>
                    <p className={styles.title}>À faire</p>
                    <Tag style={"grey"} content={todoTasks.length} />
                </div>
                {loading && <p>Chargement...</p>}
                {error && <p>Erreur : {error}</p>}
                {todoTasks.map((task) => (
                    <MyTask key={task.id} task={task} kanban={true} />
                ))}
            </div>
            <div className={styles.section}>
                <div className={styles.head}>
                    <p className={styles.title}>En cours</p>
                    <Tag style={"grey"} content={inProgressTasks.length} />
                </div>
                {loading && <p>Chargement...</p>}
                {error && <p>Erreur : {error}</p>}
                {inProgressTasks.map((task) => (
                    <MyTask key={task.id} task={task} kanban={true} />
                ))}
            </div>
            <div className={styles.section}>
                <div className={styles.head}>
                    <p className={styles.title}>Terminées</p>
                    <Tag style={"grey"} content={doneTasks.length} />
                </div>
                {loading && <p>Chargement...</p>}
                {error && <p>Erreur : {error}</p>}
                {doneTasks.map((task) => (
                    <MyTask key={task.id} task={task} kanban={true} />
                ))}
            </div>

        </div>
    )
}