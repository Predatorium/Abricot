import { TaskProvider } from '@/contexts/TaskContext';
import { getProject } from '@/api/projects';
import ProjectContent from './ProjectContent';
import { notFound } from 'next/navigation';
import TasksModalProvider from '@/contexts/TasksModalProvider';
import TaskModal from '@/components/Modals/TaskModal';
import TaskModalIA from '@/components/Modals/TaskModalIA';

export default async function Project({ params }) {
    const { projectId } = await params;
    const project = await getProject(projectId);
    
    if (!project) {
        notFound();
    }

    const { data } = project;

    return (
        <TaskProvider projectId={projectId}>
            <TasksModalProvider>
                <ProjectContent projectData={data} />
                <TaskModal />
                <TaskModalIA />
            </TasksModalProvider>
        </TaskProvider>
    );
}