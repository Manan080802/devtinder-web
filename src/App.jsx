import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      errorElement: <div>Error!</div>,
      children: [
        {
          path: "/",
          element: <Feed></Feed>,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/feed",
          element: <h1>Hello world</h1>,
        },
      ],
    },
  ]);
  return (
    <Provider store={appStore}>
      <RouterProvider router={appRouter}>
        <Outlet />
      </RouterProvider>
    </Provider>
  );
}

export default App;
