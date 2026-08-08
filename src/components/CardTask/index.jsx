import Tag from "@/components/Tag";
import Image from "next/image"
import IconText from "@/components/IconText";
import { formatDateFrWithoutYear } from "@/services/utils"
import { IconButton } from "@/components/Button";
import { statusLabel, styleLabel } from "@/services/utils";
import { getInitials } from "@/services/utils"
import { UserIconTag } from "@/components/Tag";
import { Comment, AddComment } from "@/components/Comment";
import { CommentProvider, useComments } from "@/contexts/CommentContext";
import { useState } from "react";
import { Fragment } from "react";
import styles from "./CardTask.module.css"

export default function CardTask({ task }) {
    const { id, title, description, project, dueDate, comments, status, assignees } = task;
    const [commentOpen, setCommentOpen] = useState(false);

    return (
        <div className={styles.card}>
            <div className={styles.head}>
                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <h4 className={styles.title}>{title}</h4>
                        <Tag style={styleLabel(status)} content={statusLabel(status)} />
                    </div>
                    <p className={styles.description}>{description}</p>
                </div>
                <IconButton icon={"Dots"} onClick={() => {}} />
            </div>


            <div className={styles.goal}>
                <p className={styles.greySmallText}>Échéance :</p>
                <IconText icon="Calendar" black={true} text={formatDateFrWithoutYear(dueDate)} width={18} height={18}/>
            </div>

            <div className={styles.teamAvatars}>
                <p className={styles.greySmallText}>Assigné à :</p>
                {assignees.map((assignee) => (
                    <Fragment key={assignee.id}>
                        <UserIconTag key={assignee.id} style="grey" content={getInitials(assignee.user.name)} />
                        <Tag style="grey" content={assignee.user.name} />
                    </Fragment>
                ))}
            </div>

            <hr className={styles.separator} />

            <button
                type="button"
                onClick={() => {setCommentOpen(!commentOpen)}}
                className={styles.iconButton}
                >
                <p className={styles.commentCount}>Commentaires ({comments.length})</p>
                <Image
                    src={`/images/${commentOpen ? "Down" : "Up"}.svg`}
                    alt={`Icon`}
                    width={15}
                    height={15}
                    loading="eager"
                />
            </button>

            {commentOpen && 
                <CommentProvider projectId={project.id} taskId={id} initialComments={comments}>
                    <CommentList />
                    <AddComment />
                </CommentProvider>
            }
        </div>
    );
}

function CommentList() {
    const { comments } = useComments();
    return comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
    ));
}