import { EntityListPage } from "./entity-list";
import * as api from "../lib/api";

export const DoctorsPage = () => (
  <EntityListPage
    title="Mjekët"
    fetch={api.getDoctors}
    suspend={api.suspendDoctor}
    unsuspend={api.unsuspendDoctor}
    columns={[
      { key: "id", label: "ID" },
      { key: "first_name", label: "Emri" },
      { key: "last_name", label: "Mbiemri" },
      { key: "email", label: "Email" },
      { key: "specialty", label: "Specialiteti" },
      { key: "city", label: "Qyteti" },
      { key: "created_at", label: "Regjistruar" },
    ]}
  />
);
