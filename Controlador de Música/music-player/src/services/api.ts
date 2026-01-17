// src/services/api.ts
// src/services/api.ts
import type { Track } from '../types/music';

const API_BASE_URL = 'https://api.audius.co/v1';

export const musicApi = {
    async getTrendingTracks(): Promise<Track[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/tracks/trending?app_name=MEU_PLAYER_REAC`);
            const json = await response.json();
            return (json.data || []) as Track[];
        } catch (error) {
            return [];
        }
    },

    // VERIFIQUE SE ESTA FUNÇÃO ESTÁ EXATAMENTE ASSIM:
    async searchTracks(query: string): Promise<Track[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/tracks/search?query=${query}&app_name=MEU_PLAYER_REAC`);
            const json = await response.json();
            return (json.data || []) as Track[];
        } catch (error) {
            console.error("Erro na busca:", error);
            return [];
        }
    },

    getStreamUrl(trackId: string): string {
        return `${API_BASE_URL}/tracks/${trackId}/stream?app_name=MEU_PLAYER_REAC`;
    }
};