"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/forms/InputField";
import { useForm } from "react-hook-form";
import FooterLink from "@/components/forms/FooterLink";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerAdminAPI } from "@/api";
import { useAppDispatch } from "@/store/hook";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  SECRET_KEY_RULE,
  SECRET_KEY_MESSAGE,
} from "@/utils/validators";

const registerSchema = z
  .object({
    secretKey: z
      .string()
      .nonempty(FIELD_REQUIRED_MESSAGE)
      .regex(SECRET_KEY_RULE, SECRET_KEY_MESSAGE),
    email: z
      .string()
      .nonempty(FIELD_REQUIRED_MESSAGE)
      .email(EMAIL_RULE_MESSAGE)
      .regex(EMAIL_RULE, EMAIL_RULE_MESSAGE),
    password: z
      .string()
      .nonempty(FIELD_REQUIRED_MESSAGE)
      .regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE),
    confirmPassword: z.string().nonempty(FIELD_REQUIRED_MESSAGE),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpAdminFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: SignUpAdminFormData) => {
    try {
      const { secretKey, email, password } = data;
      await registerAdminAPI({ secretKey, email, password });

      toast.success("Registration successful!");
      toast.success("Please check your email to verify your account.");
      router.push("/user/login");
    } catch (error) {
      toast.error(error as string);
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center mt-1">
            <CardTitle className="font-inter text-foreground pt-3">
              Register Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                name="secretKey"
                label="Secret Key"
                placeholder="Enter your secret key..."
                type="password"
                register={register}
                error={errors.secretKey}
              />

              <InputField
                name="email"
                label="Email"
                placeholder="abc@gmail.com"
                register={register}
                error={errors.email}
              />
              <InputField
                name="password"
                label="Password"
                placeholder="Enter your password..."
                type="password"
                register={register}
                error={errors.password}
              />
              <InputField
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Enter your password again..."
                type="password"
                register={register}
                error={errors.confirmPassword}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-poppins"
              >
                {isSubmitting ? "Processing..." : "Register"}
              </Button>
            </form>

            <FooterLink
              text="Already have an account?"
              linkText="Login"
              href="/user/login"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
