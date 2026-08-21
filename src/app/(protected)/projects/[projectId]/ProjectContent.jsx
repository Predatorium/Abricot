'use client';

import { useEffect, useState } from "react";
import { IconLinkButton, Button, ButtonIAWithText } from "@/components/Clickable/Button";
import { useTasks } from '@/contexts/TaskContext';
import { Chip } from "@/components/Clickable/Chip";
import { UserIconTag } from "@/components/Utils/Tag"
import { removeAccents } from "@/services/utils"
import { getInitials, statusLabel  } from "@/services/utils"
import { useTaskModal } from "@/contexts/TaskModalContext";
import { useTaskModalIA } from "@/contexts/TaskModalIAContext";
import { useProjectModal } from "@/contexts/ProjectModalContext";
import CardTask from "@/components/Card/CardTask";
import Image from "next/image";
import Tag from "@/components/Utils/Tag"
import SearchArea from "@/components/Utils/SearchArea";
import styles from "./project.module.css";
import { useAuth } from "@/contexts/AuthContext";

const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export default function ProjectContent({ projectData }) {
    const { tasks, loading, error, refreshTasks } = useTasks();
    const { user } = useAuth();
    const { openCreateModal  } = useTaskModal();
    const { openCreateModalIA  } = useTaskModalIA();
    const { openEditModal } = useProjectModal();
    const [query, setQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null); 
    const [isFocused, setIsFocused] = useState(false);
    const [orderByDate, setOrderByDate] = useState(false);
    
    const availableStatuses = [...new Set(tasks.map((task) => task.status))];

    const filteredTasks = tasks.filter(task => {
        const matchesQuery = removeAccents(task.title.toLowerCase()).includes(removeAccents(query.toLowerCase()));
        const matchesStatus = !selectedStatus || task.status === selectedStatus;
        return matchesQuery && matchesStatus;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (orderByDate) {
            // Tri par date d'échéance croissante (les tâches sans date passent en dernier)
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        // Tri par priorité
        return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
    });
    
    const onChange = (status) => {
        setSelectedStatus(status);
    };

    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    return (
        <div className={styles.project}>
            <div className={styles.head}>
                <div className={styles.left}>
                    <IconLinkButton icon={"Arrow"} link="/projects" />
                </div>
                <div className={styles.middle}>
                    <div className={styles.top}>
                        <h1 className={styles.title}>{projectData.name}</h1>
                        {user.id === projectData.owner.id && (
                            <button type="button" onClick={() => openEditModal(projectData)} className={styles.edit}>Modifier</button>
                        )}
                    </div>
                    <p className={styles.bottom}>{projectData.description}</p>
                </div>
                <div className={styles.right}>
                    <Button content={"Créer une tâche"} onClick={() => openCreateModal(projectData)} />
                    <ButtonIAWithText onClick={() => openCreateModalIA()} />
                </div>
            </div>
            <div className={styles.Contributors}>
                <div className={styles.left}>
                    <h2 className={styles.title}>Contributeurs</h2>
                    <p className={styles.count}>{projectData.members.length + 1} personnes</p>
                </div>
                <div className={styles.teamAvatars}>
                    <div>
                        <UserIconTag style="brand" content={getInitials(projectData.owner.name)} />
                        <Tag style="brand" content="Propriétaire" />
                    </div>
                    {projectData.members.map((member) => (
                        <div key={member.id}>
                            <UserIconTag style="grey" content={getInitials(member.user.name)} />
                            <Tag style="grey" content={member.user.name} />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.tasks}>
                <div className={styles.headTasks}>
                    <div className={styles.info}>
                        <h3 className={styles.title}>Tâches</h3>
                        <p className={styles.order}>{orderByDate ? "Par date d'échéance" : "Par ordre de priorité"}</p>
                    </div>
                    <div className={styles.filter}>
                        <Chip icon={'Task'} text={'Liste'} isActive={!orderByDate} onClick={() => setOrderByDate(false)} />
                        <Chip icon={'Kanban'} text={'Calendrier'} isActive={orderByDate} onClick={() => setOrderByDate(true)} />
                        <div className={styles.wrapper}>
                            <select
                                className={styles.select}
                                name="status"
                                id='status'
                                value={selectedStatus ?? ""}
                                onChange={(e) => onChange(e.target.value || null)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            >
                                <option value="">Statut</option>
                                {availableStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {statusLabel(status)}
                                </option>
                                ))}
                            </select>
                            <Image
                                src={`/images/${isFocused ? "Up" : "Down"}.svg`}
                                alt=""
                                width={12}
                                height={12}
                                className={styles.arrow}
                            />
                        </div>
                        <SearchArea onSearch={setQuery} />
                    </div>
                </div>
                <div className={styles.tasksList}>
                    {loading && <p>Chargement...</p>}
                    {error && <p>Erreur : {error}</p>}
                    {sortedTasks.map((task) => (
                        <CardTask key={task.id} task={task} project={projectData} />
                    ))}
                </div>
            </div>
        </div>
    );
}