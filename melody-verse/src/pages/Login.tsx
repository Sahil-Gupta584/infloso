import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../components/AuthLayout';
import { loginSchema } from '../lib/validation';
import { sendOtp } from '../lib/auth';
import { Dispatch, SetStateAction, useState } from 'react';
import VerifyEmail from './verifyEmail';

export type LoginFormData = z.infer<typeof loginSchema>;

export interface TVerifyEmailData {
  email?: string;
  otp?: string
}

interface LoginFormProps {
  setShowOtpForm: Dispatch<SetStateAction<boolean>>;
  setVerifyEmailData: Dispatch<SetStateAction<TVerifyEmailData>>;
}

export function Login() {
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [verifyEmailData, setVerifyEmailData] = useState<TVerifyEmailData>({
    email: '',
    otp: ''
  })

  return (
    showOtpForm ? <VerifyEmail verifyEmailData={verifyEmailData} setVerifyEmailData={setVerifyEmailData} />
      :
      <LoginForm setShowOtpForm={setShowOtpForm} setVerifyEmailData={setVerifyEmailData} />)
}



function LoginForm({ setShowOtpForm, setVerifyEmailData }: LoginFormProps) {
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'post',
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await res.json()

      if (res.status !== 200) {
        setError('root', { message: result.message })
        return;
      }

      const ogOtp = await sendOtp(data.email) as string

      setVerifyEmailData({ otp: ogOtp })
      setShowOtpForm(true)
    } catch (error) {
      console.error('Signup failed:', error);
      setError('root',{message:(error as Error).message})
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to continue your musical journey"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>}
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={showPass ? 'text' : 'password'} // Toggle password visibility
            {...register('password')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password?.message}</p>}

          {errors.root && <p className="mt-1 text-sm text-red-500">{errors.root?.message}</p>}
          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute bottom-[10px] right-3 transform text-gray-500"
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <p className="ml-2 text-sm text-gray-600">Remember me</p>
          </label>

        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
          <br />
          <Link
            to="/"
            className="text-sm text-center font-medium mx-auto text-blue-700 hover:text-indigo-500"
          >
            Forgot password?
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
