import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabase";

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [message, setMessage] = useState("");

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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage(error.message);
            }
        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setMessage(error.message);
            } else if (!data.session) {
                setMessage("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");
            }
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (authenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="sign-in-container">
            <h2>{isLogin ? "Entrar" : "Criar conta"}</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                />

                <button type="submit">
                    {isLogin ? "Entrar" : "Cadastrar"}
                </button>
            </form>

            {message && <p>{message}</p>}

            <button
                type="button"
                onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage("");
                }}
            >
                {isLogin
                    ? "Ainda não tem conta? Cadastre-se"
                    : "Já tem conta? Faça login"}
            </button>
        </div>
    );
};