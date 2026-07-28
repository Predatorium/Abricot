import InputLabel from '@/components/InputLabel';
import { Button } from '@/components/Button';
import { LogoAuth } from '@/components/Logo'
import Link from 'next/link';
import { register } from './action';
import styles from "./register.module.css"

export default function RegisterPage() {
  return (
    <div className={styles.register}>
      <LogoAuth />
      <form action={register} className={styles.regForm}>
          <h1 className={styles.title}>Inscription</h1>

          <InputLabel type='email' nameId='email' content='Email' isRequired={true} />
          <InputLabel type='text' nameId='pseudo' content='Pseudo' isRequired={true} />
          <InputLabel type='password' nameId='password' content='Mot de passe' isRequired={true} />
          
          <Button content={"S'inscrire"} type="submit"/>
      </form>
      <p className={styles.log}>
        {"Déjà inscrit ? "}
        <Link href="/login" className={styles.login}>Se connecter</Link>
      </p>
    </div>
  );
}