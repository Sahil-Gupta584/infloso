import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import OTPInput from "react-otp-input";
import { ArrowRight, Mail } from "lucide-react";
import { sendOtp } from "../lib/auth";
import { TVerifyEmailData } from "./Login";
import { useNavigate } from "react-router-dom";

interface VerifyEmailProps {
    setVerifyEmailData: Dispatch<SetStateAction<TVerifyEmailData>>
    verifyEmailData: TVerifyEmailData
}

export default function VerifyEmail({ setVerifyEmailData, verifyEmailData }: VerifyEmailProps) {
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

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

    async function handleSendOtp() {
        try {
            setIsSubmitting(true)
            const ogOtp = await sendOtp(verifyEmailData.email as string) as string

            setVerifyEmailData({ otp: ogOtp })
            setIsSubmitting(false)
            setResendDisabled(true)
        } catch (error) {
            setIsSubmitting(false)
            setError((error as Error).message)
        }
    }

    const onSubmit = () => verifyEmailData.otp === otp ? navigate('/') : setError("Incorrect OTP !")


    return (
        <AuthLayout
            title="Verify Your Email"
            subtitle="We've sent a verification code to your email"
        >
            <div className="bg-indigo-100 p-3 rounded-full w-fit mx-auto">
                <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
                shouldAutoFocus={true}
                inputStyle='border rounded-md h-12 !w-8 border-black'
                containerStyle='flex justify-center gap-2 my-2'
            />

            {error && <p className="my-1 text-sm text-red-500 text-center font-medium ">{error}</p>}

            <button
                onClick={() => onSubmit()}
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
