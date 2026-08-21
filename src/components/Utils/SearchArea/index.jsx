'use client';

import { useState } from "react";
import Image from "next/image"
import styles from "./SearchArea.module.css";

export default function SearchArea({ onSearch, placeholder = "Rechercher..." }) {
    const [value, setValue] = useState('');

    function handleChange(e) {
        const newValue = e.target.value;
        setValue(newValue);
        onSearch(newValue);
    }

    return (
        <div className={styles.searchArea}>
            <input 
                type="text" 
                name='search' 
                id='search' 
                className={styles.input} 
                placeholder={placeholder}
                value={value} 
                onChange={handleChange}
                aria-label="Rechercher"
            />
            <Image 
                src={"/images/Magnifier.svg"}
                alt={"Magnifier"}
                width={14}
                height={14}
                loading="eager"
                className={styles.magnifier}
            />
        </div>
    )
}