import { DashboardProvider } from '@/contexts/DashboardContext';
import DashboardLayout from './layoutContent';
import { getAssignedTasksAction, getProjectsWithTasksAction } from '@/actions/dashboardActions';

export default async function Dashboard({ children }) {
    let initialAssignedTasks = [];
    let initialProjectsWithTasks = [];

    try {
        const [tasksResult, projectsResult] = await Promise.all([
            getAssignedTasksAction(),
            getProjectsWithTasksAction(),
        ]);
        initialAssignedTasks = tasksResult.data.tasks;
        initialProjectsWithTasks = projectsResult.data.projects;
    } catch (error) {
        // On laisse les tableaux vides ; le useEffect côté client
        // retentera le chargement et pourra afficher l'erreur si besoin
    }

    return (
        <DashboardProvider
            initialAssignedTasks={initialAssignedTasks}
            initialProjectsWithTasks={initialProjectsWithTasks}
        >
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </DashboardProvider>
    )
}