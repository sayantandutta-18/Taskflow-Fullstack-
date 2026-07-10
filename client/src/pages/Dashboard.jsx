import MainLayout from "../layouts/MainLayout";

function Dashboard() {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold">
        Welcome to TaskFlow AI 🚀
      </h1>

      <p className="mt-4 text-gray-600">
        Manage your daily tasks efficiently.
      </p>
    </MainLayout>
  );
}

export default Dashboard;