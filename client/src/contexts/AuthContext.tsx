import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, onAuthChange, signOut as firebaseSignOut, type FirebaseUser } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  checkSessionAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSessionAuth = async () => {
    try {
      // Check if we have a session-based authentication
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFirebaseUser(null); // Clear Firebase user since we're using session
        return true;
      }
    } catch (error) {
      console.log("No session authentication found");
    }
    return false;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // First check for session-based authentication
      const hasSession = await checkSessionAuth();
      
      if (!hasSession) {
        // Fall back to Firebase authentication
        const unsubscribe = onAuthChange(async (fbUser) => {
          setFirebaseUser(fbUser);
          
          if (fbUser) {
            try {
              const userData = await apiRequest<User>("POST", "/api/auth/verify", { 
                email: fbUser.email,
                name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
                firebaseUid: fbUser.uid,
              });
              setUser(userData);
            } catch (error) {
              console.error("Error verifying user:", error);
              setUser(null);
            }
          } else {
            setUser(null);
          }
          
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signOut = async () => {
    try {
      // Try session logout first
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log("Session logout failed, trying Firebase logout");
    }
    
    // Also try Firebase logout
    await firebaseSignOut();
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, signOut, checkSessionAuth }}>
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
