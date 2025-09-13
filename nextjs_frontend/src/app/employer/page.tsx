import Link from "next/link";

export default function EmployerHome() {
  return (
    <div className="section">
      <h1 className="title">Employer Portal</h1>
      <p className="subtitle">Welcome to CareerMatch for Employers. Manage your jobs and candidates.</p>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700" href="/employer/dashboard">Go to Dashboard</Link>
        <Link className="rounded-md bg-slate-100 px-4 py-2 hover:bg-slate-200" href="/employer/jobs">Manage Jobs</Link>
        <Link className="rounded-md bg-slate-100 px-4 py-2 hover:bg-slate-200" href="/employer/candidates">View Candidates</Link>
      </div>
    </div>
  );
}
