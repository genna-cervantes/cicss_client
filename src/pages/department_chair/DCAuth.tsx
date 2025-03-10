import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { Navigate, Outlet } from 'react-router-dom';

const DCAuth = () => {

    const {role} = useAppContext();

    if (role !== 'department-chair'){

        if (role == 'student'){
            return <Navigate to='/student' replace />
        }
        if (role == 'tas'){
            return <Navigate to='/tas' replace />
        }
        
        return <Navigate to='/login' replace />
    }

    return <Outlet /> 
}

export default DCAuth