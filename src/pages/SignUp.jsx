import {useState} from 'react'
import {toast} from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import Oauth from '../components/Oauth'


import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


function SingUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const { name, email, password } = formData
  

  const onChange = (e) => {
    // setFormData({...formData, [e.target.id]: e.target.value })
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = { ...formData }
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()


      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')
    } catch (err) { 
      toast.error(`Something went wrong with registration`)
      // alert('Failed to sign up. Please check the details and try again.')
    }
  }

  return (
      <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            Welcome Back
          </p>
        </header>
        <form onSubmit={onSubmit}>
          <input type="text" className="nameInput" placeholder='Name' id='name' value={name} onChange={onChange} />
          <div className="passwordInputDiv"></div>
          <input type="email" className="emailInput" placeholder='Email' id='email' value={email} onChange={onChange} />
          <div className="passwordInputDiv">
            <input type={showPassword ? 'text' : 'password'} className='passwordInput' placeholder='password' id='password' value={password} onChange={onChange} />
            
            <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => {
              setShowPassword((prevState) => !prevState)
            }} />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>

          <div className="signUpBar">
            <p className="signUpText">Sign Un</p>
            <button className="signUpButton"><ArrowRightIcon fill='#ffffff' width='34px' height='34px'/></button>
          </div>
        </form>
        <Oauth />
        
        <Link to='/sign-in' className='registerLink'>Sign In Instead</Link>
       </div>
    </>
  )
}

export default SingUp