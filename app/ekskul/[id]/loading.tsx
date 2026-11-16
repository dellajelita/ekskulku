export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border space-y-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-24 bg-gray-100 rounded-xl"></div>
        <div className="h-40 bg-gray-100 rounded-xl"></div>
      </div>
    </main>
  );
}
