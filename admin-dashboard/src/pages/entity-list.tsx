import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

type EntityConfig = {
  title: string;
  fetch: () => Promise<unknown[]>;
  suspend: (id: number) => Promise<unknown>;
  unsuspend: (id: number) => Promise<unknown>;
  columns: { key: string; label: string }[];
  idKey?: string;
};

export function EntityListPage({ title, fetch: fetchFn, suspend, unsuspend, columns, idKey = "id" }: EntityConfig) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => fetchFn().then((d) => setItems(d as Record<string, unknown>[])).catch((e) => setError(e.message)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSuspend = async (id: number) => {
    if (!confirm("Pezullo këtë llogari?")) return;
    try {
      await suspend(id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gabim");
    }
  };

  const handleUnsuspend = async (id: number) => {
    try {
      await unsuspend(id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gabim");
    }
  };

  const formatDate = (v: unknown) => {
    if (!v) return "—";
    const d = new Date(v as string);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("sq-AL");
  };

  if (loading) return <div className="text-text-muted">Duke u ngarkuar...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">{title}</h1>
      {error && <div className="mb-4 p-3 bg-status-error/10 text-status-error rounded-lg text-sm">{error}</div>}
      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-background-page">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="text-left p-4 font-medium text-text-primary">{c.label}</th>
              ))}
              <th className="text-left p-4 font-medium text-text-primary">Statusi</th>
              <th className="text-left p-4 font-medium text-text-primary">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const id = row[idKey] as number;
              const suspended = !!row.suspended_at;
              return (
                <tr key={id} className="border-t border-border">
                  {columns.map((c) => (
                    <td key={c.key} className="p-4 text-text-primary">
                      {c.key === "created_at" ? formatDate(row[c.key]) : String(row[c.key] ?? "—")}
                    </td>
                  ))}
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${suspended ? "bg-status-error/20 text-status-error" : "bg-status-success/20 text-status-success"}`}>
                      {suspended ? "Pezulluar" : "Aktiv"}
                    </span>
                  </td>
                  <td className="p-4">
                    {suspended ? (
                      <Button size="sm" variant="outline" onClick={() => handleUnsuspend(id)}>Aktivizo</Button>
                    ) : (
                      <Button size="sm" variant="danger" onClick={() => handleSuspend(id)}>Pezullo</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
