
import {createBrowserRouter,RouterProvider,Route, Outlet,createRoutesFromElements} from 'react-router-dom';
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Restaurants from './Pages/Restaurants';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// const router = createBrowserRouter([
//    {
//        path: "/",
//        element: <Home/>
//    },
//    {
//        path :"/register",
//        element: <Register/>
//    },
//    {
//       path : "/login",
//       element : <Login/>
//    },
//    {
//       path : "/restaurants",
//       element : <Restaurants/>
//    }
// ]);

const Layout = () =>{
   return(
      <>
         <Navbar/>
         <Outlet/>
         <Footer/>
      </>
   );
}

const router = createBrowserRouter(
   createRoutesFromElements(
     <Route path='/' element={<Layout />}>
       <Route path='' element={<Home />} />
       <Route path='register' element={<Register />} />
       <Route path='login' element={<Login />} />
       <Route path='restaurants' element={<Restaurants />} />
     </Route>
   ),
 );

function App() {
  return (
   <div className="min-h-screen max-w-screen-2xl bg-gray-50 flex flex-col">
         <RouterProvider router = {router}>
         <Navbar/>
         </RouterProvider>    
   </div>
  );
}

export default App;
