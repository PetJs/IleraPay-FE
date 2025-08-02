import type { Plan, RememberedCard, User } from "@/lib/types";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import type { PersistOptions } from "zustand/middleware";
import { persist } from "zustand/middleware";

export interface UserStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  authorized: boolean;
  selectedPlan: Plan | null;
  rememberedCard: RememberedCard | null;

  setUser: (data: { user: User }) => void;
  updateUser: (user: User) => void;
  updateWallet: (amount: number) => void;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setSelectedPlan: (plan: Plan | null) => void;
  setRememberedCard: (card: RememberedCard | null) => void;

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
      accessToken: null,
      refreshToken: null,
      authorized: false,
      selectedPlan: null,
      rememberedCard: null,

      setUser: ({ user }) =>
        set({
          user: { ...user, walletBalance: user.walletBalance ?? 0 },
          authorized: true,
        }),

      updateUser: (user) => set({ user }),

      updateWallet: (amount: number) =>
        set((state) => ({
          user: state.user ? { ...state.user, walletBalance: amount } : null,
        })),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, authorized: true }),

      setSelectedPlan: (plan) => set({ selectedPlan: plan }),

      setRememberedCard: (card) => set({ rememberedCard: card }),

      reset: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          authorized: false,
          selectedPlan: null,
          rememberedCard: null,
        }),
    }),
    { name: "userStore" }
  )
);

export default useUserStore;
