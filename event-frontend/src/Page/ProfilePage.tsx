import "./Styles/ProfilePage.scss";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../API/auth-actions";
import { getEvents, leaveEvent } from "../API/event-action.ts";
import type { User, EventItem } from "../utils/types";

export default function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [chargement, setChargement] = useState(true);

    function estPasse(dateStr: string) { return new Date(dateStr).getTime() < Date.now(); }
    function retourEvenements() { navigate("/events"); }
    function deconnexion() { localStorage.removeItem("token"); window.dispatchEvent(new Event("storage")); navigate("/", { replace: true }); }

    useEffect(() => {
        (async () => {
            try {
                const u = await validateToken(); setUser(u);
                const evs = await getEvents(); setEvents(evs);
            } catch {
                localStorage.removeItem("token");
                window.dispatchEvent(new Event("storage"));
                navigate("/login", { replace: true });
            } finally {
                setChargement(false);
            }
        })();
    }, [navigate]);

    const utilisateurId = user ? Number(user.id) : undefined;
    const pseudo = user?.username ?? "Utilisateur";
    const avatar = pseudo.trim() ? pseudo.trim()[0].toUpperCase() : "?";

    const mesCreations = useMemo(() => {
        if (utilisateurId == null) return [];
        return events.filter(ev => Number((ev as any).owner_id) === utilisateurId);
    }, [events, utilisateurId]);

    const mesInscriptions = useMemo(() => {
        if (utilisateurId == null) return [];
        return events.filter((ev: any) => {
            if (typeof ev.is_joined === "boolean") return ev.is_joined;
            if (typeof ev.joined === "boolean") return ev.joined;
            if (Array.isArray(ev.participants)) return ev.participants.includes(utilisateurId);
            if (Array.isArray(ev.attendees)) return ev.attendees.some((u: any) => Number(u.id) === utilisateurId);
            return false;
        });
    }, [events, utilisateurId]);


    const aVenir = useMemo(
        () => mesInscriptions.filter(ev => !estPasse(ev.date)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [mesInscriptions]
    );

    const passes = useMemo(
        () => mesInscriptions.filter(ev => estPasse(ev.date)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [mesInscriptions]
    );

    const stats = {
        crees: mesCreations.length,
        inscrits: mesInscriptions.length,
        avenir: aVenir.length
    };

    async function quitter(id: number) {
        try {
            await leaveEvent(id);
            const evs = await getEvents();
            setEvents(evs);
        } catch (err: any) {
            alert(err?.message ?? "Erreur lors de la désinscription");
        }
    }

    if (chargement) return <div className="profile-chargement">Chargement…</div>;

    return (
        <div className="profil-page">
            <div className="profil-topbar">
                <button className="profil-retour" onClick={retourEvenements}>← Retour</button>
                <button className="profil-logout" onClick={deconnexion}>Déconnexion</button>
            </div>

            <div className="profil-entete">
                <div className="profil-avatar">{avatar}</div>
                <div>
                    <div className="profil-nom">{pseudo}</div>
                    <div className="profil-sous">{stats.avenir} événement(s) à venir</div>
                </div>
            </div>

            <div className="profil-grille">
                <section className="profil-bloc">
                    <h2>Informations</h2>
                    <div className="profil-ligne"><span>Pseudo</span><span>{pseudo}</span></div>
                    <div className="profil-ligne"><span>Identifiant</span><span>{user?.id ?? "-"}</span></div>
                </section>

                <section className="profil-bloc">
                    <h2>Statistiques</h2>
                    <div className="profil-stats">
                        <div className="stat"><div className="stat-n">{stats.crees}</div><div className="stat-l">Créés</div></div>
                        <div className="stat"><div className="stat-n">{stats.inscrits}</div><div className="stat-l">Inscrit</div></div>
                        <div className="stat"><div className="stat-n">{stats.avenir}</div><div className="stat-l">À venir</div></div>
                    </div>
                </section>

                <section className="profil-bloc profil-bloc-large">
                    <h2>Mes événements</h2>

                    <div className="profil-soustitre">À venir</div>
                    {aVenir.length === 0 ? (
                        <div className="profil-vide">Aucun événement à venir</div>
                    ) : (
                        <div className="profil-liste">
                            {aVenir.map(ev => (
                                <div className="profil-item" key={ev.id}>
                                    <div>
                                        <div className="profil-item-titre">{ev.title}</div>
                                        <div className="profil-item-meta">
                                            {new Date(ev.date).toLocaleString("fr-FR")} · {ev.location}
                                        </div>
                                    </div>
                                    <button className="profil-item-btn" onClick={() => quitter(ev.id)}>Quitter</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="profil-soustitre">Passés</div>
                    {passes.length === 0 ? (
                        <div className="profil-vide">Aucun événement passé</div>
                    ) : (
                        <div className="profil-liste">
                            {passes.map(ev => (
                                <div className="profil-item" key={ev.id}>
                                    <div>
                                        <div className="profil-item-titre">{ev.title}</div>
                                        <div className="profil-item-meta">
                                            {new Date(ev.date).toLocaleString("fr-FR")} · {ev.location}
                                        </div>
                                    </div>
                                    <div className="profil-item-tag">Terminé</div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
