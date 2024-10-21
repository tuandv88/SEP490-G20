// eslint-disable-next-line no-unused-vars
import React from 'react'
import Header from './header'
import Footer from './footer'

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main> {/* Nội dung trang sẽ được render ở đây */}
      <Footer />
    </div>
  )
}

export default Layout
