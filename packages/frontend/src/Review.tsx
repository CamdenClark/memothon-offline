
import { useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import rehypePrism from "@mapbox/rehype-prism";

const reviewSQL = `
SELECT 
    cards.front, 
    cards.back, 
    MAX(reviews.due_at) AS latest_due
FROM 
    cards 
INNER JOIN 
    reviews 
ON 
    cards.id = reviews.card_id 
WHERE 
    reviews.due_at < unixepoch() 
GROUP BY
    reviews.card_id;
`

const loader = ({ query }) => async ({ request, params }) => {
    return query(reviewSQL, []);
}

function Review() {
    const cardsToReview = useLoaderData();
    const [cards, setCards] = useState(cardsToReview);
    const count = cards.length;

    const card = count > 0 && cards[0];
    return (
        <div>
            {count}
            {card &&
                <div>
                    <ReactMarkdown rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}>
                        {card.front + (card.back !== "" ? "\n\n---\n\n" + card.back : "")}
                        </ReactMarkdown>
                </div>}

        </div>
    )
}

export { Review, loader };
