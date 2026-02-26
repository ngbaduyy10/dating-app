import NavItems from "./NavItems";

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col bg-background p-2 md:py-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <NavItems />
      </div>
    </div>
  );
}