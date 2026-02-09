import Link from "next/link";

export default function CreateProjectPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 pt-24 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Create Page is Working</h1>
      <p className="text-gray-400 mb-8">
        We have successfully isolated the error.
      </p>
      
      <Link 
        href="/dashboard" 
        className="px-6 py-3 bg-blue-600 rounded-lg text-white font-bold"
      >
        Go Back
      </Link>
    </div>
  );
}
