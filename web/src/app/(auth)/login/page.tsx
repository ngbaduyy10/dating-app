import LoginForm from "@/components/organisms/auth/LoginForm";
import AuthLayout from "@/components/organisms/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout type="login">
      <h1 className="font-bold text-3xl">Sign In</h1>
      <p className="text-md text-muted-foreground mb-4">Please sign in with your personal info.</p>
      <LoginForm />
    </AuthLayout>
  )
}