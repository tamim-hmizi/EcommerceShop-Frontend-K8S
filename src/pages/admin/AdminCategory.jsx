import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminCategoryTable from "../../components/admin/AdminCategoryTable";
function AdminCategory() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/");
    if (user) if (!user.isAdmin) navigate("/");
  }, [user, navigate]);
  return (
    <div>
      <h1 className="text-3xl font-bold ">Category Management</h1>
      <AdminCategoryTable token={user.token} />
    </div>
  );
}

export default AdminCategory;
