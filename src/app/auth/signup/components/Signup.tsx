"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Check,
  LoaderCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUser } from "@/actions/user";

const FormSchema = z
  .object({
    firstName: z.string().min(1, "Username is required"),
    lastName: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof FormSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const {
    fn: createUserfn,
    loading: isLoading,
    error: error,
    data: data,
  } = useFetch(createUser);

  const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log(formData);
  //   // const submitedFormData = {
  //   //   email: formData.email,
  //   //   password: formData.password,
  //   //   name: formData.firstName + " " + formData.lastName,
  //   // };
  //   // await createUserfn(submitedFormData);
  //   // console.log("Signup attempt:", formData);
  // };

  const onSubmit = async (values: FormData) => {
    try {
      await createUserfn(values);
      toast.success("User Successfully Created");
      router.push("/auth/signin");
      console.log(data);
    } catch (error) {
      console.log("Error signing up:", error);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  useEffect(() => {
    const password = watch("password") || "";

    // Simple password strength logic
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    if (password.length >= 12) strength++; // Extra point for long passwords

    setPasswordStrength(strength);
  }, [watch("password")]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8">
            <div className="text-center">
              <Link href="/" className="inline-block">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Name
                </h1>
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create Account
            </CardTitle>
            <p className="text-center text-gray-600">
              Join us
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      {...register("firstName")}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    {...register("lastName")}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password")}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {watch("password") && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Password strength:
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength <= 1
                            ? "text-red-600"
                            : passwordStrength <= 3
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  {errors.confirmPassword &&
                    getValues("password") === getValues("confirmPassword") && (
                      <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                </div>
                {errors.confirmPassword &&
                  errors.password !== errors.confirmPassword && (
                    <p className="text-xs text-red-600">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  required
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  id="newsletter"
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <Label htmlFor="newsletter" className="text-sm text-gray-700">
                  Subscribe to our newsletter for exclusive deals and updates
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                // disabled={
                //   !formData.firstName ||
                //   !formData.lastName ||
                //   !formData.email ||
                //   !formData.password ||
                //   !formData.confirmPassword ||
                //   formData.password !== formData.confirmPassword
                // }
              >
                {isLoading ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                className="h-12 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
