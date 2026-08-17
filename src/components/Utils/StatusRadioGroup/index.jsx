// components/TaskModal/StatusRadioGroup.jsx
'use client';
import { useState } from 'react';
import Tag from '@/components/Utils/Tag';
import { styleLabel, statusLabel } from '@/services/utils';
import styles from './StatusRadioGroup.module.css';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']; // ajuste à tes vraies valeurs

export default function StatusRadioGroup({ name = '', defaultValue = 'TODO' }) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className={styles.group} role="radiogroup" aria-label="Statut">
      {STATUSES.map((status) => (
        <label key={status} className={`${styles.option} ${styles[styleLabel(status)]}`}>
          <input
            type="radio"
            name={name}
            value={status}
            checked={selected === status}
            onChange={() => setSelected(status)}
            className={styles.hiddenRadio}
          />
          <Tag
            style={styleLabel(status)}
            content={statusLabel(status)}
          />
        </label>
      ))}
    </div>
  );
}