export default function PageHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
      </div>
      {action}
    </div>
  );
}
