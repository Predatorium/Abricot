// components/shared/UserMultiSelect/UserMultiSelect.jsx
'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Contributor from '@/components/Utils/Contributor';
import styles from './UserMultiSelect.module.css';

// Normalise une chaîne pour une comparaison insensible à la casse et aux accents
// (ex: "Éléonore" et "eleonore" deviennent équivalents)
function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Composant générique de sélection multiple d'utilisateurs, avec deux modes :
// - "local" : filtre une liste déjà chargée en mémoire (options), synchrone
// - "async" : interroge une fonction de recherche externe (searchFn), avec debounce
// name : préfixe utilisé pour les inputs cachés (FormData) et l'id du champ de recherche
// defaultSelected : présélection initiale (ex: membres déjà assignés en mode édition)
export default function UserMultiSelect({ mode = 'local', name, label, options = [], searchFn, defaultSelected = [], placeholder = 'Rechercher...',}) {
    // Texte actuellement saisi dans le champ de recherche
    const [query, setQuery] = useState('');
    // Résultats de la recherche en mode async (vide en mode local)
    const [asyncResults, setAsyncResults] = useState([]);
    // Indique qu'une recherche async est en cours (affichage d'un message "Recherche...")
    const [isSearching, setIsSearching] = useState(false);
    // Liste des utilisateurs sélectionnés (affichés en chips, et envoyés via inputs cachés)
    const [selected, setSelected] = useState(defaultSelected);
    // Référence au timer de debounce, pour pouvoir l'annuler à chaque nouvelle frappe
    const debounceRef = useRef(null);
    const debounceMs = 300;
    const minChars = 3;

    // Mode async : recherche débouncée via searchFn
    // Se redéclenche à chaque changement de query (ou de selected, pour filtrer les résultats)
    useEffect(() => {
        if (mode !== 'async') 
            return;

        // Annule la recherche précédente si l'utilisateur tape encore avant la fin du délai
        if (debounceRef.current) 
            clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            // En dessous du seuil minimal de caractères, on ne lance pas de recherche
            if (query.trim().length < minChars) {
                setAsyncResults([]);
                return;
            }
            setIsSearching(true);
            const users = await searchFn(query);
            // On exclut de la liste de résultats les utilisateurs déjà sélectionnés
            setAsyncResults(users.filter((u) => !selected.some((s) => s.id === u.id)));
            setIsSearching(false);
        }, debounceMs);

        // Nettoyage : annule le timer en attente si le composant est démonté
        // ou si une nouvelle recherche est déclenchée avant l'exécution de celle-ci
        return () => clearTimeout(debounceRef.current);
    }, [mode, query, selected, searchFn, minChars, debounceMs]);

    // Mode local : filtrage synchrone dans options (pas de setState, donc pas de souci d'effect)
    const localResults = useMemo(() => {
        if (mode !== 'local') 
            return [];

        // On retire les utilisateurs déjà sélectionnés du pool de résultats possibles
        const pool = options.filter((o) => !selected.some((s) => s.id === o.id));
        // Sans texte de recherche, on propose tout le pool restant
        if (!query.trim()) 
            return pool;

        // Comparaison insensible à la casse et aux accents
        const normalizedQuery = normalize(query);
        return pool.filter((o) => normalize(o.name).includes(normalizedQuery));
    }, [mode, options, query, selected]);

    // Sélection de la source de résultats à afficher selon le mode actif
    const results = mode === 'local' ? localResults : asyncResults;

    // Ajoute un utilisateur à la sélection et vide le champ de recherche
    const addUser = (user) => {
        setSelected((prev) => [...prev, user]);
        setQuery('');
        if (mode === 'async') 
            setAsyncResults([]);
    };

    // Retire un utilisateur de la sélection (ex: clic sur son chip)
    const removeUser = (id) => {
        setSelected((prev) => prev.filter((u) => u.id !== id));
    };

    return (
        <div className={styles.multiSelect}>
            {label && <label htmlFor={`${name}-search`} className={styles.label}>{label}</label>}

            <div className={styles.container}>
                <div className={styles.area}>
                    {/* Chips des utilisateurs déjà sélectionnés, avec bouton de suppression */}
                    {selected.length > 0 && (
                        <div className={styles.chips}>
                            {selected.map((u) => (
                                <Contributor key={u.id} name={u.name} id={u.id} onClick={() => removeUser(u.id)}/>
                            ))}
                        </div>
                    )}

                    {/* Champ de recherche/saisie, commun aux deux modes */}
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

                {/* Indicateur de chargement, uniquement en mode async */}
                {mode === 'async' && isSearching && <p className={styles.hint}>Recherche...</p>}

                {/* Liste déroulante des résultats cliquables, affichée à partir de minChars caractères saisis */}
                {results.length > 0 && query.trim().length >= minChars && (
                    <div className={styles.results}>
                        {results.map((u) => (
                            <button key={u.id} type="button" onClick={() => addUser(u)}>
                                {u.name ?? u.email}
                            </button>
                        ))}
                    </div>
                )}

                {/* Message "aucun résultat", uniquement en mode local (le mode async gère son propre message via isSearching) */}
                {mode === 'local' && results.length === 0 && query.trim() && (
                    <p className={styles.hint}>Aucun résultat</p>
                )}

                {/* inputs cachés pour le FormData */}
                {/* Un input hidden par utilisateur sélectionné, sérialisé en JSON,
                    pour que la sélection soit récupérable via formData.getAll(name) côté Server Action */}
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