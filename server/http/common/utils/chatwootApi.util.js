const autoBind = require("auto-bind");

class ChatwootAPI {
    constructor(baseUrl, platformApiKey) {
        autoBind(this);
        this.baseUrl = baseUrl; // Chatwoot base URL
        this.platformApiKey = platformApiKey; // Platform API key
    }

    async request(endpoint, method, data = null) {
        const headers = {
            api_access_token: this.platformApiKey,
            'Content-Type': 'application/json; charset=utf-8',
        };

        const options = {
            method,
            headers,
            ...(data && { body: JSON.stringify(data) }),
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            return method === 'DELETE' ? { success: true } : await response.json();
        } catch (error) {
            throw error;
        }
    }

    // -------------------------
    // ✅ Account Endpoints
    // -------------------------

    /**
     * ایجاد حساب جدید
     */
    async createAccount(data) {
        const endpoint = '/platform/api/v1/accounts';
        return this.request(endpoint, 'POST', data);
    }

    /**
     * دریافت اطلاعات حساب
     */
    async getAccount(accountId) {
        const endpoint = `/platform/api/v1/accounts/${accountId}`;
        return this.request(endpoint, 'GET');
    }

    /**
     * به‌روزرسانی حساب
     */
    async updateAccount(accountId, data) {
        const endpoint = `/platform/api/v1/accounts/${accountId}`;
        return this.request(endpoint, 'PATCH', data);
    }

    /**
     * حذف حساب
     */
    async deleteAccount(accountId) {
        const endpoint = `/platform/api/v1/accounts/${accountId}`;
        return this.request(endpoint, 'DELETE');
    }

    // -------------------------
    // ✅ User Endpoints
    // -------------------------

    /**
     * ایجاد کاربر جدید
     */
    async createUser(data) {
        const endpoint = '/platform/api/v1/users';
        return this.request(endpoint, 'POST', data);
    }

    /**
     * دریافت اطلاعات کاربر
     */
    async getUser(userId) {
        const endpoint = `/platform/api/v1/users/${userId}`;
        return this.request(endpoint, 'GET');
    }

    /**
     * به‌روزرسانی اطلاعات کاربر
     */
    async updateUser(userId, data) {
        const endpoint = `/platform/api/v1/users/${userId}`;
        return this.request(endpoint, 'PATCH', data);
    }

    /**
     * حذف کاربر
     */
    async deleteUser(userId) {
        const endpoint = `/platform/api/v1/users/${userId}`;
        return this.request(endpoint, 'DELETE');
    }

    /**
     * دریافت لیست کاربران
     */
    async listUsers(queryParams = {}) {
        const queryString = new URLSearchParams(queryParams).toString();
        const endpoint = `/platform/api/v1/users${queryString ? `?${queryString}` : ''}`;
        return this.request(endpoint, 'GET');
    }

    /**
     * تغییر رمز عبور کاربر
     */
    async changeUserPassword(userId, newPassword) {
        const endpoint = `/platform/api/v1/users/${userId}/password`;
        return this.request(endpoint, 'POST', { password: newPassword });
    }
}

module.exports = ChatwootAPI;
