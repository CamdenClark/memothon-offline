import { useLoaderData } from "react-router-dom";

interface Card {
    id: string,
    front: string,
    back: string
}

const loader = ({ query }) => async ({ request, params }) => {
    return query("SELECT * from cards", []);
}
function App() {
    const data = useLoaderData();

    return (
        <main>
            {data && data.map(card =>
                <div key={card.id}>
                    {card.front} - {card.back}
                </div>)}
        </main>
    )
}

export { App, loader };
