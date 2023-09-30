
import { useContext, useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import rehypePrism from "@mapbox/rehype-prism";
import { StoreContext } from "./StoreProvider";
import Card from "./components/Card";

const reviewSQL = `
SELECT c.id, c.front, c.back
FROM cards c
JOIN (
    SELECT r.card_id, MAX(r.due_at) AS max_due_at
    FROM reviews r
    GROUP BY r.card_id
) r_max ON c.id = r_max.card_id
WHERE r_max.max_due_at < unixepoch();
`

const addReviewSQL = `
INSERT INTO reviews
   (id, card_id, due_at, reviewed_at)
   VALUES
   (?,?,unixepoch('now', '1 day'),unixepoch())`;


const loader = ({ query }) => async ({ request, params }) => {
    return query(reviewSQL, []);
}

function Review() {
    const { query } = useContext(StoreContext);

    const cardsToReview = useLoaderData();
    const [cards, setCards] = useState(cardsToReview);
    const count = cards.length;

    const card = count > 0 && cards[0];

    const [showBack, setShowBack] = useState(false);

    const onReview = () => {
        setCards(cards => cards.slice(1));
        setShowBack(false);
        query(addReviewSQL, [crypto.randomUUID(), card.id])
    }

    return (
        <div>
            {count}
            {card ?
                <div className="f-col justify-content:space-between"
                style={{ height: "100%"}}>
                <div className="box">
                    <Card card={card} showBack={showBack} />
                    </div>
                    {showBack ?
                        <div className="toolbar"><button onClick={onReview}>Again</button></div>
                        : <button onClick={() => setShowBack(true)}>Show back</button>}
                </div>
                :
                <div className="box ok">
                    Nothing left to review!
                </div>}

        </div>
    )
}

export { Review, loader };
