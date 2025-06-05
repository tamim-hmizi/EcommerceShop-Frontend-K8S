import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex h-screen">
      <aside>
        <AdminSidebar />
      </aside>
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-4 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
