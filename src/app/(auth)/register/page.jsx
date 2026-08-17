"use client"

import InputLabel from '@/components/Utils/InputLabel';
import { Button } from '@/components/Clickable/Button';
import { LogoAuth } from '@/components/Layout/Logo'
import { useActionState } from "react";
import Link from 'next/link';
import { Register } from './action';
import styles from "./register.module.css"

export default function RegisterPage() {
  const [actionData, formAction, isPending] = useActionState(Register, null);

  return (
    <div className={styles.register}>
      <LogoAuth />
      <form action={formAction} className={styles.regForm}>
          <h1 className={styles.title}>Inscription</h1>

          <InputLabel type='email' nameId='email' content='Email' />
          <InputLabel type='password' nameId='password' content='Mot de passe' />

          {actionData?.error && <p className={styles.error}>{actionData.error}</p>}

          <Button content={"S'inscrire"} type="submit"/>
      </form>
      <p className={styles.log}>
        {"Déjà inscrit ? "}
        <Link href="/login" className={styles.login}>Se connecter</Link>
      </p>
    </div>
  );
}