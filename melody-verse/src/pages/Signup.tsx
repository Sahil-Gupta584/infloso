import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../components/AuthLayout';
import { signupSchema } from '../lib/validation';

export type SignupFormData = z.infer<typeof signupSchema>;

export function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log('data', data);

      delete data.confirmPassword
      const res = await fetch('http://localhost:3000/signup', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await res.json()
      console.log('result', result);

      if (res.status !== 201) {
        setError('root', { message: result.message })
        return;
      }

      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      setError('root',{message:(error as Error).message})

    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join MelodyVerse and discover endless music"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            {...register('username')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username?.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={`${showPass ? 'text' : 'password'}`}
            {...register('password')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password?.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type={`${showPass ? 'text' : 'password'}`}
            {...register('confirmPassword')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword?.message}</p>}
        </div>

        <label htmlFor="showPass" className="mb-4 flex items-center cursor-pointer text-sm text-gray-600">
          <input
            id="showPass"
            type="checkbox"
            checked={showPass}
            onChange={() => setShowPass(!showPass)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
          />
          Show Password
        </label>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Optional)</label>
          <input
            type="text"
            {...register('name')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name?.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {profilePicture && <p className="mt-1 text-sm text-gray-500">Selected: {profilePicture.name}</p>}
        </div>

        <div className="mb-4">
          <label className="flex items-center cursor-pointer text-sm text-gray-600">
            <input
              type="checkbox"
              {...register('acceptTnC')}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <p className="ml-2">I accept the <span className="text-blue-600">Terms & Conditions</span></p>
          </label>
          {errors.acceptTnC && <p className="mt-1 text-sm text-red-500">{errors.acceptTnC?.message}</p>}
          {errors.root && <p className="mt-1 text-sm text-red-500">{errors.root?.message}</p>}

        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
