"use client";

import { usePathname } from "next/navigation";
import Link from "next/link"
import Image from "next/image"
import styles from "./MenuItem.module.css"

export default function MenuItem({icon, text, link}) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(link);

    return (
        <Link href={link} className={`${styles.menuItem} ${isActive ? styles.active : ""}`}>
            <Image  
                src={`/images/${isActive ? icon + "_white" : icon}.svg`} 
                alt={`Icon ${text}`} 
                width={24}
                height={24} 
                loading="eager"/>
            {text}
        </Link>
    )
}