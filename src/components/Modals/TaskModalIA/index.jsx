'use client';

import { Button } from "@/components/Clickable/Button"
import { useState } from 'react';
import { useTaskModalIA } from '@/contexts/TaskModalIAContext';
import { generateTasksFromDescription } from '@/actions/generateTasks';
import { useTasks } from '@/contexts/TaskContext';
import TaskIA from "@/components/Card/TaskIA"
import Modal from '@/components/Modals';
import Image from "next/image";
import styles from "./TaskModalIA.module.css"
import { createTaskAction } from '@/actions/taskActions';

// Modale permettant de générer des tâches via IA à partir d'une description,
// de les éditer/supprimer avant validation, puis de les créer en base
export default function TaskModalIA() {
    // État global de la modale (ouverture, projet concerné) via Context
    const { isOpen, projectId, closeModalIA } = useTaskModalIA();
    // Gère le hover sur le bouton IA pour changer l'icône (normale/orange)
    const [isHovered, setIsHovered] = useState(false);
    // Indique si une génération IA est en cours (désactive les inputs, affiche un loader)
    const [isLoading, setIsLoading] = useState(false);
    // Permet de rafraîchir la liste des tâches après création
    const { refreshTasks } = useTasks();
    // Message d'erreur affiché à l'utilisateur (génération IA ou création de tâche)
    const [error, setError] = useState(null);
    // Contenu du textarea (description saisie par l'utilisateur)
    const [content, setContent] = useState("");
    // Liste des tâches générées par l'IA (éditables avant validation)
    const [generatedTasks, setGeneratedTasks] = useState([]);

    // Bascule l'affichage : tant qu'aucune tâche n'est générée, on est en mode "saisie",
    // une fois des tâches générées, on passe en mode "validation" (liste + bouton Ajouter)
    const submit = generatedTasks.length > 0;

    // Titre dynamique de la modale, avec icône IA
    const title = (
    <>
        <Image
        src={`/images/IA_orange.svg`}
        alt={`Icon IA`}
        width={21}
        height={21}
        loading="eager"
        />
        {submit ? "Vos tâches..." : "Créer une tâche"}
    </>
    );

    // Appelle la Server Action de génération IA à partir du texte saisi
    const handleGenerate = async () => {
        // Évite un appel si le champ est vide ou si une génération est déjà en cours
        if (!content.trim() || isLoading) return;
        setIsLoading(true);
        setError(null);

        const tasks = await generateTasksFromDescription(content);

        if (tasks.length === 0) {
            // Cas où l'IA n'a rien renvoyé d'exploitable (erreur API ou parsing raté côté serveur)
            setError("Aucune tâche n'a pu être générée. Essaie une description plus précise.");
        } else {
            setGeneratedTasks(tasks);
        }
        setIsLoading(false);
    };

    // Modifie un champ (name/description) d'une tâche générée, à l'index donné
    const handleEditTask = (index, field, value) => {
        setGeneratedTasks(prev =>
            prev.map((task, i) => i === index ? { ...task, [field]: value } : task)
        );
    };

    // Retire une tâche générée de la liste (avant validation)
    const handleRemoveTask = (index) => {
        setGeneratedTasks(prev => prev.filter((_, i) => i !== index));
    };

    // Réinitialise complètement l'état local et ferme la modale
    // (utilisée à la fois pour la fermeture manuelle et après validation réussie)
    const action = () => {
        setGeneratedTasks([]);
        setError(null);
        setContent('');
        closeModalIA();
        return { error: null };
    };

    // Crée en base chaque tâche générée, une par une, via createTaskAction
    const handleConfirm = async () => {
        for (const task of generatedTasks) {
            // Construction du payload attendu par l'API à partir de la tâche générée
            // (valeurs par défaut pour les champs non gérés par l'IA : statut, échéance, assignés, priorité)
            const payload = {
                title: task.name,
                description: task.description,
                status: "TODO",
                dueDate: new Date(),
                assigneeIds: [],
                priority: "LOW", // ou la valeur par défaut attendue par ton backend
            };

            const result = await createTaskAction(projectId, payload);

            if (result?.error) {
                // On arrête la création au premier échec : les tâches déjà créées avant
                // l'erreur restent en base, mais celles après ne sont pas tentées
                setError(`Erreur lors de la création de "${task.name}" : ${result.error}`);
                return;
            }
        }

        // Toutes les tâches ont été créées avec succès : on rafraîchit la liste et on ferme la modale
        await refreshTasks();
        action();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={action}
            title={title}
        >
            <div className={styles.content}>
                {/* Message affiché pendant l'appel à l'IA */}
                {isLoading && <p className={styles.generate}>Génération en cours...</p>}
                <div className={styles.tasks}>
                    {/* Liste des tâches générées, affichées seulement une fois la génération faite */}
                    {submit && generatedTasks.map((task, index) => (
                        <TaskIA
                            key={index}
                            name={task.name}
                            description={task.description}
                            onChangeName={(value) => handleEditTask(index, 'name', value)}
                            onChangeDescription={(value) => handleEditTask(index, 'description', value)}
                            onDelete={() => handleRemoveTask(index)}
                        />
                    ))}
                </div>
                {/* Affichage des erreurs (génération IA ou création de tâche) */}
                {error && <p className={styles.error}>{error}</p>}
                {/* Bouton de validation, visible uniquement une fois des tâches générées */}
                {submit && <Button content="+ Ajouter les tâches" onClick={handleConfirm} />}
            </div>
            {submit && <hr className={styles.separator} />}
            <div className={styles.InputIA}>
                {/* Zone de texte pour décrire les tâches à générer */}
                <textarea
                    name="message"
                    className={styles.AreaInputIA}
                    placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isLoading}
                />
                {/* Bouton déclenchant la génération IA, avec icône changeant au survol */}
                <button 
                    type="button" 
                    onClick={handleGenerate} 
                    className={styles.iconIA}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    disabled={isLoading}
                >
                    <Image
                        src={`/images/IA${isHovered ? "_orange" : ""}.svg`}
                        alt={`Icon IA`}
                        width={9}
                        height={9}
                        loading="eager"
                    />
                </button>
            </div>
        </Modal>
    )
}