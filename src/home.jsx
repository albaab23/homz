import { useEffect, useState, useRef } from 'react';
import { supabase } from './supabaseclient';
import { FiCheckCircle, FiHeart } from 'react-icons/fi';
import './home.css';
import { useSearchParams } from 'react-router-dom';
const images = []
for (let i = 1000431935; i <= 1000431951; i++) {
  images.push(`/${i}.jpg`)
}
const categories = {
  1000431935: 'اكواب',
  1000431936: 'ساعات',
  1000431937: "مباخر",
  1000431938: "مكياج",
  1000431939: "ترامس",
  1000431940: "فناجين قهوة مرة",
  1000431941: "صحون",
  1000431942: "كاسات",
  1000431943: "سكرية",
  1000431944: "ملاقط",
  1000431945: "كاسات شاي",
  1000431946: "سلات",
  1000431947: "ابريق كوكتيل",
  1000431948: "طناجر",
  1000431949: "فناجين قهوة",
  1000431950: "اكسسوارات مطبخ",
  1000431951: "ادوات تنظيف"
}
const page_size = 10
function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentpage, setcurrentpage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showmessage, setshowmessage] = useState(false)
  const lastcategory = useRef(null)
  const messagetimer = useRef(null)
  const [searchParams] = useSearchParams()
  const searchquery = searchParams.get('q') || ''
  const handleproducts = async (categoryid) => {
    setLoading(true)
    setcurrentpage(1)
    if (categoryid) {
      lastcategory.current = categoryid
      setSelectedCategory(categoryid)
    }
    const id = categoryid ? categoryid.replace('/', '').replace('.jpg', '') : null
    const categoryname = id ? categories[id] : null
    let request = supabase.from('orders').select('*')
    if (categoryname) request = request.eq('sort', categoryname)
    const { data, error } = await request
    if (error) {
      console.log(error, "errrrrrrrr")
    } else {
      setProducts(data ?? [])
    }
    setLoading(false)
  }
  const addtocart = async (product) => {
    const {data, error} = await supabase.from('cart').upsert([{
      product_id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image_url: product.image_url,
      quantity: product.quantity
    }],
    {
      onConflict: 'product_id,user_id',
      ignoreDuplicates: true,
    }
  )

    if(error) {
      console.log(error)
    }else {
      setshowmessage(true)
      clearTimeout(messagetimer.current)
      messagetimer.current = setTimeout(() => {
        setshowmessage(false)
      }, 3000)
    }
  }
  const addtofavorite = async (product) => {
    const {data, error} = await supabase.from('favorite').upsert([{
      product_id: product.id,
         name: product.name,
      price: product.price,
      description: product.description,
      image_url: product.image_url,
      quantity: product.quantity
    }],
    {
      onConflict: 'product_id,user_id',
      ignoreDuplicates: true,
    }
  )
       if(error) {
      console.log(error)
    }else {
      alert('تمت الاضافة الى المفضلة')
    }
  }
  const whatsappnumber = '0956623232'
  const orderproduct = async (product) => {
const message = ` مرحبا اريد الاستفسار عن ${product.name} هل هو متوفر`
const url = `https://wa.me/${whatsappnumber}?text=${encodeURIComponent(message)}`
window.open(url, "_blank")
  }
   useEffect(() => {
    handleproducts()
const channel = supabase.channel('orders_changes').on('postgres_changes', {event: '*', schema: 'public', table: 'orders'}, () => {
    handleproducts(lastcategory.current)
   }).subscribe()
     return () => {
    supabase.removeChannel(channel)
    clearTimeout(messagetimer.current)
  }
  }, [])
  useEffect(() => {
    setcurrentpage(1)
  }, [searchquery])
    const filteredproducts = products.filter((product) => {
      if (!searchquery) return true
      return product.name?.toLowerCase().includes(searchquery.toLowerCase())
    })
  const totalpages = Math.max(1, Math.ceil(filteredproducts.length / page_size))
  const displayedPage = Math.min(currentpage, totalpages)
  const paginatedList = filteredproducts.slice((displayedPage - 1) * page_size, displayedPage * page_size)
  const gotopage = (page) => {
    setcurrentpage(Math.min(totalpages, Math.max(1, page)))
    document.querySelector('.home-product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <>
      <style>{`
        .home-category-strip {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 20px 24px 24px;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          scrollbar-color: #9db8a8 #edf2ef;
        }
        .home-category-card {
          flex: 0 0 142px;
          overflow: hidden;
          padding: 0;
          border: 1px solid #e1e9e4;
          border-radius: 16px;
          background: #fff;
          color: #304c3e;
          font: inherit;
          cursor: pointer;
          scroll-snap-align: start;
          box-shadow: 0 4px 14px rgba(32, 63, 48, .08);
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .home-category-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(32, 63, 48, .14);
        }
        .home-category-card.is-selected {
          border: 2px solid #47745d;
          box-shadow: 0 0 0 3px rgba(71, 116, 93, .12);
        }
        .home-category-image {
          display: block;
          width: 100%;
          height: 112px;
          object-fit: cover;
          background: #f0f3f1;
        }
        .home-category-name {
          display: grid;
          min-height: 48px;
          padding: 8px;
          place-items: center;
          font-size: .92rem;
          font-weight: 600;
          text-align: center;
        }
        .home-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 22px;
          padding: 12px 24px 32px;
        }
        .home-product-card {
          display: flex;
          position: relative;
          min-width: 0;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--surface);
          box-shadow: 0 8px 22px rgba(48, 41, 35, .06);
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .home-product-card:hover {
          transform: translateY(-4px);
          border-color: #e4d8cf;
          box-shadow: 0 14px 28px rgba(145, 77, 52, .12);
        }
        .home-product-image {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          background: var(--background);
        }
        .home-product-details {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 9px;
          padding: 16px;
        }
        .home-product-details h3 {
          margin: 0;
          color: var(--ink);
          font-size: 1.08rem;
        }
        .home-product-description {
          display: -webkit-box;
          min-height: 42px;
          margin: 0;
          overflow: hidden;
          color: var(--muted);
          line-height: 1.5;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .home-product-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: var(--muted);
          font-size: .9rem;
        }
        .home-product-price {
          color: var(--primary);
          font-size: 1.1rem;
          font-weight: 700;
        }
        .home-add-to-cart {
          width: 100%;
          margin-top: auto;
          padding: 11px 14px;
          border: 0;
          border-radius: 11px;
          background: var(--primary);
          color: #fff;
          font: inherit;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s ease;
        }
        .home-add-to-cart:hover { background: var(--primary-dark); }
        @media (max-width: 600px) {
          .home-category-strip { gap: 12px; padding: 16px; }
          .home-category-card { flex-basis: 124px; }
          .home-category-image { height: 100px; }
          .home-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 8px 12px 24px; }
          .home-product-details { gap: 7px; padding: 12px; }
          .home-product-details h3 { font-size: .98rem; }
          .home-product-meta { font-size: .82rem; }
        }
        @media (max-width: 360px) {
          .home-product-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      {showmessage && (
        <div className="home-cart-toast" role="status" aria-live="polite">
          <FiCheckCircle aria-hidden="true" />
          <span>تمت الإضافة إلى السلة</span>
        </div>
      )}
      <div className='home-category-strip' aria-label='أصناف المنتجات'>
        {images.map((index) => {
          const categoryId = index.replace('/', '').replace('.jpg', '')
          return (
            <button
              key={index}
              type='button'
              className={`home-category-card${selectedCategory === index ? ' is-selected' : ''}`}
              onClick={() => handleproducts(index)}
              aria-pressed={selectedCategory === index}
            >
              <img className='home-category-image' src={index} alt={categories[categoryId]} loading='lazy'/>
              <span className='home-category-name'>{categories[categoryId]}</span>
            </button>
          )
        })
        }
      </div>
      <div className='home-product-grid' aria-busy={loading}>
        {loading
          ? Array.from({ length: page_size }, (_, index) => (
              <article key={`skeleton-${index}`} className='home-product-card home-skeleton-card' aria-hidden='true'>
                <div className='home-skeleton-image' />
                <div className='home-product-details'>
                  <span className='home-skeleton-line home-skeleton-title' />
                  <span className='home-skeleton-line' />
                  <span className='home-skeleton-line home-skeleton-short' />
                  <span className='home-skeleton-actions'>
                    <span className='home-skeleton-button' />
                    <span className='home-skeleton-button' />
                  </span>
                </div>
              </article>
            ))
          : paginatedList.map((product) => {
          return (
            <article key={product.id} className='home-product-card'>
              <img className='home-product-image' src={product.image_url} alt={product.name} />
              <button className='favorite-btn' onClick={() => addtofavorite(product)}><FiHeart/></button>
              <div className='home-product-details'>
                <h3>{product.name}</h3>
                <p className='home-product-description'>{product.description}</p>
                <div className='home-product-meta'>
                  <span className='home-product-price'>{product.price} ل.س</span>
                  <span>الكمية: {product.quantity}</span>
                </div>
                <div className="buttons">
                <button className='home-add-to-cart' onClick={() => addtocart(product)}>أضف للسلة</button>
          <button className='order-product' onClick={() => orderproduct(product)}>اطلب الان</button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
       {!loading && filteredproducts.length === 0 && (
         <p className='home-empty-products'>لا توجد منتجات مطابقة حالياً.</p>
       )}
       {!loading && filteredproducts.length > page_size && (
                <nav className='admin-pagination' aria-label='التنقل بين صفحات المنتجات'>
                    <button
                        type='button'
                        onClick={() => gotopage(displayedPage - 1)}
                        disabled={displayedPage === 1} className='before'
                    >
                        السابقة
                    </button>
                    <div className='home-page-numbers'>
                      {Array.from({ length: totalpages }, (_, index) => {
                        const page = index + 1
                        return (
                          <button
                            key={page}
                            type='button'
                            className={`home-page-number${page === displayedPage ? ' is-active' : ''}`}
                            onClick={() => gotopage(page)}
                            aria-current={page === displayedPage ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>
                    <span className='admin-page-status' aria-live='polite'>
                        صفحة {displayedPage} من {totalpages}
                    </span>
                    <button
                        type='button'
                        onClick={() => gotopage(displayedPage + 1)}
                        disabled={displayedPage >= totalpages} className='after'
                    >
                        التالية
                    </button>
                </nav>
            )}
    </>
  )
}

export default Home;
