export default Object.freeze({
    BASE_URL: process?.env?.API_BASE_URL ?? "http://localhost:3000",
    SIGNIN() {
        return `${this.BASE_URL}/auth/signin`;
    },
    SIGNUP() {
        return `${this.BASE_URL}/auth/signup`;
    }
});