import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { App, loader as listLoader } from "./App";
import Home from "./Home";
import { CreateCard, action as createAction } from "./CreateCard";
import { Review, loader as reviewLoader } from "./Review";
import { WorkerContext } from "./StoreProvider";
import { useContext } from "react";

export default function Router() {
  const providerContext = useContext(WorkerContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
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
        {
          path: "review",
          element: <Review />,
          loader: reviewLoader(providerContext),
        },
      ]
    },
  ]);
  return <RouterProvider router={router} />
}

