import React, { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { Bell, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS as AR } from '@/data/constants'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import DropdownMenuUser from '@/components/ui/userdropdown'
import { ModeToggle } from '@/components/mode-toggle'
import AuthService from '@/oidc/AuthService'
import { UserContext } from '@/contexts/UserContext'

export default function Header() {
  const { user, updateUser } = useContext(UserContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)

  // Handle scroll hide/show
  const handleScroll = useCallback(() => {
    const currentScrollTop = window.scrollY
    if (currentScrollTop > lastScrollTop) {
      setIsHidden(true)
    } else if (currentScrollTop < lastScrollTop || currentScrollTop === 0) {
      setIsHidden(false)
    }
    setLastScrollTop(currentScrollTop)
  }, [lastScrollTop])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Close dropdown when clicking outside
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  // const handleLogin = async () => {
  //   await AuthService.login()
  //   const user = await AuthService.getUser()
  //   updateUser(user)
  // }

  useEffect(() => {
    // Lấy lại thông tin người dùng khi component được mount hoặc user thay đổi
    if (!user) {
      AuthService.getUser().then((userData) => {
        if (userData) {
          updateUser(userData);
        }
      });
    }
  }, [user, updateUser]);

  const handleLogin = async () => {
    await AuthService.login()
    const userData = await AuthService.getUser()

    // Kiểm tra dữ liệu người dùng trước khi cập nhật
    if (userData) {
      updateUser(userData)
    }
  }

  return (
    <header
      className={`bg-background text-foreground shadow-md fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isHidden ? 'hidden' : 'top-0'}`}
    >
      <div className='container px-4 py-4 mx-auto'>
        <div className='flex items-center justify-between'>
          <Link to={AR.HOME} className='text-2xl font-bold text-primary'>
            Icoder
          </Link>
          <nav className='hidden md:block'>
            <ul className='flex space-x-6'>
              <li>
                <Link to={AR.HOME} className='text-lg hover:text-primary hover:font-bold'>
                  HomePage
                </Link>
              </li>
              <li>
                <Link to={AR.COURSELIST} className='text-lg hover:text-primary hover:font-bold'>
                  Course
                </Link>
              </li>
              <li>
                <Link to={AR.PROBLEMS} className='text-lg hover:text-primary hover:font-bold'>
                  Problems
                </Link>
              </li>
              <li>
                <Link to={AR.DISCUSS} className='text-lg hover:text-primary hover:font-bold'>
                  Discuss
                </Link>
              </li>
              <li>
                <Link to={AR.ABOUT} className='text-lg hover:text-primary hover:font-bold'>
                  AboutUs
                </Link>
              </li>
            </ul>
          </nav>
          <div className='flex items-center space-x-4'>
            {user ? (
              <div className='flex items-center space-x-3'>
                <Button variant='ghost' size='icon' className='hidden md:inline-flex'>
                  <Bell className='w-5 h-5' />
                </Button>
                <div className='relative flex items-center' ref={dropdownRef}>
                  <div onClick={toggleDropdown} className='cursor-pointer'>
                    <Avatar>
                      <AvatarImage src={user.profile.urlImagePresigned} alt='User Avatar' />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </div>
                  {isDropdownOpen && (
                    <div className='absolute left-0 mt-2'>
                      <DropdownMenuUser
                        isOpen={isDropdownOpen}
                        onClose={() => setIsDropdownOpen(false)}
                        userName={user.profile.firstName + ' ' + user.profile.lastName}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='hidden md:block'>
                <Button variant='outline' className='mr-2' onClick={handleLogin}>
                  Login
                </Button>
              </div>
            )}
            <ModeToggle />
            <Button variant='ghost' size='icon' className='md:hidden' onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <nav className='mt-4 md:hidden'>
            <ul className='flex flex-col space-y-2'>
              <li>
                <Link to={AR.HOME} className='block py-2 text-gray-600 hover:text-primary'>
                  HomePage
                </Link>
              </li>
              <li>
                <Link to={AR.COURSELIST} className='block py-2 text-gray-600 hover:text-primary'>
                  Course
                </Link>
              </li>
              <li>
                <Link to='/contests' className='block py-2 text-gray-600 hover:text-primary'>
                  Competition
                </Link>
              </li>
              <li>
                <Link to='/discuss' className='block py-2 text-gray-600 hover:text-primary'>
                  Discuss
                </Link>
              </li>
              <li>
                <Link to={AR.ABOUT} className='block py-2 text-gray-600 hover:text-primary'>
                  AboutUs
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Button variant='outline' className='w-full' onClick={handleLogin}>
                      Login
                    </Button>
                  </li>
                  <li>
                    <Button className='w-full'>Register</Button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
