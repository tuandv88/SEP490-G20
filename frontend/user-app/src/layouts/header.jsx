import React, { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { Bell, BookOpen, Code, Code2, Home, Info, LogIn, Menu, MessageSquare, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { AUTHENTICATION_ROUTERS as AR } from '@/data/constants'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import DropdownMenuUser from '@/components/ui/userdropdown'
import { ModeToggle } from '@/components/mode-toggle'
import AuthService from '@/oidc/AuthService'
import { UserContext } from '@/contexts/UserContext'
import { useNavigate } from "react-router-dom";
import { NavLink } from '@/components/NavLink'
import PopupNotification from '@/components/notifications/NotificationPopup'

const NAVIGATION_ITEMS = [
  { to: AR.HOME, label: 'HomePage', icon: Home },
  { to: AR.COURSELIST, label: 'Course', icon: BookOpen },
  { to: AR.PROBLEMS, label: 'Problems', icon: Code2 },
  { to: AR.DISCUSS, label: 'Discuss', icon: MessageSquare },
  { to: AR.ABOUT, label: 'AboutUs', icon: Info }
];

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
  const navigate = useNavigate();
  const handleClick = () => {
    console.log('Navigating to /notifications/history');
    navigate(`/notifications/history`);
  }

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
      className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 
        border-b border-border text-foreground fixed top-0 left-0 w-full z-40 
        transition-all duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className='container px-4 py-3 mx-auto'>
        <div className='flex items-center justify-between'>
          <Link
            to={AR.HOME}
            className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 
              bg-clip-text text-transparent flex items-center gap-2 
              hover:scale-105 transition-transform duration-300 w-10 h-10'
          >
            <img className='object-fit' src="https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/frontend/assets/icodervn-logo-removebg-preview.png" alt="Logo" />
            Icoder
          </Link>

          <nav className='hidden md:block'>
            <ul className='flex items-center space-x-8'>
              {NAVIGATION_ITEMS.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink to={to} label={label} icon={icon} />
                </li>
              ))}
            </ul>
          </nav>

          <div className='flex items-center space-x-4'>
            {user ? (
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <PopupNotification />
                </div>

                <div className='relative flex items-center' ref={dropdownRef}>
                  <div
                    onClick={toggleDropdown}
                    className='cursor-pointer transition-transform hover:scale-105'
                  >
                    <Avatar className='w-8 h-8 ring-2 ring-border ring-offset-2 ring-offset-background
                      hover:ring-primary transition-colors duration-300'>
                      <AvatarImage src={user?.profile?.urlImagePresigned} alt='User Avatar' />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </div>
                  {isDropdownOpen && (
                    <div className='absolute right-0 top-full mt-2'>
                      <DropdownMenuUser
                        isOpen={isDropdownOpen}
                        onClose={() => setIsDropdownOpen(false)}
                        userName={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='hidden md:flex items-center space-x-2'>
                <Button
                  variant='ghost'
                  className='hover:bg-primary/10 gap-2 group'
                  onClick={handleLogin}
                >
                  <LogIn className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Login
                </Button>
                <Button className='gap-2 group'>
                  <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Register
                </Button>
              </div>
            )}

            <ModeToggle />

            <Button
              variant='ghost'
              size='icon'
              className='md:hidden hover:bg-primary/10'
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className='w-5 h-5 transition-transform hover:rotate-90 duration-300' />
              ) : (
                <Menu className='w-5 h-5 transition-transform hover:scale-110 duration-300' />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className='md:hidden border-t border-border mt-3 pt-3'>
            <ul className='flex flex-col space-y-3'>
              {NAVIGATION_ITEMS.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    label={label}
                    icon={icon}
                    className='block py-2 px-3 rounded-md hover:bg-primary/10'
                  />
                </li>
              ))}
              {!user && (
                <li className='pt-3 border-t border-border'>
                  <div className='grid gap-2'>
                    <Button variant='outline' onClick={handleLogin} className='gap-2 group'>
                      <LogIn className="w-4 h-4 transition-transform group-hover:scale-110" />
                      Login
                    </Button>
                    <Button className='gap-2 group'>
                      <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
                      Register
                    </Button>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
