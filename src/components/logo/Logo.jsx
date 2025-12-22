import React from 'react';
import logo from '../../assets/img/logo.png'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to='/'>
            <div className='flex items-end'>
                <img src = {logo} alt="" />
                <h3 className="text-2xl font-bold -ms-2">_cityResolve</h3>
            </div>
        </Link>
    );
};

export default Logo;