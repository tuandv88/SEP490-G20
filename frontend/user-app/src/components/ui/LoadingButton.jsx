// LoadingButton.js
import styled, { keyframes } from 'styled-components'

// Định nghĩa animation xoay
const spinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);  // Bắt đầu ở vị trí 0 độ
  }
  100% {
    transform: rotate(360deg); // Kết thúc ở vị trí 360 độ
  }
`

const LoadingButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  // Phong cách cho vòng tròn xoay loading
  &::after {
    content: '';
    display: ${(props) => (props.loading ? 'inline-block' : 'none')};
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spinnerAnimation} 0.75s linear infinite; // Hiệu ứng xoay
    position: absolute;
    right: 0.5rem; // Vị trí của spinner
  }
`

// Xuất component
export default LoadingButton
