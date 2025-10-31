export default Object.freeze({
    BASE_URL: process?.env?.API_BASE_URL ?? "http://localhost:3000",
    
    // Auth
    SIGNIN() {
        return `${this.BASE_URL}/api/auth/signin`;
    },
    SIGNUP() {
        return `${this.BASE_URL}/api/auth/signup`;
    },
    
    // Discover
    DISCOVER(limit?: number) {
        const params = limit ? `?limit=${limit}` : '';
        return `${this.BASE_URL}/api/discover${params}`;
    },
    
    // Reactions
    REACTIONS(type?: 'sent' | 'received') {
        const params = type ? `?type=${type}` : '';
        return `${this.BASE_URL}/api/reactions${params}`;
    },
    CREATE_REACTION() {
        return `${this.BASE_URL}/api/reactions`;
    },
    
    // Matches
    MATCHES() {
        return `${this.BASE_URL}/api/matches`;
    },
    DELETE_MATCH(matchId: string) {
        return `${this.BASE_URL}/api/matches?matchId=${matchId}`;
    },
    
    // Profile
    PROFILE(userId: string) {
        return `${this.BASE_URL}/api/profile/${userId}`;
    },
    
    // Stats
    STATS() {
        return `${this.BASE_URL}/api/stats`;
    },
});