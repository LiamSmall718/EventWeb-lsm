import { useEffect, useRef, useState } from "react";
import "./SearchDialog.css";

type Props = {
    open: boolean;
    onClose: () => void;
    initialValue: string;
    onSubmit: (q: string) => void;
    onClear: () => void;
};

export default function SearchDialog({ open, onClose, initialValue, onSubmit, onClear }: Props) {
    const [query, setQuery] = useState(initialValue || "");
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => { if (!open) return; setQuery(initialValue || ""); }, [open, initialValue]);
    useEffect(() => { if (!open) return; const t = setTimeout(() => inputRef.current?.focus(), 0); return () => clearTimeout(t); }, [open]);

    useEffect(() => {
        if (!open) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter") onSubmit(query.trim());
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose, onSubmit, query]);

    if (!open) return null;

    return (
        <div className="search-overlay" onMouseDown={onClose}>
            <div className="search-dialog" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
                <div className="search-header">
                    <h3 className="search-title">Rechercher</h3>
                    <button type="button" className="search-close" onClick={onClose} aria-label="Fermer">✕</button>
                </div>

                <input
                    ref={inputRef}
                    className="search-input"
                    placeholder="Titre, lieu, date…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="search-actions">
                    <button type="button" className="search-clear" onClick={() => { onClear(); setQuery(""); }}>Effacer</button>
                    <button type="button" className="search-submit" onClick={() => onSubmit(query.trim())}>Rechercher</button>
                </div>

                <div className="search-hint">
                    {query.trim() ? `Recherche: "${query.trim()}"` : "Tapez pour chercher…"}
                </div>
            </div>
        </div>
    );
}
