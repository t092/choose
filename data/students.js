// =================================
// 學生資料設定檔
// Student Data Configuration
// =================================

// 一年一班學生資料（35人）
const class1Data = {
  classId: 'class-1',
  className: '一年一班',
  students: [
    { seat: '01', name: '王小明' },
    { seat: '02', name: '李小華' },
    { seat: '03', name: '張大偉' },
    { seat: '04', name: '陳小美' },
    { seat: '05', name: '劉小強' },
    { seat: '06', name: '林雅惠' },
    { seat: '07', name: '黃志豪' },
    { seat: '08', name: '吳佳琪' },
    { seat: '09', name: '蔡宗翰' },
    { seat: '10', name: '楊詩涵' },
    { seat: '11', name: '許建宏' },
    { seat: '12', name: '鄭雅玲' },
    { seat: '13', name: '謝承翰' },
    { seat: '14', name: '周曉婷' },
    { seat: '15', name: '施俊傑' },
    { seat: '16', name: '曾郁珊' },
    { seat: '17', name: '蘇冠宇' },
    { seat: '18', name: '葉靜宜' },
    { seat: '19', name: '江志偉' },
    { seat: '20', name: '何淑芬' },
    { seat: '21', name: '廖威廷' },
    { seat: '22', name: '鐘佳蓉' },
    { seat: '23', name: '邱信義' },
    { seat: '24', name: '郭雅雯' },
    { seat: '25', name: '簡明豪' },
    { seat: '26', name: '袁美玲' },
    { seat: '27', name: '林凱文' },
    { seat: '28', name: '翁雅琪' },
    { seat: '29', name: '溫家豪' },
    { seat: '30', name: '余雅婷' },
    { seat: '31', name: '葉俊宏' },
    { seat: '32', name: '游雅慧' },
    { seat: '33', name: '李智偉' },
    { seat: '34', name: '陳雅萍' },
    { seat: '35', name: '張家豪' }
  ]
};

// 二年三班學生資料（35人）
const class2Data = {
  classId: 'class-2',
  className: '二年三班',
  students: [
    { seat: '01', name: '陳彥廷' },
    { seat: '02', name: '林宜蓁' },
    { seat: '03', name: '黃俊凱' },
    { seat: '04', name: '張雅筑' },
    { seat: '05', name: '李政宇' },
    { seat: '06', name: '王怡君' },
    { seat: '07', name: '劉承翰' },
    { seat: '08', name: '吳怡萱' },
    { seat: '09', name: '林建宏' },
    { seat: '10', name: '蔡佩珊' },
    { seat: '11', name: '何俊宏' },
    { seat: '12', name: '郭怡君' },
    { seat: '13', name: '高志豪' },
    { seat: '14', name: '鄭雅婷' },
    { seat: '15', name: '蘇冠廷' },
    { seat: '16', name: '曾沛慈' },
    { seat: '17', name: '謝志偉' },
    { seat: '18', name: '簡雅婷' },
    { seat: '19', name: '賴冠宇' },
    { seat: '20', name: '邱雅雯' },
    { seat: '21', name: '尹志強' },
    { seat: '22', name: '汪怡伶' },
    { seat: '23', name: '范家豪' },
    { seat: '24', name: '朱雅琪' },
    { seat: '25', name: '蕭俊翰' },
    { seat: '26', name: '徐郁婷' },
    { seat: '27', name: '洪志宏' },
    { seat: '28', name: '方郁馨' },
    { seat: '29', name: '紀志偉' },
    { seat: '30', name: '葉純如' },
    { seat: '31', name: '唐俊軒' },
    { seat: '32', name: '黃雅琳' },
    { seat: '33', name: '羅志偉' },
    { seat: '34', name: '楊雅玲' },
    { seat: '35', name: '廖俊哲' }
  ]
};

// 匯出資料（供其他JS檔案使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    class1Data,
    class2Data
  };
}

// 儲存到全域變數（瀏覽器環境）
if (typeof window !== 'undefined') {
  window.CLASS_DATA = {
    'class-1': class1Data,
    'class-2': class2Data
  };
}