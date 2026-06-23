import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin — AllBlack Sports",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-canvas">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="w-full h-full flex-1 overflow-hidden">
          <div className="w-full h-full overflow-y-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
