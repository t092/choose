// =================================
// 學生名單管理系統
// Student Manager System
// =================================

/**
 * 從 localStorage 讀取班級資料
 */
function getClassDataFromStorage(classId) {
    const key = `steampunk_class_${classId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

/**
 * 將班級資料儲存到 localStorage
 */
function saveClassDataToStorage(classId, className, students) {
    const key = `steampunk_class_${classId}`;
    const data = {
        classId: classId,
        className: className,
        students: students,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`已儲存 ${className} 資料：`, students.length, '位學生');
}

/**
 * 清除班級資料
 */
function clearClassDataFromStorage(classId) {
    const key = `steampunk_class_${classId}`;
    localStorage.removeItem(key);
    console.log(`已清除 ${classId} 的自訂資料`);
}

/**
 * 檢查是否有自訂資料
 */
function hasCustomClassData(classId) {
    const key = `steampunk_class_${classId}`;
    return localStorage.getItem(key) !== null;
}

/**
 * 取得或初始化學生資料
 * 優先使用 localStorage 中的資料，如果沒有則使用預設資料
 */
function getStudentData(classId, className, defaultStudents) {
    // 嘗試從 localStorage 讀取
    const stored = getClassDataFromStorage(classId);
    
    if (stored && stored.students && stored.students.length > 0) {
        console.log(`使用儲存的 ${className} 資料`);
        return {
            className: stored.className || className,
            students: stored.students
        };
    }
    
    // 沒有儲存資料，使用預設
    console.log(`使用預設 ${className} 資料`);
    return {
        className: className,
        students: defaultStudents
    };
}

/**
 * 開啟管理員對話框
 */
function openStudentManager(classId, className, students, onSaveCallback) {
    const modal = document.createElement('div');
    modal.id = 'studentManagerModal';
    modal.className = 'student-manager-modal';
    
    // 建立學生列表 HTML
    const studentListHtml = students.map((s, index) => `
        <div class="student-row" data-index="${index}">
            <span class="student-seat">${s.seat}</span>
            <span class="student-name-display">${s.name}</span>
            <div class="student-actions">
                <button class="btn-edit" onclick="editStudent(${index})">編輯</button>
                <button class="btn-delete" onclick="deleteStudent(${index})">刪除</button>
            </div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeStudentManager()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>📋 ${className} - 學生名單管理</h2>
                <button class="modal-close" onclick="closeStudentManager()">×</button>
            </div>
            
            <div class="modal-body">
                <div class="manager-toolbar">
                    <button class="btn-add" onclick="addStudent()">➕ 新增學生</button>
                    <button class="btn-save" onclick="saveStudentData()">💾 儲存變更</button>
                    <button class="btn-reset" onclick="resetToDefault()">🔄 還原預設</button>
                </div>
                
                <div class="student-list">
                    ${studentListHtml}
                </div>
                
                <div class="student-count">
                    總共 <strong id="studentCount">${students.length}</strong> 位學生
                </div>
            </div>
        </div>
        
        <!-- 編輯/新增對話框 -->
        <div id="editModal" class="edit-modal" style="display:none;">
            <div class="modal-overlay" onclick="closeEditModal()"></div>
            <div class="modal-content small">
                <div class="modal-header">
                    <h2 id="editModalTitle">編輯學生</h2>
                    <button class="modal-close" onclick="closeEditModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>座號</label>
                        <input type="text" id="editSeat" placeholder="例如：01" />
                    </div>
                    <div class="form-group">
                        <label>姓名</label>
                        <input type="text" id="editName" placeholder="例如：王小明" />
                    </div>
                    <div class="form-actions">
                        <button class="btn-cancel" onclick="closeEditModal()">取消</button>
                        <button class="btn-confirm" onclick="confirmEdit()">確定</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 儲存回調函數和當前狀態
    modal.dataset.classId = classId;
    modal.dataset.className = className;
    modal.currentStudents = [...students]; // 複製一份
    modal.onSave = onSaveCallback;
    
    // 綁定按鍵事件
    modal.querySelector('.btn-add').onclick = () => addStudent();
    modal.querySelector('.btn-save').onclick = () => saveStudentData(classId, className, modal);
    modal.querySelector('.btn-reset').onclick = () => resetToDefault(classId, className);
}

/**
 * 關閉管理員對話框
 */
function closeStudentManager() {
    const modal = document.getElementById('studentManagerModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * 新增學生
 */
function addStudent() {
    const modal = document.getElementById('studentManagerModal');
    const newIndex = modal.currentStudents.length + 1;
    
    modal.currentStudents.push({
        seat: String(newIndex).padStart(2, '0'),
        name: '新學生'
    });
    
    refreshStudentList(modal);
}

/**
 * 編輯學生
 */
function editStudent(index) {
    const modal = document.getElementById('studentManagerModal');
    const student = modal.currentStudents[index];
    
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'block';
    editModal.dataset.editIndex = index;
    
    document.getElementById('editSeat').value = student.seat;
    document.getElementById('editName').value = student.name;
    document.getElementById('editModalTitle').textContent = '編輯學生';
}

/**
 * 刪除學生
 */
function deleteStudent(index) {
    const modal = document.getElementById('studentManagerModal');
    const student = modal.currentStudents[index];
    
    if (confirm(`確定要刪除 "${student.seat} ${student.name}" 嗎？`)) {
        modal.currentStudents.splice(index, 1);
        refreshStudentList(modal);
    }
}

/**
 * 刷新學生列表
 */
function refreshStudentList(modal) {
    const studentList = modal.querySelector('.student-list');
    const students = modal.currentStudents;
    
    studentList.innerHTML = students.map((s, index) => `
        <div class="student-row" data-index="${index}">
            <span class="student-seat">${s.seat}</span>
            <span class="student-name-display">${s.name}</span>
            <div class="student-actions">
                <button class="btn-edit" onclick="editStudent(${index})">編輯</button>
                <button class="btn-delete" onclick="deleteStudent(${index})">刪除</button>
            </div>
        </div>
    `).join('');
    
    // 更新計數
    document.getElementById('studentCount').textContent = students.length;
}

/**
 * 儲存資料
 */
function saveStudentData(classId, className, modal) {
    const students = modal.currentStudents;
    
    // 儲存到 localStorage
    saveClassDataToStorage(classId, className, students);
    
    // 更新頁面上的資料
    if (modal.onSave) {
        modal.onSave(students);
    }
    
    alert(`已儲存 ${className} 的 ${students.length} 位學生資料！`);
    closeStudentManager();
}

/**
 * 還原為預設值
 */
function resetToDefault(classId, className) {
    if (confirm(`確定要還原 ${className} 為預設資料嗎？\n\n所有自訂變更將被還原！`)) {
        clearClassDataFromStorage(classId);
        location.reload(); // 重新載入頁面
    }
}

/**
 * 關閉編輯對話框
 */
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

/**
 * 確認編輯
 */
function confirmEdit() {
    const modal = document.getElementById('studentManagerModal');
    const editModal = document.getElementById('editModal');
    const index = editModal.dataset.editIndex;
    
    const seat = document.getElementById('editSeat').value.trim();
    const name = document.getElementById('editName').value.trim();
    
    if (!seat || !name) {
        alert('請填寫完整資料');
        return;
    }
    
    modal.currentStudents[index].seat = seat;
    modal.currentStudents[index].name = name;
    
    refreshStudentList(modal);
    closeEditModal();
}

// 導出函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getClassDataFromStorage,
        saveClassDataToStorage,
        clearClassDataFromStorage,
        hasCustomClassData,
        getStudentData,
        openStudentManager
    };
}
