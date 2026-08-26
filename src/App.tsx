import { useState, useEffect } from "react";
import { 
  Shield, 
  Mail, 
  Eye,
  EyeOff,
  Map as MapIcon, 
  PlusCircle, 
  Search, 
  User as UserIcon, 
  History, 
  FileText,
  UserRoundCheckIcon, 
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  LockKeyhole,
  LogIn,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type View = "dashboard" | "map" | "register" | "verify";
type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

const formatRole = (role: string) => role.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser) {
    return <LoginView onLogin={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-slate-900 border-r border-slate-800 flex flex-col z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-bold text-xl tracking-tight"
            >
              Registre Foncier
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2">
          <NavItem 
            icon={<Shield className="w-5 h-5" />} 
            label="Tableau de bord" 
            active={activeView === "dashboard"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView("dashboard")}
          />
          <NavItem 
            icon={<MapIcon className="w-5 h-5" />} 
            label="Cadastre & Cartes" 
            active={activeView === "map"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView("map")}
          />
          <NavItem 
            icon={<PlusCircle className="w-5 h-5" />} 
            label="Enregistrement" 
            active={activeView === "register"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView("register")}
          />
          <NavItem 
            icon={<Search className="w-5 h-5" />} 
            label="Vérification Titre" 
            active={activeView === "verify"}
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView("verify")}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeView === "dashboard" && "Résumé des activités"}
              {activeView === "map" && "Gestion Cadastrale"}
              {activeView === "register" && "Nouvel Enregistrement"}
              {activeView === "verify" && "Vérification Blockchain"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right mr-3 hidden sm:flex">
                <span className="text-sm font-medium">{currentUser.name ?? currentUser.email}</span>
                <span className="text-xs text-gray-500">{formatRole(currentUser.role)}</span>
            </div>
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <UserIcon size={20} />
            </div>
            <button
              onClick={() => setCurrentUser(null)}
              className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-colors"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeView === "dashboard" && <DashboardView key="dashboard" />}
            {activeView === "map" && <MapView key="map" />}
            {activeView === "register" && <RegisterView key="register" />}
            {activeView === "verify" && <VerifyView key="verify" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, name, email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Identifiant ou mot de passe invalide.");
      }

      onLogin(result.user);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
      <div className="hidden lg:flex lg:w-[46%] relative bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(79,70,229,0.38),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.76))]" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xl font-bold">Registre Foncier</p>
              <p className="text-sm text-indigo-100">Plateforme institutionnelle</p>
            </div>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-indigo-100 mb-6">
              <CheckCircle2 size={16} />
              Accès sécurisé au tableau de bord
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Sécurisez les titres fonciers du Mali avec une traçabilité immuable.
            </h1>
            <p className="text-slate-300 mt-5 leading-7">
              Connectez-vous pour consulter les activités, vérifier les titres et enregistrer de nouvelles parcelles dans le registre.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold">12.8k</p>
              <p className="text-slate-300 mt-1">Titres</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold">452</p>
              <p className="text-slate-300 mt-1">Transactions</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-slate-300 mt-1">Contrôle</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50 text-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">Registre Foncier</p>
              <p className="text-sm text-gray-500">Accès sécurisé</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-slate-200/60 p-8">
            <div className="mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-5">
                <LockKeyhole size={24} />
              </div>
              <h2 className="text-2xl font-bold">Connexion</h2>
              <p className="text-gray-500 text-sm mt-2">
                Entrez vos identifiants pour acceder à votre compte.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" htmlFor="name">
                  Nom complet
                </label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Mira KOUMA"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="jean@registre.ml"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" htmlFor="userId">
                  ID utilisateur
                </label>
                <div className="relative">
                  <UserRoundCheckIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="rôle: admin ou agent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" htmlFor="password">
                  Mot de passe
                </label>
                <div className="relative">
                  <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-indigo-400"
              >
                {isLoading ? "Vérification..." : "Accéder à la page d'accueil"}
                <LogIn size={18} />
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, collapsed, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && (
        <span className="font-medium whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
    </button>
  );
}

function DashboardView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Titres Enregistrés" value="12,840" trend="+4.2%" icon={<CheckCircle2 className="text-green-500" />} />
        <StatCard title="Transactions Blockchain" value="452" trend="+12%" icon={<History className="text-indigo-500" />} />
        <StatCard title="Demandes en attente" value="89" trend="-2%" icon={<FileText className="text-amber-500" />} />
        <StatCard title="Litiges Détectés" value="5" trend="-1%" icon={<AlertTriangle className="text-red-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Activités Récentes</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mt-1">
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Nouveau titre foncier sécurisé</h4>
                    <span className="text-xs text-gray-400 font-mono">ID: 0x4f...a2b</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Parcelle No. {8000 + i}, Bamako Coura, Mali.</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Enregistré par: DNTFE</span>
                    <span className="text-xs text-gray-400">Il y a 2 heures</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-6">Guide Institutionnel</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">En tant qu'agent, vous participez à la sécurisation du patrimoine national via la blockchain.</p>
            <div className="p-4 bg-indigo-50 rounded-xl">
              <h4 className="text-indigo-800 font-semibold text-sm">Conseil Sécurité</h4>
              <p className="text-xs text-indigo-600 mt-1">Toujours vérifier les signatures numériques sur les documents physiques avant l'injection dans le registre immuable.</p>
            </div>
            <button className="w-full py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Voir les directives légales
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, trend, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-indigo-600">
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h4 className="text-3xl font-bold text-gray-900 mt-1">{value}</h4>
      </div>
    </div>
  );
}

function MapView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh] bg-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center space-y-4">
                <MapIcon size={64} className="mx-auto text-gray-400" />
                <div>
                    <h3 className="text-lg font-bold">Visualisation Cadastrale Interactive</h3>
                    <p className="text-gray-500 text-sm">L'intégration PostGIS est en cours d'initialisation...</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Actualiser la carte</button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">Filtrer par région</button>
                </div>
            </div>
        </motion.div>
    );
}

function RegisterView() {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
            <div className="mb-8">
                <h3 className="text-xl font-bold">Formulaire d'Enregistrement de Titre</h3>
                <p className="text-gray-500 text-sm">Les données soumises ici seront hachées et stockées sur la blockchain Ethereum.</p>
            </div>
            
            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">Localisation du Terrain</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ex: Bamako, Quartier Mali, Rue 22" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Coordonnées GPS (Lat)</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="12.6392" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Coordonnées GPS (Long)</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="-8.0029" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">Propriétaire Mandatant</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Nom complet du propriétaire" />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">Preuves Documentaires (PDF/Images)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition-colors hover:bg-indigo-50 hover:border-indigo-200 group">
                        <FileText className="mx-auto text-gray-400 mb-2 group-hover:text-indigo-500 transition-colors" size={32} />
                        <p className="text-sm text-gray-500">Glissez vos fichiers ici ou <span className="text-indigo-600 font-medium">parcourez</span></p>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="button" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all">
                        Générer & Sécuriser sur Blockchain
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

function VerifyView() {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto py-12">
            <div className="text-center mb-12">
                <Search size={64} className="mx-auto text-indigo-100 mb-4 bg-indigo-600 p-4 rounded-3xl" />
                <h3 className="text-2xl font-bold">Vérificateur d'Authenticité</h3>
                <p className="text-gray-500 mt-2">Vérifiez instantanément la validité d'un titre foncier contre le registre immuable de la blockchain.</p>
            </div>
            
            <div className="relative">
                <input 
                    type="text" 
                    className="w-full pl-14 pr-4 py-5 bg-white border border-gray-200 rounded-2xl shadow-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm" 
                    placeholder="Entrez le Hash ou le No de Titre..."
                />
                <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="mt-12 p-6 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-4">
                <CheckCircle2 className="text-green-600 shrink-0 mt-1" />
                <div>
                   <h4 className="font-bold text-green-800">Résultat Prototype</h4>
                   <p className="text-sm text-green-700 mt-1">Le système est prêt pour le déploiement Web3. Saisissez une adresse pour tester la connexion au nœud Ethereum local.</p>
                </div>
            </div>
        </motion.div>
    );
}
