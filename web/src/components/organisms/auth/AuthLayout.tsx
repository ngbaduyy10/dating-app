import Logo from "@/components/atoms/Logo";
import CommonButton from "@/components/atoms/CommonButton";

interface AuthLayoutProps {
  children: React.ReactNode;
  type: "login" | "register";
}

export default function AuthLayout({ children, type }: AuthLayoutProps) {
  return (
    <div className="h-screen flex-center bg-secondary">
      <div className="flex grid grid-cols-1 md:grid-cols-2 rounded-[30px] m-4 shadow-xl w-full md:max-w-[900px] bg-white">
        <div className="hidden md:block bg-primary p-8 rounded-l-[30px] rounded-r-[100px]">
          <div className="h-full flex flex-col justify-center text-white">
            <Logo className="text-white gap-1 mb-4" />
            <p className="text-md">
              To keep connected with us please {type === "login" ? "sign in" : "sign up"} with your personal info.
            </p>
            <p className="text-md mb-4">Go back to the home page to explore more.</p>
            <CommonButton className="border border-white hover:bg-white hover:text-primary">
              Go back to Home
            </CommonButton>
          </div>
        </div>
        <div className="flex-center flex-col p-8 rounded-[30px]">
          {children}
        </div>
      </div>
    </div>
  )
}