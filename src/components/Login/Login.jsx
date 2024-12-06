import axios from 'axios';
import { Formik, useFormik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import * as yup from 'yup'
import { userContext } from '../../Context/User.Context';
import { Helmet } from 'react-helmet';
export default function Login() {
  let[errorMsg,setErrorMsg] = useState(null);
  const {token,setToken} = useContext(userContext)
  let navigate = useNavigate()
  // function validation(form){
  //   let errors = {}
  //   //name
  //   if(!form.name)
  //   {
  //     errors.name = 'Name is required.'
  //   }
  //   else if(!/^[A-Za-z]+(?:[-'\s][A-Za-z]+)*$/.test(form.name))
  //   {
  //     errors.name = 'Invalid characters in name.'
  //   }
  //   //email
  //   if(!form.email)
  //   {
  //     errors.email = 'Email is required.'
  //   }
  //   else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email))
  //   {
  //     errors.email = 'Invalid email format.'
  //   }
  //   
  //   return errors
  // }
  // yup validation
  let validationSchema = yup.object({
    email:yup.string().required('Email is required.').email('Invalid email format.'),
    password:yup.string().required('Password is required.').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>\/?]{8,}$/,'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character.'),
  })
  async function handleLogin(values){
    let toastId;
    try {
      toastId = toast.loading("Waiting...");
    let {data} = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin',values);
    toast.dismiss(toastId);
    toast.success("User Loggedin Successfully")
    if(data.message == "success"){
      localStorage.setItem("token",data.token)
      setToken(data.token);
      navigate('/')
    }
   } catch (error) {
    toast.dismiss(toastId)
    toast.error(error.response.data.message)
    setErrorMsg(error.response.data.message)
   }
  }
  let formik = useFormik({
    initialValues:{
      email:'',
      password:''
    },
    onSubmit:handleLogin,
    // validate:validation,
    validationSchema:validationSchema
  })
    const [isEyeVisible, setIsEyeVisible] = useState(false); // State to track visibility
    const toggleIcon = () => {
        setIsEyeVisible(!isEyeVisible); // Toggle the state
    };
    useEffect(()=>{
      window.scrollTo(0,0)
    },[])
  return (
    <>
    <Helmet>
      <title>Login</title>
    </Helmet>
    <form className="mx-auto w-full text-center lg:w-3/5 p-10"  onSubmit={formik.handleSubmit}>
      <h3 className=' text-left text-2xl md:text-3xl lg:text-4xl my-3 text-[--main-color]'> <i className="fa-regular fa-circle-user mr-3"></i>Login now</h3>  
      <div className="relative z-0 w-full mb-5 group">
          <input type="email" name="email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 dark:text-gray-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0  peer border-[--main-color] focus:border-[--main-color]" placeholder=" " />
          {formik.errors.email && formik.touched.email ? <p className='text-red-600'><i className="fa-solid fa-circle-exclamation mr-2"></i>{formik.errors.email}</p> :null}
          <label htmlFor="floating_email" className="peer-focus:font-medium left-0 absolute text-sm text-gray-500 dark:text-gray-400 peer-focus:text-[--main-color] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
      </div>  
      <div className="relative z-0 w-full mb-5 group">
          <input type={isEyeVisible?"text":"password"} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} name="password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 dark:text-gray-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0  peer border-[--main-color] focus:border-[--main-color]" placeholder=" "/>
          <span onClick={toggleIcon} className={`fa-regular cursor-pointer absolute right-0 top-4 text-[--main-color] ${isEyeVisible ? 'fa-eye' : 'fa-eye-slash'}`}></span>
          {formik.errors.password && formik.touched.password ? <p className='text-red-600'><i className="fa-solid fa-circle-exclamation mr-2"></i>{formik.errors.password}</p> :null}
          <label htmlFor="floating_email" className="peer-focus:font-medium left-0 absolute text-sm text-gray-500 dark:text-gray-400 peer-focus:text-[--main-color] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
          {errorMsg?<p className='text-red-600'><i className="fa-solid fa-circle-exclamation mr-2"></i>{errorMsg}</p>:null}
      </div>
      <button type="submit" className="text-white bg-[--main-color] font-medium rounded-lg text-lg px-5 py-2.5 text-center active:scale-90">Log In</button>
      <p className='mt-3 font-semibold dark:text-gray-300'>Don't have an account?<Link to="/auth/register" className='text-[--main-color] ml-2 underline' >Register</Link> </p>
    </form>
    </>
  )
}
