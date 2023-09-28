import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { App, loader as listLoader } from "./App";
import Home from "./Home";
import ErrorPage from "./ErrorPage";
import { CreateCard, action as createAction } from "./CreateCard";
import { StoreContext } from "./StoreProvider";
import { useContext } from "react";

export default function Router() {
    const providerContext = useContext(StoreContext);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            loader: listLoader(providerContext),
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "create",
                    element: <CreateCard />,
                    action: createAction(providerContext)
                },
            ]
        },
    ]);
    return <RouterProvider router={router} />
}

