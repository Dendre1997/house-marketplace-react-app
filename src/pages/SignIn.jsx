import { useState } from 'react'
import {toast} from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'

import OAuth from '../components/Oauth'

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


function SingIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData
  

  const onChange = (e) => {
    // setFormData({...formData, [e.target.id]: e.target.value })
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
    const auth = getAuth()

    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    if (userCredential.user) {
      navigate('/')
    }

    

    } catch (err) { 
      toast.error('bad users credentials')
    }
  }

  const navigate = useNavigate()

  return (
      <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            Welcome Back
          </p>
        </header>
        <form onSubmit={onSubmit}>
          <input type="text" className="emailInput" placeholder='Email' id='email' onChange={onChange} />
          <div className="passwordInputDiv">
            <input type={showPassword ? 'text' : 'password'} className='passwordInput' placeholder='password' id='password' value={password} onChange={onChange} />
            
            <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => {
              setShowPassword((prevState) => !prevState)
            }} />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>

          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton"><ArrowRightIcon fill='#ffffff' width='34px' height='34px'/></button>
          </div>
        </form>
        <OAuth/>
        
        <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>
       </div>
    </>
  )
}

export default SingIn