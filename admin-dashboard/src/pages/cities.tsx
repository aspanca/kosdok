import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import * as api from "../lib/api";

type City = { id: number; name: string; postcode: string };

export const CitiesPage = () => {
  const [items, setItems] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<City | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", postcode: "" });

  const load = () => api.getCities().then((d) => setItems(d as City[])).catch((e) => setError(e.message)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.postcode) return;
    try {
      await api.createCity(form);
      setForm({ name: "", postcode: "" });
      setCreating(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gabim");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await api.updateCity(editing.id, { name: form.name, postcode: form.postcode });
      setEditing(null);
      setForm({ name: "", postcode: "" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gabim");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Fshi këtë qytet?")) return;
    try {
      await api.deleteCity(id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gabim");
    }
  };

  if (loading) return <div className="text-text-muted">Duke u ngarkuar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Qytetet</h1>
        <Button onClick={() => { setCreating(true); setEditing(null); setForm({ name: "", postcode: "" }); }}>
          Shto qytet
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-status-error/10 text-status-error rounded-lg text-sm">{error}</div>
      )}

      {creating && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-white rounded-xl border border-border flex gap-4">
          <Input placeholder="Emri" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input placeholder="Postkodi" value={form.postcode} onChange={(e) => setForm((f) => ({ ...f, postcode: e.target.value }))} required />
          <Button type="submit">Ruaj</Button>
          <Button type="button" variant="outline" onClick={() => setCreating(false)}>Anulo</Button>
        </form>
      )}

      {editing && (
        <form onSubmit={handleUpdate} className="mb-6 p-4 bg-white rounded-xl border border-border flex gap-4">
          <Input placeholder="Emri" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input placeholder="Postkodi" value={form.postcode} onChange={(e) => setForm((f) => ({ ...f, postcode: e.target.value }))} required />
          <Button type="submit">Përditëso</Button>
          <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ name: "", postcode: "" }); }}>Anulo</Button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background-page">
            <tr>
              <th className="text-left p-4 font-medium text-text-primary">ID</th>
              <th className="text-left p-4 font-medium text-text-primary">Emri</th>
              <th className="text-left p-4 font-medium text-text-primary">Postkodi</th>
              <th className="text-left p-4 font-medium text-text-primary">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-4 text-text-muted">{c.id}</td>
                <td className="p-4 text-text-primary">{c.name}</td>
                <td className="p-4 text-text-primary">{c.postcode}</td>
                <td className="p-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(c); setForm({ name: c.name, postcode: c.postcode }); setCreating(false); }}>
                    Ndrysho
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>Fshi</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
