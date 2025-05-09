/**
 * 活動詳情頁面 Vue 應用
 * 使用 Vue 3 Options API 實現
 * 使用 Fetch API 進行後端通信
 */

// 基礎 API URL (實際使用時需要設定正確的路徑)
const API_BASE_URL = 'http://localhost:8080/maven-tickeasy-v1/api';

// 創建 Vue 應用
const app = Vue.createApp({
    // 資料
    data() {
        return {
            // 活動ID (從 URL 參數中獲取)
            eventId: null,
            // 活動詳情
            event: null,
            // 票券類型列表
            ticketTypes: [],
            // 加載狀態
            loading: true,
            // 錯誤訊息
            error: null,
            // 用戶登錄狀態
            isLoggedIn: false,
            // 用戶ID
            memberId: null
        };
    },

    // 計算屬性
    computed: {
        // 活動圖片 URL
        eventImageUrl() {
            if (!this.event) return '';
            return `${API_BASE_URL}/events/${this.event.eventId}/image`;
        },
        // 是否有可購買的票券
        hasAvailableTickets() {
            if (!this.ticketTypes || this.ticketTypes.length === 0) return false;
            
            // 檢查是否有任何票券剩餘且當前時間在售票期間內
            const now = new Date();
            
            return this.ticketTypes.some(ticket => {
                const sellFromTime = new Date(ticket.sellFromTime);
                const sellToTime = new Date(ticket.sellToTime);
                return ticket.remainingTickets > 0 && now >= sellFromTime && now <= sellToTime;
            });
        }
    },

    // 方法
    methods: {
        // 獲取活動詳情資料
        async fetchEventData() {
            this.loading = true;
            this.error = null;
            
            try {
                // 獲取活動詳情
                const eventResponse = await fetch(`${API_BASE_URL}/events/${this.eventId}`);
                const eventData = await eventResponse.json();
                
                if (eventResponse.ok && eventData.status === 200) {
                    this.event = eventData.data;
                    
                    // 獲取票券類型
                    const ticketResponse = await fetch(`${API_BASE_URL}/events/${this.eventId}/tickets`);
                    const ticketData = await ticketResponse.json();
                    
                    if (ticketResponse.ok && ticketData.status === 200) {
                        this.ticketTypes = ticketData.data;
                    } else {
                        console.warn('無法獲取票券信息:', ticketData.errorMessage);
                        this.ticketTypes = [];
                    }
                } else {
                    this.error = eventData.userMessage || '無法獲取活動詳情';
                }
            } catch (err) {
                console.error('獲取活動資料時發生錯誤:', err);
                this.error = '網絡錯誤，請檢查您的網絡連接';
            } finally {
                this.loading = false;
            }
        },
        
        // 切換關注狀態
        async toggleFavorite() {
            // 檢查用戶是否已登入
            if (!this.isLoggedIn) {
                alert('請先登入才能關注活動');
                return;
            }
            
            try {
                // 切換關注狀態 (1: 關注, 0: 取消關注)
                const newStatus = this.event.isFollowed === 1 ? 0 : 1;
                
                const response = await fetch(`${API_BASE_URL}/events/${this.eventId}/favorite?isFollowed=${newStatus}`, {
                    method: 'POST',
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                if (response.ok && data.status === 200) {
                    // 更新前端顯示
                    this.event.isFollowed = newStatus;
                    
                    // 顯示成功訊息
                    const message = newStatus === 1 ? '已成功加入我的關注!' : '已取消關注';
                    alert(message);
                } else {
                    // 處理錯誤
                    alert(data.userMessage || '操作失敗，請稍後再試');
                }
            } catch (err) {
                console.error('切換關注狀態時發生錯誤:', err);
                alert('網絡錯誤，請稍後再試');
            }
        },
        
        // 處理購票按鈕點擊
        handleBookingClick() {
            if (!this.hasAvailableTickets) return;
            
            // 檢查用戶是否已登入
            if (!this.isLoggedIn) {
                if (confirm('請先登入才能購票。是否前往登入頁面？')) {
                    // 導向登入頁面，並設置回調頁面
                    window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`;
                }
                return;
            }
            
            // 這裡可以直接導向到購票頁面或是開啟購票表單
            alert('此功能尚未實現，敬請期待！');
        },
        
        // 格式化日期 (完整格式)
        formatDate(dateString) {
            if (!dateString) return '';
            
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        },
        
        // 格式化日期 (短格式)
        formatDateShort(dateString) {
            if (!dateString) return '';
            
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(date);
        },
        
        // 格式化價格
        formatPrice(price) {
            return price.toLocaleString('zh-TW');
        },
        
        // 檢查用戶登錄狀態
        checkLoginStatus() {
            // 從 sessionStorage 或 cookie 中獲取用戶資訊
            // 實際專案中應該從後端驗證 session
            try {
                // 檢查 session 中是否有 memberId
                const memberId = this.getCookie('memberId') || sessionStorage.getItem('memberId');
                if (memberId) {
                    this.isLoggedIn = true;
                    this.memberId = parseInt(memberId, 10);
                }
            } catch (err) {
                console.error('檢查登錄狀態時發生錯誤:', err);
            }
        },
        
        // 獲取 Cookie 值
        getCookie(name) {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
        }
    },
    
    // 生命週期鉤子
    created() {
        // 從 URL 獲取活動 ID
        const urlParams = new URLSearchParams(window.location.search);
        this.eventId = urlParams.get('eventId');
        
        // 如果沒有提供活動 ID，使用預設值或提示錯誤
        if (!this.eventId) {
            console.warn('未提供活動 ID，使用預設值');
            this.eventId = 1; // 使用預設 ID 或顯示錯誤訊息
            // this.error = '未提供活動 ID';
            // return;
        }
        
        // 檢查用戶登錄狀態
        this.checkLoginStatus();
        
        // 獲取活動資料
        this.fetchEventData();
    }
});

// 掛載應用
app.mount('#app');