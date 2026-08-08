import Tag from "@/components/Tag";
import { formatDateFrWithoutYear } from "@/services/utils"
import IconText from "@/components/IconText";
import { ButtonLink } from "@/components/Button";
import { statusLabel, styleLabel } from "@/services/utils";
import styles from "./Task.module.css"

export default function MyTask({ task, kanban = false }) {
  const { id, title, description, project, dueDate, comments, status } = task;
  const projectName = project?.name;
  const commentsCount = comments?.length ?? 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.status}>
        <Tag style={styleLabel(status)} content={statusLabel(status)} />
      </div>

      <div className={`${styles.datas} ${kanban ? styles.kanban : ""}`}>
        <IconText icon="Folder" text={projectName} width={18} height={18}/>
        <hr className={styles.separator} />
        <IconText icon="Calendar" text={formatDateFrWithoutYear(dueDate)} width={18} height={18}/>
        <hr className={styles.separator} />
        <IconText icon="Comment" text={commentsCount} width={18} height={18}/>
      </div>

      <div className={`${styles.button}  ${kanban ? styles.kanban : ""}`}>
        <ButtonLink content={"Voir"} link={`/projects/${project.id}/tasks/${id}`} outline={false} />
      </div>
    </div>
  );
}