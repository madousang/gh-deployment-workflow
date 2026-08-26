import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const superAdminId = process.env.SUPER_ADMIN_ID ?? "admin";
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ?? "admin@registre.ml";
  const superAdminName = process.env.SUPER_ADMIN_NAME ?? "Mamadou SANGARE";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "admin123";
  const agentId = process.env.AGENT_USER_ID ?? "agent";
  const agentEmail = process.env.AGENT_USER_EMAIL ?? "agent@registre.ml";
  const agentName = process.env.AGENT_USER_NAME ?? "Paul TOGOLA";
  const agentPassword = process.env.AGENT_USER_PASSWORD ?? "agent123";

  const superAdmin = await prisma.user.upsert({
    where: { id: superAdminId },
    update: {
      email: superAdminEmail,
      name: superAdminName,
      password: hashPassword(superAdminPassword),
      role: "SUPER_ADMIN",
    },
    create: {
      id: superAdminId,
      email: superAdminEmail,
      name: superAdminName,
      password: hashPassword(superAdminPassword),
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Super admin ready: ${superAdmin.id}`);

  const agent = await prisma.user.upsert({
    where: { id: agentId },
    update: {
      email: agentEmail,
      name: agentName,
      password: hashPassword(agentPassword),
      role: "AGENT_FONCIER",
    },
    create: {
      id: agentId,
      email: agentEmail,
      name: agentName,
      password: hashPassword(agentPassword),
      role: "AGENT_FONCIER",
    },
  });

  console.log(`Agent user ready: ${agent.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
