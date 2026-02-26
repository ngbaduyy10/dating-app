import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Header from "@/components/organisms/layout/Header";
import Sidebar from "@/components/organisms/layout/Sidebar";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen w-full bg-background">
        <div className="fixed top-0 left-0 right-0 h-[68px] border-b border-gray-200 z-10 bg-white">
          <Header />
        </div>
        <div className="flex flex-1 pt-[68px]">
            <div className="w-80 fixed top-[68px] left-0 h-[calc(100vh-68px)] max-lg:hidden bg-background z-20">
              <Sidebar />
            </div>
            
            <div className="flex-1 min-w-0 mx-0 lg:ml-80 mr-2 h-[calc(100vh-68px)]">
              <main className="h-full py-2 md:py-4 pl-2 pr-1 bg-background overflow-y-auto main-scrollbar">
                {children}
              </main>
            </div>
          </div>
      </div>
    </SessionProvider>
  );
}