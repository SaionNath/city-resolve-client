import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
    baseURL : "https://city-resolve-server.vercel.app/api"
})

const useAxiosSimple = () => {
    return axiosInstance;
};

export default useAxiosSimple;