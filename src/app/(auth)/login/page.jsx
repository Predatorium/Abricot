"use client";

import InputLabel from '@/components/Utils/InputLabel';
import { Button } from '@/components/Clickable/Button';
import { LogoAuth } from '@/components/Layout/Logo'
import Link from 'next/link';
import { Login } from './action'
import { useActionState } from "react";
import styles from './login.module.css'

export default function LoginPage() {
  const [actionData, formAction, isPending] = useActionState(Login, null);

  return (
    <div className={styles.login}>
      <LogoAuth />
      <form action={formAction} className={styles.logForm}>
          <h1 className={styles.title}>Connexion</h1>

          <InputLabel type='email' nameId='email' content='Email' />
          <InputLabel type='password' nameId='password' content='Mot de passe' />
          
          {actionData?.error && <p className={styles.error}>{actionData.error}</p>}

          <Button content={'Se connecter'} type="submit" />
      </form>
      <p className={styles.sub}>
        {"Pas encore de compte ? "}
        <Link href="/register" className={styles.create}>Créer un compte</Link>
      </p>
    </div>
  );
}