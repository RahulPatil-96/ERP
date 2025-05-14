export interface User {
  id: string;
  email: string;
  roles: ('student' | 'faculty' | 'admin' | 'hod')[];
  currentRole: 'student' | 'faculty' | 'admin' | 'hod'; 
  firstName: string;
  lastName: string;
  name?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (role: 'student' | 'faculty' | 'admin' | 'hod') => void; // Added method for role switching
  impersonateUser: (userId: string) => Promise<void>; // New method for impersonation

  // Added theme state and toggleTheme action
  isDarkMode: boolean;
  toggleTheme: () => void;
}
