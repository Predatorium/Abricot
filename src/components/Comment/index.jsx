import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useComments } from "@/contexts/CommentContext";
import { getInitials, dateCreatedAt } from '@/services/utils';
import styles from './Comment.module.css';
import { Button } from "@/components/Button";

export function Comment({ comment }) {
    const { content, author, createdAt } = comment;

    return (
        <div className={styles.comment}>
            <p className={styles.userIcon}>{author ? getInitials(author.name) : ""}</p>
            <div className={styles.commentContent}>
                <div className={styles.commentText}>
                    <p className={styles.author}>{author.name}</p>
                    <p className={styles.content}>{content}</p>
                </div>
                <p className={styles.date}>{dateCreatedAt(createdAt)}</p>
            </div>
        </div>
    );
}

export function AddComment() {
    const { user } = useAuth();
    const { addComment } = useComments();

    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function submitComment() {
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await addComment({ content: content.trim() });
            setContent("");
        } catch (err) {
            setError("Erreur lors de l'ajout du commentaire.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitComment();
        }
    }

    return (
        <div className={styles.comment}>
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
                    {error && <p className={styles.error}>{error}</p>}
                </div>
                <Button content="Envoyer" onClick={submitComment} disabled={!isSubmitting} />
            </div>
        </div>
    );
}