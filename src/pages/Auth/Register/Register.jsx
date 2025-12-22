import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
    const {register, handleSubmit, formState: { errors },} = useForm();
    const {registerUser, updateUserProfile} = useAuth();
    const location = useLocation();
    // console.log('location in reg', location)
    const navigate = useNavigate();
    const axiosSecure = useAxios();

    const handleRegistration = (data) => {
        // console.log('After register', data.photo[0]);

        const profileImage = data.photo[0];

        registerUser(data.email, data.password)
        .then(() => {
            // console.log(result.user);

            // 1.store the img in form data
            const formData = new FormData();
            formData.append('image', profileImage);
            
            // 2.send the photo to store
            const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_Key}`

            axios.post(image_API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then(res => {
                const photoURL = res.data.data.url;

                //create user in the db
                const userInfo = {
                    email: data.email,
                    displayName: data.name,
                    photoURL: photoURL,
                }

                axiosSecure.post('/users', userInfo)
                .then(res => {
                    if(res.data.insertedId){
                        console.log('User created in the db');
                    }
                })

                //update user profile to firebase
                const userProfile = {
                    displayName: data.name,
                    photoURL: photoURL,
                }
                updateUserProfile(userProfile)
                .then(() => {
                    console.log("User Profile Updated.")
                    navigate(location?.state || '/')
                })
                .catch(error => 
                    console.log(error)
                )
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
  return (
    <div className="px-3">
        <h3 className="text-4xl font-bold">Create an Account</h3>
        <p className="mb-5 font-medium">Register to make the society safe...</p>
        <form onSubmit={handleSubmit(handleRegistration)}>
            <fieldset className="fieldset">

                {/* name */}
            <label className="label">Name</label>
            <input type="text" {...register('name', {required: true})} className="input input-bordered w-full" placeholder="Your Name" />

            {
                errors.name?.type === 'required' && <p className="text-red-500">Name is required</p>
            }

            {/* photo */}
            <label className="label">Image</label>
            <input type="file" {...register('photo', {required: true})} className="file-input" placeholder="Your Image" />

            {
                errors.photo?.type === 'required' && <p className="text-red-500">Photo is required</p>
            }

                {/* email */}
            <div className="my-3">
                <label className="label">Email</label>
                <input type="email" {...register('email', {required: true})} className="input input-bordered w-full" placeholder="Your Email" />

                {
                    errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>
                }

            </div>
                {/* pass */}
            <label className="label">Password</label>
            <input type="password" {...register('password', {
                required: true, 
                minLength: 6,
                })} className="input input-bordered w-full" placeholder="Your Password" />

            {
                errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>
            }

            {
                errors.password?.type === 'minLength' && <p className="text-red-500">Password must be 6 characters or longer</p>
            }

            <button className="btn bg-primary mt-4 rounded-lg w-full">Register</button>
            <div className="text-md">
                <p className="font-bold">Already have an account?
                    <NavLink state={location.state} to='/login' className="text-primary link link-hover"> Login</NavLink></p>
            </div>
            </fieldset>
        </form>
        <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;