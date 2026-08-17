import styles from './Contributor.module.css';

export default function Contributor({ name, onClick }) {

    return (
        <div className={styles.contributor}>
            <p className={styles.name}>{name}</p>
            <button
                type="button"
                onClick={onClick}
                className={styles.iconButton}
            >
                <p className={styles.icon}>x</p>
            </button>
        </div>
    );
}