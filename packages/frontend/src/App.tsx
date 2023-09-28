import { Link, Outlet, useLoaderData } from "react-router-dom";

interface Card {
    id: string,
    front: string,
    back: string
}

const loader = ({ query }) => async ({ request, params }) => {
    return query("SELECT * from cards", []);
}

function App() {
    return (
        <>
            <header className="navbar">
                <nav>
                    <Link to="/">memothon</Link>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export { App, loader };
