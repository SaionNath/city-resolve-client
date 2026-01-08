import React from 'react';
import Feature from '../Feature/Feature';
import Works from '../Works/Works';
import HomeIssues from '../HomeIssues/HomeIssues';
import Banner from '../Banner/Banner';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Feature></Feature>
            <Works></Works>
            <HomeIssues></HomeIssues>
        </div>
    );
};

export default Home;