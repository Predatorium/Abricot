"use client";

import { usePathname } from "next/navigation";
import Link from "next/link"
import Image from "next/image"
import styles from "./MenuItem.module.css"
import { useState } from 'react';

export default function MenuItem({icon, text, link}) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(link);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link 
            href={link} 
            className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image  
                src={`/images/${isActive || isHovered ? icon + "_white" : icon}.svg`} 
                alt={`Icon ${text}`} 
                width={24}
                height={24} 
                loading="eager"/>
            {text}
        </Link>
    )
}