import { useQueryHook } from "./StoreProvider";
import { CreateCard } from './CreateCard';

interface Card {
    id: string,
    front: string,
    back: string
}

function App() {
    const { data } = useQueryHook<Card>(["cards"], "SELECT * from cards", []);

    return (
        <div>
            <CreateCard />
            {data && data.map(card =>
                <div key={card.id}>
                    {card.front} - {card.back}
                </div>)}
        </div>
    )
}

export default App
