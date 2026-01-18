const BASE_URL = "https://api.deezer.com";
const PROXY = "https://corsproxy.io/?";

const mapDeezerTrack = (track: any) => ({
    id: track.id.toString(),
    title: track.title,
    artwork: {
        "150x150": track.album?.cover_medium || "",
        "480x480": track.album?.cover_xl || ""
    },
    stream_url: track.preview,
    user: {
        id: track.artist.id.toString(),
        name: track.artist.name
    }
});

export const musicApi = {
    getTrendingTracks: async () => {
        // Adicionado ?limit=50 para garantir que o botão "Carregar Mais" apareça
        const url = `${PROXY}${encodeURIComponent(`${BASE_URL}/chart/0/tracks?limit=50`)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro na rede');
        const data = await response.json();
        return data.data.map(mapDeezerTrack);
    },

    searchTracks: async (query: string) => {
        const url = `${PROXY}${encodeURIComponent(`${BASE_URL}/search?q=${query}`)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro na rede');
        const data = await response.json();
        return data.data.map(mapDeezerTrack);
    },

    getUserTracks: async (artistId: string) => {
        const url = `${PROXY}${encodeURIComponent(`${BASE_URL}/artist/${artistId}/top?limit=50`)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro na rede');
        const data = await response.json();
        return data.data.map(mapDeezerTrack);
    }
};