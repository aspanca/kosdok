import { EntityListPage } from "./entity-list";
import * as api from "../lib/api";

export const LabsPage = () => (
  <EntityListPage
    title="Laboratorët"
    fetch={api.getLabs}
    suspend={api.suspendLab}
    unsuspend={api.unsuspendLab}
    columns={[
      { key: "id", label: "ID" },
      { key: "name", label: "Emri" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Telefoni" },
      { key: "city", label: "Qyteti" },
      { key: "created_at", label: "Regjistruar" },
    ]}
  />
);
