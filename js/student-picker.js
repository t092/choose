// =================================
// 學生選人系統
// Student Picker System
// =================================

// 選人系統狀態
let pickerState = {
    studentData: [],
    selectedStudents: new Set(),
    isSelecting: false,
    selectionSpeed: 100, // 選擇動畫速度（毫秒）
    audioEnabled: true,
    preselectionCount: 15 // 預選循環次數
};

/**
 * 初始化選人系統
 * @param {Array} studentData - 學生數據
 */
function initializeStudentPicker(studentData) {
    if (!studentData || studentData.length === 0) {
        console.error('學生數據無效');
        return;
    }

    pickerState.studentData = [...studentData];
    pickerState.selectedStudents.clear();
    pickerState.isSelecting = false;

    updateStatistics();
    console.log('選人系統初始化完成', `共 ${studentData.length} 名學生`);
}

/**
 * 開始選人
 */
function startSelection() {
    if (pickerState.isSelecting) {
        console.log('選人進行中，請稍後...');
        return;
    }

    // 檢查是否所有學生都被選過
    if (pickerState.selectedStudents.size >= pickerState.studentData.length) {
        alert('所有學生都已經被選過了！\n\n請點擊「重置選人狀態」來重新開始。');
        return;
    }

    pickerState.isSelecting = true;

    // 禁用按鈕並更新狀態
    const button = document.getElementById('selectButton');
    const statusElement = document.getElementById('selectionStatus');
    
    if (button) {
        button.disabled = true;
        button.textContent = '⚙️ 選擇中... ⚙️';
    }
    
    if (statusElement) {
        statusElement.textContent = '選擇中...';
        statusElement.style.color = '#ffd700';
    }

    // 播放音效（如果啟用）
    if (pickerState.audioEnabled) {
        playSelectionSound();
    }

    // 開始預選動畫
    startPreselectionAnimation();
}

/**
 * 預選動畫循環
 */
function startPreselectionAnimation() {
    const unselectedStudents = getUnselectedStudents();
    
    if (unselectedStudents.length === 0) {
        console.error('沒有未選中的學生');
        completeSelection(null);
        return;
    }

    let preselectionIndex = 0;
    const preselectionInterval = setInterval(() => {
        // 清除之前的高亮
        clearAllHighlights();

        // 隨機選擇一個未選中的學生進行高亮
        const randomStudent = unselectedStudents[Math.floor(Math.random() * unselectedStudents.length)];
        highlightStudent(randomStudent.seat, pickerState.selectionSpeed);

        // 更新結果顯示
        updateResultDisplay(randomStudent, true);

        preselectionIndex++;

        // 達到預選次數後停止
        if (preselectionIndex >= pickerState.preselectionCount) {
            clearInterval(preselectionInterval);
            
            // 最終選擇
            setTimeout(() => {
                const finalStudent = selectFinalStudent(unselectedStudents);
                completeSelection(finalStudent);
            }, pickerState.selectionSpeed);
        }
    }, pickerState.selectionSpeed);
}

/**
 * 清除所有高亮
 */
function clearAllHighlights() {
    const items = document.querySelectorAll('.student-cloud-item');
    items.forEach(item => {
        item.classList.remove('highlighted');
    });
}

/**
 * 獲取未選中的學生列表
 */
function getUnselectedStudents() {
    return pickerState.studentData.filter(student => 
        !pickerState.selectedStudents.has(student.seat)
    );
}

/**
 * 選擇最終學生
 */
function selectFinalStudent(unselectedStudents) {
    const finalIndex = Math.floor(Math.random() * unselectedStudents.length);
    return unselectedStudents[finalIndex];
}

/**
 * 完成選擇
 */
function completeSelection(selectedStudent) {
    if (!selectedStudent) {
        pickerState.isSelecting = false;
        return;
    }

    // 標記為已選中
    pickerState.selectedStudents.add(selectedStudent.seat);
    markStudentAsSelected(selectedStudent.seat);

    // 更新UI
    updateResultDisplay(selectedStudent, false);
    updateStatistics();

    // 播放完成音效
    if (pickerState.audioEnabled) {
        playCompleteSound();
    }

    // 延遲重置按鈕狀態
    setTimeout(() => {
        pickerState.isSelecting = false;
        
        const button = document.getElementById('selectButton');
        const statusElement = document.getElementById('selectionStatus');
        
        if (button) {
            button.disabled = false;
            button.textContent = '⚙️ 開始選人 ⚙️';
        }
        
        if (statusElement) {
            statusElement.textContent = '待命中';
            statusElement.style.color = '';
        }
    }, 500);

    console.log(`選中學生: ${selectedStudent.seat} - ${selectedStudent.name}`);
}

/**
 * 更新結果顯示
 * @param {Object} student - 學生數據
 * @param {boolean} isPreselection - 是否為預選階段
 */
function updateResultDisplay(student, isPreselection) {
    const resultElement = document.getElementById('resultDisplay');
    if (!resultElement || !student) return;

    if (isPreselection) {
        resultElement.innerHTML = `
            <span class="seat">${student.seat}</span>
            <span class="name" style="opacity: 0.6;">${student.name}</span>
        `;
    } else {
        resultElement.innerHTML = `
            <span class="seat">${student.seat}</span>
            <span class="name">${student.name}</span>
        `;
    }
}

/**
 * 更新統計數據
 */
function updateStatistics() {
    const totalElement = document.getElementById('totalStudents');
    const selectedElement = document.getElementById('selectedCount');
    const remainingElement = document.getElementById('remainingCount');

    if (totalElement) {
        totalElement.textContent = pickerState.studentData.length;
    }

    if (selectedElement) {
        selectedElement.textContent = pickerState.selectedStudents.size;
    }

    if (remainingElement) {
        const remaining = pickerState.studentData.length - pickerState.selectedStudents.size;
        remainingElement.textContent = remaining;
    }
}

/**
 * 音效初始化
 */
function initializeAudio() {
    // 音效初始化（實際音檔載入時啟用）
    console.log('音效系統初始化');
    
    // 檢查並設置預設音效狀態
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        pickerState.audioEnabled = audioToggle.classList.contains('active');
    }
}

/**
 * 切換音效開關
 */
function toggleAudio() {
    const audioToggle = document.getElementById('audioToggle');
    if (!audioToggle) return;

    pickerState.audioEnabled = !pickerState.audioEnabled;
    
    if (pickerState.audioEnabled) {
        audioToggle.classList.add('active');
    } else {
        audioToggle.classList.remove('active');
    }

    console.log(`音效狀態: ${pickerState.audioEnabled ? '開啟' : '關閉'}`);
}

/**
 * 播放選擇音效（模擬）
 */
function playSelectionSound() {
    console.log('🔊 播放選擇音效');
}

/**
 * 播放完成音效（模擬）
 */
function playCompleteSound() {
    console.log('🔊 播放完成音效');
}

/**
 * 重置選人狀態
 */
function resetSelectionState() {
    if (pickerState.isSelecting) {
        alert('選人進行中，請稍後再重置！');
        return;
    }

    if (confirm('確定要重置所有選人狀態嗎？')) {
        pickerState.selectedStudents.clear();
        
        // 重置所有學生的選中狀態
        resetAllStudents();
        
        // 更新統計數據
        updateStatistics();
        
        // 清空結果顯示
        const resultElement = document.getElementById('resultDisplay');
        if (resultElement) {
            resultElement.innerHTML = '<span style="color: var(--steam-gray); font-size: 1.2rem;">等待選擇...</span>';
        }

        console.log('選人狀態已重置');
    }
}

// 導出函數（供其他JS檔案使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeStudentPicker,
        startSelection,
        resetSelectionState,
        initializeAudio,
        toggleAudio
    };
}
