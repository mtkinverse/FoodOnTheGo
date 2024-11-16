
import {createBrowserRouter,RouterProvider,Route, Outlet,createRoutesFromElements} from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Restaurants from './pages/Restaurants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      
        <RouterProvider router={router}/>

      
    </div>
  );
}


export default App;
