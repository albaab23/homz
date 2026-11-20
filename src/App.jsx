import Header from "./header.jsx";
import Navbar from "./navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "./home.jsx";
import Favorite from "./favorite.jsx";
import Cart from "./cart.jsx";
import Account from "./account.jsx";
import "./App.css";
function App() {
  return (
    <div className="appShell">
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <footer className="siteFooter" style={{marginTop: 'auto' }}>
      <a href="https://wa.me/938767095" style={{color: 'white', textDecoration: 'none'}}><p style={{fontSize: '25px', fontWeight: 'bold'}}>created by: <span style={{color: 'brown'}}>jaafar aljajeh</span></p></a>
        <span style={{fontSize: '20px', fontWeight: 'bold'}}>هومز</span>
        <p>تفاصيل جميلة، لبيت يشبهك.</p>
        <small>© هومز. جميع الحقوق محفوظة.</small>
      </footer>
    </div>
  );
}

export default App;