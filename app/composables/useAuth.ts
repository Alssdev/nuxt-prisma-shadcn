import { authClient } from '~/lib/auth-client';

export function useAuth() {
  const useSession = () => authClient.useSession(useFetch);

  const signIn = async (email: string, password: string) => {
    return await authClient.signIn.email({
      email,
      password,
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    return await authClient.signUp.email({
      email,
      password,
      name,
    });
  };

  const signOut = async () => {
    return await authClient.signOut();
  };

  return {
    useSession,
    signIn,
    signUp,
    signOut,
  };
}
