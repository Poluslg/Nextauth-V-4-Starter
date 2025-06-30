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
  ArrowLeft,
  LoaderCircleIcon,
  MoveLeftIcon,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [email, setEmail] = useState(String);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const router = useRouter();
  const testemailpassword = {
    email: "test@test.com",
    password: "test@123",
  };

  const handleVarifyEmail = () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
  };

  const handleTestLogin = () => {
    setEmail(testemailpassword.email);
    setPassword(testemailpassword.password);
    setTestLoading(true);
    signIn("credentials", {
      email: testemailpassword.email,
      password: testemailpassword.password,
      redirect: true,
      callbackUrl: "/",
    }).catch((error) => {
      const errorMessage = error as Error;
      console.log(errorMessage.message);
      toast.error("Failed to sign in with test credentials");
    });
    setTestLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password: password,
        redirect: false,
        redirectTo: "/",
      });
      console.log(res?.error);
      if (res?.error) {
        toast.error("Invalid password");
        setPassword("");
      } else {
        toast.success("Successfully signed in");
        setEmail("");
        setPassword("");
        setIsEmail(false);
        setPasswordField(false);
        router.push("/");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleEmailVarification = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (email) {
      setIsEmail(true);
      const response = await fetch("/api/checkEmail", {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();
      if (data.message === "Email Found") {
        setPasswordField(true);
      } else if (data.message === "Email not Found") {
        toast.error("Email not found");
        setIsEmail(false);
      } else if (data.message === "Please try to login using google") {
        toast.error("Please try to login using google");
        setIsEmail(false);
      } else {
        toast.error("Please try again latter");
        setIsEmail(false);
      }
    }
  };

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      const data = await signIn("google");
      // toast.error("Please use credentials to login");
    } catch (error) {
      alert("Failed to sign in with Google. Please try again.");
      console.error("Google Sign-In Error:", error);
    }
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
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
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-600">
              Sign in to your account to continue shopping
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!passwordField ? (
              <form className="space-y-4" onSubmit={handleEmailVarification}>
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
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <LoaderCircleIcon className="animate-spin" />
                  ) : (
                    "Varify Email"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div
                  className="text-sm text-gray-700 font-medium flex items-center space-x-1 cursor-pointer"
                  onClick={() => {
                    setPasswordField(false);
                    setIsEmail(false);
                    setEmail("");
                  }}
                >
                  <MoveLeftIcon color="gray" size={20} />
                  <p>Back</p>
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
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                      disabled={isEmail}
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-700">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <LoaderCircleIcon className="animate-spin" />
                  ) : (
                    " Sign In"
                  )}
                </Button>
              </form>
            )}

            <Button
              type="submit"
              disabled={testLoading}
              onClick={handleTestLogin}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
            >
              {testLoading ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                " Sign In as Test"
              )}
            </Button>
            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                className="h-12 border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={signInWithGoogle}
              >
                {isGoogleLoading ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  <>
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
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don&quot;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our{" "}
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
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
