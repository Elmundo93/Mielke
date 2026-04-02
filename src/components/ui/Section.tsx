export function Section({ title, children, subdued = false }: { title?: string; children: React.ReactNode; subdued?: boolean }) {
  return (
    <section className={subdued ? "bg-muted/40" : ""}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        {title ? <h2 className="text-2xl font-semibold">{title}</h2> : null}
        <div className={title ? "mt-6" : ""}>{children}</div>
      </div>
    </section>
  );
}

