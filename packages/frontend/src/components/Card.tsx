import ReactMarkdown from 'react-markdown';
import rehypePrism from "@mapbox/rehype-prism";

interface CardProps {
  card: {
    front: string;
    back: string;
  };
  showBack: boolean;
}

export default function Card({ card, showBack }: CardProps) {
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
