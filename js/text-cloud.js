// =================================
// 文字雲動畫系統
// Text Cloud Animation System
// =================================

// 儲存文字雲實例
const textCloudInstances = new Map();

/**
 * 初始化文字雲
 * @param {HTMLElement} container - 容器元素
 * @param {Array} studentData - 學生數據數組
 */
function initializeTextCloud(container, studentData) {
    if (!container || !studentData) {
        console.error('文字雲初始化參數錯誤');
        return;
    }

    // 清空容器
    container.innerHTML = '';

    // 為每個學生創建文字雲元素
    studentData.forEach((student, index) => {
        createStudentCloudElement(container, student, index);
    });

    // 添加隨機位置
    randomizeCloudPositions(container);

    // 啟動動畫
    startCloudAnimation(container);

    console.log(`文字雲初始化完成，共 ${studentData.length} 個學生`);
}

/**
 * 創建學生文字雲元素
 */
function createStudentCloudElement(container, student, index) {
    const element = document.createElement('div');
    element.className = 'student-cloud-item';
    element.id = `student-${student.seat}`;
    
    // 設置內容
    element.innerHTML = `
        <span class="seat-number">${student.seat}</span>
        <span class="student-name">${student.name}</span>
    `;
    
    // 設置隨機初始位置（之後會被 randomizeCloudPositions 覆蓋）
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.opacity = '0';
    
    // 添加到容器
    container.appendChild(element);
    
    // 存儲學生數據
    element.dataset.seat = student.seat;
    element.dataset.name = student.name;
    element.dataset.selected = 'false';
}

/**
 * 隨機化文字雲位置
 */
function randomizeCloudPositions(container) {
    const items = container.querySelectorAll('.student-cloud-item');
    const containerWidth = container.offsetWidth || 800;
    const containerHeight = container.offsetHeight || 450;
    
    items.forEach((item, index) => {
        // 計算可用空間（考慮元素尺寸）
        const itemWidth = item.offsetWidth || 120;
        const itemHeight = item.offsetHeight || 40;
        
        const maxX = Math.max(0, containerWidth - itemWidth - 40);
        const maxY = Math.max(0, containerHeight - itemHeight - 40);
        
        // 生成隨機位置
        const randomX = Math.random() * maxX + 20;
        const randomY = Math.random() * maxY + 20;
        
        // 設置位置
        item.style.left = `${randomX}px`;
        item.style.top = `${randomY}px`;
        
        // 淡入動畫
        setTimeout(() => {
            item.style.transition = 'opacity 0.8s ease';
            item.style.opacity = '1';
        }, index * 50);
    });
}

/**
 * 啟動文字雲動畫
 */
function startCloudAnimation(container) {
    const items = container.querySelectorAll('.student-cloud-item');
    
    items.forEach((item, index) => {
        // 添加漂移動畫
        setInterval(() => {
            if (item.dataset.selected === 'true') return; // 已選中的不動畫
            
            driftAnimation(item, container);
        }, 3000 + (index * 200));
    });
}

/**
 * 漂移動畫
 */
function driftAnimation(element, container) {
    const currentX = parseFloat(element.style.left) || 0;
    const currentY = parseFloat(element.style.top) || 0;
    
    const containerWidth = container.offsetWidth || 800;
    const containerHeight = container.offsetHeight || 450;
    const elementWidth = element.offsetWidth || 120;
    const elementHeight = element.offsetHeight || 40;
    
    // 計算新位置（小範圍移動）
    const maxDelta = 30;
    const newX = Math.max(20, Math.min(
        currentX + (Math.random() - 0.5) * maxDelta,
        containerWidth - elementWidth - 20
    ));
    const newY = Math.max(20, Math.min(
        currentY + (Math.random() - 0.5) * maxDelta,
        containerHeight - elementHeight - 20
    ));
    
    // 執行動畫
    element.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;
}

/**
 * 高亮顯示學生
 * @param {string} seatNumber - 座位號
 * @param {number} duration - 高亮時長（毫秒）
 */
function highlightStudent(seatNumber, duration = 2000) {
    const element = document.getElementById(`student-${seatNumber}`);
    if (!element) return;
    
    element.classList.add('highlighted');
    
    setTimeout(() => {
        element.classList.remove('highlighted');
    }, duration);
}

/**
 * 標記學生為已選中
 * @param {string} seatNumber - 座位號
 */
function markStudentAsSelected(seatNumber) {
    const element = document.getElementById(`student-${seatNumber}`);
    if (!element) return;
    
    // 移除高亮
    element.classList.remove('highlighted');
    
    // 添加選中樣式
    element.classList.add('selected');
    element.dataset.selected = 'true';
    
    // 停止動畫
    element.style.transition = 'none';
}

/**
 * 重置所有學生狀態
 */
function resetAllStudents() {
    const items = document.querySelectorAll('.student-cloud-item');
    
    items.forEach(item => {
        item.classList.remove('highlighted', 'selected');
        item.dataset.selected = 'false';
        item.style.transition = 'opacity 0.5s ease';
        item.style.opacity = '1';
    });
    
    console.log('所有學生狀態已重置');
}

/**
 * 重置單個學生狀態
 * @param {string} seatNumber - 座位號
 */
function resetStudent(seatNumber) {
    const element = document.getElementById(`student-${seatNumber}`);
    if (!element) return;
    
    element.classList.remove('highlighted', 'selected');
    element.dataset.selected = 'false';
    element.style.transition = 'opacity 0.5s ease';
    element.style.opacity = '1';
}

// 導出函數（供其他JS檔案使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTextCloud,
        highlightStudent,
        markStudentAsSelected,
        resetAllStudents,
        resetStudent
    };
}
