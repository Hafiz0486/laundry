import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import Bon from "./pages/Bon"
import Update from "./pages/Update"
import Service from "./pages/Service"
import CreateService from "./pages/CreateService"

// variable
var bon ="/bon"
var service ="/service"
// var consumer ="/consumer"
// var transaction ="/transaction"

// var update ="/update"
// var create ="/create"


function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>Kamal Laundry</h1>
        <Link to="/">Home</Link>
        <Link to={bon}>Bon</Link>
        <Link to={service}>Service</Link>
      </nav> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={bon} element={<Bon />} />
        <Route path={service} element={<Service />} />
        <Route path="/createservice" element={<CreateService />} />
        <Route path="/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
