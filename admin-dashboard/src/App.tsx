import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/auth-context";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
