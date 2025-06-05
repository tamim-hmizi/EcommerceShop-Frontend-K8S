import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminOrderTable from "../../components/admin/AdminOrderTable";
function AdminOrder() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/");
    if (user) if (!user.isAdmin) navigate("/");
  }, [user, navigate]);
  return (
    <div>
      <h1 className="text-3xl font-bold ">Order Managemant</h1>
      <AdminOrderTable token={user.token} />
    </div>
  );
}

export default AdminOrder;
