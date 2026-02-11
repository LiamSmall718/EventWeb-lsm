import { Link } from "react-router-dom";
import "./Styles/HomePage.scss";

export default function HomePage() {
    return (
        <div className="home">
            <div className="home__bg" aria-hidden="true" />

            <main className="home__wrap">
                <div className="home__kicker">ENTRÉE</div>

                <h1 className="home__title">
                    ÉVÉNEMENTS
                    <span className="home__titleOutline">ÉVÉNEMENTS</span>
                </h1>

                <p className="home__subtitle">
                    Connecte-toi ou crée un compte pour accéder aux événements.
                </p>

                <div className="home__cta">
                    <Link to="/login" className="home__btn home__btn--primary">Se connecter</Link>
                    <Link to="/signup" className="home__btn home__btn--ghost">Créer un compte</Link>
                </div>

            </main>
        </div>
    );
}
