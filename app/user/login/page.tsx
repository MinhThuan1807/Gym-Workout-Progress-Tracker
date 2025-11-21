'use client'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/user/ui/button'
import InputField from '@/components/user/forms/InputField'
import FooterLink from '@/components/user/forms/FooterLink'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/user/ui/card'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginUserAPI } from '@/store/slices/authSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '@/utils/validators'

const SignIn = () => {
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>()

  if (searchParams.get('verified') === 'true') {
    toast.success('Email verified successfully! You can now log in.')
  }

  const onSubmit = async (data: SignInFormData) => {
    try {
      const user = await dispatch(loginUserAPI(data)).unwrap()

      if (user.data.role === 'admin') {
        router.push('/admin/dashboard')
        return
      }
      router.push('/dashboard')
    } catch (error) {
      toast.error(error as string)
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center mt-1">
            <CardTitle className="font-inter text-foreground pt-3">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <InputField
                name="email"
                label="Email"
                placeholder="abc@gmail.com"
                register={register}
                error={errors.email}
                validation={{
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                }}
              />

              <InputField
                name="password"
                label="Password"
                placeholder="Enter your password..."
                type="password"
                register={register}
                error={errors.password}
                validation={{
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                }}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-foreground font-poppins"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <FooterLink
                text="Don't have an account?"
                linkText="Sign Up"
                href="/user/register"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignIn
