const app = document.getElementById("results-app");

// غيّر الرابط حسب رابط الـ API عندك من Visual Studio
// const API_BASE_URL = "http://localhost:5155";
// const API_BASE_URL = "http://mousegame.runasp.net";
const API_BASE_URL = "/backend";


// كلمة مرور بسيطة من 4 أرقام
// غيّرها كما تريد
const RESULTS_PAGE_PASSWORD = "1234";

const SESSION_UNLOCK_KEY = "mouse_trainer_results_unlocked";

let allResults = [];
let filteredResults = [];

function isUnlocked() {
  return sessionStorage.getItem(SESSION_UNLOCK_KEY) === "true";
}

function unlockResultsPage() {
  sessionStorage.setItem(SESSION_UNLOCK_KEY, "true");
}

function lockResultsPage() {
  sessionStorage.removeItem(SESSION_UNLOCK_KEY);
  renderPasswordScreen();
}

function renderPasswordScreen() {
  app.innerHTML = `
    <section class="min-h-screen flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        <div class="bg-gradient-to-l from-blue-950 via-blue-900 to-sky-700 text-white p-8 text-center">
          <div class="text-6xl mb-4">🔐</div>
          <h1 class="text-3xl font-bold mb-3">لوحة نتائج المتدربين</h1>
          <p class="text-blue-50 leading-8">
            أدخل كلمة المرور للوصول إلى سجل النتائج.
          </p>
        </div>

        <form id="password-form" class="p-7">
          <label class="block mb-2 font-bold text-slate-900">
            كلمة المرور
          </label>

          <input
            id="password-input"
            type="password"
            inputmode="numeric"
            maxlength="4"
            placeholder="••••"
            class="w-full text-center tracking-[1rem] rounded-2xl border border-slate-300 px-4 py-4 text-2xl outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-600"
            autocomplete="off"
          />

          <p id="password-error" class="hidden mt-3 text-red-600 font-bold text-sm">
            كلمة المرور غير صحيحة.
          </p>

          <button
            type="submit"
            class="w-full mt-6 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl py-4 font-bold text-lg"
          >
            دخول
          </button>

          <a
            href="./index.html"
            class="block text-center mt-4 text-slate-500 hover:text-blue-800 font-bold"
          >
            العودة إلى اللعبة
          </a>
        </form>

      </div>
    </section>
  `;

  const form = document.getElementById("password-form");
  const input = document.getElementById("password-input");
  const error = document.getElementById("password-error");

  input.focus();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const password = input.value.trim();

    if (password !== RESULTS_PAGE_PASSWORD) {
      error.classList.remove("hidden");
      input.classList.add(
        "border-red-500",
        "focus:border-red-500",
        "focus:ring-red-100"
      );
      input.value = "";
      input.focus();
      return;
    }

    unlockResultsPage();
    renderDashboard();
    loadResults();
  });
}

function renderDashboard() {
  app.innerHTML = `
    <section class="min-h-screen px-4 py-6">
      <div class="max-w-7xl mx-auto">
        
        <header class="bg-white rounded-3xl shadow border border-slate-200 overflow-hidden mb-6">
          <div class="bg-gradient-to-l from-blue-950 via-blue-900 to-sky-700 text-white p-6 md:p-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p class="text-blue-100 mb-2">لوحة إدارية بسيطة</p>
                <h1 class="text-3xl md:text-4xl font-bold mb-3">نتائج المتدربين</h1>
                <p class="text-blue-50 leading-8 max-w-3xl">
                  عرض نتائج التدريب المحفوظة في SQLite، مع إمكانية البحث، التصفية، الحذف، والتصدير.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-3">
                <a
                  href="./index.html"
                  class="bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-2xl px-5 py-3 font-bold text-center"
                >
                  العودة للعبة
                </a>

                <button
                  id="logout-button"
                  class="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-5 py-3 font-bold"
                >
                  خروج
                </button>
              </div>
            </div>
          </div>

          <div class="p-5 md:p-6">
            <div id="stats-grid" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              ${renderStatsSkeleton()}
            </div>
          </div>
        </header>

        <section class="bg-white rounded-3xl shadow border border-slate-200 p-5 md:p-6 mb-6">
          <div class="grid lg:grid-cols-5 gap-4">
            
            <div class="lg:col-span-2">
              <label class="block mb-2 font-bold text-slate-900">بحث</label>
              <input
                id="search-input"
                type="text"
                placeholder="ابحث بالاسم، المرحلة، التقييم..."
                class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-600"
              />
            </div>

            <div>
              <label class="block mb-2 font-bold text-slate-900">المستوى</label>
              <select
                id="difficulty-filter"
                class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-600"
              >
                <option value="">كل المستويات</option>
                <option value="beginner">مبتدئ</option>
                <option value="medium">متوسط</option>
                <option value="advanced">متقدم</option>
              </select>
            </div>

            <div>
              <label class="block mb-2 font-bold text-slate-900">نوع التدريب</label>
              <select
                id="scope-filter"
                class="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-600"
              >
                <option value="">كل الأنواع</option>
                <option value="تدريب كامل">تدريب كامل</option>
                <option value="تدريب قسم محدد">تدريب قسم محدد</option>
              </select>
            </div>

            <div class="flex items-end">
              <button
                id="refresh-button"
                class="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-2xl px-5 py-3 font-bold"
              >
                تحديث
              </button>
            </div>

          </div>

          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-5">
            <p id="table-status" class="text-slate-500 font-bold">
              جاري تحميل النتائج...
            </p>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                id="export-filtered-button"
                class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-5 py-3 font-bold"
              >
                تصدير النتائج المعروضة CSV
              </button>

              <button
                id="export-all-button"
                class="bg-sky-600 hover:bg-sky-700 text-white rounded-2xl px-5 py-3 font-bold"
              >
                تصدير كل النتائج CSV
              </button>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-3xl shadow border border-slate-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[1100px] text-right">
              <thead class="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th class="p-4 font-bold text-slate-700">#</th>
                  <th class="p-4 font-bold text-slate-700">اسم المتدرب</th>
                  <th class="p-4 font-bold text-slate-700">المستوى</th>
                  <th class="p-4 font-bold text-slate-700">نوع التدريب</th>
                  <th class="p-4 font-bold text-slate-700">القسم / المرحلة</th>
                  <th class="p-4 font-bold text-slate-700">النقاط</th>
                  <th class="p-4 font-bold text-slate-700">المدة</th>
                  <th class="p-4 font-bold text-slate-700">التقييم</th>
                  <th class="p-4 font-bold text-slate-700">التاريخ</th>
                  <th class="p-4 font-bold text-slate-700">إجراء</th>
                </tr>
              </thead>

              <tbody id="results-table-body">
                <tr>
                  <td colspan="10" class="p-8 text-center text-slate-500 font-bold">
                    جاري تحميل البيانات...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </section>
  `;

  document
    .getElementById("logout-button")
    .addEventListener("click", lockResultsPage);
  document
    .getElementById("refresh-button")
    .addEventListener("click", loadResults);

  document
    .getElementById("search-input")
    .addEventListener("input", applyFilters);
  document
    .getElementById("difficulty-filter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("scope-filter")
    .addEventListener("change", applyFilters);

  document
    .getElementById("export-filtered-button")
    .addEventListener("click", () => {
      exportResultsToCsv(filteredResults, "filtered");
    });

  document.getElementById("export-all-button").addEventListener("click", () => {
    exportResultsToCsv(allResults, "all");
  });
}

function renderStatsSkeleton() {
  return `
    ${["النتائج", "متوسط النقاط", "متوسط المدة", "أعلى نتيجة"]
      .map(
        (label) => `
      <div class="rounded-3xl bg-slate-100 p-5">
        <p class="text-slate-500 mb-2">${label}</p>
        <p class="text-2xl font-bold text-slate-900">...</p>
      </div>
    `
      )
      .join("")}
  `;
}

// console.log("Loading results from API...");
async function loadResults() {
  const status = document.getElementById("table-status");
  const tableBody = document.getElementById("results-table-body");

  try {
    status.textContent = "جاري تحميل النتائج...";
    status.className = "text-sky-700 font-bold";

    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="p-8 text-center text-slate-500 font-bold">
          جاري تحميل البيانات...
        </td>
      </tr>
    `;

    const response = await fetch(`${API_BASE_URL}/results?take=2000`);
    console.log("API response status:");
    console.log("API response status:", response);


     if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    allResults = await response.json();
    filteredResults = [...allResults];

    renderStats();
    renderResultsTable();
    updateStatus();
  } catch (error) {
    console.error("Error loading results:", error);

    status.textContent =
      "حدث خطأ أثناء تحميل النتائج. تأكد أن الـ API يعمل والرابط صحيح.721";
    status.className = "text-red-600 font-bold";

    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="p-8 text-center text-red-600 font-bold">
          لم يتم تحميل النتائج.
        </td>
      </tr>
    `;
  }
}

function applyFilters() {
  const search = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();
  const difficulty = document.getElementById("difficulty-filter").value;
  const scope = document.getElementById("scope-filter").value;

  filteredResults = allResults.filter((item) => {
    const matchesSearch =
      !search ||
      String(item.playerName || "")
        .toLowerCase()
        .includes(search) ||
      String(item.stageTitle || "")
        .toLowerCase()
        .includes(search) ||
      String(item.trainingScope || "")
        .toLowerCase()
        .includes(search) ||
      String(item.evaluation || "")
        .toLowerCase()
        .includes(search);

    const matchesDifficulty = !difficulty || item.difficulty === difficulty;

    const matchesScope = !scope || item.trainingScope === scope;

    return matchesSearch && matchesDifficulty && matchesScope;
  });

  renderStats();
  renderResultsTable();
  updateStatus();
}

function renderStats() {
  const total = filteredResults.length;

  const averageScore = total
    ? Math.round(
        filteredResults.reduce(
          (sum, item) => sum + Number(item.totalScore || 0),
          0
        ) / total
      )
    : 0;

  const averageDuration = total
    ? Math.round(
        filteredResults.reduce(
          (sum, item) => sum + Number(item.durationSeconds || 0),
          0
        ) / total
      )
    : 0;

  const maxScore = total
    ? Math.max(...filteredResults.map((item) => Number(item.totalScore || 0)))
    : 0;

  const fullTrainingCount = filteredResults.filter(
    (item) => item.trainingScope === "تدريب كامل"
  ).length;
  const singleTrainingCount = filteredResults.filter(
    (item) => item.trainingScope === "تدريب قسم محدد"
  ).length;

  document.getElementById("stats-grid").innerHTML = `
    <div class="rounded-3xl bg-blue-50 border border-blue-100 p-5">
      <p class="text-blue-700 mb-2">عدد النتائج</p>
      <p class="text-3xl font-bold text-blue-950">${total}</p>
    </div>

    <div class="rounded-3xl bg-emerald-50 border border-emerald-100 p-5">
      <p class="text-emerald-700 mb-2">متوسط النقاط</p>
      <p class="text-3xl font-bold text-emerald-950">${averageScore}</p>
    </div>

    <div class="rounded-3xl bg-amber-50 border border-amber-100 p-5">
      <p class="text-amber-700 mb-2">متوسط المدة</p>
      <p class="text-3xl font-bold text-amber-950">${averageDuration} ث</p>
    </div>

    <div class="rounded-3xl bg-violet-50 border border-violet-100 p-5">
      <p class="text-violet-700 mb-2">أعلى نتيجة</p>
      <p class="text-3xl font-bold text-violet-950">${maxScore}</p>
      <p class="text-sm text-violet-700 mt-2">
        كامل: ${fullTrainingCount} | أقسام: ${singleTrainingCount}
      </p>
    </div>
  `;
}

function renderResultsTable() {
  const tableBody = document.getElementById("results-table-body");

  if (filteredResults.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="p-8 text-center text-slate-500 font-bold">
          لا توجد نتائج مطابقة.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filteredResults
    .map(
      (item, index) => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
      <td class="p-4 font-bold text-slate-500">${index + 1}</td>

      <td class="p-4">
        <div class="font-bold text-slate-900">${escapeHtml(
          item.playerName
        )}</div>
        <div class="text-xs text-slate-400 mt-1">ID: ${item.id}</div>
      </td>

      <td class="p-4">
        <span class="inline-flex rounded-full bg-blue-50 text-blue-800 px-3 py-1 text-sm font-bold">
          ${escapeHtml(item.difficultyLabel)}
        </span>
      </td>

      <td class="p-4">
        <span class="inline-flex rounded-full ${
          item.trainingScope === "تدريب كامل"
            ? "bg-emerald-50 text-emerald-800"
            : "bg-amber-50 text-amber-800"
        } px-3 py-1 text-sm font-bold">
          ${escapeHtml(item.trainingScope)}
        </span>
      </td>

      <td class="p-4 max-w-[250px]">
        <div class="font-bold text-slate-800 line-clamp-2">${escapeHtml(
          item.stageTitle
        )}</div>
      </td>

      <td class="p-4">
        <span class="font-bold text-slate-900">${item.totalScore}</span>
      </td>

      <td class="p-4">
        ${item.durationSeconds} ثانية
      </td>

      <td class="p-4">
        <span class="inline-flex rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-sm font-bold">
          ${escapeHtml(item.evaluation)}
        </span>
      </td>

      <td class="p-4 text-slate-600">
        ${formatDate(item.createdAt)}
      </td>

      <td class="p-4">
        <button
          data-delete-id="${item.id}"
          class="delete-result-button bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl px-4 py-2 font-bold"
        >
          حذف
        </button>
      </td>
    </tr>
  `
    )
    .join("");

  document.querySelectorAll(".delete-result-button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.deleteId);
      deleteResult(id);
    });
  });
}

async function deleteResult(id) {
  const item = allResults.find((result) => result.id === id);

  const confirmed = confirm(
    `هل أنت متأكد من حذف نتيجة المتدرب؟\n\n` +
      `الاسم: ${item?.playerName || "غير معروف"}\n` +
      `رقم النتيجة: ${id}`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/results/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("فشل حذف النتيجة");
    }

    allResults = allResults.filter((result) => result.id !== id);
    filteredResults = filteredResults.filter((result) => result.id !== id);

    renderStats();
    renderResultsTable();
    updateStatus("تم حذف النتيجة بنجاح.", "success");
  } catch (error) {
    console.error(error);
    updateStatus("حدث خطأ أثناء حذف النتيجة.", "error");
  }
}

function updateStatus(customMessage = null, type = "normal") {
  const status = document.getElementById("table-status");

  if (customMessage) {
    status.textContent = customMessage;
    status.className =
      type === "success"
        ? "text-emerald-700 font-bold"
        : type === "error"
        ? "text-red-600 font-bold"
        : "text-slate-500 font-bold";
    return;
  }

  status.textContent = `عدد النتائج المعروضة: ${filteredResults.length} من أصل ${allResults.length}`;
  status.className = "text-slate-500 font-bold";
}

// function exportResultsToCsv(results, scopeName) {
//   if (!results || results.length === 0) {
//     alert("لا توجد نتائج للتصدير.");
//     return;
//   }

//   const headers = [
//     "Id",
//     "ResultCode",
//     "PlayerName",
//     "Difficulty",
//     "DifficultyLabel",
//     "TrainingScope",
//     "StageTitle",
//     "TotalScore",
//     "CompletedStages",
//     "DurationSeconds",
//     "Evaluation",
//     "CreatedAt",
//   ];

//   const rows = results.map((item) => [
//     item.id,
//     item.resultCode,
//     item.playerName,
//     item.difficulty,
//     item.difficultyLabel,
//     item.trainingScope,
//     item.stageTitle,
//     item.totalScore,
//     item.completedStages,
//     item.durationSeconds,
//     item.evaluation,
//     formatDate(item.createdAt),
//   ]);

//   //   const csvContent = [
//   //     headers.map(csvEscape).join(","),
//   //     ...rows.map((row) => row.map(csvEscape).join(","))
//   //   ].join("\n");

//   const csvContent = [
//     "sep=,",
//     headers.map(csvEscape).join(","),
//     ...rows.map((row) => row.map(csvEscape).join(",")),
//   ].join("\r\n");

//   // BOM لدعم العربية في Excel
//   const blob = new Blob(["\uFEFF" + csvContent], {
//     type: "text/csv;charset=utf-8",
//   });

//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");

//   const datePart = new Date().toISOString().slice(0, 10);

//   link.href = url;
//   link.download = `mouse-trainer-results-${scopeName}-${datePart}.csv`;
//   link.style.display = "none";

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   URL.revokeObjectURL(url);
// }


function exportResultsToCsv(results, scopeName) {
  if (!results || results.length === 0) {
    alert("لا توجد نتائج للتصدير.");
    return;
  }

  const rowsHtml = results.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(item.id)}</td>
      <td>${escapeHtml(item.resultCode)}</td>
      <td>${escapeHtml(item.playerName)}</td>
      <td>${escapeHtml(item.difficulty)}</td>
      <td>${escapeHtml(item.difficultyLabel)}</td>
      <td>${escapeHtml(item.trainingScope)}</td>
      <td>${escapeHtml(item.stageTitle)}</td>
      <td>${escapeHtml(item.totalScore)}</td>
      <td>${escapeHtml(item.completedStages)}</td>
      <td>${escapeHtml(item.durationSeconds)}</td>
      <td>${escapeHtml(item.evaluation)}</td>
      <td>${escapeHtml(formatDate(item.createdAt))}</td>
    </tr>
  `).join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Tahoma, Arial, sans-serif;
          direction: rtl;
        }

        table {
          border-collapse: collapse;
          width: 100%;
          direction: rtl;
        }

        th, td {
          border: 1px solid #999;
          padding: 8px;
          text-align: right;
          mso-number-format: "\\@";
        }

        th {
          background-color: #d9eaf7;
          font-weight: bold;
        }

        .title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .meta {
          margin-bottom: 15px;
          color: #555;
        }
      </style>
    </head>

    <body>
      <div class="title">نتائج المتدربين - أتقن استخدام الماوس</div>
      <div class="meta">تاريخ التصدير: ${escapeHtml(new Date().toLocaleString("ar"))}</div>

      <table>
        <thead>
          <tr>
            <th>م</th>
            <th>Id</th>
            <th>ResultCode</th>
            <th>اسم المتدرب</th>
            <th>Difficulty</th>
            <th>المستوى</th>
            <th>نوع التدريب</th>
            <th>القسم / المرحلة</th>
            <th>النقاط</th>
            <th>المراحل المكتملة</th>
            <th>المدة بالثواني</th>
            <th>التقييم</th>
            <th>تاريخ التدريب</th>
          </tr>
        </thead>

        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // BOM + HTML Excel لضمان ظهور العربية بشكل صحيح
  const blob = new Blob(["\uFEFF" + htmlContent], {
    type: "application/vnd.ms-excel;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const datePart = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `mouse-trainer-results-${scopeName}-${datePart}.xls`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? "")
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .trim();

  const escaped = text.replace(/"/g, '""');

  if (escaped.includes(",") || escaped.includes('"')) {
    return `"${escaped}"`;
  }

  return escaped;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ar");
}

if (isUnlocked()) {
  renderDashboard();
  loadResults();
} else {
  renderPasswordScreen();
}
