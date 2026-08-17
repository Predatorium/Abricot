'use client'

import { useEffect } from "react";
import { Button } from "@/components/Clickable/Button";
import styles from "./projects.module.css"
import { useProjects } from '@/contexts/ProjectContext';
import { useProjectModal } from '@/contexts/ProjectModalContext';
import CardProject from "@/components/Card/CardProject";

export default function Projects() {
    const { projects, loading, error, refreshProjects } = useProjects();
    const { openCreateModal } = useProjectModal();

    useEffect(() => {
        refreshProjects();
    }, [refreshProjects]);

    return (
        <div className={styles.projects}>
            <div className={styles.head}>
                <div className={styles.leftSide}>
                    <h4 className={styles.title}>Mes projets</h4>
                    <p className={styles.subtitle}>Gérez vos projets.</p>
                </div>
                <Button content={'+ Créer un projet'} onClick={() => openCreateModal()} />
            </div>
            <div className={styles.myProjects}>
                {loading && <p>Chargement...</p>}
                {error && <p>Erreur : {error}</p>}
                {projects.map((project) => (
                    <CardProject key={project.id} project={project} />
                ))}
            </div>
        </div>
    )
}