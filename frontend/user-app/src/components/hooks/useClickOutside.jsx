import { useEffect, useRef, useState } from 'react'

export default function useClickOutside(dom = 'button') {
  const [show, setShow] = useState(false)

  const nodeRef = useRef(null)

  useEffect(() => {
    function handleClickOutSide(e) {
      if (nodeRef.current && !nodeRef.current.contains(e.target) && !e.target.matches(dom)) {
        console.log('Click outside detected')
        setShow(false)
      }
    }

    document.addEventListener('click', handleClickOutSide)
    return () => {
      document.removeEventListener('click', handleClickOutSide)
    }
  }, [])

  return {
    nodeRef,
    show,
    setShow
  }
}
