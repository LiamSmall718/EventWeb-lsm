import "./styles/LoginPage.scss";
import { type FormEvent, useState } from "react";
import { login, validateToken } from "../API/auth-actions";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        try {
            await login(username, password);
            const user = await validateToken();
            console.log("Logged in user:", user);
            navigate("/events");
        } catch (err: any) {
            alert(err.message || "Connexion impossible");
        }
    }

    return (
        <div className="login-page">
            <form className="login-page__form" onSubmit={handleSubmit}>
                <h1>Connexion</h1>

                <input
                    placeholder="Username"
                    value={username}
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Se connecter</button>

            </form>
        </div>
    );
}
