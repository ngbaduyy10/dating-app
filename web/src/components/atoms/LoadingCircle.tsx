import { LoaderCircle } from "lucide-react";
import { ReactNode } from "react";

interface LoadingCircleProps {
  loading: boolean;
  children: ReactNode;
}

export default function LoadingCircle({ loading, children } : LoadingCircleProps) {
  return (
    <>
      {loading ? (
        <div className="animate-spin flex-center">
          <LoaderCircle/>
        </div>
      ) : children}
    </>
  )
}