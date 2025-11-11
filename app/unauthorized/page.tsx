export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <a
          href="/dashboard"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}
