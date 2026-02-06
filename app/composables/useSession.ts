import { authClient } from "~/lib/auth-client";

export const useSession = async () => {
  const { data, isPending, error } = await authClient.useSession(useFetch);
  const user = computed(() => data.value?.user);
  return { user, isPending, error };
}
