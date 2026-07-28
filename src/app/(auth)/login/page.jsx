"use client";

import InputLabel from '@/components/InputLabel';
import { Button } from '@/components/Button';
import { LogoAuth } from '@/components/Logo'
import Link from 'next/link';
import { login } from './action'
import { useActionState } from "react";
import styles from './login.module.css'

export default function LoginPage() {
  const [actionData, formAction, isPending] = useActionState(login, null);

  return (
    <div className={styles.login}>
      <LogoAuth />
      <form action={formAction} className={styles.logForm}>
          <h1 className={styles.title}>Connexion</h1>

          <InputLabel type='email' nameId='email' content='Email' isRequired={true} />
          <InputLabel type='password' nameId='password' content='Mot de passe' isRequired={true} />
          
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