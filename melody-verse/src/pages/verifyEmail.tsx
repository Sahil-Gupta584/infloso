import { useEffect, useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import OTPInput from "react-otp-input";
import { ArrowRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";

export default function VerifyEmail() {
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);

    const { handleSubmit, watch, register, setValue, setError, formState: { errors, isSubmitting } } = useForm<{ otp: string }>();
    const otp = watch('otp')
    useEffect(() => {
        let timer: number;
        if (resendDisabled && countdown > 0) {
            timer = window.setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setResendDisabled(false);
        }
        return () => clearInterval(timer);
    }, [resendDisabled, countdown]);

    async function handleSendOtp(rawData) {
        try {
            const res = await fetch('',{d})
        } catch (error) {
            setError('otp', { message: (error as Error).message })

        }
    }

    return (
        <AuthLayout
            title="Verify Your Email"
            subtitle={`We've sent a verification code to your email`}
        >
            <div className="bg-indigo-100 p-3 mb-6 rounded-full">
                <Mail className="w-6 h-6 text-indigo-600" />
            </div>

            <OTPInput
                value={otp}
                onChange={(value) => setValue('otp', value)}
                numInputs={4}
                renderSeparator={<span></span>}
                renderInput={(props) => <input {...props} {...register('otp')} />}
            />

            {errors.otp && <p className="mt-1 text-sm text-red-500">{errors.otp?.message}</p>}

            <button
                onClick={handleSubmit(handleSendOtp)}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Verifying...' : 'Verify Email'}
                <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={resendDisabled}
                    className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {resendDisabled
                        ? `Resend code in ${countdown}s`
                        : "Didn't receive the code? Resend"}
                </button>
            </div>
        </AuthLayout>
    )
}
