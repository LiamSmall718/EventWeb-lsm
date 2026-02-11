import "./EventCard.css";

type Props = {
    id: number;
    title: string;
    date: string;
    location: string;
    capacity: number;
    attendees_count: number;
    is_joined: boolean;
    canDelete: boolean;
    onDelete: (id: number) => void;
    onJoin: (id: number) => void;
    onLeave: (id: number) => void;
    onEdit: (id: number) => void;
};

export default function EventCard({
                                      id, title, date, location, capacity, attendees_count,
                                      is_joined, canDelete, onDelete, onJoin, onLeave, onEdit
                                  }: Props) {

    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleDateString("fr-FR", { month: "short" });
    const year = d.getFullYear();

    const isFull = attendees_count >= capacity;
    const isPast = d.getTime() < Date.now();
    const seed = encodeURIComponent(title || String(id));

    return (
        <article className="evcard">
            <div className="evcard__top">
                <div className="evcard__date">
                    <div className="evcard__day">{day}</div>
                    <div className="evcard__month">{month}</div>
                    <div className="evcard__year">{year}</div>
                </div>

                <div className="evcard__content">
                    <div className="evcard__title">{title}</div>
                    <div className="evcard__meta">{location}</div>

                    <div className="evcard__capacity">
                        {attendees_count} / {capacity} inscrits
                        {isFull && " • Complet"}
                        {isPast && " • Passé"}
                    </div>
                </div>
            </div>

            <div
                className="evcard__media"
                style={{ backgroundImage: `url(https://picsum.photos/seed/${seed}/800/500)` }}
            />


            <div className="evcard__actions">
                {!is_joined ? (
                    <button
                        className="evcard__btn"
                        disabled={isFull || isPast}
                        onClick={(e) => { e.stopPropagation(); onJoin(id); }}
                    >
                        S’inscrire
                    </button>
                ) : (
                    <button
                        className="evcard__btn"
                        onClick={(e) => { e.stopPropagation(); onLeave(id); }}
                    >
                        Quitter
                    </button>
                )}

                {canDelete && (
                    <button
                        className="evcard__btn evcard__btn--ghost"
                        onClick={(e) => { e.stopPropagation(); onEdit(id); }}
                    >
                        Modifier
                    </button>
                )}

                {canDelete && (
                    <button
                        className="evcard__btn evcard__btn--ghost"
                        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                    >
                        Supprimer
                    </button>
                )}
            </div>
        </article>
    );
}
