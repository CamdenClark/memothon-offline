import { useState } from 'react';
import { ActionFunctionArgs, Form } from 'react-router-dom';
import DisplayCard from './components/Card';
import { WorkerContextData } from './StoreProvider';

const action = ({ createCard }: WorkerContextData) => async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = crypto.randomUUID();
  const front = formData.get('front');
  const back = formData.get('back');

  // Ensure that front and back are strings
  if (typeof front !== 'string' || typeof back !== 'string') {
    throw new Error('Front and back must be strings.');
  }
  return await createCard({ id, front, back });
}

function CreateCard() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const card = { front, back };

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

        <DisplayCard card={card} showBack={true} />
      </div>
    </>
  );
}

export { action, CreateCard };

