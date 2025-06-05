import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminProductTable from "../../components/admin/AdminProductTable";
function AdminProduct() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/");
    if (user) if (!user.isAdmin) navigate("/");
  }, [user, navigate]);
  return (
    <div>
      <h1 className="text-3xl font-bold ">Product Managemant</h1>
      <AdminProductTable token={user.token} />
    </div>
  );
}

export default AdminProduct;
