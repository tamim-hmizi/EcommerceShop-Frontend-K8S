import RegisterForm from "../../components/auth/ResgisterForm";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}

export default Register;
