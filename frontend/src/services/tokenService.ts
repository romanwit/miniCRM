export const getToken = (): String | null => {
    const token = localStorage.getItem('auth_token_xyz');
    return token;
};