import "./EventDialog.css";

type Props = {
    open: boolean;
    onClose: () => void;
    event: {
        title: string;
        date: string;
        location: string;
        capacity: number;
        attendees_count: number;
        is_joined: boolean;
    } | null;
};

export default function EventDialog({ open, onClose, event }: Props) {
    if (!open || !event) return null;

    const d = new Date(event.date);
    const formattedDate = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const formattedTime = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="dialog-overlay" onClick={onClose} role="presentation">
            <div className="dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="dialog__header">
                    <h3 className="dialog__title">{event.title}</h3>
                    <button className="dialog__close" onClick={onClose} aria-label="Fermer">✕</button>
                </div>

                <div className="dialog__body">
                    <div className="dialog__row">
                        <div className="dialog__label">Date</div>
                        <div className="dialog__value">{formattedDate}</div>
                    </div>

                    <div className="dialog__row">
                        <div className="dialog__label">Heure</div>
                        <div className="dialog__value">{formattedTime}</div>
                    </div>

                    <div className="dialog__row">
                        <div className="dialog__label">Lieu</div>
                        <div className="dialog__value">{event.location}</div>
                    </div>

                    <div className="dialog__row">
                        <div className="dialog__label">Capacité</div>
                        <div className="dialog__value">{event.attendees_count} / {event.capacity}</div>
                    </div>

                    <div className="dialog__row">
                        <div className="dialog__label">Statut</div>
                        <div className="dialog__value">{event.is_joined ? "Inscrit" : "Non inscrit"}</div>
                    </div>
                </div>

                <div className="dialog__footer">
                    <button className="dialog__btn" onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
}
