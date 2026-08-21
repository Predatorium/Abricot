// components/TaskModal/TaskModal.jsx
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

const initialState = { error: null };

export default function TaskModal() {
  const { isOpen, mode, task, project, closeModal } = useTaskModal();
  const { refreshTasks } = useTasks();
  const [isFocused, setIsFocused] = useState(false);

  const members = useMemo(() => {
    if (!project) return [];

    const normalizedMembers = (project.members ?? []).map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
    }));

    return project.owner ? [project.owner, ...normalizedMembers] : normalizedMembers;
  }, [project]);

  const defaultAssignees = useMemo(() => {
    return (task?.assignees ?? []).map((a) => ({
      id: a.user.id,
      name: a.user.name,
      email: a.user.email,
    }));
  }, [task]);

  const action = async (prevState, formData) => {
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      status: mode === 'create' ? "TODO" : formData.get('currentState'),
      dueDate: formData.get('dueDate') || new Date(), // string vide si non rempli → null
      assigneeIds: formData.getAll('assigneeIds').map((raw) => JSON.parse(raw).id),
      priority: formData.get('priority'),
    };

    const result = mode === 'create'
      ? await createTaskAction(project.id, payload)
      : await updateTaskAction(project.id, task.id, payload);

    if (result?.error) return { error: result.error };

    await refreshTasks();
    closeModal();
    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={mode === 'create' ? 'Créer une tâche' : 'Modifier'}
    >
      <form action={formAction} className={styles.form}>
        <div className={styles.inputs}>
          <InputLabel 
            type='text' 
            nameId='title' 
            content='Titre*' 
            isRequired={true} 
            value={mode === 'create' ? '' : task?.title ?? ''} 
          />

          <InputLabel 
            type='textarea' 
            nameId='description' 
            content='Description*' 
            isRequired={true} 
            value={mode === 'create' ? '' : task?.description ?? ''} 
          />

          <InputLabel 
            type='date'
            nameId='dueDate' 
            content='Échéance*'
            isRequired={true} 
            value={mode === 'create' ? '' : task?.dueDate ? task.dueDate.split('T')[0] : ''} 
          />

          <UserMultiSelect   
            mode="local"
            name="assigneeIds"
            label="Assigné à :"
            options={members}
            defaultSelected={defaultAssignees}
            placeholder="Choisir un ou plusieurs collaborateurs"
          />

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

          <div className={styles.field}>
            <p className={styles.status}>Statut :</p>
            <StatusRadioGroup name='currentState' defaultValue={task?.status ?? 'TODO'} />
          </div>

          {state.error && <p className={styles.error}>{state.error}</p>}
        </div>

        <Button type="submit" content={isPending ? 'Enregistrement...' : mode === 'create' ? '+ Ajouter une tâche' : 'Enregistrer'}/>
      </form>
    </Modal>
  );
}