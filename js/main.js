// =================================
// 主頁面 JavaScript
// Steampunk Selector - Main Page
// =================================

// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
  initializeMainPage();
  addInteractiveEffects();
});

// 初始化主頁面
function initializeMainPage() {
  console.log('蒸氣龐克選人系統已啟動 🎩⚙️');
  
  // 頁面載入動畫
  animatePageLoad();
  
  // 初始化齒輪動畫
  initializeGearAnimations();
}

// 頁面載入動畫
function animatePageLoad() {
  const elements = document.querySelectorAll('.class-card, .title-section, .section-title');
  
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

// 齒輪動畫初始化
function initializeGearAnimations() {
  const gears = document.querySelectorAll('.gear-small, .gear-title');
  
  gears.forEach(gear => {
    // 滑鼠懸停時加速
    gear.addEventListener('mouseenter', function() {
      this.style.animationDuration = '2s';
    });
    
    gear.addEventListener('mouseleave', function() {
      this.style.animationDuration = '';
    });
  });
}

// 添加互動效果
function addInteractiveEffects() {
  // 音效模擬（實際音效載入時啟用）
  const classCards = document.querySelectorAll('.class-card');
  
  classCards.forEach(card => {
    // 點擊效果
    card.addEventListener('click', function(e) {
      // 避免在新增班級卡片的預設行為
      if (this.classList.contains('add-new-card')) {
        e.preventDefault();
        showAddClassModal();
        return;
      }
      
      // 模擬音效（實際音檔載入時啟用）
      playClickSound();
      
      // 添加點擊動畫
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
    
    // 懸停音效（可選）
    card.addEventListener('mouseenter', function() {
      if (!this.classList.contains('add-new-card')) {
        playHoverSound();
      }
    });
  });
}

// 點擊音效（模擬）
function playClickSound() {
  // 這裡是佔位符，實際需要載入音檔
  console.log('🔊 播放點擊音效');
  
  // 實際程式碼範例：
  /*
  const audio = new Audio('audio/click.mp3');
  audio.volume = 0.7;
  audio.play().catch(e => console.log('音效播放失敗:', e));
  */
}

// 懸停音效（模擬）
function playHoverSound() {
  console.log('🔊 播放懸停音效');
}

// 顯示新增班級彈窗
function showAddClassModal() {
  // 簡單的提示，實際可做更好看的彈窗
  const className = prompt('請輸入班級名稱：');
  if (className) {
    const studentCount = prompt('請輸入班級人數（預設35人）：') || '35';
    alert(`已記錄新班級：${className}\n人數：${studentCount}人\n\n請手動複製 class-template.html 並修改學生資料。`);
  }
}

// 版本資訊
console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│  蒸氣龐克選人系統 v1.0.0       │
│  Steampunk Student Selector     │
│                                 │
│  ⚙️ 齒輪轉動，命運抉擇         │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`);

// 導出函數（其他頁面使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeMainPage,
    playClickSound,
    playHoverSound
  };
}