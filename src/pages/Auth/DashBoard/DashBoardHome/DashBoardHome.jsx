import React from 'react';
import useRole from '../../../../hooks/useRole';
import Loading from '../../../../components/Loading/Loading';
import AdminDashBoardHome from './AdminDashBoardHome';
import StaffDashBoardHome from './StaffDashBoardHome';
import CitizenDashBoardHome from './CitizenDashBoardHome';

const DashBoardHome = () => {
    const {role, roleLoading} = useRole();
    if(roleLoading){
        return <Loading></Loading>
    }
    if(role === 'admin'){
        return <AdminDashBoardHome></AdminDashBoardHome>
    }
    else if(role === 'staff'){
        return <StaffDashBoardHome></StaffDashBoardHome>
    }
    else{
        return <CitizenDashBoardHome></CitizenDashBoardHome>
    }
};

export default DashBoardHome;