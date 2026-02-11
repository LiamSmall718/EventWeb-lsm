import "../EventsHeader.css";
import { useEffect, useRef, useState, useMemo } from "react";
import type { User } from "../../../utils/types";

type Props = {
    user: User | null;
    onLogout: () => void;
    onProfile?: () => void;
};

export default function UserMenu({ user, onLogout, onProfile }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const avatarLetter = useMemo(() => {
        const u = user?.username?.trim();
        return u && u.length > 0 ? u[0].toUpperCase() : "?";
    }, [user?.username]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!ref.current) return;
            if (open && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    return (
        <div className="events-header__menuWrap" ref={ref}>
            <button
                className="events-header__userbtn"
                disabled={!user}
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                title={user?.username || "Non connecté"}
                type="button"
            >
                <span className="events-header__avatar" aria-hidden="true">{avatarLetter}</span>
                <span className="events-header__chev" aria-hidden="true">▾</span>
            </button>

            {open && (
                <div className="events-header__menu" role="menu">
                    <button
                        className="events-header__menuitem"
                        role="menuitem"
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onProfile?.();
                        }}
                    >
                        Profil
                    </button>

                    <div className="events-header__menusep" />

                    <button
                        className="events-header__menuitem danger"
                        role="menuitem"
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
