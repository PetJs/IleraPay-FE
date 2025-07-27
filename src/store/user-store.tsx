import type { User } from "@/lib/types";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { PersistOptions } from "zustand/middleware";
import { persist } from "zustand/middleware";

export interface UserStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  authorized: boolean;
  setUser: (data: { user: User }) => void;
  updateUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  reset: () => void;
}

type MyPersist = (
  config: StateCreator<UserStore>,
  options: PersistOptions<UserStore>
) => StateCreator<UserStore>;

const useUserStore = create<UserStore>(
  (persist as MyPersist)(
    (set) => ({
      user: null,
      currentRole: null,
      userId: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      authorized: false,
      setUser: ({ user }: { user: User }) =>
        set({
          user,
          authorized: true,
        }),
      updateUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      reset: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          authorized: false,
        }),
    }),
    { name: "userStore" }
  )
);

export default useUserStore;
