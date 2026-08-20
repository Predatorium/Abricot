'use client';
import { useRef } from 'react';
import styles from './InputLabel.module.css';
import Image from 'next/image';

export default function InputLabel({ nameId, content, type, isRequired, placeholder, value, onChange, tooltip }) {
  const inputRef = useRef(null);
  const isDate = type === 'date';
  const Tag = type === 'textarea' ? 'textarea' : 'input';

  const inputProps = type === 'textarea' ? {} : { type };

  return (
    <div className={styles.label}>
      <div className={styles.titleRow}>
        <label htmlFor={nameId} className={styles.title}>{content}</label>
        {tooltip && (
          <span
            className={styles.tooltipWrapper}
            tabIndex={0}
            role="button"
            aria-describedby={`${nameId}-tooltip`}
          >
            <span className={styles.tooltipIcon} aria-hidden="true">ⓘ</span>
            <span id={`${nameId}-tooltip`} role="tooltip" className={styles.tooltipContent}>
              {tooltip}
            </span>
          </span>
        )}
      </div>

      <div className={styles.inputWrapper}>
        <Tag
          ref={inputRef}
          id={nameId}
          name={nameId}
          {...inputProps}
          className={`${styles.input} ${isDate ? styles.dateInput : ''}`}
          required={isRequired}
          placeholder={placeholder}
          defaultValue={value ?? ''}
          onChange={onChange}
        />

        {isDate && (
          <button
            type="button"
            className={styles.calendarIcon}
            onClick={() => inputRef.current?.showPicker?.()}
            tabIndex={-1}
            aria-label="Ouvrir le calendrier"
          >
            <Image
              src={`/images/Calendar.svg`}
              alt={`Calendar`}
              width={15}
              height={15}
              loading="eager"
            />
          </button>
        )}
      </div>
    </div>
  );
}