'use client'

import styles from './profile.module.css'
import InputLabel from '@/components/Utils/InputLabel';
import { useAuth } from '@/contexts/AuthContext';
import { logoutAction } from '@/actions/authActions';
import { redirect } from "next/navigation";
import { Button } from '@/components/Clickable/Button';
import { useActionState } from "react";
import { Update } from './action';

export default function Profile() {
    const { user, clearUser } = useAuth();
    const [firstName, lastName] = user?.name.split(' ') || ['', ''];

    const intitialState = { email: user?.email || '', firstName: firstName, lastName: lastName };
    const [actionData, formAction, isPending] = useActionState(Update, intitialState);

    const handleLogout = async () => {
        await logoutAction();
        clearUser();
        redirect("/");      
    };

    return (
        <div className={styles.profile}>
            <div className={styles.head}>
                <h1 className={styles.title}>Mon compte</h1>
                <p className={styles.name}>{user?.name}</p>
            </div>
            
            {actionData?.error && <p className={styles.error}>{actionData.error}</p>}

            <form action={formAction} className={styles.form}>

                {user && <InputLabel key={lastName} type='text' nameId='lastName' content='Nom' value={lastName} />}
                {user && <InputLabel key={firstName} type='text' nameId='firstName' content='Prénom' value={firstName} />}
                {user && <InputLabel key={user.email} type='email' nameId='email' content='Email' value={user.email} />}
                <InputLabel type='password' nameId='currentPassword' content='Mot de passe actuel' placeholder='Votre mot de passe actuel' />
                <InputLabel 
                    type='password' 
                    nameId='password' 
                    content='Nouveau mot de passe' 
                    placeholder='Votre nouveau mot de passe' 
                    tooltip="Min. 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)" 
                />

                <Button content={'Modifier les informations'} type="submit" />
            </form>
            <Button content={'Se déconnecter'} type="button" onClick={handleLogout} />

        </div>
    )
}