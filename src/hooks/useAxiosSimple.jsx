import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
    baseURL : "http://localhost:3000"
})

const useAxiosSimple = () => {
    return axiosInstance;
};

export default useAxiosSimple;