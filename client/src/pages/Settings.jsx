import PageHeader from "../components/PageHeader";
import { useAuthStore } from "../stores/authStore";

export default function Settings() {
  const { user } = useAuthStore();

  return (
    <>
      <PageHeader eyebrow="Workspace" title="Settings" />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="glass rounded-lg p-5">
          <h2 className="text-lg font-bold text-white">Profile</h2>
          <div className="mt-5 space-y-3">
            <input className="input" value={user?.name || ""} readOnly />
            <input className="input" value={user?.email || ""} readOnly />
            <input className="input" value={user?.role || ""} readOnly />
          </div>
        </section>
        <section className="glass rounded-lg p-5">
          <h2 className="text-lg font-bold text-white">Production checklist</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Connect Neon PostgreSQL through DATABASE_URL.</p>
            <p>Add Cashfree sandbox or production credentials.</p>
            <p>Expose webhook URL with ngrok during local testing.</p>
            <p>Configure Cashfree webhook to POST to /api/webhooks/cashfree.</p>
            <p>Deploy server and client with production environment variables.</p>
          </div>
        </section>
      </div>
    </>
  );
}
