import LandingPage from "./components/LandingPage";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import ProductPage from "./components/ProductPage";
import Error from "./components/Error";
import Cart from "./components/Cart";


const appRouter = createBrowserRouter([
  {
    path: "/ecom-app",
    element: <LandingPage />,
    errorElement: <Error />
  },
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <Error />
  },
  {
    path: "/product",
    element: <ProductPage />,
    errorElement: <Error />
  },
  {
    path: "/cart",
    element: <Cart />,
    errorElement: <Error />
  },
])

const App = () => {
  return(
    <div>
      <RouterProvider router={appRouter}/>
      <Outlet />
    </div>
  )
}



export default App