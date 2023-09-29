import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypePrism from "@mapbox/rehype-prism";
import { Form } from 'react-router-dom';

const createCardSQL = `INSERT INTO cards (id, front, back) VALUES (?,?,?);`

const createReviewSQL = `INSERT INTO reviews (id, card_id, reviewed_at, due_at) VALUES (?,?,?,?);`

const action = ({ query }) => async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const newCardId = crypto.randomUUID();
    await query(createCardSQL, [newCardId, data.front, data.back]);
    return await query(createReviewSQL, [crypto.randomUUID(), newCardId, Date.now().toString(), Date.now().toString()]);
}

function CreateCard() {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    return (
        <>
            <Form className="rows" method="post" onSubmit={() => {
                setFront("");
                setBack("");
            }}>
                <label htmlFor="front">Front</label>
                <textarea
                    name="front"
                    rows={4}
                    style={{
                        resize: "none",
                        maxWidth: 700,
                        width: "100%"
                    }}
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                />
                <label htmlFor="back">Back</label>

                <textarea
                    name="back"
                    rows={4}
                    style={{
                        resize: "none",
                        width: "100%",
                        maxWidth: 700

                    }}
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                />
                <div>
                    <button className="big margin-block-start" type="submit">Create</button>
                </div>
            </Form>
            <div className='box'
                style={{ minHeight: 200 }}>
                <div className="titlebar">Preview
                </div>

                <ReactMarkdown rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}>
                    {front + (back !== "" ? "\n\n---\n\n" + back : "")}</ReactMarkdown>
            </div>

        </>
    );
}

export { action, CreateCard };

