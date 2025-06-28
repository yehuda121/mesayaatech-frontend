import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, getToken } from "./authManager";

export function useRoleGuard(expectedRole) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const role = getUserRole();

    if (!token || !role || role !== expectedRole) {
      sessionStorage.clear();
      router.push("/login");
    }
  }, [expectedRole, router]);
}
