import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import homz from './assets/homz.jpg';
import './header.css';

function Header() {
  const navigate = useNavigate();
   const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') ?? '');

  const handleSearch = (event) => {
  const value = event.target.value
  setSearch(value)
  if (value.trim()) {
    navigate(`/?q=${encodeURIComponent(value)}`, {replace:true})
  }else {
  navigate('/', {replace: true})
  }
  };

  return (
    <header className="siteHeader">
      <div className="headerInner">
        <Link className="brand" to="/" aria-label="هومز - الصفحة الرئيسية">
          <img className="brandLogo" src={homz} alt="هومز" />
          <span className="brandCopy">
            <strong>هومز</strong>
            <small>تفاصيل تصنع الفرق</small>
          </span>
        </Link>
        <div className="searchBox" role="search">
          <FiSearch aria-hidden="true" />
          <input
            className="searchInput"
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="ابحث عن منتجك المفضل..."
            aria-label="ابحث عن منتج"
          />
        </div>
        <p className="headerNote">جمال بيتك يبدأ من هنا <span aria-hidden="true">✦</span></p>
      </div>
    </header>
  );
}

export default Header;
