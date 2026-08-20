import { TaskProvider } from '@/contexts/TaskContext';
import { getProject } from '@/api/projects';
import ProjectContent from './ProjectContent';
import { notFound } from 'next/navigation';
import { getAllTasksAction } from '@/actions/taskActions'
import TasksModalProvider from '@/contexts/TasksModalProvider';
import TaskModal from '@/components/Modals/TaskModal';
import TaskModalIA from '@/components/Modals/TaskModalIA';

export default async function Project({ params }) {
    const { projectId } = await params;

    let project;
    let initialTasks = [];
    
    try {
        const [tasksResult, projectsResult] = await Promise.all([
            getAllTasksAction(projectId),
            getProject(projectId),
        ]);
        initialTasks = tasksResult.data.tasks;
        project = projectsResult.data.project;
    } catch (error) {
        notFound();
        // On laisse les tableaux vides ; le useEffect côté client
        // retentera le chargement et pourra afficher l'erreur si besoin
    }

    return (
        <TaskProvider projectId={projectId} initialTasks={initialTasks}>
            <TasksModalProvider>
                <ProjectContent projectData={project} />
                <TaskModal />
                <TaskModalIA />
            </TasksModalProvider>
        </TaskProvider>
    );
}