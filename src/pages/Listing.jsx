import { useState, useEffect } from 'react'

import { Link, useNavigate, useParams} from 'react-router-dom'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet' 

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/swiper-bundle.css'
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';

import { getDoc, doc } from 'firebase/firestore'

import { getAuth } from 'firebase/auth'

import { db } from '../firebase.config'

import Spinner  from '../components/Spinner'

import ShareIcon from '../assets/svg/shareIcon.svg'

// SwiperCore.use

function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sharedLinkCopied, setSharedLinkCopied] = useState(false)

    const navigate = useNavigate()

    const params = useParams()

    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listing', params.listingId)

            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                console.log(docSnap.data())
                setListing(docSnap.data())
                setLoading(false)

            }

         }
        
        fetchListing()
    }, [navigate, params.listingId])

    if (loading) {
        return <Spinner />
    }
  return (
      <main>
          <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
              slidesPerView={1} pagination={{ clickable: true }} autoplay={{delay: 3000}} breakpoints={{
                    1024: {
                        slidesPerView: 2
                    }
                }}>
              {listing.imgUrls.map((url, index) => (
                //   setTimeout(() => {
                //       const time = 1
                  //   )}, 2000)
                  
                  <SwiperSlide key={index}>
                      <div style={{background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: 'cover', width: '100%', height: '30vh'}} className="swiperSlideDiv" ></div>
                  </SwiperSlide>
            
              ))}
              {/* <SwiperSlide><img className="swiperSlideDiv" src={listing.imgUrls[0]} alt="" /></SwiperSlide>
              <SwiperSlide><img className="swiperSlideDiv" src={listing.imgUrls[1]} alt="" /></SwiperSlide>
              <SwiperSlide><img  className="swiperSlideDiv" src={listing.imgUrls[2]} alt="" /></SwiperSlide> */}
          </Swiper>

          <div className="shareIconDiv" onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              setSharedLinkCopied(true)
              setTimeout(() => {
                setSharedLinkCopied(false)    
              }, 2000)
          }}>
              <img src={ShareIcon} alt="share icon" />
          </div>
          
          {sharedLinkCopied && <p className='linkCopied'>Copied!</p>}

          <div className="listingDetails">
              <p className="listingName">
                  {listing.name} - ${''}
                  {listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
              </p>
              <p className="listingLocation">{listing.location}</p>
              {/* <img src={listing.imgUrls[2]} alt="" /> */}
              
              <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'} </p>
              {listing.offer && (<p className='discountPrice'>${listing.regularPrice - listing.discountedPrice} discunt</p>)}
              
              <ul className="listingDetailsList">
                  <li>
                      {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : 'One bedroom'}

                  </li>
                  <li>
                      {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : 'One Bathroom'}
                  </li>
                  <li>
                      {listing.parking && 'Parking Spot'}
                  </li>
                  <li>{listing.furnished && 'Furnished'}</li>
              </ul>
              <p className="listingLocationTitle">Location</p>
              
              <div className="leafletContainer">
                  <MapContainer style={{ height: '100%', width: '100%' }} center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
                      <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyrigth">OpenStreetMap</a>contributors'
                          url='http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                      />

                      <Marker
                        position={[listing.geolocation.lat, listing.geolocation.lng]}
                      >
                          <Popup>{listing.location}</Popup>
                      </Marker>
                  </MapContainer>
              </div>

              {auth.currentUser?.uid !== listing.userRef && (
                  <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>Contact Landlord</Link> 
              )}
          </div>
    </main>
  )
}

export default Listing