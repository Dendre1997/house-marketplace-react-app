import {useEffect, useState, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

function useAuthStatus() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)
    const isMounted = useRef(true)
    useEffect(() => {
        if (isMounted) { 
            const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(user)
            }
            setCheckingStatus(false)
        })
        }

        return () => {
            isMounted.current = false
        }
        
    }, [isMounted])

  return {loggedIn, checkingStatus}
}

export default useAuthStatus


// https://stackowerflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks