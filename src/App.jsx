import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Wishlist from "./components/Wishlist";
import TripList from "./components/TripList";

export default function App() {
    return (
        <div className="app-shell container">
            <header className="app-header">
                <p className="app-eyebrow">Travel planning</p>
                <h1>Business Trips</h1>
                <p className="app-intro">
                    Explore upcoming business trips and save the ones you are interested in.
                </p>
            </header>
            <main>
                <Wishlist/>
                <TripList/>
            </main>
            <footer>only for educational purposes @BBW 2026</footer>
        </div>
    );
}
