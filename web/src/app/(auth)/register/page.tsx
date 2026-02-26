import RegisterForm from "@/components/organisms/auth/RegisterForm";
import AuthLayout from "@/components/organisms/auth/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout type="register">
      <h1 className="font-bold text-3xl">Sign Up</h1>
      <p className="text-md text-muted-foreground mb-4">Please sign up with your personal info.</p>
      <RegisterForm />
    </AuthLayout>
  )
}