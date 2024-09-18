
import { useState} from 'react'
// import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'

import { useNavigate, Link } from 'react-router-dom'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ArrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

import ListingItem from '../components/ListingItem';

function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.currentUser) {
      setFormData({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
      })
      // navigate('/profile')
    } else {
      navigate('/sign-in')
    }
    
    const fetchUserListing = async () => {
        try {
        const listingsRef = collection(db, 'listing')
        const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))
        const querySnap = await getDocs(q)
      
        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        // console.log(listings)
        setListings(listings)
        setLoading(false)
        } catch (err) {
      toast.error('Error fetching user listings')
      setLoading(false)
    }
      }
      fetchUserListing()
    
    
    
    
  }, [auth.currentUser.uid])
  // console.log(listings)

  const { name, email } = formData
  
  const onLogout = (e) => {
    e.preventDefault()
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update Display name
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        // Update firestore

        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name: name,

        })

      }
    } catch (err) {
      toast.error('Coud not update profile details')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onDelete = async (listingId) => {
    if (window.confirm('are you shure you want to delete')) {
    try {
      await deleteDoc(doc(db, 'listing', listingId))
      const updatedListings = listings.filter((listing) =>
        listing.id !== listingId)
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
      }
        catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
      }
      }
  }

  const onEdit =  (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  return <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type='button' onClick={onLogout} className="logOut">
        Logout
      </button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Prsonal Details</p>
        <p className="changePersonalDetails" onClick={() => {
          changeDetails && onSubmit()
          setChangeDetails((prevState) => !prevState)
        }}>
          {changeDetails ? 'done' : 'change'}
        </p>
      </div>
      <div className="profileCard">
        <form action="submit">
          <input type="text" id='name' className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
          />
          <input type="text" id='email' className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            disabled={!changeDetails}
            value={email}
            onChange={onChange}
          />
        </form>
      </div>

      <Link to="/create-listing" className='createListing'>
        <img src={homeIcon} alt="home" />
        <p>Sell or rent your home</p>
        <img src={ArrowRight} alt="arrow right" />
      </Link>
      {/* <li>{listings[0].data.name}</li> */}
      {!loading && listings?.length > 0 && (
        <>
          <p className="listingText">Your Listings</p>
          <ul className="listingsList">
            {listings.map((listing) => (
              <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />
            ))}
          </ul>
        </>
      )}
    </main>
  </div>
}

export default Profile