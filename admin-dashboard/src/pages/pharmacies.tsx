import { EntityListPage } from "./entity-list";
import * as api from "../lib/api";

export const PharmaciesPage = () => (
  <EntityListPage
    title="Barnatorët"
    fetch={api.getPharmacies}
    suspend={api.suspendPharmacy}
    unsuspend={api.unsuspendPharmacy}
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
