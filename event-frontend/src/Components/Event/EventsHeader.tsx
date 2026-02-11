import "./EventsHeader.css";
import type { User } from "../../utils/types";
import HeaderTitle from "./header/HeaderTitle";
import HeaderActions from "./header/HeaderAction";
import UserMenu from "./header/UserMenu";

type TimeFilter = "all" | "future" | "past";
type ScopeFilter = "all" | "mine";

type Props = {
    user: User | null;
    onLogout: () => void;
    onCreate?: () => void;
    onProfile?: () => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    timeFilter: TimeFilter;
    onTimeFilterChange: (v: TimeFilter) => void;
    scopeFilter: ScopeFilter;
    onScopeFilterChange: (v: ScopeFilter) => void;
};

export default function EventsHeader({ user, onLogout, onProfile, onCreate, searchQuery, onSearchChange, timeFilter, onTimeFilterChange, scopeFilter, onScopeFilterChange }: Props) {
    return (
        <div className="events-header">
            <HeaderTitle />
            <div className="events-header__right">
                <HeaderActions user={user} onCreate={onCreate} searchQuery={searchQuery} onSearchChange={onSearchChange} timeFilter={timeFilter} onTimeFilterChange={onTimeFilterChange} scopeFilter={scopeFilter} onScopeFilterChange={onScopeFilterChange} />
                <UserMenu user={user} onLogout={onLogout} onProfile={onProfile} />
            </div>
        </div>
    );
}
