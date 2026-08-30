import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useComments } from "@/contexts/CommentContext";
import { getInitials, dateCreatedAt } from '@/services/utils';
import styles from './Comment.module.css';
import { Button } from "@/components/Clickable/Button";

// Affichage d'un commentaire existant (avatar avec initiales, nom de l'auteur,
// contenu, et date formatée)
export function Comment({ comment }) {
    const { content, author, createdAt } = comment;

    return (
        <div className={styles.comment}>
            {/* Avatar : initiales de l'auteur, ou rien si l'auteur est absent (ex: compte supprimé) */}
            <p className={styles.userIcon}>{author ? getInitials(author.name) : ""}</p>
            <div className={styles.commentContent}>
                <div className={styles.commentText}>
                    <p className={styles.author}>{author.name}</p>
                    <p className={styles.content}>{content}</p>
                </div>
                {/* Date formatée (ex: "il y a 2h", "12 mars") via le service utils */}
                <p className={styles.date}>{dateCreatedAt(createdAt)}</p>
            </div>
        </div>
    );
}

// Formulaire d'ajout d'un nouveau commentaire (textarea + bouton Envoyer)
export function AddComment() {
    // Utilisateur connecté, pour afficher son avatar pendant la saisie
    const { user } = useAuth();
    // Fonction du Context permettant d'ajouter un commentaire (appelle la Server Action et rafraîchit la liste)
    const { addComment } = useComments();

    // Contenu du textarea en cours de saisie
    const [content, setContent] = useState("");
    // Empêche les doubles soumissions et permet de désactiver le champ pendant l'envoi
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Message d'erreur affiché en cas d'échec de l'ajout
    const [error, setError] = useState(null);

    // Envoie le commentaire au backend via le Context
    async function submitComment() {
        // Ignore les soumissions vides (après trim) ou si un envoi est déjà en cours
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await addComment({ content: content.trim() });
            // Réinitialise le champ une fois le commentaire envoyé avec succès
            setContent("");
        } catch (err) {
            setError("Erreur lors de l'ajout du commentaire.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Permet d'envoyer le commentaire avec la touche Entrée seule
    // (Shift+Entrée reste disponible pour insérer un retour à la ligne dans le textarea)
    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitComment();
        }
    }

    return (
        <div className={styles.comment}>
            {/* Avatar de l'utilisateur connecté, ou rien si non authentifié */}
            <p className={styles.userIcon}>{user ? getInitials(user.name) : ""}</p>
            <div className={styles.container}>
                <div className={styles.commentInput}>
                    <textarea
                        className={styles.addCommentInput}
                        placeholder="Ajouter un commentaire..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                    />
                    {/* Message d'erreur affiché sous le champ en cas d'échec */}
                    {error && <p className={styles.error}>{error}</p>}
                </div>
                {/* Bouton désactivé tant que le champ est vide (pas de vérification de isSubmitting ici,
                    mais submitComment() bloque déjà les doubles envois en interne) */}
                <Button content="Envoyer" onClick={submitComment} disabled={!content.trim()} />
            </div>
        </div>
    );
}