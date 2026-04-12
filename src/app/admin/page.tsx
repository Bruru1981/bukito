"use client";

import { useState, useEffect } from "react";
import { BrandTab } from "./BrandTab";
import { JournalTab, MenuTab, PlaylistsTab, SettingsTab } from "./AdminTabs";

type Tab = "settings" | "menu" | "journal" | "playlists" | "brand";

const TABS: { key: Tab; label: string }[] = [
  { key: "settings", label: "SETTINGS" },
  { key: "menu", label: "MENU" },
  { key: "journal", label: "JOURNAL" },
  { key: "playlists", label: "PLAYLISTS" },
  { key: "brand", label: "BRAND" },
];

/* ═══════════════════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════════════════ */

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [tab, setTab] = useState<Tab>("settings");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("bukito_admin_pw");
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  function handleLogin() {
    if (loginInput.trim()) {
      setPassword(loginInput.trim());
      setAuthenticated(true);
      sessionStorage.setItem("bukito_admin_pw", loginInput.trim());
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="bg-white/50 p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h1 className="text-2xl text-sunrust mb-6 text-center">
            BUKITO ADMIN
          </h1>
          <input
            type="password"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="PASSWORD"
            className="w-full px-4 py-3 border border-sunrust/20 bg-sand text-sunrust placeholder-sunrust/40 rounded mb-4 focus:outline-none focus:border-sunrust"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-sunrust text-sand py-3 rounded hover:bg-sunrust/90 transition-colors"
          >
            ENTER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand text-sunrust" data-lenis-prevent>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-sunrust text-sand px-6 py-3 rounded shadow-lg">
          {toast}
        </div>
      )}

      <header className="border-b border-sunrust/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl tracking-wide">BUKITO ADMIN</h1>
        <button
          onClick={() => {
            setAuthenticated(false);
            setPassword("");
            sessionStorage.removeItem("bukito_admin_pw");
          }}
          className="text-sm text-sunrust/50 hover:text-sunrust transition-colors"
        >
          LOGOUT
        </button>
      </header>

      <nav className="border-b border-sunrust/10 px-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm transition-colors border-b-2 ${
              tab === t.key
                ? "border-sunrust text-sunrust"
                : "border-transparent text-sunrust/40 hover:text-sunrust/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="p-6 max-w-5xl mx-auto">
        {tab === "settings" && (
          <SettingsTab password={password} showToast={showToast} />
        )}
        {tab === "menu" && (
          <MenuTab password={password} showToast={showToast} />
        )}
        {tab === "journal" && (
          <JournalTab password={password} showToast={showToast} />
        )}
        {tab === "playlists" && (
          <PlaylistsTab password={password} showToast={showToast} />
        )}
        {tab === "brand" && (
          <BrandTab password={password} showToast={showToast} />
        )}
      </main>
    </div>
  );
}
