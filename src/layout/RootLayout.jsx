import React from 'react';
import Navbar from '../pages/shared/Navbar';
import { Outlet } from 'react-router';
import Footer from '../pages/shared/Footer';

const RootLayout = () => {
    return (
    <div className="bg-[#F0F0F0] py-5">
      <div className="max-w-300 mx-auto px-2 md:px-0">
        <Navbar></Navbar>
        <main className="grow w-full">
          <Outlet></Outlet>
        </main>
        <Footer></Footer>
      </div>
    </div>
    );
};

export default RootLayout;