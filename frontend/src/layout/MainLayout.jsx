import { Outlet } from "react-router-dom";
import { Header } from "../components/index.js";
import { Toaster } from "react-hot-toast";

function MainLayout() {
    return (
        <div className="dark:bg-gray-800 dark:text-white flex flex-col min-h-screen">
            <Toaster />
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout;
