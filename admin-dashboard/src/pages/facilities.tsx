import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import * as api from "../lib/api";
import { getFacilityIcon, FACILITY_ICON_OPTIONS } from "../lib/facility-icons";
import { IconSelect } from "../components/ui/icon-select";

type Facility = { id: number; name: string; icon: string | null; category: string | null };

export const FacilitiesPage = () => {
  const [items, setItems] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Facility | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "", category: "" });

  const load = () => api.getFacilities().then((d) => setItems(d as Facility[])).catch((e) => setError(e.message)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    try {
      await api.createFacility({ name: form.name, icon: form.icon || undefined, category: form.category || undefined });
      setForm({ name: "", icon: "", category: "" });
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
      await api.updateFacility(editing.id, { name: form.name, icon: form.icon || undefined, category: form.category || undefined });
      setEditing(null);
      setForm({ name: "", icon: "", category: "" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gabim");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Fshi këtë lehtësirë?")) return;
    try {
      await api.deleteFacility(id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gabim");
    }
  };

  if (loading) return <div className="text-text-muted">Duke u ngarkuar...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Lehtësirat</h1>
        <Button onClick={() => { setCreating(true); setEditing(null); setForm({ name: "", icon: "", category: "" }); }}>Shto lehtësirë</Button>
      </div>
      {error && <div className="mb-4 p-3 bg-status-error/10 text-status-error rounded-lg text-sm">{error}</div>}
      {creating && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-white rounded-xl border border-border flex gap-4 flex-wrap items-end">
          <Input placeholder="Emri" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <div className="w-[56px]">
            <label className="block text-xs font-medium text-text-muted mb-1">Ikona</label>
            <IconSelect
              value={form.icon}
              onChange={(v) => setForm((f) => ({ ...f, icon: v }))}
              options={FACILITY_ICON_OPTIONS}
              getIcon={getFacilityIcon}
            />
          </div>
          <Input placeholder="Kategoria" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          <Button type="submit">Ruaj</Button>
          <Button type="button" variant="outline" onClick={() => setCreating(false)}>Anulo</Button>
        </form>
      )}
      {editing && (
        <form onSubmit={handleUpdate} className="mb-6 p-4 bg-white rounded-xl border border-border flex gap-4 flex-wrap items-end">
          <Input placeholder="Emri" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <div className="w-[56px]">
            <label className="block text-xs font-medium text-text-muted mb-1">Ikona</label>
            <IconSelect
              value={form.icon}
              onChange={(v) => setForm((f) => ({ ...f, icon: v }))}
              options={FACILITY_ICON_OPTIONS}
              getIcon={getFacilityIcon}
            />
          </div>
          <Input placeholder="Kategoria" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          <Button type="submit">Përditëso</Button>
          <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ name: "", icon: "", category: "" }); }}>Anulo</Button>
        </form>
      )}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background-page">
            <tr>
              <th className="text-left p-4 font-medium text-text-primary">ID</th>
              <th className="text-left p-4 font-medium text-text-primary">Emri</th>
              <th className="text-left p-4 font-medium text-text-primary">Ikona</th>
              <th className="text-left p-4 font-medium text-text-primary">Kategoria</th>
              <th className="text-left p-4 font-medium text-text-primary">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f) => {
              const Icon = getFacilityIcon(f.icon);
              return (
              <tr key={f.id} className="border-t border-border">
                <td className="p-4 text-text-muted">{f.id}</td>
                <td className="p-4 text-text-primary">{f.name}</td>
                <td className="p-4">
                  {Icon ? (
                    <Icon className="w-4 h-4 text-primary" />
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td className="p-4 text-text-primary">{f.category || "—"}</td>
                <td className="p-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(f); setForm({ name: f.name, icon: f.icon || "", category: f.category || "" }); setCreating(false); }}>Ndrysho</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(f.id)}>Fshi</Button>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
