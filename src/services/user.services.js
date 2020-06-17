export const userService = {
    login
};

async function login(email, password) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    };
    const response = await fetch("/api/v1/rest-auth/login/", requestOptions)
    const user = await handleResponse(response)
    localStorage.setItem("user", JSON.stringify(user));
    return user;
}

async function handleResponse(response) {
    const text = await response.text()
    const data = text && JSON.parse(text);
    if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        throw error;
    }
    return data;
}
