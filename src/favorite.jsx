import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseclient';
import './favorite.css';
function Favorite () {
   const [products, setproducts] = useState([])
    const [loading, setloading] = useState(true)
    const fetchitems = async () => {
      const {data, error} = await supabase.from('favorite').select('*').order('created_at', {ascending: false})
      if(error) {
        console.log(error, 'ewdiihew')
      }else {
        setproducts(data)
        console.log(products)
      }
      setloading(false)
    }
    useEffect( () => {
  fetchitems()
    }, [])
    if (loading) return <p className='loading'>جاري تحميل المفضلة...</p>
    if(products.length === 0) {
      return <p className='empty-favorites'>لم تتم إضافة أي منتج إلى المفضلة بعد.</p>
    }
    const handleRemoveFromFavorite = async (id) => {
      const {error} = await supabase.from('favorite').delete().eq('id', id)
      if(error) {
        console.log(error, 'ewdiihew')
      }else {
        fetchitems()
      }
    }
  return (
    <main className="pageShell favoritesPage">
      <div className="pageHeading">
        <span className="sectionEyebrow">اختياراتك الخاصة</span>
        <h1>قائمة المفضلة</h1>
        <p>احتفظ بالمنتجات التي أحببتها لتعود إليها وقتما تشاء.</p>
      </div>
      <div className="cart-container">
        {products.map((product) => {
          return (
            <div className="cart-items" key={product.id}>
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              {product.description ? <p className="cart-item-desc">{product.description}</p> : null}
              <p className="cart-item-price">{product.price} ل.س</p>
              {product.quantity ? <p className="cart-item-qty">الكمية: {product.quantity}</p> : null}
              <button className='remove-from-favorite' onClick={() => handleRemoveFromFavorite(product.id)}>ازالة من المفضلة</button>
            </div>
          )
        })}
      </div>
    </main>
  );
}

export default Favorite;
