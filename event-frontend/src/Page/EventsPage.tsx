import "./Styles/EventsPage.scss";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../API/auth-actions";
import { getEvents, createEvent, deleteEvent, joinEvent, leaveEvent, updateEvent } from "../API/event-action.ts";
import EventsHeader from "../Components/Event/EventsHeader.tsx";
import CreateEventForm from "../Components/Event/Form/CreateEventForm.tsx";
import EventsList from "../Components/Event/EventList.tsx";
import ConfirmDialog from "../Components/Event/Dialog/ConfirmDialog.tsx";
import type { User, EventItem } from "../utils/types";

type TimeFilter = "all" | "future" | "past";
type ScopeFilter = "all" | "mine";

export default function EventsPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [openCreate, setOpenCreate] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
    const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);

    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

    const currentUserId = user ? Number(user.id) : undefined;

    function isPast(dateStr: string) { const t = new Date(dateStr).getTime(); return Number.isFinite(t) ? t < Date.now() : false; }

    function askLogout() { setConfirmLogoutOpen(true); }
    function cancelLogout() { setConfirmLogoutOpen(false); }
    function confirmLogout() { localStorage.removeItem("token"); window.dispatchEvent(new Event("storage")); navigate("/", { replace: true }); setConfirmLogoutOpen(false); }

    useEffect(() => {
        (async () => {
            try {
                const u = await validateToken(); setUser(u);
                const evs = await getEvents(); setEvents(evs);
            } catch {
                localStorage.removeItem("token"); window.dispatchEvent(new Event("storage")); navigate("/login", { replace: true });
            } finally { setLoading(false); }
        })();
    }, [navigate]);

    async function onCreate(payload: { title: string; date: string; location: string; capacity: number }) {
        try { const ev = await createEvent(payload); setEvents((prev) => [ev, ...prev]); }
        catch (err: any) { alert(err?.message ?? "Erreur création event"); throw err; }
    }

    function askDelete(id: number) { setEventToDelete(id); setConfirmDeleteOpen(true); }
    function cancelDelete() { setConfirmDeleteOpen(false); setEventToDelete(null); }

    async function confirmDelete() {
        if (eventToDelete == null) return;
        try { await deleteEvent(eventToDelete); setEvents(prev => prev.filter(ev => ev.id !== eventToDelete)); }
        catch (err: any) { alert(err?.message ?? "Erreur suppression event"); }
        finally { setConfirmDeleteOpen(false); setEventToDelete(null); }
    }

    async function onJoin(id: number) {
        try { const r = await joinEvent(id); setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...r } : ev))); }
        catch (err: any) { alert(err?.message ?? "Erreur inscription"); }
    }

    async function onLeave(id: number) {
        try { const r = await leaveEvent(id); setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...r } : ev))); }
        catch (err: any) { alert(err?.message ?? "Erreur désinscription"); }
    }

    async function onEditSave(id: number, payload: any) {
        try { await updateEvent(id, payload); const updated = await getEvents(); setEvents(updated); }
        catch (err: any) { alert(err?.message ?? "Erreur lors de la modification"); }
    }

    const filteredEvents = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        let list = [...events];

        if (scopeFilter === "mine" && currentUserId != null) list = list.filter((ev: any) => Number((ev as any).owner_id) === currentUserId);
        if (timeFilter === "future") list = list.filter((ev) => !isPast(ev.date));
        if (timeFilter === "past") list = list.filter((ev) => isPast(ev.date));
        if (q) list = list.filter((ev) => (ev.title ?? "").toLowerCase().includes(q) || (ev.location ?? "").toLowerCase().includes(q));

        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (timeFilter === "past") list.reverse();

        return list;
    }, [events, searchQuery, timeFilter, scopeFilter, currentUserId]);

    const aVenir = useMemo(() => filteredEvents.filter(ev => !isPast(ev.date)), [filteredEvents]);
    const passes = useMemo(() => filteredEvents.filter(ev => isPast(ev.date)), [filteredEvents]);

    if (loading) return <div className="events-page__loading">Chargement…</div>;

    return (
        <div className="events-page">
            <EventsHeader
                user={user}
                onLogout={askLogout}
                onCreate={() => setOpenCreate(true)}
                onProfile={() => navigate("/profile")}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                timeFilter={timeFilter}
                onTimeFilterChange={setTimeFilter}
                scopeFilter={scopeFilter}
                onScopeFilterChange={setScopeFilter}
            />

            <CreateEventForm open={openCreate} onClose={() => setOpenCreate(false)} onCreate={onCreate} />

            <div className="events-hero">
                <div className="events-hero__left">
                    <div className="events-hero__crumbs">Accueil / Événements</div>
                    <h1 className="events-hero__title">Événements</h1>
                    <p className="events-hero__desc">Retrouvez les événements à venir et les événements passés.</p>
                </div>
                <div className="events-hero__right">Events</div>
            </div>

            <section className="events-section">
                <h2 className="events-section__title">À venir</h2>
                <div className="events-grid">
                    <EventsList events={aVenir} currentUserId={currentUserId} onDelete={askDelete} onJoin={onJoin} onLeave={onLeave} onEdit={onEditSave} />
                </div>
            </section>

            <section className="events-section">
                <h2 className="events-section__title">Passés</h2>
                <div className="events-grid">
                    <EventsList events={passes} currentUserId={currentUserId} onDelete={askDelete} onJoin={onJoin} onLeave={onLeave} onEdit={onEditSave} />
                </div>
            </section>

            <ConfirmDialog
                open={confirmDeleteOpen}
                title="Supprimer l’événement"
                message="Voulez-vous vraiment supprimer cet événement ? Cette action est irréversible."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <ConfirmDialog
                open={confirmLogoutOpen}
                title="Déconnexion"
                message="Voulez-vous vraiment vous déconnecter ?"
                confirmLabel="Se déconnecter"
                cancelLabel="Annuler"
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
            />
        </div>
    );
}
