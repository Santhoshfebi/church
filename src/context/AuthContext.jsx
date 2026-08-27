import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Profile error:", error);
      setProfile(null);
      return;
    }

    setProfile(data);
  };

  useEffect(() => {
    const initialiseAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        await loadProfile(currentUser.id);
      }

      setLoading(false);
    };

    initialiseAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        await loadProfile(currentUser.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
