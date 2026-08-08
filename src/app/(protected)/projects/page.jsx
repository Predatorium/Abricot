'use client'

import { useEffect } from "react";
import { Button } from "@/components/Button";
import styles from "./projects.module.css"
import { ProjectProvider, useProjects } from '@/contexts/ProjectContext';
import CardProject from "@/components/CardProject";

export function ProjectsContent() {
    const { projects, loading, error, refreshProjects } = useProjects();

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
                <Button content={'+ Créer un projet'}  />
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

export default function Projects() {
    return (
        <ProjectProvider>
            <ProjectsContent />
        </ProjectProvider>
    );
}