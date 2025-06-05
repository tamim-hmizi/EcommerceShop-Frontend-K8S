import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignInForm from "../../components/auth/SignInForm";

function SignIn() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
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
      <SignInForm />
    </div>
  );
}

export default SignIn;
