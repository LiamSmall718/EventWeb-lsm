import "./styles/LoginPage.scss";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, login, validateToken } from "../API/auth-actions";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await signup(username, password);
            await login(username, password);
            await validateToken();
            navigate("/events");
        } catch (err: any) {
            alert(err.message || "Erreur signup/login");
        }
    }

    return (
        <div className="login-page">
            <form className="login-page__form" onSubmit={handleSubmit}>
                <h1 data-outline="INSCRIPTION">Inscription</h1>

                <input
                    placeholder="Pseudo"
                    value={username}
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    placeholder="Mot de passe"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Créer un compte</button>

                <div className="login-page__links">
                    <Link to="/login">← Retour à la connexion</Link>
                    <Link to="/login">Se connecter</Link>
                </div>
            </form>
        </div>
    );
}
