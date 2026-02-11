import { useEffect, useRef, useState } from "react";
import "./CreateEventForm.css";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreate: (payload: { title: string; date: string; location: string; capacity: number }) => Promise<void>;
};

export default function CreateEventForm({ open, onClose, onCreate }: Props) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState<number>(10);

    const titleRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => titleRef.current?.focus(), 0);
        return () => clearTimeout(t);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim() || !date.trim() || !location.trim()) return;

        await onCreate({
            title: title.trim(),
            date: date.trim(),
            location: location.trim(),
            capacity: Number(capacity) || 10,
        });

        setTitle("");
        setDate("");
        setLocation("");
        setCapacity(10);
        onClose();
    }

    if (!open) return null;

    return (
        <div className="create-event__overlay" onMouseDown={onClose}>
            <div className="create-event__dialog" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="create-event__header">
                    <h2 className="create-event__title">Créer un événement</h2>
                    <button type="button" className="create-event__close" onClick={onClose} aria-label="Fermer">✕</button>
                </div>

                <form className="create-event__form" onSubmit={handleSubmit}>
                    <input ref={titleRef} placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
                    <input placeholder="Lieu" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input
                        type="number"
                        min={1}
                        placeholder="Nombre de places"
                        value={capacity}
                        onChange={(e) => setCapacity(parseInt(e.target.value || "10", 10))}
                    />

                    <div className="create-event__actions">
                        <button type="button" className="create-event__cancel" onClick={onClose}>Annuler</button>
                        <button type="submit" className="create-event__button">Ajouter</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
