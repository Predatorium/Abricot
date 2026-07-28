'use client';

import Link from "next/link"
import styles from "./UserIcon.module.css"
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/services/utils'
import { logoutAction } from '@/actions/authActions';
import { redirect } from "next/navigation";

export default function UserIcon() {
    const { user, clearUser } = useAuth();

    const handleLogout = async () => {
        // On vide le context tout de suite pour une UI instantanée,
        // logoutAction() efface le cookie et redirige vers /login.
        await logoutAction();
        clearUser();
        redirect("/");      
    };

    return (
        <Link href={"/profile"} onClick={handleLogout} className={styles.userIcon}>
            <p>{user ? getInitials(user.name) : ""}</p>
        </Link>
    )
}