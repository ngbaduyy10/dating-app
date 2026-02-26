import Logo from "@/components/atoms/Logo";
import AvatarDropDown from "@/components/atoms/AvatarDropdown";

export default function Header() {
  return (
    <header className="py-3 px-4 text-black">
      <div className="flex-between max-md:mb-2">  
        <Logo className="text-black gap-1" />
        <AvatarDropDown />
      </div>
    </header>
  )
}