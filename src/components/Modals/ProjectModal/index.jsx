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

// État initial du useActionState (aucune erreur au départ)
const initialState = { error: null };

// Modale unique servant à la fois pour créer et modifier un projet,
// y compris la gestion des contributeurs (ajout/retrait)
export default function ProjectModal() {
  // État global de la modale (ouverture, mode, projet concerné) via Context
  const { isOpen, mode, project, closeModal } = useProjectModal();
  // Utilisateur connecté, utilisé comme contributeur par défaut en mode création
  const { user } = useAuth();
  // Permet de rafraîchir la liste des projets après création/modification
  const { refreshProjects } = useProjects();

  // Liste normalisée des membres actuels du projet, au format attendu par UserMultiSelect
  // - en création : seulement l'utilisateur connecté (créateur du projet)
  // - en édition : le propriétaire + les membres existants du projet
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

  // Fonction passée à useActionState : gère la création/modification du projet
  // ainsi que la synchronisation des contributeurs (ajouts et retraits)
  const action = async (prevState, formData) => {
    // Les contributeurs sélectionnés sont envoyés comme des chaînes JSON (un objet par utilisateur) : on les parse
    const newContributors = formData.getAll('contributors').map((raw) => JSON.parse(raw));
    const payload = {
      name: formData.get('title'),
      description: formData.get('description'),
      // Le payload de création/modification n'a besoin que des emails, pas des objets complets
      contributors: newContributors
        .filter((c) => !(mode === 'create' && c.id === user.id))
        .map((c) => c.email),
    };

    // Choix de la Server Action à appeler selon le mode (création ou modification)
    const result = mode === 'create'
      ? await createProjectAction(payload)
      : await updateProjectAction(project.id, payload);

    if (result?.error) return { error: result.error };

    // En mode édition uniquement : on compare l'ancienne et la nouvelle liste de contributeurs
    // pour déterminer qui ajouter et qui retirer (le endpoint de mise à jour du projet
    // ne gère pas lui-même la liste des contributeurs)
    if (mode === 'edit') {
      const originalContributorIds = (members ?? []).map((m) => m.id);
      const newContributorIds = newContributors.map((c) => c.id);

      // Contributeurs présents dans la nouvelle liste mais absents de l'ancienne → à ajouter
      const toAdd = newContributors.filter((c) => !originalContributorIds.includes(c.id));
      // Contributeurs présents dans l'ancienne liste mais absents de la nouvelle → à retirer
      const toRemoveIds = originalContributorIds.filter((id) => !newContributorIds.includes(id));

      // Exécution en parallèle de tous les ajouts et retraits de contributeurs
      const contributorResults = await Promise.all([
        ...toAdd.map((user) => addContributorAction(project.id, { email: user.email, role: user.role })),
        ...toRemoveIds.map((userId) => removeContributorAction(project.id, userId)),
      ]);

      // Si au moins un ajout/retrait a échoué, on remonte la première erreur trouvée
      const contributorError = contributorResults.find((r) => r?.error);
      if (contributorError) 
        return { error: contributorError.error };
    }
    
    // Rafraîchit la liste des projets après succès (création, modification, et contributeurs à jour)
    await refreshProjects();
    if (mode === 'create') {
      // En création, on redirige directement vers la page du nouveau projet
      const projectId = result.data.project.id;
      
      redirect(`/projects/${projectId}`);
    }
    // En édition, on ferme simplement la modale (pas de redirection, l'utilisateur reste sur la page)
    closeModal();
    return { error: null };
  };

  // useActionState relie l'action au formulaire : expose l'état (erreur),
  // la fonction à passer à `action`, et un booléen de chargement (isPending)
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={mode === 'create' ? 'Nouveau projet' : 'Modifier le projet'}
    >
      <form action={formAction} className={styles.form}>
        <div className={styles.inputs}>
          {/* Titre : vide en création, pré-rempli avec la valeur existante en édition */}
          <InputLabel 
            type='text' 
            nameId='title' 
            content='Titre*' 
            isRequired={true} 
            value={mode === 'create' ? '' : project?.name ?? ''} 
          />

          {/* Description : même logique que le titre */}
          <InputLabel
            type='textarea' 
            nameId='description' 
            content='Description*' 
            isRequired={true} 
            value={mode === 'create' ? '' : project?.description ?? ''} 
          />

          {/* Message d'erreur éventuel (création/modification échouée, ou synchronisation des contributeurs) */}
          {state.error && <p className={styles.error}>{state.error}</p>}

          {/* Sélecteur de contributeurs en mode "async" : recherche via l'API (searchUsersAction)
              plutôt qu'une liste locale fixe, avec pré-sélection des membres actuels */}
          <UserMultiSelect
            mode="async"
            name="contributors"
            label="Contributeurs"
            searchFn={searchUsersAction}
            defaultSelected={members}
            placeholder="Rechercher par nom ou email..."
          />
        </div>
        
        {/* Bouton de soumission, texte dynamique selon l'état d'envoi et le mode */}
        <Button type="submit" content={isPending ? 'Enregistrement...' : mode === 'create' ? '+ Ajouter un projet' : 'Enregistrer'}/>
      </form>
    </Modal>
  );
}