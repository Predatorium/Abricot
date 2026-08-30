'use client';

import { useRef } from 'react';
import styles from './InputLabel.module.css';
import Image from 'next/image';

// Composant générique de champ de formulaire avec label, tooltip optionnelle,
// et support de plusieurs types (text, textarea, date, etc.)
// nameId : sert à la fois d'id, de name du champ, et d'id du label (accessibilité via htmlFor)
// content : texte du label affiché
// type : type d'input HTML ("text", "date"...) ou "textarea" pour basculer sur une zone de texte
// isRequired : ajoute l'attribut HTML required
// placeholder, value, onChange : props classiques transmises à l'input/textarea
// tooltip : texte optionnel affiché dans une bulle d'aide au survol/focus de l'icône ⓘ
export default function InputLabel({ nameId, content, type, isRequired, placeholder, value, onChange, tooltip }) {
  // Référence directe vers l'élément input/textarea, utilisée pour déclencher
  // manuellement l'ouverture du calendrier natif sur les champs de type "date"
  const inputRef = useRef(null);
  // Permet d'appliquer un style spécifique et d'afficher l'icône calendrier uniquement pour les dates
  const isDate = type === 'date';
  // Choix dynamique de la balise HTML à rendre : <textarea> ou <input>
  const Tag = type === 'textarea' ? 'textarea' : 'input';

  // L'attribut "type" n'a de sens que pour un <input> ; un <textarea> n'en accepte pas
  const inputProps = type === 'textarea' ? {} : { type };

  return (
    <div className={styles.label}>
      <div className={styles.titleRow}>
        <label htmlFor={nameId} className={styles.title}>{content}</label>
        {/* Tooltip d'aide, affichée seulement si une prop tooltip est fournie */}
        {tooltip && (
          <span
            className={styles.tooltipWrapper}
            tabIndex={0} // rend l'icône focusable au clavier (accessibilité)
            role="button"
            aria-describedby={`${nameId}-tooltip`} // relie l'icône au contenu de la tooltip pour les lecteurs d'écran
          >
            <span className={styles.tooltipIcon} aria-hidden="true">ⓘ</span>
            {/* Contenu de la tooltip, affiché en CSS pur au survol/focus (voir CSS Modules) */}
            <span id={`${nameId}-tooltip`} role="tooltip" className={styles.tooltipContent}>
              {tooltip}
            </span>
          </span>
        )}
      </div>

      <div className={styles.inputWrapper}>
        {/* Rendu dynamique : <input> ou <textarea> selon le type, avec les props communes */}
        <Tag
          ref={inputRef}
          id={nameId}
          name={nameId}
          {...inputProps}
          className={`${styles.input} ${isDate ? styles.dateInput : ''}`}
          required={isRequired}
          placeholder={placeholder}
          defaultValue={value ?? ''} // non-contrôlé : la valeur initiale seulement, pas de re-render à chaque frappe
          onChange={onChange}
        />

        {/* Bouton calendrier custom, affiché uniquement pour les champs de type "date",
            pour remplacer/compléter l'icône native du navigateur */}
        {isDate && (
          <button
            type="button"
            className={styles.calendarIcon}
            // showPicker() ouvre le sélecteur de date natif du navigateur ; optional chaining
            // car cette méthode n'est pas supportée par tous les navigateurs
            onClick={() => inputRef.current?.showPicker?.()}
            tabIndex={-1} // exclu de la navigation au clavier (l'input lui-même reste accessible)
            aria-label="Ouvrir le calendrier"
          >
            <Image
              src={`/images/Calendar.svg`}
              alt={`Calendar`}
              width={12}
              height={12}
              loading="eager"
            />
          </button>
        )}
      </div>
    </div>
  );
}