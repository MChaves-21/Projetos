
import type { Track } from '../types/music';

// Usaremos o gateway principal que redireciona automaticamente para nós saudáveis
const API_BASE = "https://api.audius.co/v1";

export const musicApi = {
    async getTrendingTracks(): Promise<Track[]> {
        try {
            const res = await fetch(`${API_BASE}/tracks/trending?app_name=GSA_MUSIC`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            console.error("Erro ao buscar tendências:", err);
            return [];
        }
    },

    async searchTracks(query: string): Promise<Track[]> {
        try {
            const res = await fetch(`${API_BASE}/tracks/search?query=${query}&app_name=GSA_MUSIC`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            return [];
        }
    },

    async getUserTracks(userId: string): Promise<Track[]> {
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/tracks?app_name=GSA_MUSIC`);
            const json = await res.json();
            return json.data || [];
        } catch (err) {
            return [];
        }
    },

    getStreamUrl(trackId: string): string {
        // Esta URL redireciona o áudio para um servidor ativo automaticamente
        return `${API_BASE}/tracks/${trackId}/stream?app_name=GSA_MUSIC`;
    }
};