/* ========================================================
   FIREBASE INITIALIZATION & GLOBAL REFERENCES
======================================================== */
const firebase = window.firebase;
const Chart = window.Chart;

const firebaseConfig = {
  apiKey: "AIzaSyAogcBRJLCfcAtLaFZXy6FspO1KPS--fgc",
  authDomain: "diet-planner-124a6.firebaseapp.com",
  projectId: "diet-planner-124a6",
  storageBucket: "diet-planner-124a6.firebasestorage.app",
  messagingSenderId: "174821078898",
  appId: "1:174821078898:web:756ff80ab0baf37c07cfeb",
  measurementId: "G-TZ53E2VN5Y"
};

const fbApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Try to init analytics (fails silently if blocked by ad-blocker)
try { firebase.analytics(); } catch (e) {}

/**
 * Master configuration of the 8 food items.
 */
export const FOOD_ITEMS = [
  {
    id: 'eggs',
    name: 'Whole Eggs',
    emoji: '🥚',
    unit: '1 egg',
    unitPlural: 'eggs',
    min: 0,
    max: 12,
    step: 1,
    defaultQty: 6,
    kcal: 75,
    protein: 6,
    carbs: 0.5,
    fat: 5,
  },
  {
    id: 'rotis',
    name: 'Rotis',
    emoji: '🫓',
    unit: '1 medium roti',
    unitPlural: 'rotis',
    min: 0,
    max: 15,
    step: 1,
    defaultQty: 7,
    kcal: 110,
    protein: 3.5,
    carbs: 22,
    fat: 0.5,
  },
  {
    id: 'chawal',
    name: 'Chawal / Cooked Rice',
    emoji: '🍚',
    unit: '1 katori',
    unitPlural: 'katoris',
    min: 0,
    max: 6,
    step: 0.5,
    defaultQty: 1.5,
    kcal: 195,
    protein: 4,
    carbs: 42,
    fat: 0.4,
  },
  {
    id: 'daal',
    name: 'Daal / Cooked Lentils',
    emoji: '🥣',
    unit: '1 katori',
    unitPlural: 'katoris',
    min: 0,
    max: 6,
    step: 0.5,
    defaultQty: 3,
    kcal: 150,
    protein: 7,
    carbs: 20,
    fat: 3.5,
  },
  {
    id: 'milk',
    name: 'Full-Cream Milk',
    emoji: '🥛',
    unit: '250 ml glass',
    unitPlural: 'glasses',
    min: 0,
    max: 6,
    step: 0.5,
    defaultQty: 1,
    kcal: 155,
    protein: 8,
    carbs: 12,
    fat: 8,
  },
  {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    unit: '1 medium',
    unitPlural: 'bananas',
    min: 0,
    max: 8,
    step: 1,
    defaultQty: 3,
    kcal: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.3,
  },
  {
    id: 'chickpeas',
    name: 'Roasted Chickpeas',
    subtitle: 'Bhuna Chana',
    emoji: '🫘',
    unit: '50g serving',
    unitPlural: 'servings (50g)',
    min: 0,
    max: 4,
    step: 0.5,
    defaultQty: 1,
    kcal: 180,
    protein: 10,
    carbs: 30,
    fat: 2.5,
  },
  {
    id: 'whey',
    name: 'Whey Protein',
    emoji: '🥤',
    unit: '1 scoop / 30g',
    unitPlural: 'scoops',
    min: 0,
    max: 3,
    step: 0.5,
    defaultQty: 1,
    kcal: 120,
    protein: 24,
    carbs: 3,
    fat: 1.5,
  },
];

// Application State
export const state = {
  quantities: {},
  customFoods: [],
  calorieGoal: 2700,
  proteinGoal: 120,
  currentUser: null,
};

// Cache DOM elements
let dom = {};

function initDomElements() {
  dom = {
    foodGrid: document.getElementById('foodGrid'),
    usdaFoodSearch: document.getElementById('usdaFoodSearch'),
    usdaFoodResults: document.getElementById('usdaFoodResults'),
    usdaSearchSpinner: document.getElementById('usdaSearchSpinner'),
    usdaSearchMessage: document.getElementById('usdaSearchMessage'),
    customFoodList: document.getElementById('customFoodList'),
    totalCalories: document.getElementById('totalCalories'),
    totalProtein: document.getElementById('totalProtein'),
    totalCarbs: document.getElementById('totalCarbs'),
    totalFats: document.getElementById('totalFats'),
    calorieGoalInput: document.getElementById('calorieGoalInput'),
    proteinGoalInput: document.getElementById('proteinGoalInput'),
    calPercentBadge: document.getElementById('calPercentBadge'),
    proPercentBadge: document.getElementById('proPercentBadge'),
    carbShareBadge: document.getElementById('carbShareBadge'),
    fatShareBadge: document.getElementById('fatShareBadge'),
    calorieProgressBar: document.getElementById('calorieProgressBar'),
    proteinProgressBar: document.getElementById('proteinProgressBar'),
    carbShareBar: document.getElementById('carbShareBar'),
    fatShareBar: document.getElementById('fatShareBar'),
    carbsKcalText: document.getElementById('carbsKcalText'),
    fatsKcalText: document.getElementById('fatsKcalText'),
    splitProteinPct: document.getElementById('splitProteinPct'),
    splitCarbsPct: document.getElementById('splitCarbsPct'),
    splitFatsPct: document.getElementById('splitFatsPct'),
    barProtein: document.getElementById('barProtein'),
    barCarbs: document.getElementById('barCarbs'),
    barFats: document.getElementById('barFats'),
    activeItemsBadge: document.getElementById('activeItemsBadge'),
    btnRecommended: document.getElementById('btnRecommended'),
    btnResetZero: document.getElementById('btnResetZero'),
    floatingSummaryBar: document.getElementById('floatingSummaryBar'),
    dailyTotalsSection: document.getElementById('dailyTotalsSection'),
    floatCalories: document.getElementById('floatCalories'),
    floatProtein: document.getElementById('floatProtein'),
    floatCarbs: document.getElementById('floatCarbs'),
    floatFats: document.getElementById('floatFats'),
    toastMessage: document.getElementById('toastMessage'),
    // Auth elements
    authStatus: document.getElementById('authStatus'),
    btnGoogleSignIn: document.getElementById('btnGoogleSignIn'),
    btnSignOut: document.getElementById('btnSignOut'),
    // Navigation User Dropdown elements
    userDropdownWrapper: document.getElementById('userDropdownWrapper'),
    btnUserDropdownToggle: document.getElementById('btnUserDropdownToggle'),
    userDashboardDropdown: document.getElementById('userDashboardDropdown'),
    navDropdownChevron: document.getElementById('navDropdownChevron'),
    navAvatarImg: document.getElementById('navAvatarImg'),
    navAvatarFallback: document.getElementById('navAvatarFallback'),
    navUserName: document.getElementById('navUserName'),
    dashUserEmail: document.getElementById('dashUserEmail'),
    // Personal Dashboard elements
    guestPromptBanner: document.getElementById('guestPromptBanner'),
    btnBannerSignIn: document.getElementById('btnBannerSignIn'),
    personalDashboardSection: document.getElementById('userDashboardDropdown'),
    dashAvatarImg: document.getElementById('dashAvatarImg'),
    dashAvatarFallback: document.getElementById('dashAvatarFallback'),
    dashDateBadge: document.getElementById('dashDateBadge'),
    dashUserName: document.getElementById('dashUserName'),
    dashGreetingSub: document.getElementById('dashGreetingSub'),
    dashBtnSaveNow: document.getElementById('dashBtnSaveNow'),
    dashBtnViewFullAnalytics: document.getElementById('dashBtnViewFullAnalytics'),
    dashCalInput: document.getElementById('dashCalInput'),
    dashProInput: document.getElementById('dashProInput'),
    dashBtnSaveTargets: document.getElementById('dashBtnSaveTargets'),
    dashConsistencyPct: document.getElementById('dashConsistencyPct'),
    dashDaysCount: document.getElementById('dashDaysCount'),
    dashConsistencyBar: document.getElementById('dashConsistencyBar'),
    dashTodayStatusBadge: document.getElementById('dashTodayStatusBadge'),
    dashTodayCals: document.getElementById('dashTodayCals'),
    dashTodayPro: document.getElementById('dashTodayPro'),
    btnGraphModeCalories: document.getElementById('btnGraphModeCalories'),
    btnGraphModeProtein: document.getElementById('btnGraphModeProtein'),
    weeklyChartCanvas: document.getElementById('weeklyChartCanvas'),
    chartPlaceholder: document.getElementById('chartPlaceholder'),
    chartLegendActualDot: document.getElementById('chartLegendActualDot'),
    chartSummaryInsight: document.getElementById('chartSummaryInsight'),
    chartAvgValue: document.getElementById('chartAvgValue'),
    // Data logging elements
    saveLogSection: document.getElementById('saveLogSection'),
    btnSaveLog: document.getElementById('btnSaveLog'),
    lastSavedText: document.getElementById('lastSavedText'),
    // Weekly analytics elements
    weeklyAnalyticsSection: document.getElementById('weeklyAnalyticsSection'),
    btnToggleAnalytics: document.getElementById('btnToggleAnalytics'),
    analyticsPanel: document.getElementById('analyticsPanel'),
    analyticsChevron: document.getElementById('analyticsChevron'),
    analyticsLogCount: document.getElementById('analyticsLogCount'),
    weekTotalCal: document.getElementById('weekTotalCal'),
    weekTotalPro: document.getElementById('weekTotalPro'),
    weekAvgCal: document.getElementById('weekAvgCal'),
    weekAvgPro: document.getElementById('weekAvgPro'),
    weekCalHitRate: document.getElementById('weekCalHitRate'),
    weekProHitRate: document.getElementById('weekProHitRate'),
    weeklyTableBody: document.getElementById('weeklyTableBody'),
  };
}

let toastTimer = null;
let weeklyChartInstance = null;
let currentGraphMode = 'calories'; // 'calories' | 'protein'
let cachedWeeklyLogs = [];
let usdaSearchTimer = null;
let usdaSearchController = null;
let currentUsdaResults = [];

/* ========================================================
   UTILITY HELPERS
======================================================== */
export function roundTo(value, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatQty(qty) {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
}

/** Returns today's date as YYYY-MM-DD in local timezone */
export function getTodayDateStr() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/** Returns date string for N days ago */
export function getDateStrDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

/** Formats YYYY-MM-DD to a friendly display like "Mon, Nov 18" */
export function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = getTodayDateStr();
  const yesterday = getDateStrDaysAgo(1);
  let label = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  if (dateStr === today) label += ' (Today)';
  else if (dateStr === yesterday) label += ' (Yesterday)';
  return label;
}

export function showToast(message) {
  try {
    if (!dom.toastMessage) return;
    dom.toastMessage.textContent = message;
    dom.toastMessage.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
    dom.toastMessage.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toastMessage.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
      dom.toastMessage.classList.remove('opacity-100', 'translate-y-0');
    }, 2200);
  } catch (err) {
    console.error('Toast error:', err);
  }
}

/* ========================================================
   USER TARGETS & PERSONAL DASHBOARD
======================================================== */
export async function loadUserTargets(uid) {
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists && doc.data()) {
      const data = doc.data();
      if (data.calorieGoal && data.calorieGoal >= 500) {
        state.calorieGoal = data.calorieGoal;
        if (dom.calorieGoalInput) dom.calorieGoalInput.value = data.calorieGoal;
        if (dom.dashCalInput) dom.dashCalInput.value = data.calorieGoal;
      }
      if (data.proteinGoal && data.proteinGoal >= 20) {
        state.proteinGoal = data.proteinGoal;
        if (dom.proteinGoalInput) dom.proteinGoalInput.value = data.proteinGoal;
        if (dom.dashProInput) dom.dashProInput.value = data.proteinGoal;
      }
    }
  } catch (err) {
    console.warn('Could not load user targets:', err);
  }
}

export async function saveUserTargets() {
  if (!state.currentUser) {
    showToast('Please sign in first');
    return;
  }

  const cal = parseInt(dom.dashCalInput.value, 10);
  const pro = parseInt(dom.dashProInput.value, 10);

  if (Number.isNaN(cal) || cal < 500 || cal > 6000) {
    showToast('Calorie target must be between 500 and 6,000');
    return;
  }
  if (Number.isNaN(pro) || pro < 20 || pro > 350) {
    showToast('Protein target must be between 20g and 350g');
    return;
  }

  state.calorieGoal = cal;
  state.proteinGoal = pro;
  if (dom.calorieGoalInput) dom.calorieGoalInput.value = cal;
  if (dom.proteinGoalInput) dom.proteinGoalInput.value = pro;
  recalculateTotals();

  try {
    if (dom.dashBtnSaveTargets) {
      dom.dashBtnSaveTargets.disabled = true;
      dom.dashBtnSaveTargets.textContent = 'Saving...';
    }

    await db.collection('users').doc(state.currentUser.uid).set({
      calorieGoal: cal,
      proteinGoal: pro,
      targetsUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    showToast(`🎯 Targets saved: ${cal.toLocaleString()} kcal & ${pro}g protein!`);
    renderWeeklyChart(cachedWeeklyLogs);
  } catch (err) {
    console.error('Error saving targets:', err);
    showToast('❌ Failed to save targets');
  } finally {
    if (dom.dashBtnSaveTargets) {
      dom.dashBtnSaveTargets.disabled = false;
      dom.dashBtnSaveTargets.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        Apply &amp; Save Targets to Cloud
      `;
    }
  }
}

/* ========================================================
   7-DAY INTERACTIVE PROGRESS GRAPH (CHART.JS)
======================================================== */
export function renderWeeklyChart(logs) {
  if (!dom.weeklyChartCanvas || typeof Chart === 'undefined') return;
  cachedWeeklyLogs = logs || [];

  if (!logs || logs.length === 0) {
    if (dom.chartPlaceholder) dom.chartPlaceholder.classList.remove('hidden');
    if (dom.chartAvgValue) {
      dom.chartAvgValue.textContent = currentGraphMode === 'calories' ? `${state.calorieGoal.toLocaleString()} kcal (target)` : `${state.proteinGoal}g (target)`;
    }
    if (weeklyChartInstance) {
      weeklyChartInstance.destroy();
      weeklyChartInstance = null;
    }
    return;
  }

  if (dom.chartPlaceholder) dom.chartPlaceholder.classList.add('hidden');

  const dayLabels = [];
  const dateKeys = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const dStr = getDateStrDaysAgo(i);
    dateKeys.push(dStr);
    if (i === 0) {
      dayLabels.push('Today');
    } else if (i === 1) {
      dayLabels.push('Yest');
    } else {
      const dObj = new Date(dStr + 'T12:00:00');
      dayLabels.push(dayNames[dObj.getDay()]);
    }
  }

  const logMap = {};
  logs.forEach(l => {
    if (l.date) logMap[l.date] = l;
  });

  const isCal = currentGraphMode === 'calories';
  const targetValue = isCal ? state.calorieGoal : state.proteinGoal;
  const actualData = dateKeys.map(k => {
    const item = logMap[k];
    if (!item) return 0;
    return isCal ? item.calories : item.protein;
  });
  const targetData = dateKeys.map(() => targetValue);

  const loggedValues = actualData.filter(v => v > 0);
  const avgVal = loggedValues.length > 0 ? Math.round(loggedValues.reduce((a, b) => a + b, 0) / loggedValues.length) : 0;
  if (dom.chartAvgValue) {
    dom.chartAvgValue.textContent = isCal ? `${avgVal.toLocaleString()} kcal` : `${avgVal}g`;
  }

  if (dom.chartLegendActualDot) {
    dom.chartLegendActualDot.className = isCal ? 'w-2.5 h-2.5 rounded-sm bg-amber-400' : 'w-2.5 h-2.5 rounded-sm bg-emerald-400';
  }

  if (weeklyChartInstance) {
    weeklyChartInstance.destroy();
  }

  const barColor = isCal ? '#f59e0b' : '#10b981';
  const barHover = isCal ? '#fbbf24' : '#34d399';
  const targetColor = isCal ? '#fbbf24' : '#6ee7b7';

  const ctx = dom.weeklyChartCanvas.getContext('2d');
  weeklyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dayLabels,
      datasets: [
        {
          type: 'line',
          label: isCal ? 'Target (kcal)' : 'Target (g)',
          data: targetData,
          borderColor: targetColor,
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
          tension: 0,
          order: 1
        },
        {
          type: 'bar',
          label: isCal ? 'Intake (kcal)' : 'Intake (g)',
          data: actualData,
          backgroundColor: actualData.map(v => v === 0 ? 'rgba(51, 65, 85, 0.4)' : barColor),
          hoverBackgroundColor: barHover,
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 26,
          order: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label: function(context) {
              if (context.dataset.type === 'line') {
                return `Target: ${context.parsed.y} ${isCal ? 'kcal' : 'g'}`;
              }
              const val = context.parsed.y;
              if (val === 0) return 'No log recorded';
              const diff = val - targetValue;
              const diffStr = diff >= 0 ? `+${diff}` : `${diff}`;
              return `Intake: ${val} ${isCal ? 'kcal' : 'g'} (${diffStr})`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 11, weight: '600' } }
        },
        y: {
          grid: { color: 'rgba(51, 65, 85, 0.45)' },
          ticks: { color: '#94a3b8', font: { size: 10 } },
          suggestedMax: targetValue * 1.2
        }
      }
    }
  });
}

/* ========================================================
   FIREBASE AUTH
======================================================== */
export async function handleAuthStateChange(user) {
  state.currentUser = user;
  if (user) {
    const fullName = user.displayName || user.email?.split('@')[0] || 'Athlete';
    const firstName = fullName.split(' ')[0];

    // Navbar user dropdown trigger setup
    if (dom.navUserName) dom.navUserName.textContent = firstName;
    if (user.photoURL && dom.navAvatarImg) {
      dom.navAvatarImg.src = user.photoURL;
      dom.navAvatarImg.classList.remove('hidden');
      if (dom.navAvatarFallback) dom.navAvatarFallback.classList.add('hidden');
    } else if (dom.navAvatarFallback) {
      dom.navAvatarFallback.textContent = firstName[0].toUpperCase();
      dom.navAvatarFallback.classList.remove('hidden');
      if (dom.navAvatarImg) dom.navAvatarImg.classList.add('hidden');
    }

    if (dom.userDropdownWrapper) dom.userDropdownWrapper.classList.remove('hidden');
    if (dom.btnGoogleSignIn) dom.btnGoogleSignIn.classList.add('hidden');
    if (dom.btnSignOut) dom.btnSignOut.classList.remove('hidden');
    if (dom.saveLogSection) dom.saveLogSection.classList.remove('hidden');
    if (dom.weeklyAnalyticsSection) dom.weeklyAnalyticsSection.classList.remove('hidden');

    if (dom.guestPromptBanner) dom.guestPromptBanner.classList.add('hidden');

    // Dashboard inside dropdown
    if (dom.dashUserName) dom.dashUserName.textContent = firstName;
    if (dom.dashUserEmail) dom.dashUserEmail.textContent = user.email || '';
    if (dom.dashDateBadge) {
      dom.dashDateBadge.textContent = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    }

    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    if (dom.dashGreetingSub) {
      dom.dashGreetingSub.textContent = `${timeGreeting}, ${firstName}!`;
    }

    if (user.photoURL && dom.dashAvatarImg) {
      dom.dashAvatarImg.src = user.photoURL;
      dom.dashAvatarImg.classList.remove('hidden');
      if (dom.dashAvatarFallback) dom.dashAvatarFallback.classList.add('hidden');
    } else if (dom.dashAvatarFallback) {
      dom.dashAvatarFallback.textContent = firstName[0].toUpperCase();
      dom.dashAvatarFallback.classList.remove('hidden');
      if (dom.dashAvatarImg) dom.dashAvatarImg.classList.add('hidden');
    }

    await loadUserTargets(user.uid);
    await loadWeeklyData();
  } else {
    if (dom.userDropdownWrapper) dom.userDropdownWrapper.classList.add('hidden');
    if (dom.userDashboardDropdown) dom.userDashboardDropdown.classList.add('hidden');
    if (dom.navDropdownChevron) dom.navDropdownChevron.classList.remove('rotate-180');
    if (dom.btnGoogleSignIn) dom.btnGoogleSignIn.classList.remove('hidden');
    if (dom.btnSignOut) dom.btnSignOut.classList.add('hidden');
    if (dom.saveLogSection) dom.saveLogSection.classList.add('hidden');
    if (dom.weeklyAnalyticsSection) dom.weeklyAnalyticsSection.classList.add('hidden');

    if (dom.guestPromptBanner) dom.guestPromptBanner.classList.remove('hidden');

    if (weeklyChartInstance) {
      weeklyChartInstance.destroy();
      weeklyChartInstance = null;
    }
  }
}

auth.onAuthStateChanged(handleAuthStateChange);

/* ========================================================
   FIRESTORE DATA LOGGING
======================================================== */
export function userLogsCollection() {
  return db.collection('users').doc(state.currentUser.uid).collection('dailyLogs');
}

export async function saveTodayLog() {
  if (!state.currentUser) {
    showToast('Please sign in first');
    return;
  }

  const dateStr = getTodayDateStr();
  let totalKcal = 0, totalPro = 0, totalCarbs = 0, totalFats = 0;
  const portions = {};

  FOOD_ITEMS.forEach((item) => {
    const qty = state.quantities[item.id] || 0;
    portions[item.id] = qty;
    totalKcal += item.kcal * qty;
    totalPro += item.protein * qty;
    totalCarbs += item.carbs * qty;
    totalFats += item.fat * qty;
  });

  const customFoods = state.customFoods.filter((food) => food.grams > 0);
  customFoods.forEach((food) => {
    const factor = food.grams / 100;
    totalKcal += food.kcal * factor;
    totalPro += food.protein * factor;
    totalCarbs += food.carbs * factor;
    totalFats += food.fat * factor;
  });

  const logData = {
    date: dateStr,
    calories: Math.round(totalKcal),
    protein: roundTo(totalPro, 1),
    carbs: roundTo(totalCarbs, 1),
    fats: roundTo(totalFats, 1),
    calorieGoal: state.calorieGoal,
    proteinGoal: state.proteinGoal,
    portions: portions,
    customFoods: customFoods,
    savedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  try {
    if (dom.btnSaveLog) {
      dom.btnSaveLog.disabled = true;
      dom.btnSaveLog.textContent = 'Saving...';
    }

    await userLogsCollection().doc(dateStr).set(logData);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (dom.lastSavedText) {
      dom.lastSavedText.textContent = `Last saved at ${timeStr}`;
      dom.lastSavedText.classList.remove('hidden');
    }
    showToast(`✅ Log saved for ${formatDateDisplay(dateStr)}`);

    await deleteOldLogs();
    await loadWeeklyData();
  } catch (err) {
    console.error('Error saving log:', err);
    showToast('❌ Failed to save. Check console.');
  } finally {
    if (dom.btnSaveLog) {
      dom.btnSaveLog.disabled = false;
      dom.btnSaveLog.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
        Save Today's Log
      `;
    }
  }
}

export async function deleteOldLogs() {
  if (!state.currentUser) return;
  try {
    const cutoffDate = getDateStrDaysAgo(7);
    const oldDocs = await userLogsCollection()
      .where('date', '<', cutoffDate)
      .get();

    const batch = db.batch();
    oldDocs.forEach((doc) => batch.delete(doc.ref));
    if (!oldDocs.empty) {
      await batch.commit();
      console.log(`Deleted ${oldDocs.size} old log(s) before ${cutoffDate}`);
    }
  } catch (err) {
    console.error('Error deleting old logs:', err);
  }
}

export async function loadWeeklyData() {
  if (!state.currentUser) return;
  try {
    const cutoffDate = getDateStrDaysAgo(7);
    const snapshot = await userLogsCollection()
      .where('date', '>=', cutoffDate)
      .orderBy('date', 'desc')
      .get();

    const logs = [];
    snapshot.forEach((doc) => logs.push(doc.data()));

    renderWeeklyAnalytics(logs);
  } catch (err) {
    console.error('Error loading weekly data:', err);
    if (err.code === 'failed-precondition') {
      console.warn('Firestore composite index required. Check the console link above to create it.');
    }
  }
}

export function renderWeeklyAnalytics(logs) {
  cachedWeeklyLogs = logs || [];
  const count = logs.length;
  if (dom.analyticsLogCount) {
    dom.analyticsLogCount.textContent = `${count} log${count !== 1 ? 's' : ''}`;
  }

  renderWeeklyChart(logs);

  const consistencyPct = Math.round((count / 7) * 100);
  if (dom.dashConsistencyPct) dom.dashConsistencyPct.textContent = `${consistencyPct}%`;
  if (dom.dashDaysCount) dom.dashDaysCount.textContent = `${count} / 7 days`;
  if (dom.dashConsistencyBar) dom.dashConsistencyBar.style.width = `${Math.min(100, consistencyPct)}%`;

  const todayStr = getTodayDateStr();
  const todayLog = logs.find((l) => l.date === todayStr);

  if (todayLog) {
    if (dom.dashTodayStatusBadge) {
      dom.dashTodayStatusBadge.textContent = '✓ Logged Today';
      dom.dashTodayStatusBadge.className = 'px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    }
    if (dom.dashTodayCals) dom.dashTodayCals.textContent = `${todayLog.calories.toLocaleString()} kcal`;
    if (dom.dashTodayPro) dom.dashTodayPro.textContent = `${todayLog.protein}g protein`;
  } else {
    if (dom.dashTodayStatusBadge) {
      dom.dashTodayStatusBadge.textContent = 'Not Saved';
      dom.dashTodayStatusBadge.className = 'px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
    }
    if (dom.dashTodayCals) dom.dashTodayCals.textContent = `${dom.totalCalories ? dom.totalCalories.textContent : '0'} kcal`;
    if (dom.dashTodayPro) dom.dashTodayPro.textContent = `${dom.totalProtein ? dom.totalProtein.textContent : '0'}g protein`;
  }

  if (count === 0) {
    if (dom.weekTotalCal) dom.weekTotalCal.textContent = '0';
    if (dom.weekTotalPro) dom.weekTotalPro.textContent = '0';
    if (dom.weekAvgCal) dom.weekAvgCal.textContent = '0';
    if (dom.weekAvgPro) dom.weekAvgPro.textContent = '0';
    if (dom.weekCalHitRate) dom.weekCalHitRate.textContent = '0';
    if (dom.weekProHitRate) dom.weekProHitRate.textContent = '0';
    if (dom.weeklyTableBody) {
      dom.weeklyTableBody.innerHTML = `
        <tr><td colspan="8" class="px-4 py-6 text-center text-slate-400 text-sm">No logs yet. Save your first daily log!</td></tr>
      `;
    }
    return;
  }

  let totalCal = 0, totalPro = 0;
  let calHitDays = 0, proHitDays = 0;

  logs.forEach((log) => {
    totalCal += log.calories || 0;
    totalPro += log.protein || 0;

    const calGoal = log.calorieGoal || state.calorieGoal || 2700;
    const proGoal = log.proteinGoal || state.proteinGoal || 120;
    if (Math.abs(log.calories - calGoal) <= calGoal * 0.1) calHitDays++;
    if (log.protein >= proGoal) proHitDays++;
  });

  if (dom.weekTotalCal) dom.weekTotalCal.textContent = Math.round(totalCal).toLocaleString();
  if (dom.weekTotalPro) dom.weekTotalPro.textContent = roundTo(totalPro, 1);
  if (dom.weekAvgCal) dom.weekAvgCal.textContent = Math.round(totalCal / count).toLocaleString();
  if (dom.weekAvgPro) dom.weekAvgPro.textContent = roundTo(totalPro / count, 1);
  if (dom.weekCalHitRate) dom.weekCalHitRate.textContent = Math.round((calHitDays / count) * 100);
  if (dom.weekProHitRate) dom.weekProHitRate.textContent = Math.round((proHitDays / count) * 100);

  let rowsHtml = '';
  logs.forEach((log) => {
    const calGoal = log.calorieGoal || state.calorieGoal || 2700;
    const proGoal = log.proteinGoal || state.proteinGoal || 120;
    const calPct = Math.round((log.calories / calGoal) * 100);
    const proPct = Math.round((log.protein / proGoal) * 100);
    const calHit = Math.abs(log.calories - calGoal) <= calGoal * 0.1;
    const proHit = log.protein >= proGoal;
    const bothHit = calHit && proHit;

    const statusBadge = bothHit
      ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">✓ On Track</span>'
      : calHit || proHit
        ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">~ Partial</span>'
        : '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">✗ Missed</span>';

    rowsHtml += `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="px-4 py-3 text-sm font-semibold text-slate-800 whitespace-nowrap">${formatDateDisplay(log.date)}</td>
        <td class="px-4 py-3 text-sm text-right font-bold text-amber-700">${log.calories.toLocaleString()}</td>
        <td class="px-4 py-3 text-sm text-right font-bold text-emerald-700">${log.protein}g</td>
        <td class="px-4 py-3 text-sm text-right text-slate-600">${log.carbs}g</td>
        <td class="px-4 py-3 text-sm text-right text-slate-600">${log.fats}g</td>
        <td class="px-4 py-3 text-sm text-right text-slate-500">${calGoal} <span class="text-[10px] text-slate-400">(${calPct}%)</span></td>
        <td class="px-4 py-3 text-sm text-right text-slate-500">${proGoal}g <span class="text-[10px] text-slate-400">(${proPct}%)</span></td>
        <td class="px-4 py-3 text-center">${statusBadge}</td>
      </tr>
    `;
  });

  if (dom.weeklyTableBody) dom.weeklyTableBody.innerHTML = rowsHtml;
}

/* ========================================================
   FOOD CARD RENDERING & UI
======================================================== */
export function initDefaultState() {
  FOOD_ITEMS.forEach((item) => {
    state.quantities[item.id] = item.defaultQty;
  });
}

function customFoodsStorageKey() {
  return `dietPlannerCustomFoods:${getTodayDateStr()}`;
}

function persistCustomFoods() {
  try {
    localStorage.setItem(customFoodsStorageKey(), JSON.stringify(state.customFoods));
  } catch (err) {
    console.warn('Could not save extra foods on this device:', err);
  }
}

function loadCustomFoods() {
  try {
    const saved = JSON.parse(localStorage.getItem(customFoodsStorageKey()) || '[]');
    state.customFoods = Array.isArray(saved)
      ? saved.filter((food) => food && Number.isFinite(Number(food.fdcId)) && Number.isFinite(Number(food.grams)))
        .map((food) => ({
          fdcId: Number(food.fdcId),
          name: String(food.name || 'USDA food').slice(0, 180),
          dataType: String(food.dataType || 'USDA').slice(0, 40),
          kcal: Number(food.kcal) || 0,
          protein: Number(food.protein) || 0,
          carbs: Number(food.carbs) || 0,
          fat: Number(food.fat) || 0,
          fiber: Number(food.fiber) || 0,
          sodium: Number(food.sodium) || 0,
          grams: Math.min(1000, Math.max(0, Number(food.grams) || 0)),
        }))
      : [];
  } catch (err) {
    state.customFoods = [];
  }
}

function renderCustomFoods() {
  if (!dom.customFoodList) return;
  dom.customFoodList.replaceChildren();

  state.customFoods.forEach((food) => {
    const card = document.createElement('article');
    card.className = 'custom-food-card rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-xl';
    card.dataset.fdcId = String(food.fdcId);

    const heading = document.createElement('div');
    heading.className = 'mb-3 flex items-start justify-between gap-3';
    const headingText = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'text-sm font-bold leading-snug text-slate-900';
    title.textContent = food.name;
    const source = document.createElement('p');
    source.className = 'mt-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700';
    source.textContent = `${food.dataType} · USDA · values per 100 g`;
    headingText.append(title, source);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700';
    remove.dataset.action = 'remove-custom-food';
    remove.dataset.fdcId = String(food.fdcId);
    remove.setAttribute('aria-label', `Remove ${food.name}`);
    remove.textContent = 'Remove';
    heading.append(headingText, remove);

    const nutrition = document.createElement('div');
    nutrition.className = 'mb-3 grid grid-cols-3 gap-2 text-center';
    const nutrientFields = [
      ['Calories', 'kcal', food.kcal, 0],
      ['Protein', 'g', food.protein, 1],
      ['Carbs', 'g', food.carbs, 1],
      ['Fat', 'g', food.fat, 1],
      ['Fiber', 'g', food.fiber, 1],
      ['Sodium', 'mg', food.sodium, 0],
    ];
    nutrientFields.forEach(([label, unit, amount, decimals]) => {
      const cell = document.createElement('div');
      cell.className = 'rounded-xl bg-emerald-50/70 px-2 py-2';
      const labelEl = document.createElement('span');
      labelEl.className = 'block text-[9px] font-bold uppercase tracking-wide text-emerald-800';
      labelEl.textContent = label;
      const valueEl = document.createElement('span');
      valueEl.className = 'mt-0.5 block text-xs font-bold text-slate-900';
      valueEl.dataset.nutrient = label.toLowerCase();
      valueEl.dataset.unit = unit;
      valueEl.dataset.decimals = String(decimals);
      valueEl.textContent = `${roundTo(amount * food.grams / 100, decimals)} ${unit}`;
      cell.append(labelEl, valueEl);
      nutrition.append(cell);
    });

    const sliderLabel = document.createElement('label');
    sliderLabel.className = 'flex items-center justify-between text-xs font-semibold text-slate-700';
    sliderLabel.htmlFor = `custom-food-slider-${food.fdcId}`;
    sliderLabel.append(document.createTextNode('Amount eaten'));
    const grams = document.createElement('output');
    grams.dataset.gramsOutput = '';
    grams.className = 'font-extrabold text-emerald-800';
    grams.textContent = `${food.grams} g`;
    sliderLabel.append(grams);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `custom-food-slider-${food.fdcId}`;
    slider.className = 'custom-food-grams mt-2 w-full accent-emerald-600';
    slider.min = '0';
    slider.max = '1000';
    slider.step = '5';
    slider.value = String(food.grams);
    slider.dataset.fdcId = String(food.fdcId);
    slider.setAttribute('aria-label', `${food.name} quantity in grams`);

    card.append(heading, nutrition, sliderLabel, slider);
    dom.customFoodList.append(card);
  });
}

function updateCustomFoodCard(food) {
  const card = dom.customFoodList?.querySelector(`[data-fdc-id="${food.fdcId}"]`);
  if (!card) return;
  const factor = food.grams / 100;
  card.querySelector('[data-grams-output]').textContent = `${food.grams} g`;
  card.querySelectorAll('[data-nutrient]').forEach((valueEl) => {
    const key = valueEl.dataset.nutrient === 'calories' ? 'kcal' : valueEl.dataset.nutrient === 'fat' ? 'fat' : valueEl.dataset.nutrient;
    const amount = Number(food[key]) || 0;
    const decimals = Number(valueEl.dataset.decimals) || 0;
    valueEl.textContent = `${roundTo(amount * factor, decimals)} ${valueEl.dataset.unit}`;
  });
}

function renderUsdaResults(foods) {
  if (!dom.usdaFoodResults) return;
  currentUsdaResults = foods;
  dom.usdaFoodResults.replaceChildren();
  foods.forEach((food, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.role = 'option';
    option.className = 'block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-0 hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none';
    option.dataset.searchIndex = String(index);
    const name = document.createElement('span');
    name.className = 'block text-sm font-semibold text-slate-900';
    name.textContent = food.name;
    const details = document.createElement('span');
    details.className = 'mt-1 block text-xs text-slate-500';
    details.textContent = `${food.dataType} · ${Math.round(food.kcal)} kcal · ${roundTo(food.protein, 1)} g protein per 100 g`;
    option.append(name, details);
    dom.usdaFoodResults.append(option);
  });
  dom.usdaFoodResults.classList.toggle('hidden', foods.length === 0);
  dom.usdaFoodSearch?.setAttribute('aria-expanded', String(foods.length > 0));
}

async function searchUsdaFoods(query) {
  usdaSearchController?.abort();
  usdaSearchController = new AbortController();
  const controller = usdaSearchController;
  if (query.length < 2) {
    dom.usdaSearchSpinner?.classList.add('hidden');
    renderUsdaResults([]);
    dom.usdaSearchMessage.textContent = 'Enter at least 2 characters to search USDA foods.';
    return;
  }

  dom.usdaSearchSpinner?.classList.remove('hidden');
  dom.usdaSearchMessage.textContent = 'Searching USDA FoodData Central…';
  try {
    const response = await fetch(`/api/foods?query=${encodeURIComponent(query)}`, { signal: controller.signal });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'USDA search is unavailable.');
    if (controller.signal.aborted) return;
    renderUsdaResults(payload.foods || []);
    dom.usdaSearchMessage.textContent = payload.foods?.length
      ? `${payload.foods.length} USDA foods found. Select one to add it to today’s foods.`
      : 'No matching USDA foods found. Try a more specific search.';
  } catch (err) {
    if (err.name === 'AbortError') return;
    renderUsdaResults([]);
    dom.usdaSearchMessage.textContent = err.message || 'Could not reach USDA FoodData Central. Try again shortly.';
  } finally {
    if (usdaSearchController === controller) dom.usdaSearchSpinner?.classList.add('hidden');
  }
}

function addCustomFood(food) {
  const fdcId = Number(food.fdcId);
  if (state.customFoods.some((item) => item.fdcId === fdcId)) {
    showToast('That USDA food is already in today’s list');
    return;
  }
  state.customFoods.push({ ...food, fdcId, grams: 100 });
  persistCustomFoods();
  renderCustomFoods();
  recalculateTotals();
  dom.usdaFoodSearch.value = '';
  renderUsdaResults([]);
  dom.usdaSearchMessage.textContent = 'Food added. Adjust the slider to the amount eaten.';
}

export function renderFoodCards() {
  if (!dom.foodGrid) return;
  dom.foodGrid.innerHTML = '';

  FOOD_ITEMS.forEach((item) => {
    const card = document.createElement('article');
    card.id = `card-${item.id}`;
    card.className =
      'bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between';

    const subtitleHtml = item.subtitle
      ? `<span class="text-xs font-medium text-slate-400 block">${item.subtitle}</span>`
      : '';

    card.innerHTML = `
      <!-- Card Top: Icon, Name, Unit -->
      <div class="flex items-start justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 select-none">
            ${item.emoji}
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-tight">${item.name}</h3>
            ${subtitleHtml}
            <p class="text-xs text-slate-500 mt-0.5">Per ${item.unit}: ${item.kcal} kcal · ${item.protein}g P</p>
          </div>
        </div>
      </div>

      <!-- Interactive Portion Controls -->
      <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
        <div class="flex items-center justify-between gap-2 mb-3">
          <button
            type="button"
            data-action="decrement"
            data-id="${item.id}"
            aria-label="Decrease ${item.name}"
            class="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 active:scale-95 text-slate-700 font-bold text-lg flex items-center justify-center shadow-xs transition-all cursor-pointer select-none"
          >−</button>

          <div class="text-center">
            <div class="flex items-baseline justify-center gap-1">
              <span id="qty-${item.id}" class="text-xl font-extrabold text-slate-900">0</span>
              <span class="text-xs font-medium text-slate-500">${item.unitPlural}</span>
            </div>
          </div>

          <button
            type="button"
            data-action="increment"
            data-id="${item.id}"
            aria-label="Increase ${item.name}"
            class="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-lg flex items-center justify-center shadow-xs transition-all cursor-pointer select-none"
          >+</button>
        </div>

        <!-- Range Slider -->
        <div class="px-1">
          <input
            id="slider-${item.id}"
            type="range"
            class="food-slider w-full"
            min="${item.min}"
            max="${item.max}"
            step="${item.step}"
            value="${state.quantities[item.id]}"
            data-id="${item.id}"
            aria-label="${item.name} quantity slider"
          />
          <div class="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
            <span>${item.min}</span>
            <span>${item.max}</span>
          </div>
        </div>
      </div>

      <!-- Live Per-Item Subtotal -->
      <div class="grid grid-cols-4 gap-1.5 text-center pt-2 border-t border-slate-100">
        <div class="rounded-lg bg-amber-50/80 py-1.5 px-1">
          <div class="text-[10px] font-semibold text-amber-700 uppercase">Kcal</div>
          <div id="sub-kcal-${item.id}" class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">0</div>
        </div>
        <div class="rounded-lg bg-emerald-50/80 py-1.5 px-1">
          <div class="text-[10px] font-semibold text-emerald-700 uppercase">Pro</div>
          <div id="sub-pro-${item.id}" class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">0g</div>
        </div>
        <div class="rounded-lg bg-blue-50/80 py-1.5 px-1">
          <div class="text-[10px] font-semibold text-blue-700 uppercase">Carb</div>
          <div id="sub-carb-${item.id}" class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">0g</div>
        </div>
        <div class="rounded-lg bg-rose-50/80 py-1.5 px-1">
          <div class="text-[10px] font-semibold text-rose-700 uppercase">Fat</div>
          <div id="sub-fat-${item.id}" class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">0g</div>
        </div>
      </div>
    `;

    dom.foodGrid.appendChild(card);
  });
}

export function updateFoodCardUI(item) {
  const qty = state.quantities[item.id];
  const card = document.getElementById(`card-${item.id}`);
  const qtyEl = document.getElementById(`qty-${item.id}`);
  const sliderEl = document.getElementById(`slider-${item.id}`);
  const kcalEl = document.getElementById(`sub-kcal-${item.id}`);
  const proEl = document.getElementById(`sub-pro-${item.id}`);
  const carbEl = document.getElementById(`sub-carb-${item.id}`);
  const fatEl = document.getElementById(`sub-fat-${item.id}`);

  if (!card || !qtyEl || !sliderEl) return;

  qtyEl.textContent = formatQty(qty);
  sliderEl.value = qty;

  const pct = ((qty - item.min) / (item.max - item.min)) * 100;
  sliderEl.style.background = `linear-gradient(to right, #10b981 0%, #10b981 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;

  const subKcal = Math.round(item.kcal * qty);
  const subPro = roundTo(item.protein * qty, 1);
  const subCarb = roundTo(item.carbs * qty, 1);
  const subFat = roundTo(item.fat * qty, 1);

  if (kcalEl) kcalEl.textContent = subKcal;
  if (proEl) proEl.textContent = `${subPro}g`;
  if (carbEl) carbEl.textContent = `${subCarb}g`;
  if (fatEl) fatEl.textContent = `${subFat}g`;

  if (qty === 0) {
    card.classList.add('opacity-75', 'bg-slate-50/70');
    card.classList.remove('bg-white');
  } else {
    card.classList.remove('opacity-75', 'bg-slate-50/70');
    card.classList.add('bg-white');
  }
}

export function recalculateTotals() {
  try {
    let totalKcal = 0;
    let totalPro = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let activeCount = 0;

    FOOD_ITEMS.forEach((item) => {
      const qty = state.quantities[item.id] || 0;
      if (qty > 0) activeCount += 1;
      totalKcal += item.kcal * qty;
      totalPro += item.protein * qty;
      totalCarbs += item.carbs * qty;
      totalFats += item.fat * qty;
    });

    state.customFoods.forEach((food) => {
      const factor = food.grams / 100;
      if (food.grams > 0) activeCount += 1;
      totalKcal += food.kcal * factor;
      totalPro += food.protein * factor;
      totalCarbs += food.carbs * factor;
      totalFats += food.fat * factor;
    });

    const roundedKcal = Math.round(totalKcal);
    const roundedPro = roundTo(totalPro, 1);
    const roundedCarbs = roundTo(totalCarbs, 1);
    const roundedFats = roundTo(totalFats, 1);

    if (dom.totalCalories) dom.totalCalories.textContent = roundedKcal.toLocaleString();
    if (dom.totalProtein) dom.totalProtein.textContent = roundedPro;
    if (dom.totalCarbs) dom.totalCarbs.textContent = roundedCarbs;
    if (dom.totalFats) dom.totalFats.textContent = roundedFats;

    if (dom.floatCalories) dom.floatCalories.textContent = roundedKcal.toLocaleString();
    if (dom.floatProtein) dom.floatProtein.textContent = `${roundedPro}g`;
    if (dom.floatCarbs) dom.floatCarbs.textContent = `${roundedCarbs}g`;
    if (dom.floatFats) dom.floatFats.textContent = `${roundedFats}g`;

    if (dom.activeItemsBadge) dom.activeItemsBadge.textContent = `${activeCount} / ${FOOD_ITEMS.length + state.customFoods.length} foods active`;

    const calGoal = Math.max(1, state.calorieGoal);
    const calPct = Math.round((roundedKcal / calGoal) * 100);
    if (dom.calPercentBadge) dom.calPercentBadge.textContent = `${calPct}%`;
    if (dom.calorieProgressBar) dom.calorieProgressBar.style.width = `${Math.min(calPct, 100)}%`;

    const proGoal = Math.max(1, state.proteinGoal);
    const proPct = Math.round((roundedPro / proGoal) * 100);
    if (dom.proPercentBadge) dom.proPercentBadge.textContent = `${proPct}%`;
    if (dom.proteinProgressBar) dom.proteinProgressBar.style.width = `${Math.min(proPct, 100)}%`;

    const proKcal = roundedPro * 4;
    const carbKcal = roundedCarbs * 4;
    const fatKcal = roundedFats * 9;
    const macroKcalSum = proKcal + carbKcal + fatKcal;

    let splitPro = 0;
    let splitCarb = 0;
    let splitFat = 0;

    if (macroKcalSum > 0) {
      splitPro = Math.round((proKcal / macroKcalSum) * 100);
      splitCarb = Math.round((carbKcal / macroKcalSum) * 100);
      splitFat = Math.max(0, 100 - splitPro - splitCarb);
    }

    if (dom.carbsKcalText) dom.carbsKcalText.textContent = `${Math.round(carbKcal).toLocaleString()} kcal`;
    if (dom.fatsKcalText) dom.fatsKcalText.textContent = `${Math.round(fatKcal).toLocaleString()} kcal`;
    if (dom.carbShareBadge) dom.carbShareBadge.textContent = `${splitCarb}% kcal`;
    if (dom.fatShareBadge) dom.fatShareBadge.textContent = `${splitFat}% kcal`;
    if (dom.carbShareBar) dom.carbShareBar.style.width = `${splitCarb}%`;
    if (dom.fatShareBar) dom.fatShareBar.style.width = `${splitFat}%`;

    if (dom.splitProteinPct) dom.splitProteinPct.textContent = `${splitPro}%`;
    if (dom.splitCarbsPct) dom.splitCarbsPct.textContent = `${splitCarb}%`;
    if (dom.splitFatsPct) dom.splitFatsPct.textContent = `${splitFat}%`;
    if (dom.barProtein) dom.barProtein.style.width = `${splitPro}%`;
    if (dom.barCarbs) dom.barCarbs.style.width = `${splitCarb}%`;
    if (dom.barFats) dom.barFats.style.width = `${splitFat}%`;

    const todayKey = getTodayDateStr();
    const todaySaved = cachedWeeklyLogs.some((l) => l.date === todayKey);
    if (!todaySaved && dom.dashTodayCals && dom.dashTodayPro) {
      dom.dashTodayCals.textContent = `${roundedKcal.toLocaleString()} kcal`;
      dom.dashTodayPro.textContent = `${roundedPro}g protein`;
    }
  } catch (err) {
    console.error('Error recalculating totals:', err);
  }
}

export function setItemQuantity(id, newQty) {
  const item = FOOD_ITEMS.find((f) => f.id === id);
  if (!item) return;
  const clamped = Math.min(item.max, Math.max(item.min, roundTo(newQty, 1)));
  state.quantities[id] = clamped;
  updateFoodCardUI(item);
  recalculateTotals();
}

export function updateAllUI() {
  FOOD_ITEMS.forEach(updateFoodCardUI);
  renderCustomFoods();
  recalculateTotals();
}

/* ========================================================
   EVENT BINDINGS
======================================================== */
export function bindEvents() {
  if (dom.usdaFoodSearch) {
    dom.usdaFoodSearch.addEventListener('input', () => {
      window.clearTimeout(usdaSearchTimer);
      const query = dom.usdaFoodSearch.value.trim();
      usdaSearchTimer = window.setTimeout(() => searchUsdaFoods(query), 300);
    });
    dom.usdaFoodSearch.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        renderUsdaResults([]);
        dom.usdaSearchMessage.textContent = 'Search closed.';
      } else if (event.key === 'ArrowDown' && !dom.usdaFoodResults.classList.contains('hidden')) {
        event.preventDefault();
        dom.usdaFoodResults.querySelector('button')?.focus();
      }
    });
  }

  if (dom.usdaFoodResults) {
    dom.usdaFoodResults.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowUp', 'Escape'].includes(event.key)) return;
      const options = [...dom.usdaFoodResults.querySelectorAll('button[data-search-index]')];
      const index = options.indexOf(document.activeElement);
      if (event.key === 'Escape') {
        dom.usdaFoodSearch.focus();
        renderUsdaResults([]);
        return;
      }
      event.preventDefault();
      const nextIndex = event.key === 'ArrowDown' ? Math.min(index + 1, options.length - 1) : index - 1;
      if (nextIndex < 0) dom.usdaFoodSearch.focus();
      else options[nextIndex]?.focus();
    });
    dom.usdaFoodResults.addEventListener('click', (event) => {
      const option = event.target.closest('button[data-search-index]');
      if (!option) return;
      const food = currentUsdaResults[Number(option.dataset.searchIndex)];
      if (food) addCustomFood(food);
    });
  }

  if (dom.customFoodList) {
    dom.customFoodList.addEventListener('input', (event) => {
      if (!event.target.matches('.custom-food-grams')) return;
      const food = state.customFoods.find((item) => item.fdcId === Number(event.target.dataset.fdcId));
      if (!food) return;
      food.grams = Number(event.target.value);
      updateCustomFoodCard(food);
      persistCustomFoods();
      recalculateTotals();
    });
    dom.customFoodList.addEventListener('click', (event) => {
      const remove = event.target.closest('button[data-action="remove-custom-food"]');
      if (!remove) return;
      const fdcId = Number(remove.dataset.fdcId);
      state.customFoods = state.customFoods.filter((food) => food.fdcId !== fdcId);
      persistCustomFoods();
      renderCustomFoods();
      recalculateTotals();
    });
  }

  // Food grid +/- buttons
  dom.foodGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    const item = FOOD_ITEMS.find((f) => f.id === id);
    if (!item) return;
    const current = state.quantities[id] || 0;
    const next = action === 'increment' ? current + item.step : current - item.step;
    setItemQuantity(id, next);
  });

  // Sliders
  dom.foodGrid.addEventListener('input', (e) => {
    if (e.target.matches('input[type="range"].food-slider')) {
      const id = e.target.dataset.id;
      const val = parseFloat(e.target.value);
      if (!Number.isNaN(val)) setItemQuantity(id, val);
    }
  });

  // Calorie Goal
  dom.calorieGoalInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val) && val > 0) {
      state.calorieGoal = val;
      recalculateTotals();
    }
  });
  dom.calorieGoalInput.addEventListener('blur', (e) => {
    const val = parseInt(e.target.value, 10);
    if (Number.isNaN(val) || val < 500) {
      state.calorieGoal = 2700;
      e.target.value = 2700;
      recalculateTotals();
    }
  });

  // Protein Goal
  dom.proteinGoalInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val) && val > 0) {
      state.proteinGoal = val;
      recalculateTotals();
    }
  });
  dom.proteinGoalInput.addEventListener('blur', (e) => {
    const val = parseInt(e.target.value, 10);
    if (Number.isNaN(val) || val < 20) {
      state.proteinGoal = 120;
      e.target.value = 120;
      recalculateTotals();
    }
  });

  // Recommended Plan
  dom.btnRecommended.addEventListener('click', () => {
    initDefaultState();
    updateAllUI();
    showToast('Loaded Recommended Lean Bulk Plan');
  });

  // Reset to 0
  dom.btnResetZero.addEventListener('click', () => {
    FOOD_ITEMS.forEach((item) => {
      state.quantities[item.id] = 0;
    });
    state.customFoods.forEach((food) => { food.grams = 0; });
    persistCustomFoods();
    updateAllUI();
    showToast('All food portions cleared to 0');
  });

  // Google Sign In
  dom.btnGoogleSignIn.addEventListener('click', async () => {
    try {
      await auth.signInWithPopup(googleProvider);
      showToast('✅ Signed in successfully!');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error('Sign-in error:', err);
        showToast('❌ Sign-in failed: ' + err.message);
      }
    }
  });

  // Sign Out
  dom.btnSignOut.addEventListener('click', async () => {
    try {
      if (dom.userDashboardDropdown) dom.userDashboardDropdown.classList.add('hidden');
      if (dom.btnUserDropdownToggle) dom.btnUserDropdownToggle.setAttribute('aria-expanded', 'false');
      if (dom.navDropdownChevron) dom.navDropdownChevron.classList.remove('rotate-180');
      await auth.signOut();
      showToast('Signed out');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  });

  // Navigation User Dashboard Dropdown Toggle & Interactions
  if (dom.btnUserDropdownToggle && dom.userDashboardDropdown) {
    dom.btnUserDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dom.userDashboardDropdown.classList.contains('hidden');
      if (isHidden) {
        dom.userDashboardDropdown.classList.remove('hidden');
        dom.btnUserDropdownToggle.setAttribute('aria-expanded', 'true');
        if (dom.navDropdownChevron) dom.navDropdownChevron.classList.add('rotate-180');
        // Render or resize chart smoothly after dropdown is revealed
        setTimeout(() => {
          if (weeklyChartInstance) {
            weeklyChartInstance.resize();
          } else if (cachedWeeklyLogs && cachedWeeklyLogs.length > 0) {
            renderWeeklyChart(cachedWeeklyLogs);
          }
        }, 60);
      } else {
        dom.userDashboardDropdown.classList.add('hidden');
        dom.btnUserDropdownToggle.setAttribute('aria-expanded', 'false');
        if (dom.navDropdownChevron) dom.navDropdownChevron.classList.remove('rotate-180');
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (dom.userDashboardDropdown && !dom.userDashboardDropdown.classList.contains('hidden')) {
        if (!dom.userDashboardDropdown.contains(e.target) && !dom.btnUserDropdownToggle.contains(e.target)) {
          dom.userDashboardDropdown.classList.add('hidden');
          dom.btnUserDropdownToggle.setAttribute('aria-expanded', 'false');
          if (dom.navDropdownChevron) dom.navDropdownChevron.classList.remove('rotate-180');
        }
      }
    });

    // Prevent clicks inside the dropdown from closing it accidentally
    dom.userDashboardDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Save Today's Log
  dom.btnSaveLog.addEventListener('click', saveTodayLog);

  // Toggle Weekly Analytics panel
  dom.btnToggleAnalytics.addEventListener('click', () => {
    const panel = dom.analyticsPanel;
    const chevron = dom.analyticsChevron;
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
      chevron.classList.remove('rotated');
    } else {
      panel.classList.add('open');
      chevron.classList.add('rotated');
    }
  });

  // Guest Banner Sign In
  if (dom.btnBannerSignIn) {
    dom.btnBannerSignIn.addEventListener('click', async () => {
      try {
        await auth.signInWithPopup(googleProvider);
        showToast('✅ Signed in successfully!');
      } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          console.error('Sign-in error:', err);
          showToast('❌ Sign-in failed: ' + err.message);
        }
      }
    });
  }

  // Dashboard Save Today's Log
  if (dom.dashBtnSaveNow) {
    dom.dashBtnSaveNow.addEventListener('click', saveTodayLog);
  }

  // Dashboard Save Targets
  if (dom.dashBtnSaveTargets) {
    dom.dashBtnSaveTargets.addEventListener('click', saveUserTargets);
  }

  // Dashboard Quick Preset Buttons
  document.querySelectorAll('.dash-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cal = btn.dataset.cal;
      const pro = btn.dataset.pro;
      if (dom.dashCalInput) dom.dashCalInput.value = cal;
      if (dom.dashProInput) dom.dashProInput.value = pro;
      showToast(`Preset loaded: ${cal} kcal / ${pro}g protein`);
    });
  });

  // Dashboard Graph Mode Switcher (Calories vs Protein)
  if (dom.btnGraphModeCalories) {
    dom.btnGraphModeCalories.addEventListener('click', () => {
      currentGraphMode = 'calories';
      dom.btnGraphModeCalories.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow-xs cursor-pointer';
      dom.btnGraphModeProtein.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer';
      renderWeeklyChart(cachedWeeklyLogs);
    });
  }

  if (dom.btnGraphModeProtein) {
    dom.btnGraphModeProtein.addEventListener('click', () => {
      currentGraphMode = 'protein';
      dom.btnGraphModeProtein.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-emerald-500 text-slate-950 shadow-xs cursor-pointer';
      dom.btnGraphModeCalories.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer';
      renderWeeklyChart(cachedWeeklyLogs);
    });
  }

  // Dashboard View History / Analytics Button
  if (dom.dashBtnViewFullAnalytics) {
    dom.dashBtnViewFullAnalytics.addEventListener('click', () => {
      // Close dropdown
      if (dom.userDashboardDropdown) {
        dom.userDashboardDropdown.classList.add('hidden');
        if (dom.btnUserDropdownToggle) dom.btnUserDropdownToggle.setAttribute('aria-expanded', 'false');
        if (dom.navDropdownChevron) dom.navDropdownChevron.classList.remove('rotate-180');
      }
      if (dom.analyticsPanel && !dom.analyticsPanel.classList.contains('open')) {
        dom.analyticsPanel.classList.add('open');
        if (dom.analyticsChevron) dom.analyticsChevron.classList.add('rotated');
      }
      if (dom.weeklyAnalyticsSection) {
        dom.weeklyAnalyticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // IntersectionObserver for compact sticky bar
  if ('IntersectionObserver' in window && dom.dailyTotalsSection && dom.floatingSummaryBar) {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          dom.floatingSummaryBar.classList.remove('-translate-y-full');
          dom.floatingSummaryBar.setAttribute('aria-hidden', 'false');
        } else {
          dom.floatingSummaryBar.classList.add('-translate-y-full');
          dom.floatingSummaryBar.setAttribute('aria-hidden', 'true');
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(dom.dailyTotalsSection);
  }
}

// Expose key functions to window for any inline onclick handlers or external calls
window.saveTodayLog = saveTodayLog;
window.saveUserTargets = saveUserTargets;
window.setItemQuantity = setItemQuantity;
window.updateAllUI = updateAllUI;
window.recalculateTotals = recalculateTotals;
window.renderWeeklyChart = renderWeeklyChart;
window.showToast = showToast;
window.state = state;
window.FOOD_ITEMS = FOOD_ITEMS;

// Bootstrap App
export function init() {
  try {
    initDomElements();
    initDefaultState();
    loadCustomFoods();
    renderFoodCards();
    renderCustomFoods();
    bindEvents();
    updateAllUI();
  } catch (err) {
    console.error('Initialization failed:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
