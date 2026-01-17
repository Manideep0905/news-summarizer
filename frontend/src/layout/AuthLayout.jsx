import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-black">
            <Outlet />
        </div>
    );
}

export default AuthLayout;
