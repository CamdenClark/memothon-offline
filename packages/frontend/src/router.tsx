import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import { CreateCard } from "./CreateCard";
import { StoreContext } from "./StoreProvider";
import { useContext } from "react";

export default function Router() {
    const providerContext = useContext(StoreContext);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />
            },
                {
                    path: "create",
                    element: <CreateCard />,
                }
    ]);
    return <RouterProvider router={router} />
}

