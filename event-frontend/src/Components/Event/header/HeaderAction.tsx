import "../EventsHeader.css";
import { useEffect, useState } from "react";
import SearchDialog from "../Dialog/SearchDialog";
import FilterMenu from "./FilterMenu";

type TimeFilter = "all" | "future" | "past";
type ScopeFilter = "all" | "mine";

type Props = {
    onCreate?: () => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    timeFilter: TimeFilter;
    onTimeFilterChange: (v: TimeFilter) => void;
    scopeFilter: ScopeFilter;
    onScopeFilterChange: (v: ScopeFilter) => void;
};

export default function HeaderActions({ onCreate, searchQuery, onSearchChange, timeFilter, onTimeFilterChange, scopeFilter, onScopeFilterChange }: Props) {
    const [openSearch, setOpenSearch] = useState(false);

    useEffect(() => { if (!openSearch) return; const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenSearch(false); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [openSearch]);

    return (
        <>
            <button type="button" className="events-header__createbtn" onClick={() => onCreate?.()}>Créer</button>

            <FilterMenu
                timeFilter={timeFilter}
                onTimeFilterChange={onTimeFilterChange}
                scopeFilter={scopeFilter}
                onScopeFilterChange={onScopeFilterChange}
            />

            <button type="button" className="events-header__iconbtn" onClick={() => setOpenSearch(true)} aria-label="Rechercher">🔍</button>

            <SearchDialog
                open={openSearch}
                initialValue={searchQuery}
                onClose={() => setOpenSearch(false)}
                onSubmit={(q: string) => { onSearchChange(q); setOpenSearch(false); }}
                onClear={() => { onSearchChange(""); setOpenSearch(false); }}
            />
        </>
    );
}
