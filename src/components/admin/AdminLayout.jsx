import AdminSidebar from "./AdminSidebar";
import AdminMobileHeader from "./AdminMobileHeader";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f5f1] text-zinc-900">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminMobileHeader />

          {children}
        </div>
      </div>
    </div>
  );
}
