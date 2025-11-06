"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/forms/InputField";
import { useForm } from "react-hook-form";
import FooterLink from "@/components/forms/FooterLink";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUserAPI } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hook";

const registerSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).+$/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa, 1 số, 1 ký tự đặc biệt và có độ dài tối thiểu 8 ký tự"),
       confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});
const Register = () => {
    const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const { email, password } = data;

      await dispatch(registerUserAPI({ email, password })).unwrap();

      toast.success("Đăng ký thành công!");
      toast.success("Vui lòng kiểm tra email của bạn để xác minh tài khoản.");
      router.push("/user/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Đăng ký thất bại!");
      } else {
        toast.error("Đăng ký thất bại!");
      }
      console.error(error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center mt-1">
            <CardTitle className="font-inter text-foreground pt-3">
              Đăng ký tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* <InputField
                name="username"
                label="Username"
                placeholder="Jake123"
                register={register}
                error={errors.displayName}
                validation={{
                  required: "Username là bắt buộc",
                  pattern: {
                    value: /^[a-zA-Z0-9_]{3,30}$/,
                    message:
                      "Username phải có độ dài từ 3-30 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới",
                  },
                }}
              /> */}
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
                placeholder="Nhập mật khẩu của bạn..."
                type="password"
                register={register}
                error={errors.password}
              />
              <InputField
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Nhập lại mật khẩu của bạn..."
                type="password"
                register={register}
                error={errors.confirmPassword}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-poppins"
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>

            <FooterLink
              text="Bạn đã có tài khoản?"
              linkText="Đăng nhập"
              href="/user/login"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
