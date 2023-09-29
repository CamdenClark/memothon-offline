
import { Link, Outlet, useLoaderData } from "react-router-dom";

const reviewSQL = `SELECT card_id, MAX(due_at) latest_due
  FROM reviews
  GROUP BY card_id, due_at
  HAVING latest_due < unixepoch();
`

const loader = ({ query }) => async ({ request, params }) => {
    return query(reviewSQL, []);
}

function Review() {
    const reviews = useLoaderData();
    const count = reviews.length;
    console.log(reviews);
    return (
        <div>
            {count}
            {reviews.map(review => <div>{review.id} {review.due_at}</div>)}

        </div>
    )
}

export { Review, loader };
