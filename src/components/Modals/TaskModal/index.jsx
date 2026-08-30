'use client';

import { useActionState, useState } from 'react';
import { createTaskAction, updateTaskAction } from '@/actions/taskActions';
import { useTaskModal } from '@/contexts/TaskModalContext';
import { useTasks } from '@/contexts/TaskContext';
import { Button } from '@/components/Clickable/Button';
import { useMemo } from 'react';
import Image from 'next/image';
import UserMultiSelect from '@/components/Utils/UserMultiSelect';
import InputLabel from '@/components/Utils/InputLabel';
import Modal from '@/components/Modals';
import styles from './TaskModal.module.css';
import StatusRadioGroup from '@/components/Utils/StatusRadioGroup';

// État initial du useActionState (aucune erreur au départ)
const initialState = { error: null };

// Modale unique servant à la fois pour créer et modifier une tâche
// (le mode "create"/"update" détermine les valeurs par défaut et l'action appelée)
export default function TaskModal() {
  // État global de la modale (ouverture, mode, tâche concernée, projet) via Context
  const { isOpen, mode, task, project, closeModal } = useTaskModal();
  // Permet de rafraîchir la liste des tâches après création/modification
  const { refreshTasks } = useTasks();
  // Gère le focus du select "priorité" pour changer l'icône de flèche (haut/bas)
  const [isFocused, setIsFocused] = useState(false);

  // Liste normalisée des membres du projet (propriétaire + membres),
  // au format attendu par UserMultiSelect ({id, name, email})
  const members = useMemo(() => {
    if (!project) return [];

    const normalizedMembers = (project.members ?? []).map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
    }));

    return project.owner ? [project.owner, ...normalizedMembers] : normalizedMembers;
  }, [project]);

  // Liste des assignés déjà présents sur la tâche (pré-sélection en mode édition)
  const defaultAssignees = useMemo(() => {
    return (task?.assignees ?? []).map((a) => ({
      id: a.user.id,
      name: a.user.name,
      email: a.user.email,
    }));
  }, [task]);

  // Fonction passée à useActionState : construit le payload à partir du formulaire
  // et appelle la Server Action de création ou de mise à jour selon le mode
  const action = async (prevState, formData) => {
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      // En création, le statut est toujours "TODO" ; en édition, on prend la valeur du formulaire
      status: mode === 'create' ? "TODO" : formData.get('currentState'),
      dueDate: formData.get('dueDate') || new Date(), // date du jour si non rempli
      // Les assignés sont envoyés comme des chaînes JSON (un objet par assigné) : on les parse pour ne garder que l'id
      assigneeIds: formData.getAll('assigneeIds').map((raw) => JSON.parse(raw).id),
      priority: formData.get('priority'),
    };

    // Choix de la Server Action à appeler selon le mode (création ou modification)
    const result = mode === 'create'
      ? await createTaskAction(project.id, payload)
      : await updateTaskAction(project.id, task.id, payload);

    // En cas d'erreur renvoyée par la Server Action, on la remonte dans le state du formulaire
    if (result?.error) return { error: result.error };

    // Succès : on rafraîchit la liste des tâches et on ferme la modale
    await refreshTasks();
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
      title={mode === 'create' ? 'Créer une tâche' : 'Modifier'}
    >
      <form action={formAction} className={styles.form}>
        <div className={styles.inputs}>
          {/* Titre : vide en création, pré-rempli avec la valeur existante en édition */}
          <InputLabel 
            type='text' 
            nameId='title' 
            content='Titre*' 
            isRequired={true} 
            value={mode === 'create' ? '' : task?.title ?? ''} 
          />

          {/* Description : même logique que le titre */}
          <InputLabel 
            type='textarea' 
            nameId='description' 
            content='Description*' 
            isRequired={true} 
            value={mode === 'create' ? '' : task?.description ?? ''} 
          />

          {/* Échéance : on extrait la partie date (YYYY-MM-DD) de l'ISO string pour l'input type="date" */}
          <InputLabel 
            type='date'
            nameId='dueDate' 
            content='Échéance*'
            isRequired={true} 
            value={mode === 'create' ? '' : task?.dueDate ? task.dueDate.split('T')[0] : ''} 
          />

          {/* Sélecteur multiple des collaborateurs assignés, pré-rempli en mode édition */}
          <UserMultiSelect   
            mode="local"
            name="assigneeIds"
            label="Assigné à :"
            options={members}
            defaultSelected={defaultAssignees}
            placeholder="Choisir un ou plusieurs collaborateurs"
          />

          {/* Select natif pour la priorité, avec icône de flèche qui change selon le focus */}
          <div className={styles.priority}>
            <label htmlFor='priority' className={styles.label}>Prioritée :</label>
            <div className={styles.wrapper}>
              <select
                  className={styles.select}
                  name="priority"
                  id="priority"
                  defaultValue={task?.priority ?? 'LOW'}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
              >
                  <option value={"LOW"}>Basse</option>
                  <option value={"MEDIUM"}>Moyenne</option>
                  <option value={"HIGH"}>Élevée</option>
                  <option value={"URGENT"}>Urgente</option>
              </select>
              <Image
                  src={`/images/${isFocused ? "Up" : "Down"}.svg`}
                  alt=""
                  width={12}
                  height={12}
                  className={styles.arrow}
              />
            </div>
          </div>

          {/* Statut de la tâche, affiché sous forme de groupe de boutons radio */}
          <div className={styles.field}>
            <p className={styles.status}>Statut :</p>
            <StatusRadioGroup name='currentState' defaultValue={task?.status ?? 'TODO'} />
          </div>

          {/* Message d'erreur éventuel (échec de création/modification) */}
          {state.error && <p className={styles.error}>{state.error}</p>}
        </div>

        {/* Bouton de soumission, désactivé visuellement (texte "Enregistrement...") pendant l'envoi */}
        <Button type="submit" content={isPending ? 'Enregistrement...' : mode === 'create' ? '+ Ajouter une tâche' : 'Enregistrer'}/>
      </form>
    </Modal>
  );
}