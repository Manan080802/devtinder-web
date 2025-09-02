import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import UpdateProfile from "./components/UpdateProfile";

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
        {
          path: "/profile",
          element: <Profile></Profile>,
        },
        {
          path: "/update-profile",
          element: <UpdateProfile />,
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
