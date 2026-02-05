import { authClient } from "~/lib/auth-client";

export const useSession = async () => {
  const { data: session } = await authClient.useSession(useFetch);
  return session;
}
