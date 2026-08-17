'use client'

import styles from './Button.module.css'
import Link from "next/link";
import Image from "next/image"
import { useState } from 'react';

export function Button({ content, outline = false, type = 'button', onClick = null, disabled = false }) {
  return (
    <button type={type} onClick={onClick} className={`${styles.button} 
      ${outline ? styles.outline : styles.simple}`} disabled={disabled}>
      {content}
    </button>
  )
}

export function ButtonLink({ content, outline, link }) {
  return (
    <Link href={link} className={`${styles.button} ${outline ? styles.outline : styles.simple}`}>
      {content}
    </Link>
  )
}

export function IconLinkButton({ icon, link }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={link}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={styles.iconButton}
    >
      <Image
        src={`/images/${isHovered ? icon + "_orange" : icon}.svg`}
        alt={`Icon ${icon}`}
        width={15}
        height={15}
        loading="eager"
      />
    </Link>
  )
}

export function IconButton({ icon, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={styles.iconButton}
    >
      <Image
        src={`/images/${isHovered ? icon + "_orange" : icon}.svg`}
        alt={`Icon ${icon}`}
        width={15}
        height={15}
        loading="eager"
      />
    </button>
  )
}

export function ButtonIA({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={styles.buttonIA}
    >
      <Image
        src={`/images/${"IA" + (isHovered ? "_orange" : "")}.svg`}
        alt={`Icon IA`}
        width={15}
        height={15}
        loading="eager"
      />
    </button>
  )
}

export function ButtonIAWithText({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={styles.buttonIAText}
    >
      <Image
        src={`/images/${"IA" + (isHovered ? "_orange" : "")}.svg`}
        alt={`Icon IA`}
        width={21}
        height={21}
        loading="eager"
      />
      IA
    </button>
  )
}