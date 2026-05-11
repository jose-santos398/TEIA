import { execSync } from "child_process";

try {
  console.log("🔍 Rodando ESLint...\n");

  execSync("eslint .", { stdio: "inherit" });

  console.log("\n✅ ESLint passou sem erros!");
} catch {
  console.log("\n❌ ESLint encontrou problemas!");
  process.exit(1);
}