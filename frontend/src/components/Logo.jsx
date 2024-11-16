import axios from 'axios'


const Logo = () => {
    return (
      <div className='flex items-center space-x-2'>
        <img src='images/logo.png' alt='FoodGO Logo' className='h-8 w-auto' />
        <h2 className='text-2xl font-bold text-purple-600'>FoodGO</h2>
      </div>
    );
  };

export default Logo;