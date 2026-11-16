import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./contexts/financial-record-context";
import { supabase } from "./supabase";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="app-container">
        <div className="navbar">
          <Link to="/">Painel</Link>

          {authenticated && (
            <button onClick={handleSignOut}>
              Sair
            </button>
          )}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                authenticated ? (
                  <FinancialRecordsProvider>
                    <Dashboard />
                  </FinancialRecordsProvider>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />

            <Route path="/auth" element={<Auth />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;