
import {createBrowserRouter,RouterProvider,Route, Outlet,createRoutesFromElements} from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Restaurants from './pages/Restaurants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OwnedRestaurants from './pages/OwnedRestaurants';
import Menu from './components/Menu';  // Your menu component
import 'bootstrap/dist/css/bootstrap.min.css';
import ManageRestaurant from './components/ManageRestaurant';
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
       <Route path='ownedRestaurants' element = {<OwnedRestaurants/>}/>
       <Route path ='menu/:restaurant_name/:restaurant_id' element = {<Menu/>}/>
       {/* <Route path= 'manageRestaurant/:id' element = {<ManageRestaurant/>} /> */}
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
