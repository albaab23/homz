import { useState, useEffect } from "react"
import { supabase } from "./supabaseclient"
import "./adminlogin.css"
function Adminlogin() {
const [email, setemail] = useState('')
const [password, setpassword] = useState('')
const loginbtn = async (e) => {
    e.preventDefault()
const {data, error} = await supabase.auth.signInWithPassword({
    email:email,
    password:password
})
if (error) {
    console.log(error)
    alert("حدث خطا اثناء تسجيل الدخول")
}else{
    alert('تم تسجيل الدخول بنجاح')
    window.location.href = 'admin.html'
}
}


return (
    <>
  <div className="account">
    <input type="email" placeholder="البريد الالكتروني" value={email} onChange={(e) => setemail(e.target.value)}/>
    <input type="password" placeholder="كلمة المرور"  value={password} onChange={(e) => setpassword(e.target.value)} />
    <button onClick={loginbtn}>تسجيل دخول</button>
  </div>
        </>
        )
}
export default Adminlogin