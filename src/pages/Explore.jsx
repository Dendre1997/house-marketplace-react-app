import { Link } from 'react-router-dom'
import rentCategotyImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategotyImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from '../components/Slider'
function Explore() {
  return (
      <div className='explore'>
      <header>
        <p className="pageHeader">Explore</p>  
      </header>
      <main>
        <Slider />
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to='/category/rent'>
            <img src={rentCategotyImage} alt="rent" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Places for rent</p>
          </Link>
          <Link to='/category/sale'>
            <img src={sellCategotyImage} alt="sell" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Places for sell</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore