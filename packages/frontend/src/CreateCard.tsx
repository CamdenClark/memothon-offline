import { useState } from 'react';
import { useMutationHook } from "./StoreProvider";
import { useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import rehypePrism from "@mapbox/rehype-prism";

const createSQL = `INSERT INTO cards (id, front, back)
    VALUES (?,?,?);`

export function CreateCard() {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const { mutate } = useMutationHook(createSQL, {
        onMutate: async (_) => {
            setFront("");
            setBack("");
        }
    });
    const queryClient = useQueryClient();
    const createCard = () => {
        mutate([crypto.randomUUID(), front, back],
            {
                onSuccess: (_) => {
                    queryClient.invalidateQueries({ queryKey: ["cards"] });
                }
            })
    }
    return (
        <div>
            <textarea
                placeholder='Front side of card'
                value={front}
                onChange={(e) => setFront(e.target.value)}
            />
            <textarea
                placeholder='Back side of card'
                value={back}
                onChange={(e) => setBack(e.target.value)}
            />
            <button onClick={createCard}>Create Card</button>

            <ReactMarkdown rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}>
                {front + "\n\n---\n\n" + back}</ReactMarkdown>
        </div>
    );
}
