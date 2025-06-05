import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminUserTable from "../../components/admin/AdminUserTable";
function AdminUser() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/");
    if (user) if (!user.isAdmin) navigate("/");
  }, [user, navigate]);
  return (
    <div>
      <h1 className="text-3xl font-bold ">User Management</h1>
      <AdminUserTable token={user.token} />
    </div>
  );
}

export default AdminUser;
