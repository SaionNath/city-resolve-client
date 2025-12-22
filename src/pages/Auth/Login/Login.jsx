import React from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const {signInUser} = useAuth();
    const location = useLocation();
    // console.log('location in reg', location)
    const navigate = useNavigate();

    const handleLogin = (data) => {
        console.log('after login', data)
        signInUser(data.email, data.password)
        .then(result => {
            console.log(result.user);
            navigate(location?.state || '/')
        })
        .catch(error => {
            console.log(error)
        })
    }
  return (
    <div className="px-3">
        <h3 className="text-4xl font-bold">Welcome Back</h3>
        <p className="mb-5 font-medium">Login to keep the society safe...</p>
        <form onSubmit={handleSubmit(handleLogin)}>
            <fieldset className="fieldset">
                    {/* email */}
                <label className="label">Email</label>
                <input type="email" {...register('email', {required: true})} className="input input-bordered w-full" placeholder="Email" />

                {
                    errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>
                }
            
                <div className="my-3">
                    {/* password */}
                    <label className="label">Password</label>
                    <input type="password" {...register('password', {
                        required: true,
                        minLength: 6,
                        })} className="input input-bordered w-full" placeholder="Password" />

                {
                    errors.password?.type === 'required' && <p className="text-red-500">password is required</p>
                }

                {
                    errors.password?.type === 'minLength' && <p className="text-red-500">Password must be 6 characters or longer</p>
                }

                </div>

                <div>
                    <Link to='/forgot_password' className="link link-hover">Forgot password?</Link>
                </div>

                <button className="btn bg-primary mt-4 rounded-lg w-full">Login</button>

                <div>
                    <p className="font-bold">Don't have any account?
                        <NavLink state={location.state} to='/register' className="text-primary link link-hover"> Register</NavLink></p>
                </div>

            </fieldset>
        </form>
        <SocialLogin></SocialLogin>
    </div>
  );
};

export default Login;