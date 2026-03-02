import { EntityListPage } from "./entity-list";
import * as api from "../lib/api";

export const PatientsPage = () => (
  <EntityListPage
    title="Pacientët"
    fetch={api.getPatients}
    suspend={api.suspendPatient}
    unsuspend={api.unsuspendPatient}
    columns={[
      { key: "id", label: "ID" },
      { key: "first_name", label: "Emri" },
      { key: "last_name", label: "Mbiemri" },
      { key: "email", label: "Email" },
      { key: "phone_number", label: "Telefoni" },
      { key: "city", label: "Qyteti" },
      { key: "created_at", label: "Regjistruar" },
    ]}
  />
);
