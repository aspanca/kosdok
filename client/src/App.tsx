import React from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/auth-context";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
