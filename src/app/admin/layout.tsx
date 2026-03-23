export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,rgba(255,180,0,0.08),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(220,38,38,0.07),transparent_40%),var(--background)]">
      <div className="border-b border-[var(--border)] bg-[var(--paper)] py-2 flex justify-center">
        <div className="text-xs uppercase tracking-[0.18em] font-semibold text-[var(--ink)]">Admin Mode</div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
