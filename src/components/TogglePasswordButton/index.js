import React from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Button = ({ showConfirmPassword, setShowConfirmPassword }) => {
  return (
    <button 
      type="button" 
      className="absolute right-3 top-3" 
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }} 
    >
      {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
    </button>
  );
};

export default Button;