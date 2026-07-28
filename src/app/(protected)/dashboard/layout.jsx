'use client'

import { Button } from "@/components/Button";
import styles from "./dashboard.module.css"
import { useAuth } from '@/contexts/AuthContext';
import { Chip } from "@/components/Chip";
import { usePathname, useRouter } from "next/navigation";

export default function Dashboard({ children }) {

    const { user } = useAuth();

    const pathname = usePathname();
    const router = useRouter();
    const isKanban = pathname.startsWith('/dashboard/kanban');
    
    return (
        <div className={styles.dashboard}>
            <div className={styles.head}>
                <div className={styles.leftSide}>
                    <h1 className={styles.title}>Tableau de bord</h1>
                    <p className={styles.welcome}>Bonjour {user.name}, voici un aperçu de vos projets et tâches.</p>
                </div>
                <Button content={'+ Créer un projet'}  />
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