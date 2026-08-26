var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_cors = __toESM(require("cors"), 1);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.use((0, import_cors.default)());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SiraFoncier API is running" });
  });
  app.post("/api/auth/login", async (req, res) => {
    const userId = typeof req.body.userId === "string" ? req.body.userId.trim() : "";
    if (!userId) {
      return res.status(400).json({ message: "L'identifiant utilisateur est requis." });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });
      if (!user) {
        return res.status(401).json({ message: "Identifiant utilisateur invalide." });
      }
      res.json({ user });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ message: "Impossible de v\xE9rifier cet identifiant pour le moment." });
    }
  });
  app.post("/api/land/register", (req, res) => {
    res.status(201).json({ message: "Registration initiated" });
  });
  app.get("/api/land/:id", (req, res) => {
    res.json({ id: req.params.id, status: "verified" });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
