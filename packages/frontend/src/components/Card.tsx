import ReactMarkdown from 'react-markdown';
import rehypePrism from "@mapbox/rehype-prism";

export default function Card({ card, showBack }) {
    const content = showBack ?
        card.front + (card.back !== "" ? "\n\n---\n\n" + card.back : "") : card.front
    return (
        <ReactMarkdown
            rehypePlugins={[
            [rehypePrism, { ignoreMissing: true }]]}>
            {content}
        </ReactMarkdown>
    );
}
