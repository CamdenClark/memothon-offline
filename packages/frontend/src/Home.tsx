import { useContext } from "react";
import { Link } from "react-router-dom";
import { WorkerContext } from "./StoreProvider";

function Home() {
  const { cleanup } = useContext(WorkerContext);

  return (
    <div>
      <Link to={"/create"}>Create</Link>
      <br />
      <Link to={"/review"}>Review</Link>
      <div onClick={() => cleanup()}>Cleanup</div>

    </div>
  )
}

export default Home;
