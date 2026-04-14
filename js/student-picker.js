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
    if (typeof stopSelectionSound === 'function') stopSelectionSound();

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

// =================================
// 蒸氣龐克音效系統 (Web Audio API)
// =================================
let audioCtx = null;
let suspenseOscillator1 = null;
let suspenseOscillator2 = null;
let suspenseGain = null;
let suspenseInterval = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

/**
 * 播放選擇音效（緊張感時鐘/齒輪聲）
 */
function playSelectionSound() {
    console.log('🔊 播放選擇音效');
    if (!pickerState.audioEnabled) return;
    initAudioContext();
    
    // 產生規律的齒輪/時鐘滴答聲，越來越快，音量更大
    let tickSpeed = 250;
    
    const playTick = () => {
        if (!pickerState.isSelecting) {
            clearTimeout(suspenseInterval);
            return;
        }
        
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'square';
        osc2.type = 'sawtooth';
        
        // 更尖銳、更響亮的機械滴答聲
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        osc2.frequency.setValueAtTime(150, audioCtx.currentTime);
        
        // 音量推至極限
        gain.gain.setValueAtTime(1.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc2.start();
        osc.stop(audioCtx.currentTime + 0.15);
        osc2.stop(audioCtx.currentTime + 0.15);
        
        // 加速，製造更強的緊張感
        if (tickSpeed > 40) {
            tickSpeed -= 15;
        }
        
        suspenseInterval = setTimeout(playTick, tickSpeed);
    };
    
    playTick();
    
    // 背景持續低鳴（蒸汽鍋爐壓力聲），音量和頻率不斷上升
    suspenseOscillator1 = audioCtx.createOscillator();
    suspenseOscillator2 = audioCtx.createOscillator();
    suspenseGain = audioCtx.createGain();
    
    suspenseOscillator1.type = 'sawtooth';
    suspenseOscillator1.frequency.setValueAtTime(50, audioCtx.currentTime);
    suspenseOscillator1.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 3);
    
    suspenseOscillator2.type = 'square';
    suspenseOscillator2.frequency.setValueAtTime(51, audioCtx.currentTime); // 微微失調產生嗡嗡聲
    suspenseOscillator2.frequency.linearRampToValueAtTime(122, audioCtx.currentTime + 3);
    
    // 逐漸變大聲，極具壓迫感
    suspenseGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    suspenseGain.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 3);
    
    suspenseOscillator1.connect(suspenseGain);
    suspenseOscillator2.connect(suspenseGain);
    suspenseGain.connect(audioCtx.destination);
    
    suspenseOscillator1.start();
    suspenseOscillator2.start();
}

/**
 * 停止選擇音效
 */
function stopSelectionSound() {
    if (suspenseInterval) clearTimeout(suspenseInterval);
    if (suspenseGain && audioCtx) {
        try {
            suspenseGain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            if (suspenseOscillator1) suspenseOscillator1.stop(audioCtx.currentTime + 0.2);
            if (suspenseOscillator2) suspenseOscillator2.stop(audioCtx.currentTime + 0.2);
        } catch (e) {}
    }
}

/**
 * 播放完成音效（巨大蒸汽汽笛與銅鐘聲）
 */
function playCompleteSound() {
    console.log('🔊 播放完成音效');
    stopSelectionSound();
    
    if (!pickerState.audioEnabled) return;
    initAudioContext();
    
    const duration = 3.0;
    
    // 銅鐘主音 - 非常響亮
    const bellOsc1 = audioCtx.createOscillator();
    const bellOsc2 = audioCtx.createOscillator();
    const bellGain = audioCtx.createGain();
    
    bellOsc1.type = 'sine';
    bellOsc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    bellOsc2.type = 'triangle';
    bellOsc2.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6
    
    bellGain.gain.setValueAtTime(2.0, audioCtx.currentTime); // 過載音量
    bellGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    bellOsc1.connect(bellGain);
    bellOsc2.connect(bellGain);
    bellGain.connect(audioCtx.destination);
    
    // 蒸汽汽笛聲 (和弦)
    const whistleGain = audioCtx.createGain();
    whistleGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    whistleGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration - 1.0);
    
    const frequencies = [349.23, 440.00, 659.25]; // F4, A4, E5 華麗的和弦
    const whistles = frequencies.map(freq => {
        const osc = audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.connect(whistleGain);
        return osc;
    });
    
    whistleGain.connect(audioCtx.destination);
    
    // 啟動所有音源
    bellOsc1.start();
    bellOsc2.start();
    whistles.forEach(osc => osc.start());
    
    bellOsc1.stop(audioCtx.currentTime + duration);
    bellOsc2.stop(audioCtx.currentTime + duration);
    whistles.forEach(osc => osc.stop(audioCtx.currentTime + duration - 1.0));
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
