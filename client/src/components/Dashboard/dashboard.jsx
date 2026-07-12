function Dashboard({ token, userId, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">JobSync</h1>
            <p className="text-sm text-gray-600">Track your applications</p>
          </div>
          
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to JobSync!</h2>
            <p className="text-xl text-gray-600 mb-4">Your job application tracker is ready</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 px-6 py-4 text-left rounded-lg">
            <p className="text-gray-700">
              ✅ Authentication working<br/>
              ✅ Backend connected<br/>
              ✅ Ready to add applications<br/>
            </p>
          </div>

          <p className="text-gray-500 mt-8">Coming tomorrow: Application dashboard, add jobs, track status...</p>
        </div>
      </main>

    </div>
  );
}

export default Dashboard;

