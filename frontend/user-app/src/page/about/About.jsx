import { MENU } from '../../defines'
import { Link } from 'react-router-dom'

export const About = () => {
  return (
    <div>
      <h1>About</h1>
      <Link to={MENU.HOME}>About</Link>
    </div>
  )
}
