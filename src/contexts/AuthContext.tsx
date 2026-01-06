import { createContext, useContext, useState, ReactNode } from "react";

type AppRole = "admin" | "customer";

// Mock user type for demo mode
interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

interface AuthContextType {
  user: MockUser | null;
  session: { user: MockUser } | null;
  role: AppRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setDemoRole: (role: AppRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading] = useState(false);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Demo mode: Accept any credentials and create mock user
    const mockUser: MockUser = {
      id: "demo-user-" + Date.now(),
      email: email || "demo@salonsmart.com",
      user_metadata: {
        full_name: fullName || "Demo User",
      },
    };
    setUser(mockUser);
    setRole("admin"); // Default to admin for demo purposes
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Demo mode: Accept any credentials and create mock user
    const mockUser: MockUser = {
      id: "demo-user-" + Date.now(),
      email: email || "demo@salonsmart.com",
      user_metadata: {
        full_name: "Demo User",
      },
    };
    setUser(mockUser);
    setRole("admin"); // Default to admin for demo purposes
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setRole(null);
  };

  const setDemoRole = (newRole: AppRole) => {
    setRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user ? { user } : null,
        role,
        isLoading,
        isAdmin: role === "admin",
        signUp,
        signIn,
        signOut,
        setDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
