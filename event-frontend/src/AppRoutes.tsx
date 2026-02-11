import LoginPage from "./Page/LoginPage.tsx";
import SignupPage from "./Page/SignupPage.tsx";
import HomePage from "./Page/HomePage.tsx";
import EventsPage from "./Page/EventsPage.tsx";
import ProfilePage from "./Page/ProfilePage.tsx";


import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

export default function AppRoutes() {
    const [tick, setTick] = useState(0);

    // rerender après login/logout (quand on change d’URL) + quand un autre onglet modifie le storage
    useEffect(() => {
        const onStorage = () => setTick((t) => t + 1);
        window.addEventListener("storage", onStorage);
        window.addEventListener("focus", onStorage);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("focus", onStorage);
        };
    }, []);

    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    return (
        <Routes>
            <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/events" replace /> : <HomePage />}
            />

            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/events" replace /> : <LoginPage />}
            />

            <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/events" replace /> : <SignupPage />}
            />

            <Route
                path="/events"
                element={isAuthenticated ? <EventsPage /> : <Navigate to="/" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />

            <Route path="/profile" element={<ProfilePage />} />

        </Routes>
    );
}
