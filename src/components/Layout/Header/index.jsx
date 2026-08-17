import { LogoHeader } from "../Logo"
import MenuItem from "../../Clickable/MenuItem"
import UserIcon from "../../Clickable/UserIcon"
import styles from "./Header.module.css"

export default function Header() {

    return (
        <div className={styles.header}>
            <LogoHeader />
            <div className={styles.menuItems}>
                <MenuItem icon={"Dashboard"} text={"Tableau de bord"} link={"/dashboard"} />
                <MenuItem icon={"Project"} text={"Projets"} link={"/projects"} />
            </div>
            <UserIcon />
        </div>
    )
}