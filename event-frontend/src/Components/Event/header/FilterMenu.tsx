import { useEffect, useRef, useState } from "react";
import "./FilterMenu.css";

type TimeFilter = "all" | "future" | "past";
type ScopeFilter = "all" | "mine";

type Props = {
    timeFilter: TimeFilter;
    onTimeFilterChange: (v: TimeFilter) => void;
    scopeFilter: ScopeFilter;
    onScopeFilterChange: (v: ScopeFilter) => void;
};

export default function FilterMenu({ timeFilter, onTimeFilterChange, scopeFilter, onScopeFilterChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function close(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div className="filtermenu-root" ref={ref}>
            <button className="filtermenu-btn" onClick={() => setOpen(o => !o)}>
                Filtres ▾
            </button>

            {open && (
                <div className="filtermenu-panel">
                    <div className="filtermenu-section">
                        <div className="filtermenu-label">Événements</div>
                        <button className={scopeFilter === "all" ? "active" : ""} onClick={() => onScopeFilterChange("all")}>Tous</button>
                        <button className={scopeFilter === "mine" ? "active" : ""} onClick={() => onScopeFilterChange("mine")}>Mes events</button>
                    </div>

                    <div className="filtermenu-section">
                        <div className="filtermenu-label">Temps</div>
                        <button className={timeFilter === "all" ? "active" : ""} onClick={() => onTimeFilterChange("all")}>Tous</button>
                        <button className={timeFilter === "future" ? "active" : ""} onClick={() => onTimeFilterChange("future")}>Futurs</button>
                        <button className={timeFilter === "past" ? "active" : ""} onClick={() => onTimeFilterChange("past")}>Passés</button>
                    </div>
                </div>
            )}
        </div>
    );
}
