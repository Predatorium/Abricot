// components/TaskModal/StatusRadioGroup.jsx
'use client';
import { useState } from 'react';
import Tag from '@/components/Utils/Tag';
import { styleLabel, statusLabel } from '@/services/utils';
import styles from './StatusRadioGroup.module.css';

// Liste des statuts possibles pour une tâche
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']; // ajuste à tes vraies valeurs

// Groupe de boutons radio permettant de choisir le statut d'une tâche,
// affichés sous forme de Tags stylés plutôt que de radios natifs
// name : nom du champ pour la soumission via FormData
// defaultValue : statut initial sélectionné (ex: statut actuel de la tâche en édition)
export default function StatusRadioGroup({ name = '', defaultValue = 'TODO' }) {
  // Statut actuellement sélectionné (composant contrôlé, nécessaire ici
  // car chaque radio doit refléter/mettre à jour un état commun au groupe)
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className={styles.group} role="radiogroup" aria-label="Statut">
      {STATUSES.map((status) => (
        // Chaque option est un <label> englobant un radio caché + un Tag visuel,
        // pour bénéficier du comportement natif des radios (accessibilité, clic sur le label)
        // tout en gardant une apparence personnalisée (Tag) plutôt qu'un radio par défaut
        <label key={status} className={`${styles.option} ${styles[styleLabel(status)]}`}>
          <input
            type="radio"
            name={name}
            value={status}
            checked={selected === status}
            onChange={() => setSelected(status)}
            className={styles.hiddenRadio} // radio natif masqué visuellement (mais toujours présent pour le clavier/lecteurs d'écran)
          />
          {/* Représentation visuelle du statut : couleur/style selon styleLabel, texte via statusLabel */}
          <Tag
            style={styleLabel(status)}
            content={statusLabel(status)}
          />
        </label>
      ))}
    </div>
  );
}