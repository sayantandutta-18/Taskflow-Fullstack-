import MainLayout from "../layouts/MainLayout";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-8 mt-10">

        <div className="flex flex-col items-center">

          <img
            src="https://ui-avatars.com/api/?name=User&background=2563eb&color=fff&size=200"
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />

          <h1 className="text-3xl font-bold mt-5 text-white">
            {user?.name}
          </h1>

          <p className="text-gray-400 mt-2">
            {user?.email}
          </p>

        </div>

        <div className="grid grid-cols-2 gap-5 mt-10">

          <div className="bg-slate-800 rounded-xl p-5">
            <p className="text-gray-400">Name</p>

            <h2 className="text-xl font-bold mt-2">
              {user?.name}
            </h2>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <p className="text-gray-400">Email</p>

            <h2 className="text-xl font-bold mt-2">
              {user?.email}
            </h2>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <p className="text-gray-400">
              Account Status
            </p>

            <h2 className="text-xl font-bold mt-2 text-green-400">
              Active
            </h2>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <p className="text-gray-400">
              Joined
            </p>

            <h2 className="text-xl font-bold mt-2">
              2026
            </h2>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Profile;