import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function MainLayout({children}) {
  return (
    <div className="min-h-screen bg-[#07070d] text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Page Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
