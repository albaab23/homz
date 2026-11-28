import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import './cart.css';
import { supabase } from './supabaseclient';

function Cart() {
  const [products, setproducts] = useState([])
  const [loading, setloading] = useState(true)
  const fetchitems = async () => {
    const { data, error } = await supabase.from('cart').select('*').order('created_at', { ascending: false })
    if (error) {
      console.log(error)
    } else {
      setproducts(data)
      console.log(products)
    }
    setloading(false)
  }
  useEffect(() => {
    fetchitems()
  }, [])
  if (loading) return <p className='loading'>جاري تحميل السلة...</p>
  if (products.length === 0) {
    return <p className='empty-cart'>السلة فارغة حالياً. أضف منتجات من المتجر لتظهر هنا.</p>
  }
  const total = products.reduce((sum, product) => {
return sum + Number(product.price)
  }, 0)
  const whatsappnumber = '0956623232'
  const handleCheckout = () => {
const message = `مرحبا اريد الاستفسار عن ${products.map((product) => product.name).join('و')} هل هو متوفر`
const url = `https://wa.me/${whatsappnumber}?text=${encodeURIComponent(message)}`
window.open(url, "_blank")
  }
  return (
    <main className="pageShell cartPage">
      <div className="pageHeading">
        <span className="sectionEyebrow">مشترياتك</span>
        <h1>سلة المشتريات</h1>
        <p>راجع اختياراتك قبل إتمام التسوق</p>
      </div>
      <div className="counters">
        <p className="products-count">عدد المنتجات {products.length}</p>
        <p className="products-total-price">إجمالي التكاليف: {total} ل.س</p>
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
            </div>
          )
        })}
      </div>
      <button className='checkout-button' onClick={handleCheckout}>اتمام الطلب</button>
    </main>
  );
}

export default Cart;
