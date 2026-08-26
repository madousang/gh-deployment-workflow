import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { pbkdf2Sync, timingSafeEqual } from "crypto";

const prisma = new PrismaClient();

function verifyPassword(password: string, storedPassword: string) {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = pbkdf2Sync(password, salt, 120000, 64, "sha512");
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  return storedHashBuffer.length === hash.length && timingSafeEqual(storedHashBuffer, hash);
}

async function startServer() {
  const app = express();
  const PORT = 5000;

  app.use(express.json());
  app.use(cors());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SiraFoncier API is running" });
  });

  app.post("/api/auth/login", async (req, res) => {
    const userId = typeof req.body.userId === "string" ? req.body.userId.trim() : "";
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!userId || !name || !email || !password) {
      return res.status(400).json({ message: "L'identifiant, le nom, l'email et le mot de passe sont requis." });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          role: true,
        },
      });

      if (
        !user ||
        user.email.toLowerCase() !== email ||
        !user.name ||
        user.name.trim() !== name ||
        !verifyPassword(password, user.password)
      ) {
        return res.status(401).json({ message: "Identifiant, nom, email ou mot de passe invalide." });
      }

      const { password: _password, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ message: "Impossible de vérifier cet identifiant pour le moment." });
    }
  });

  // Blockchain interaction endpoints (Prototypes)
  app.post("/api/land/register", (req, res) => {
    // Logic for registering land on blockchain will go here
    res.status(201).json({ message: "Registration initiated" });
  });

  app.get("/api/land/:id", (req, res) => {
    // Logic for verifying land ownership will go here
    res.json({ id: req.params.id, status: "verified" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
