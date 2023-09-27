import { useQueryHook } from "./StoreProvider";

interface Card {
    id: string,
    front: string,
    back: string
}

function App() {
    const { data } = useQueryHook<Card>(["cards"], "SELECT * from cards", []);

    return (
        <main>
            {data && data.map(card =>
                <div key={card.id}>
                    {card.front} - {card.back}
                </div>)}
        </main>
    )
}

export default App
