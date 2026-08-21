import styles from './Contributor.module.css';
import { useAuth } from '@/contexts/AuthContext';

export default function Contributor({ name, id, onClick }) {
    const { user } = useAuth();

    return (
        <div className={styles.contributor}>
            <p className={styles.name}>{name}</p>

            { user.id !== id &&
                <button
                    type="button"
                    onClick={onClick}
                    className={styles.iconButton}
                >
                    <p className={styles.icon}>x</p>
                </button> 
            }
        </div>
    );
}