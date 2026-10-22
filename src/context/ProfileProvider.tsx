import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Profile } from '../data/types';
import { getAllProfiles } from '../db/database';
import { AsyncStorage } from '../storage/AsyncStorage';

interface ProfileContextValue {
  activeProfile: Profile | null;
  profiles: Profile[];
  setActiveProfileId: (id: number) => void;
  refreshProfiles: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);
const ACTIVE_PROFILE_KEY = '@active_profile_id';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const refreshProfiles = useCallback(async () => {
    const all = await getAllProfiles();
    setProfiles(all);
    if (all.length > 0) {
      const savedId = await AsyncStorage.getItem<number>(ACTIVE_PROFILE_KEY);
      const target = all.find((p) => p.id === savedId) ?? all[0];
      setActiveProfile(target);
      await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, target.id);
    }
  }, []);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  const setActiveProfileId = useCallback(async (id: number) => {
    await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, id);
    const all = await getAllProfiles();
    setProfiles(all);
    const target = all.find((p) => p.id === id) ?? null;
    setActiveProfile(target);
  }, []);

  return (
    <ProfileContext.Provider value={{ activeProfile, profiles, setActiveProfileId, refreshProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
