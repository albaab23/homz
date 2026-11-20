import imageCompression from 'browser-image-compression'
import './adminpanel.css'
import {useState, useEffect} from 'react'
import {supabase} from './supabaseclient'   
const PAGE_SIZE = 8

function AdminPanel() {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [quantity, setQuantity] = useState('')
    const [image, setImage] = useState(null)
    const [editid, setEditid] = useState(null)
    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    async function checkUser() {
        const {data: {user}} = await supabase.auth.getUser()
        if (!user) {
            window.location.href = '/login.html'
        }
    }
    useEffect(() => {
        checkUser()
    }, [])
    const requestslist = {
        name: name,
        price: price,
        description: description,
        sort: type,
        quantity: quantity,
    }
    const fetchData = async () => {
    const {data, error} = await supabase.from('orders').select('*')
    if (error) {
        console.log('er1',error)
    }else {
        setList(data)
    } 
}
      const addProduct = async () => {
        if(name === '' || price === '' || description === '' || type === '' || quantity === '') {
            alert('يجب عليك تعبئة كل الحقول')
            return
        }
        let imageUrl = null
        if(image) {
            const compressed = await imageCompression(image, {maxSizeMB: 0.2, maxWidthOrHeight: 1024, useWebWorker: true})
            const ext = image.name.split('.').pop()
            const path = `${Date.now()}_${ext}`
            const {error: uploadError} = await supabase.storage.from('products').upload(path, compressed)
            if (uploadError) {
                console.log('upload error', uploadError)
                return
            }
            imageUrl = supabase.storage.from('products').getPublicUrl(path).data.publicUrl
        }
        const payload = imageUrl ? {...requestslist, image_url: imageUrl} : requestslist
        const {data, error} =   document.querySelector('.add-btn').innerText = '.... جاري الاضافة'
        await (editid
       ? supabase.from('orders').update(payload).eq('id', editid).select()
       : supabase.from('orders').insert([payload]).select())
        if (error) {
            console.log('er2',error)
        } else {
            document.querySelector('.add-btn').innerText = 'اصافة'
          fetchData()
          setCurrentPage(1)
          setName('')
          setPrice('')
          setDescription('')
            setType('')
            setQuantity('')
            setEditid(null)
        }
    }
        useEffect(() => {
            fetchData()
        }, [])
        const deleteProduct = async (id) => {
            const {data, error} = await supabase.from('orders').delete().eq('id', id)
            if (error) {
                console.log('er3',error)
            }else {
                fetchData()
            }
        }
            const edit =  (id) => {
const item = list.find((item) => item.id === id)
setName(item.name)
setPrice(item.price)
setDescription(item.description)
setType(item.sort)
setQuantity(item.quantity)
setEditid(id)
}
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
    const displayedPage = Math.min(currentPage, totalPages)
    const paginatedList = list.slice((displayedPage - 1) * PAGE_SIZE, displayedPage * PAGE_SIZE)

    return (
        <div className='admin-panel'>
        <div className='crud admin-form'>
            <input type="text" placeholder='اسم المنتج' value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder='السعر' value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="text" placeholder='الوصف' value={description} onChange={(e) => setDescription(e.target.value)} />
            <select type="text" value={type} onChange={(e) => setType(e.target.value)} >
                <option value="">اختر النوع</option>
                <option value="اكواب">اكواب</option>
                <option value="ساعات">ساعات</option>
                <option value="مباخر">مباخر</option>
                <option value="مكياج">مكياج</option>
                <option value="ترامس">ترامس</option>
                <option value="فناجين قهوة مرة">فناجين قهوة مرة</option>
                <option value="صحون">صحون</option>
                <option value="كاسات">كاسات</option>
                <option value="سكرية">سكرية</option>
                <option value="ملاقط">ملاقط</option>
                <option value="كاسات شاي">كاسات شاي</option>
                <option value="سلات">سلات</option>
                <option value="ابريق كوكتيل">ابريق كوكتيل</option>
                <option value="طناجر">طناجر</option>
                <option value="فناحين قهوة">فناحين قهوة</option>
                <option value="اكسسوارات مطبخ">اكسسوارات مطبخ</option>
                <option value="ادوات تنظيف">ادوات تنظيف</option>
            </select>
            <input type="text" placeholder='الكمية' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <label htmlFor="image" className='admin-image-label'>صورة المنتج</label>
            <input type="file" id="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{display: 'none'}}/>
            <button onClick={addProduct} className='add-btn'>اضافة</button>
        </div>
       <style>{`
        .admin-panel {
            direction: rtl;
            max-width: 1280px;
            margin: 0 auto;
            padding: 24px;
            color: #23332f;
        }
        .admin-form {
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            align-items: center;
            gap: 14px;
            padding: 22px;
            margin-bottom: 30px;
            border: 1px solid #e4ebe8;
            border-radius: 20px;
            background: #fff;
            box-shadow: 0 8px 26px rgba(27, 56, 48, .07);
        }
        .admin-form input:not([type="file"]), .admin-form select {
            box-sizing: border-box;
            width: 100%;
            min-width: 0;
            padding: 13px 15px;
            border: 1px solid #dce5e1;
            border-radius: 12px;
            background: #f8faf9;
            color: #23332f;
            font: inherit;
        }
        .admin-form input:focus, .admin-form select:focus {
            outline: 2px solid #98b7aa;
            border-color: #527b6b;
        }
        .admin-image-label {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 46px;
            padding: 0 14px;
            border: 1px dashed #91a99e;
            border-radius: 12px;
            background: #f2f7f4;
            color: #355d4d;
            cursor: pointer;
            text-align: center;
        }
        .admin-form .add-btn {
            min-height: 46px;
            border-radius: 12px;
            background: #315d4c;
            font-size: 1rem;
            cursor: pointer;
            transition: background .2s ease, transform .2s ease;
        }
        .admin-form .add-btn:hover { background: #244b3c; transform: translateY(-1px); }
        .admin-list-header {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            justify-content: space-between;
            gap: 8px 16px;
            margin: 0 2px 16px;
        }
        .admin-list-header h2 { margin: 0; font-size: 1.35rem; }
        .admin-list-count { color: #71817a; font-size: .95rem; }
        .admin-product-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 18px;
        }
        .admin-product-card {
            display: flex;
            min-width: 0;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e5ece8;
            border-radius: 18px;
            background: #fff;
            box-shadow: 0 5px 18px rgba(27, 56, 48, .06);
            transition: transform .2s ease, box-shadow .2s ease;
        }
        .admin-product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 24px rgba(27, 56, 48, .11);
        }
        .admin-product-image {
            width: 100%;
            height: 190px;
            object-fit: cover;
            background: #f2f5f3;
        }
        .admin-product-image-placeholder {
            display: grid;
            height: 190px;
            place-items: center;
            background: #f2f5f3;
            color: #84938c;
        }
        .admin-product-info { padding: 16px 18px 8px; }
        .admin-product-info h3 { margin: 0 0 8px; color: #294d3f; font-size: 1.1rem; }
        .admin-product-info p { margin: 6px 0; color: #61716a; line-height: 1.5; overflow-wrap: anywhere; }
        .admin-product-actions { display: flex; gap: 10px; padding: 12px 18px 18px; margin-top: auto; }
        .admin-product-actions button { flex: 1; border-radius: 10px; cursor: pointer; transition: filter .2s ease; }
        .admin-product-actions button:hover { filter: brightness(.92); }
        .admin-empty {
            grid-column: 1 / -1;
            padding: 42px 20px;
            border: 1px dashed #cbd8d1;
            border-radius: 16px;
            background: #f8faf9;
            color: #71817a;
            text-align: center;
        }
        .admin-pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            margin: 24px 0 8px;
        }
        .admin-pagination button {
            min-width: 92px;
            padding: 10px 16px;
            border: 1px solid #315d4c;
            border-radius: 10px;
            background: #315d4c;
            color: #fff;
            font: inherit;
            cursor: pointer;
        }
        .admin-pagination button:disabled {
            border-color: #dce5e1;
            background: #edf1ef;
            color: #9aa7a1;
            cursor: not-allowed;
        }
        .admin-page-status { min-width: 100px; color: #52645b; text-align: center; }
        @media (max-width: 600px) {
            .admin-panel { padding: 16px; }
            .admin-form { padding: 16px; }
            .admin-product-list { grid-template-columns: 1fr; }
            .admin-pagination { gap: 8px; }
            .admin-pagination button { min-width: 78px; padding: 9px 10px; }
        }
       `}</style>
       <div className='list'>
            <div className='admin-list-header'>
                <h2>المنتجات</h2>
                <span className='admin-list-count'>إجمالي المنتجات: {list.length}</span>
            </div>
            <div className='admin-product-list'>
            {list.length === 0 ? (
                <div className='admin-empty'>لا توجد منتجات لعرضها حالياً</div>
            ) : paginatedList.map((item) => (
                <div key={item.id} className='admin-product-card'>
                    {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className='admin-product-image' />
                    ) : (
                        <div className='admin-product-image-placeholder'>لا توجد صورة</div>
                    )}
                    <div className='admin-product-info'>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>السعر: {item.price} ل.س</p>
                    <p>النوع: {item.sort}</p>
                    <p>الكمية: {item.quantity}</p>
                    </div>
                    <div className='admin-product-actions'>
                    <button onClick={() => edit(item.id)} className='edit-btn'>تعديل</button>
                    <button onClick={() => deleteProduct(item.id)} className='delete-btn'>حذف</button>
                    </div>
                </div>
            ))}
            </div>
            {list.length > PAGE_SIZE && (
                <nav className='admin-pagination' aria-label='التنقل بين صفحات المنتجات'>
                    <button
                        type='button'
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                    >
                        السابقة
                    </button>
                    <span className='admin-page-status' aria-live='polite'>
                        صفحة {displayedPage} من {totalPages}
                    </span>
                    <button
                        type='button'
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={displayedPage >= totalPages}
                    >
                        التالية
                    </button>
                </nav>
            )}
        </div>      
        </div>
    )
}
export default AdminPanel