'use client';

import { Fragment, useEffect, useState } from "react";
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

export default function ProjectContent({ projectData }) {
    const { tasks, loading, error, refreshTasks } = useTasks();
    const { user } = useAuth();
    const { openCreateModal  } = useTaskModal();
    const { openCreateModalIA  } = useTaskModalIA();
    const { openEditModal } = useProjectModal();
    const { project } = projectData;
    const [query, setQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null); 
    const [isFocused, setIsFocused] = useState(false);
    
    const availableStatuses = [...new Set(tasks.map((task) => task.status))];

    const filteredTasks = tasks.filter(task => {
        const matchesQuery = removeAccents(task.title.toLowerCase()).includes(removeAccents(query.toLowerCase()));
        const matchesStatus = !selectedStatus || task.status === selectedStatus;
        return matchesQuery && matchesStatus;
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
                        <h1 className={styles.title}>{project.name}</h1>
                        {user.id === project.owner.id && (
                            <button type="button" onClick={() => openEditModal(project)} className={styles.edit}>Modifier</button>
                        )}
                    </div>
                    <p className={styles.bottom}>{project.description}</p>
                </div>
                <div className={styles.right}>
                    <Button content={"Créer une tâche"} onClick={() => openCreateModal(project)} />
                    <ButtonIAWithText onClick={() => openCreateModalIA()} />
                </div>
            </div>
            <div className={styles.Contributors}>
                <div className={styles.left}>
                    <h2 className={styles.title}>Contributeurs</h2>
                    <p className={styles.count}>{project.members.length + 1} personnes</p>
                </div>
                <div className={styles.teamAvatars}>
                    <UserIconTag style="brand" content={getInitials(project.owner.name)} />
                    <Tag style="brand" content="Propriétaire" />
                    {project.members.map((member) => (
                        <Fragment key={member.id}>
                            <UserIconTag style="grey" content={getInitials(member.user.name)} />
                            <Tag style="grey" content={member.user.name} />
                        </Fragment>
                    ))}
                </div>
            </div>
            <div className={styles.tasks}>
                <div className={styles.headTasks}>
                    <div className={styles.info}>
                        <h3 className={styles.title}>Tâches</h3>
                        <p className={styles.order}>Par ordre de priorité</p>
                    </div>
                    <div className={styles.filter}>
                        <Chip icon={'Task'} text={'Liste'} isActive={true} />
                        <Chip icon={'Kanban'} text={'Calendrier'} isActive={false} />
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
                    {filteredTasks.map((task) => (
                        <CardTask key={task.id} task={task} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
}