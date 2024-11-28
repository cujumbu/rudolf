import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Station } from '../types';

interface StationState {
  station: Station | null;
  authorized: boolean;
  loading: boolean;
  authorizeStation: (adminId: string) => Promise<void>;
  deauthorizeStation: () => void;
  checkAuthorization: () => Promise<void>;
}

export const useStationStore = create<StationState>((set) => ({
  station: null,
  authorized: false,
  loading: true,
  authorizeStation: async (adminId: string) => {
    try {
      const { data: station } = await supabase
        .from('stations')
        .select('*')
        .eq('is_active', true)
        .single();

      if (station) {
        // Store authorization in localStorage without expiry
        const authorization = {
          stationId: station.id,
          adminId,
        };
        localStorage.setItem('station_auth', JSON.stringify(authorization));
        set({ station, authorized: true });
      }
    } catch (error) {
      console.error('Station authorization error:', error);
    }
  },
  deauthorizeStation: () => {
    localStorage.removeItem('station_auth');
    set({ authorized: false, station: null });
  },
  checkAuthorization: async () => {
    try {
      const auth = localStorage.getItem('station_auth');
      if (!auth) {
        set({ authorized: false, loading: false });
        return;
      }

      const { stationId } = JSON.parse(auth);

      const { data: station } = await supabase
        .from('stations')
        .select('*')
        .eq('id', stationId)
        .eq('is_active', true)
        .single();

      if (!station) {
        localStorage.removeItem('station_auth');
      }

      set({ 
        station,
        authorized: !!station,
        loading: false
      });
    } catch (error) {
      console.error('Station authorization check error:', error);
      set({ authorized: false, loading: false });
    }
  },
}));