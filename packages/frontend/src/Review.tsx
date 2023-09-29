
import { Link, Outlet, useLoaderData } from "react-router-dom";

const loader = ({ query }) => async ({ request, params }) => {
    return query("SELECT * from reviews", []);
}

function Review() {
    const reviews = useLoaderData();
    return (
        <div>
            {reviews.map(review => <div>{review.id} {review.due_at}</div>)}

        </div>
    )
}

export { Review, loader };
