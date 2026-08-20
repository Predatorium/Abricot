import Image from "next/image"
import Tag from "@/components/Utils/Tag"
import { UserIconTag } from "@/components/Utils/Tag"
import styles from "./CardProject.module.css"
import { getInitials } from "@/services/utils"
import Link from "next/link";

export default function CardProject({ project }){
    const { id, name, description, owner, members, tasksTotal, tasksDone } = project;
    const progress = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;

    return (
        <Link href={`/projects/${id}`} className={styles.card}>
            <div className={styles.head}>
                <h2 className={styles.title}>{name}</h2>
                <p className={styles.description}>{description}</p>
            </div>

            <div className={styles.progress}>
                <div className={styles.progressHeader}>
                    <span>Progression</span>
                    <span className={styles.percent}>{progress}%</span>
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ '--progress': `${progress}%` }} />
                </div>
                <p className={styles.tasksInfo}>{tasksDone}/{tasksTotal} tâches terminées</p>
            </div>

            <div className={styles.team}>
                <div className={styles.teamHeader}>
                    <Image src={`/images/Team.svg`} alt={`Icon team`} 
                        width={12} height={12} loading="eager"/>
                    <span>Équipe ({members.length + 1})</span>
                </div>

                <div className={styles.teamAvatars}>
                    <UserIconTag style="brand" content={getInitials(owner.name)} />
                    <Tag style="brand" content="Propriétaire" />
                    {members.map((member) => (
                        <UserIconTag key={member.id} style="grey" content={getInitials(member.user.name)} />
                    ))}
                </div>
            </div>
        </Link>
    )
}