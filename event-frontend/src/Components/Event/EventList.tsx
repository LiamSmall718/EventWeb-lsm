import "./EventList.css";
import EventCard from "./EventCard.tsx";
import EventDialog from "./Dialog/EventDialog.tsx";
import EditEventDialog from "./Dialog/EditEventDialog.tsx";
import { useState } from "react";

type EventItem = {
    id: number;
    title: string;
    date: string;
    location: string;
    owner_id: number;
    capacity: number;
    attendees_count: number;
    is_joined: boolean;
};

type EditPayload = { title: string; date: string; location: string; capacity: number; };

type Props = {
    events: EventItem[];
    currentUserId?: number;
    onDelete: (id: number) => void;
    onJoin: (id: number) => void;
    onLeave: (id: number) => void;
    onEdit: (id: number, payload: EditPayload) => void;
    title?: string;
};

export default function EventsList({ events, currentUserId, onDelete, onJoin, onLeave, onEdit, title = "Liste des événements" }: Props) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<EventItem | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editSelected, setEditSelected] = useState<EventItem | null>(null);

    function openDialog(ev: EventItem) { setSelected(ev); setOpen(true); }
    function closeDialog() { setOpen(false); setSelected(null); }
    function openEdit(ev: EventItem) { setEditSelected(ev); setEditOpen(true); }
    function closeEdit() { setEditOpen(false); setEditSelected(null); }
    function handleSaveEdit(id: number, payload: EditPayload) { onEdit(id, payload); closeEdit(); }

    return (
        <div className="events-list">
            <h2 className="events-list__title">{title}</h2>

            {events.length === 0 ? (
                <p className="events-list__empty">Aucun événement pour le moment.</p>
            ) : (
                <div className="events-list__grid">
                    {events.map((ev) => (
                        <div key={ev.id} className="events-list__cell" onClick={() => openDialog(ev)} role="button" tabIndex={0}>
                            <EventCard
                                id={ev.id}
                                title={ev.title}
                                date={ev.date}
                                location={ev.location}
                                capacity={ev.capacity}
                                attendees_count={ev.attendees_count}
                                is_joined={ev.is_joined}
                                canDelete={ev.owner_id === currentUserId}
                                onDelete={onDelete}
                                onJoin={onJoin}
                                onLeave={onLeave}
                                onEdit={(eventId) => {
                                    const target = events.find((x) => x.id === eventId);
                                    if (target) openEdit(target);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <EventDialog open={open} onClose={closeDialog} event={selected} />
            <EditEventDialog open={editOpen} event={editSelected} onClose={closeEdit} onSave={handleSaveEdit} />
        </div>
    );
}
