// components/shared/UserMultiSelect/UserMultiSelect.jsx
'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Contributor from '@/components/Utils/Contributor';
import styles from './UserMultiSelect.module.css';

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function UserMultiSelect({ mode = 'local', name, label, options = [], searchFn, defaultSelected = [], placeholder = 'Rechercher...',}) {
    const [query, setQuery] = useState('');
    const [asyncResults, setAsyncResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selected, setSelected] = useState(defaultSelected);
    const debounceRef = useRef(null);
    const debounceMs = 300;
    const minChars = 2;

    // Mode async : recherche débouncée via searchFn
    useEffect(() => {
        if (mode !== 'async') 
            return;

        if (debounceRef.current) 
            clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            if (query.trim().length < minChars) {
                setAsyncResults([]);
                return;
            }
            setIsSearching(true);
            const users = await searchFn(query);
            setAsyncResults(users.filter((u) => !selected.some((s) => s.id === u.id)));
            setIsSearching(false);
        }, debounceMs);

        return () => clearTimeout(debounceRef.current);
    }, [mode, query, selected, searchFn, minChars, debounceMs]);

    // Mode local : filtrage synchrone dans options (pas de setState, donc pas de souci d'effect)
    const localResults = useMemo(() => {
        if (mode !== 'local') 
            return [];

        const pool = options.filter((o) => !selected.some((s) => s.id === o.id));
        if (!query.trim()) 
            return pool;

        const normalizedQuery = normalize(query);
        return pool.filter((o) => normalize(o.name).includes(normalizedQuery));
    }, [mode, options, query, selected]);

    const results = mode === 'local' ? localResults : asyncResults;

    const addUser = (user) => {
        setSelected((prev) => [...prev, user]);
        setQuery('');
        if (mode === 'async') 
            setAsyncResults([]);
    };

    const removeUser = (id) => {
        setSelected((prev) => prev.filter((u) => u.id !== id));
    };

    return (
        <div className={styles.multiSelect}>
            {label && <label htmlFor={`${name}-search`} className={styles.label}>{label}</label>}

            <div className={styles.container}>
                <div className={styles.area}>
                    {selected.length > 0 && (
                        <div className={styles.chips}>
                            {selected.map((u) => (
                                <Contributor key={u.id} name={u.name} id={u.id} onClick={() => removeUser(u.id)}/>
                            ))}
                        </div>
                    )}

                    <input
                        id={`${name}-search`}
                        name={`${name}-search`}
                        type="text"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoComplete="off"
                        className={styles.input}
                    />
                </div>

                {mode === 'async' && isSearching && <p className={styles.hint}>Recherche...</p>}

                {results.length > 0 && query.trim().length >= 3 && (
                    <div className={styles.results}>
                        {results.map((u) => (
                            <button key={u.id} type="button" onClick={() => addUser(u)}>
                                {u.name ?? u.email}
                            </button>
                        ))}
                    </div>
                )}

                {mode === 'local' && results.length === 0 && query.trim() && (
                    <p className={styles.hint}>Aucun résultat</p>
                )}

                {/* inputs cachés pour le FormData */}
                {selected.map((user) => (
                    <input 
                        key={user.id} 
                        type="hidden" 
                        id={name} name={name} 
                        value={JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role })} 
                    />
                ))}
            </div>
        </div>
    );
}