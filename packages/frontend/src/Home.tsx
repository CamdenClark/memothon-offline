import { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "./StoreProvider";

function Home() {
    const { cleanup } = useContext(StoreContext);
    
    return (
        <div>
            <Link to={"/create"}>Create</Link>
            <div onClick={() => cleanup()}>Cleanup</div>

        </div>
    )
}

export default Home;
