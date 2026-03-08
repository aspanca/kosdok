import dotenv from "dotenv";

export function resolveEnvironmentFilePaths(nodeEnvironmentRaw: string | undefined): string[] {
  const nodeEnvironment = nodeEnvironmentRaw?.trim().toLowerCase() || "development";

  return [`.env.${nodeEnvironment}.local`, `.env.${nodeEnvironment}`, ".env.local", ".env"];
}

export function loadEnvironmentFiles(nodeEnvironmentRaw: string | undefined): void {
  const filePaths = [...resolveEnvironmentFilePaths(nodeEnvironmentRaw)].reverse();

  for (const filePath of filePaths) {
    dotenv.config({
      path: filePath,
      override: true,
    });
  }
}
