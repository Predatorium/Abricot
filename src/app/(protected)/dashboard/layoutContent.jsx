'use client'

import { Button } from "@/components/Clickable/Button";
import styles from "./dashboard.module.css"
import { useAuth } from '@/contexts/AuthContext';
import { Chip } from "@/components/Clickable/Chip";
import { usePathname } from "next/navigation";
import { useProjectModal } from '@/contexts/ProjectModalContext';
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
    const { user } = useAuth();
    const { openCreateModal } = useProjectModal();
    const router = useRouter();

    const pathname = usePathname();
    const isKanban = pathname.startsWith('/dashboard/kanban');
    
    return (
        <div className={styles.dashboard}>
            <div className={styles.head}>
                <h1 className={styles.title}>Tableau de bord</h1>
                <p className={styles.welcome}>Bonjour {user.name}, voici un aperçu de vos projets et tâches.</p>
                <div className={styles.button}>
                    <Button content={'+ Créer un projet'} onClick={() => openCreateModal()} />
                </div>
            </div>
            <div className={styles.selection}>
                <Chip icon={'Task'} text={'Liste'} isActive={!isKanban} 
                    onClick={() => router.push('/dashboard/tasks')} />
                <Chip icon={'Kanban'} text={'Kanban'} isActive={isKanban} 
                    onClick={() => router.push('/dashboard/kanban')} />
            </div>
            {children}
        </div>
    )
}