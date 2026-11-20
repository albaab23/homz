import { NavLink } from 'react-router-dom';
import { FiHeart, FiHome, FiShoppingBag, FiUser } from 'react-icons/fi';
import './navbar.css';

function Navbar() {
  return (
    <nav className="menu" aria-label="القائمة الرئيسية">
      <div className="menuInner">
        <NavLink to="/" end>
          <FiHome aria-hidden="true" />
          <span>الرئيسية</span>
        </NavLink>
        <NavLink to="/favorite">
          <FiHeart aria-hidden="true" />
          <span>المفضلة</span>
        </NavLink>
        <NavLink to="/cart">
          <FiShoppingBag aria-hidden="true" />
          <span>سلة المشتريات</span>
        </NavLink>
        <NavLink to="/account">
          <FiUser aria-hidden="true" />
          <span>حسابي</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
