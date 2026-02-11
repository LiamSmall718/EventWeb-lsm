import { useEffect, useState } from "react";
import "./EditEventDialog.css";

type Props = {
    open: boolean;
    event: any;
    onClose: () => void;
    onSave: (id: number, payload: {
        title: string;
        date: string;
        location: string;
        capacity: number;
    }) => void;
};

export default function EditEventDialog({ open, event, onClose, onSave }: Props) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState(10);

    useEffect(() => {
        if (!event) return;
        setTitle(event.title);
        setDate(event.date.slice(0, 16)); // Pour datetime-local
        setLocation(event.location);
        setCapacity(event.capacity);
    }, [event]);

    if (!open || !event) return null;

    return (
        <div className="edit-overlay" onMouseDown={onClose}>
            <div
                className="edit-dialog"
                onMouseDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="edit-header">
                    <h3 className="edit-title">Modifier l’événement</h3>
                    <button className="edit-close" onClick={onClose}>✕</button>
                </div>

                <div className="edit-body">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />
                    <input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" />
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lieu" />
                    <input
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        type="number"
                        min={1}
                    />
                </div>

                <div className="edit-footer">
                    <button className="edit-btn" onClick={onClose}>Annuler</button>
                    <button
                        className="edit-btn primary"
                        onClick={() => onSave(event.id, { title, date, location, capacity })}
                    >
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
}
