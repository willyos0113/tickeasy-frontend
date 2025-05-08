/**
 * TickEasy 票務系統前端程式 - 靜態麵包屑導航版本
 */

// API 基礎 URL - 確保與後端服務地址一致
const BASE_URL = 'http://localhost:8080/maven-tickeasy-v1';

/**
 * 工具函數
 */
const utils = {
    // 格式化日期時間
    formatDateTime(dateTimeString) {
        if (!dateTimeString) return '';
        
        const date = new Date(dateTimeString);
        
        if (isNaN(date.getTime())) {
            return dateTimeString;
        }
        
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    },
    
    // 格式化貨幣
    formatCurrency(amount) {
        if (amount === undefined || amount === null) return '';
        return `NT$ ${amount.toLocaleString()}`;
    },
    
    // 獲取 URL 參數
    getUrlParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        for (let i = 0; i < pairs.length; i++) {
            if (!pairs[i]) continue;
            
            const pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        
        return params;
    },
    
    // 顯示錯誤訊息
    showError(message) {
        console.error(message);
        return message;
    },
    
    // 更新靜態麵包屑導航
    updateBreadcrumb(eventName) {
        // 這個函數會更新 .event-back a 元素的內容
        const eventBackLink = document.querySelector('.event-back a');
        if (eventBackLink) {
            const arrowSpan = '<span class="arrow-back">‹</span>';
            eventBackLink.innerHTML = arrowSpan + ' ' + eventName;
        }
    }
};

/**
 * API 請求模組 - 增強的錯誤處理
 */
const api = {
    // 處理 API 回應
    async handleResponse(response) {
        // 檢查 HTTP 狀態碼
        if (!response.ok) {
            const errorMsg = `API 錯誤: ${response.status} ${response.statusText}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        
        // 檢查回應的內容類型
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch (error) {
                console.error('JSON 解析錯誤:', error);
                throw new Error('無法解析 API 回應的 JSON 格式');
            }
        } else {
            // 如果不是 JSON 格式，按文本處理 (有助於調試)
            const text = await response.text();
            console.error('API 回應不是 JSON 格式:', text.substring(0, 200)); // 僅顯示前 200 個字符
            throw new Error('API 回應格式不正確，請檢查後端服務');
        }
    },
    
    // 獲取活動詳情
    async getEventDetail(eventId) {
        try {
            console.log(`正在獲取活動 ${eventId} 的詳情...`);
            
            const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await this.handleResponse(response);
            
            if (data.status === 200) {
                console.log('成功獲取活動詳情:', data.data);
                return data.data;
            } else {
                const errorMsg = `獲取活動詳情失敗: ${data.errorMessage || data.userMessage || '未知錯誤'}`;
                console.error(errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('API 錯誤:', error);
            throw error;
        }
    },
    
    // 獲取活動票券類型
    async getEventTickets(eventId) {
        try {
            console.log(`正在獲取活動 ${eventId} 的票券類型...`);
            
            const response = await fetch(`${BASE_URL}/api/events/${eventId}/tickets`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await this.handleResponse(response);
            
            if (data.status === 200) {
                console.log('成功獲取票券類型:', data.data);
                return data.data;
            } else {
                const errorMsg = `獲取票券類型失敗: ${data.errorMessage || data.userMessage || '未知錯誤'}`;
                console.error(errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('API 錯誤:', error);
            throw error;
        }
    },
    
    // 獲取活動圖片URL
    getEventImageUrl(eventId) {
        return `${BASE_URL}/api/events/${eventId}/image`;
    }
};

/**
 * Vue 主應用
 */
const app = Vue.createApp({
    data() {
        return {
            loading: true,
            error: null,
            eventId: null,
            eventDetail: null,
            ticketTypes: []
        };
    },
    
    computed: {
        // 獲取活動圖片URL
        eventImageUrl() {
            return this.eventId ? api.getEventImageUrl(this.eventId) : '';
        },
        
        // 格式化活動開始時間
        formattedStartTime() {
            return this.eventDetail ? utils.formatDateTime(this.eventDetail.eventFromDate) : '';
        },
        
        // 獲取活動關鍵字
        eventKeywords() {
            if (!this.eventDetail) return [];
            
            const keywords = [];
            if (this.eventDetail.keyword1) keywords.push(this.eventDetail.keyword1);
            if (this.eventDetail.keyword2) keywords.push(this.eventDetail.keyword2);
            if (this.eventDetail.keyword3) keywords.push(this.eventDetail.keyword3);
            
            return keywords;
        }
    },
    
    created() {
        // 從 URL 參數獲取活動 ID
        const params = utils.getUrlParams();
        this.eventId = params.eventId || '1'; // 默認使用 ID 為 1 的活動
        
        console.log(`初始化活動頁面，活動ID: ${this.eventId}`);
        
        // 載入活動詳情和票券類型
        this.loadEventData();
    },
    
    methods: {
        // 載入活動數據
        async loadEventData() {
            this.loading = true;
            this.error = null;
            
            try {
                console.log('從後端 API 獲取活動詳情');
                this.eventDetail = await api.getEventDetail(this.eventId);
                
                // 更新靜態麵包屑導航
                utils.updateBreadcrumb(this.eventDetail.eventName);
                
                try {
                    console.log('從後端 API 獲取票券類型');
                    this.ticketTypes = await api.getEventTickets(this.eventId);
                } catch (ticketError) {
                    console.warn('獲取票券類型失敗:', ticketError);
                    this.ticketTypes = []; // 使用空數組
                }
            } catch (error) {
                console.error('載入活動詳情失敗:', error);
                this.error = `載入活動資料失敗: ${error.message}`;
            } finally {
                this.loading = false;
            }
        },
        
        // 格式化貨幣
        formatCurrency(amount) {
            return utils.formatCurrency(amount);
        },
        
        // 重試載入數據
        retryLoading() {
            console.log('重試載入數據');
            this.loadEventData();
        }
    },
    
    template: `
        <div class="event-page">
            <!-- 載入提示 -->
            <div v-if="loading" class="loading">
                <p>資料載入中...</p>
            </div>
            
            <!-- 錯誤提示 -->
            <div v-if="error" class="error">
                <p>{{ error }}</p>
                <button @click="retryLoading" class="retry-btn">重試</button>
            </div>
            
            <!-- 活動詳情 -->
            <div v-if="!loading && !error && eventDetail" class="event-content">
                <!-- 頁面標題區塊 -->
                <h3 class="section-title">Section 1</h3>
                
                <!-- 活動橫幅 -->
                <img :src="eventImageUrl" class="event-banner" :alt="eventDetail.eventName" onerror="this.src='https://placehold.co/1000x300?text=無圖片'">
                
                <!-- 活動詳細內容 -->
                <div class="event-container">
                    <div class="event-header">
                        <h1 class="event-title">{{ eventDetail.eventName }}</h1>
                        <div class="event-category">{{ eventKeywords.join(' / ') }}</div>
                    </div>
                    
                    <div class="event-info">
                        <div class="info-item">
                            <div class="label">日期</div>
                            <div class="value">{{ formattedStartTime }}</div>
                        </div>
                        
                        <div class="info-item">
                            <div class="label">地點</div>
                            <div class="value">{{ eventDetail.place }}</div>
                        </div>
                        
                        <div class="info-item">
                            <div class="label">主辦單位</div>
                            <div class="value">{{ eventDetail.eventHost }}</div>
                        </div>
                    </div>
                    
                    <div class="event-content">
                        <h3 class="content-title">活動介紹</h3>
                        <div class="event-description">{{ eventDetail.summary }}</div>
                    </div>
                </div>
                
                <!-- 票券資訊 -->
                <div class="ticket-container">
                    <div class="ticket-header">
                        <h3 class="ticket-title">票券資訊</h3>
                    </div>
                    
                    <div v-if="ticketTypes && ticketTypes.length > 0" class="ticket-list">
                        <div v-for="ticket in ticketTypes" :key="ticket.typeId" class="ticket-item">
                            <div class="ticket-type">{{ ticket.categoryName }}</div>
                            <div class="ticket-price">{{ formatCurrency(ticket.price) }}</div>
                        </div>
                    </div>
                    <div v-else class="no-tickets">
                        <p>暫無票券資訊</p>
                    </div>
                    
                    <button class="purchase-btn" :disabled="!ticketTypes || ticketTypes.length === 0">立即購票</button>
                </div>
            </div>
        </div>
    `
});

// 掛載應用
document.addEventListener('DOMContentLoaded', () => {
    // 掛載主應用
    app.mount('.main-content');
    console.log('TickEasy 應用已成功掛載');
});