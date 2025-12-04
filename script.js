class CountdownApp {
    constructor() {
        this.countdownInterval = null;
        this.targetDate = null;
        
        // DOM Elements
        this.targetDateInput = document.getElementById('target-date');
        this.targetTimeInput = document.getElementById('target-time');
        this.countdownTitleInput = document.getElementById('countdown-title');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.copyLinkBtn = document.getElementById('copy-link');
        this.saveLocalBtn = document.getElementById('save-local');
        
        // Countdown display elements
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.progressBar = document.getElementById('progress-bar');
        this.targetDatetimeDisplay = document.getElementById('target-datetime-display');
        this.timeRemainingDisplay = document.getElementById('time-remaining');
        this.currentCountdownTitle = document.getElementById('current-countdown-title');
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        this.targetDateInput.min = today;
        
        // Set default time to next hour
        const nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        this.targetDateInput.value = today;
        this.targetTimeInput.value = nextHour.toTimeString().substring(0, 5);
        
        // Load saved countdown from localStorage
        this.loadSavedCountdown();
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startCountdown());
        this.resetBtn.addEventListener('click', () => this.resetCountdown());
        this.copyLinkBtn.addEventListener('click', () => this.copyShareLink());
        this.saveLocalBtn.addEventListener('click', () => this.saveToLocalStorage());
        
        // Update URL with countdown parameters
        this.updateURLWithParams();
    }
    
    startCountdown() {
        // Get target date and time
        const dateValue = this.targetDateInput.value;
        const timeValue = this.targetTimeInput.value;
        const title = this.countdownTitleInput.value || 'Đếm ngược đến sự kiện';
        
        if (!dateValue || !timeValue) {
            this.showToast('Vui lòng chọn ngày và giờ đích!', 'error');
            return;
        }
        
        // Create target date
        const targetDateTime = new Date(`${dateValue}T${timeValue}`);
        const now = new Date();
        
        // Validate target date is in the future
        if (targetDateTime <= now) {
            this.showToast('Thời gian đích phải trong tương lai!', 'error');
            return;
        }
        
        this.targetDate = targetDateTime;
        this.currentCountdownTitle.textContent = title;
        
        // Update display
        this.updateCountdownDisplay();
        
        // Start countdown interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        this.countdownInterval = setInterval(() => {
            this.updateCountdownDisplay();
        }, 1000);
        
        // Update URL
        this.updateURLWithParams();
        
        this.showToast('Bộ đếm ngược đã bắt đầu!', 'success');
    }
    
    updateCountdownDisplay() {
        if (!this.targetDate) return;
        
        const now = new Date();
        const timeDiff = this.targetDate.getTime() - now.getTime();
        
        // If countdown is finished
        if (timeDiff <= 0) {
            this.daysElement.textContent = '00';
            this.hoursElement.textContent = '00';
            this.minutesElement.textContent = '00';
            this.secondsElement.textContent = '00';
            this.progressBar.style.width = '100%';
            this.timeRemainingDisplay.textContent = 'Đã kết thúc!';
            
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
            }
            
            // Show celebration effect
            this.celebrateCompletion();
            return;
        }
        
        // Calculate time units
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        // Update display
        this.daysElement.textContent = days.toString().padStart(2, '0');
        this.hoursElement.textContent = hours.toString().padStart(2, '0');
        this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        this.secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Update progress bar
        const totalDuration = this.targetDate.getTime() - (this.targetDate.getTime() - timeDiff);
        const elapsed = totalDuration - timeDiff;
        const progressPercentage = (elapsed / totalDuration) * 100;
        this.progressBar.style.width = `${Math.min(progressPercentage, 100)}%`;
        
        // Update target datetime display
        const targetFormatted = this.targetDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.targetDatetimeDisplay.textContent = targetFormatted;
        
        // Update time remaining text
        const timeRemainingText = `${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây`;
        this.timeRemainingDisplay.textContent = timeRemainingText;
    }
    
    celebrateCompletion() {
        // Add celebration class to countdown display
        const countdownDisplay = document.querySelector('.countdown-display');
        countdownDisplay.classList.add('celebrate');
        
        // Remove class after animation
        setTimeout(() => {
            countdownDisplay.classList.remove('celebrate');
        }, 3000);
        
        // Show completion message
        this.showToast('Đếm ngược đã hoàn thành! 🎉', 'success');
    }
    
    resetCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        // Reset to default values
        const today = new Date().toISOString().split('T')[0];
        const nextHour = new Date();
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        
        this.targetDateInput.value = today;
        this.targetTimeInput.value = nextHour.toTimeString().substring(0, 5);
        this.countdownTitleInput.value = 'Đếm ngược đến sự kiện';
        
        // Reset display
        this.daysElement.textContent = '00';
        this.hoursElement.textContent = '00';
        this.minutesElement.textContent = '00';
        this.secondsElement.textContent = '00';
        this.progressBar.style.width = '0%';
        this.targetDatetimeDisplay.textContent = '--/--/---- --:--:--';
        this.timeRemainingDisplay.textContent = '--';
        this.currentCountdownTitle.textContent = 'Đếm ngược đến sự kiện';
        
        // Clear URL parameters
        history.replaceState({}, document.title, window.location.pathname);
        
        this.showToast('Đã đặt lại bộ đếm ngược!', 'info');
    }
    
    copyShareLink() {
        if (!this.targetDate) {
            this.showToast('Chưa có bộ đếm ngược để chia sẻ!', 'error');
            return;
        }
        
        // Create shareable URL with parameters
        const params = new URLSearchParams();
        params.set('date', this.targetDateInput.value);
        params.set('time', this.targetTimeInput.value);
        params.set('title', encodeURIComponent(this.countdownTitleInput.value));
        
        const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showToast('Đã sao chép liên kết chia sẻ!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Đã sao chép liên kết chia sẻ!', 'success');
        });
    }
    
    saveToLocalStorage() {
        if (!this.targetDate) {
            this.showToast('Chưa có bộ đếm ngược để lưu!', 'error');
            return;
        }
        
        const countdownData = {
            date: this.targetDateInput.value,
            time: this.targetTimeInput.value,
            title: this.countdownTitleInput.value,
            targetTimestamp: this.targetDate.getTime()
        };
        
        localStorage.setItem('countdownAppData', JSON.stringify(countdownData));
        this.showToast('Đã lưu bộ đếm ngược!', 'success');
    }
    
    loadSavedCountdown() {
        try {
            const savedData = localStorage.getItem('countdownAppData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Check if saved countdown is still in the future
                const now = new Date().getTime();
                if (data.targetTimestamp > now) {
                    this.targetDateInput.value = data.date;
                    this.targetTimeInput.value = data.time;
                    this.countdownTitleInput.value = data.title;
                    
                    // Auto-start the countdown
                    setTimeout(() => {
                        this.startCountdown();
                    }, 500);
                }
            }
        } catch (e) {
            console.log('Không thể load dữ liệu đã lưu');
        }
    }
    
    updateURLWithParams() {
        if (!this.targetDate) return;
        
        const params = new URLSearchParams();
        params.set('date', this.targetDateInput.value);
        params.set('time', this.targetTimeInput.value);
        params.set('title', encodeURIComponent(this.countdownTitleInput.value));
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        history.replaceState({}, '', newUrl);
    }
    
    loadFromURLParams() {
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get('date');
        const timeParam = params.get('time');
        const titleParam = params.get('title');
        
        if (dateParam && timeParam) {
            this.targetDateInput.value = dateParam;
            this.targetTimeInput.value = timeParam;
            
            if (titleParam) {
                this.countdownTitleInput.value = decodeURIComponent(titleParam);
            }
            
            // Auto-start the countdown
            setTimeout(() => {
                this.startCountdown();
            }, 1000);
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        
        // Set color based on type
        if (type === 'success') {
            toast.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            toast.style.backgroundColor = '#ef4444';
        } else if (type === 'info') {
            toast.style.backgroundColor = '#3b82f6';
        }
        
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CountdownApp();
    
    // Also check for URL parameters
    app.loadFromURLParams();
    
    // Add celebration animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebrate {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .celebrate .time-unit {
            animation: celebrate 0.5s ease-in-out 3;
        }
        
        .celebrate .number {
            color: #fbbf24;
            text-shadow: 0 0 20px #fbbf24;
        }
    `;
    document.head.appendChild(style);
});