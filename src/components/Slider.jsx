import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

import { toast} from 'react-toastify'

// Import Swiper styles
import 'swiper/swiper-bundle.css'
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
import Spiner from './Spinner'

function   Slider()  {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => { 
        const fetchListings = async () => {
            try {
        const listingsRef = collection(db, 'listing')
        const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q)
            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                }
                )
            })
                // console.log(listings)
                setListings(listings)
                setLoading(false);
            } catch (err) {
                toast.error('Error getting documents')
                setLoading(false);
                }
        }
        
        fetchListings()
    }, [])
    if (loading) {
         return <Spiner />
    } 
    if (listings.length === 0) {
        <></>
    }
    return listings && (
        <>
            <p className="exploreHeading"> Recomended</p>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                breakpoints={{
                    1024: {
                        slidesPerView: 2
                    }
                }}
        >
                {listings.map(({ data, id }) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div style={{ background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover', width: '100%', height: '30vh' }} className="swiperSlideDiv">
                            <p className="swiperSlideText" style={{ top: 50}}>{data.name}</p>
                            <p className="swiperSlidePrice" style={{ top: 110}}>${(data.discountedPrice
                          ??
                          data.regularPrice)
                          .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {data.type === 'rent' && '/month'}
                            </p>
                        </div>
                </SwiperSlide>
            ))}
      </Swiper>
        </>
  )
}

export default Slider