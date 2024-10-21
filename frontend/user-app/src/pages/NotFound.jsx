import { Link } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS as AR } from '../data/constants'
const NotFound = () => {
  return (
    <div>
      <h1>Not Found</h1>
      <Link to={AR.NOTFOUND}></Link>
    </div>
  )
}
export default NotFound
