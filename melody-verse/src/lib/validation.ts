  import { z } from 'zod';

  export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
  });

  export const signupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().optional( ),
    acceptTnC:z.boolean(),
    name:z.string().max(30).optional(),
    profileImg:z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }).refine((data)=>data.acceptTnC === true,{
    message:"Please accept Terms and Conditions.",
    path:['acceptTnC']
  });