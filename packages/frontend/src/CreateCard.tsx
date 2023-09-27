import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypePrism from "@mapbox/rehype-prism";
import { Form } from 'react-router-dom';

const createSQL = `INSERT INTO cards (id, front, back)
    VALUES (?,?,?);`

const action = ({ query }) => async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    return query(createSQL, [crypto.randomUUID(), data.front, data.back]);

}

function CreateCard() {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    return (
        <main>
            <Form method="post">
                <textarea
                    name="front"
                    placeholder='Front side of card'
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                />
                <textarea
                    placeholder='Back side of card'
                    name="back"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                />
                <button type="submit">Create</button>
            </Form>

            <ReactMarkdown rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}>
                {front + "\n\n---\n\n" + back}</ReactMarkdown>
        </main>
    );
}

export { action, CreateCard };

