'use client';

import Link from "next/link"
import styles from "./UserIcon.module.css"
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/services/utils'

export default function UserIcon() {
    const { user } = useAuth();

    return (
        <Link href={"/profile"} className={styles.userIcon}>
            <p>{user ? getInitials(user.name) : ""}</p>
        </Link>
    )
}