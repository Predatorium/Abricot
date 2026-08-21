// components/ProjectModal/ProjectModal.jsx
'use client';
import { useActionState } from 'react';
import { createProjectAction, updateProjectAction, addContributorAction, removeContributorAction } from '@/actions/projectActions';
import { useProjects } from '@/contexts/ProjectContext';
import { useProjectModal } from '@/contexts/ProjectModalContext';
import { searchUsersAction } from '@/actions/searchUsersActions';
import { Button } from '@/components/Clickable/Button';
import { useMemo } from 'react';
import UserMultiSelect from '@/components/Utils/UserMultiSelect';
import InputLabel from '@/components/Utils/InputLabel';
import Modal from '@/components/Modals';
import styles from './ProjectModal.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

const initialState = { error: null };

export default function ProjectModal() {
  const { isOpen, mode, project, closeModal } = useProjectModal();
  const { user } = useAuth();
  const { refreshProjects } = useProjects();

  const members = useMemo(() => {
    if (!project) {
      return user ? [{ id: user.id, name: user.name, email: user.email }] : [];
    }

    const normalizedMembers = (project.members ?? []).map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
    }));

    return project.owner ? [project.owner, ...normalizedMembers] : normalizedMembers;
  }, [project, user]);

  const action = async (prevState, formData) => {
    const newContributors = formData.getAll('contributors').map((raw) => JSON.parse(raw));
    const payload = {
      name: formData.get('title'),
      description: formData.get('description'),
      contributors: newContributors.map((user) => ( user.email )),
    };

    const result = mode === 'create'
      ? await createProjectAction(payload)
      : await updateProjectAction(project.id, payload);

    if (result?.error) return { error: result.error };

    if (mode === 'edit') {
      const originalContributorIds = (members ?? []).map((m) => m.id);
      const newContributorIds = newContributors.map((c) => c.id);

      const toAdd = newContributors.filter((c) => !originalContributorIds.includes(c.id));
      const toRemoveIds = originalContributorIds.filter((id) => !newContributorIds.includes(id));

      const contributorResults = await Promise.all([
        ...toAdd.map((user) => addContributorAction(project.id, { email: user.email, role: user.role })),
        ...toRemoveIds.map((userId) => removeContributorAction(project.id, userId)),
      ]);

      const contributorError = contributorResults.find((r) => r?.error);
      if (contributorError) 
        return { error: contributorError.error };
    }
    
    await refreshProjects();
    if (mode === 'create') {
      const projectId = result.data.project.id;
      
      redirect(`/projects/${projectId}`);
    }
    closeModal();
    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={mode === 'create' ? 'Nouveau projet' : 'Modifier le projet'}
    >
      <form action={formAction} className={styles.form}>
        <div className={styles.inputs}>
          <InputLabel 
            type='text' 
            nameId='title' 
            content='Titre*' 
            isRequired={true} 
            value={mode === 'create' ? '' : project?.name ?? ''} 
          />

          <InputLabel
            type='textarea' 
            nameId='description' 
            content='Description*' 
            isRequired={true} 
            value={mode === 'create' ? '' : project?.description ?? ''} 
          />

          {state.error && <p className={styles.error}>{state.error}</p>}

          <UserMultiSelect
            mode="async"
            name="contributors"
            label="Contributeurs"
            searchFn={searchUsersAction}
            defaultSelected={members}
            placeholder="Rechercher par nom ou email..."
          />
        </div>
        
        <Button type="submit" content={isPending ? 'Enregistrement...' : mode === 'create' ? '+ Ajouter un projet' : 'Enregistrer'}/>
      </form>
    </Modal>
  );
}