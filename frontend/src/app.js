const app = document.getElementById("app");

const stages = [
  {
    id: "move",
    title: "تدريب تحريك الماوس",
    description: "يتعلم المتدرب التحكم بالمؤشر والوصول إلى الهدف.",
    instruction: "المطلوب: ضع المؤشر فوق الدائرة بدون نقر.",
  },
  {
    id: "click",
    title: "تدريب النقر بالزر الأيسر",
    description: "يتعلم المتدرب الضغط على العناصر بزر الماوس الأيسر.",
    instruction: "المطلوب: اضغط على الدائرة بزر الماوس الأيسر.",
  },
  {
    id: "double",
    title: "تدريب النقر المزدوج",
    description: "يتعلم المتدرب فتح الملفات بالنقر مرتين بسرعة.",
    instruction: "المطلوب: انقر نقرتين متتاليتين بسرعة على أيقونة الملف.",
    requiredSuccess: 4,
  },
  {
    id: "drag",
    title: "تدريب السحب والإفلات",
    description:
      "يتعلم المتدرب الضغط مع الاستمرار ثم الإفلات في المكان الصحيح.",
    instruction: "المطلوب: اسحب البطاقة إلى الصندوق.",
    requiredSuccess: 4,
  },
  {
    id: "right",
    title: "تدريب زر الماوس الأيمن",
    description: "يتعلم المتدرب إظهار القائمة المختصرة واختيار أمر منها.",
    instruction: "المطلوب: اضغط بالزر الأيمن على البطاقة ثم اختر فتح.",
    requiredSuccess: 4,
  },
  {
    id: "scroll",
    title: "تدريب عجلة التمرير",
    description: "يتعلم المتدرب النزول والصعود داخل صفحة طويلة.",
    instruction:
      "المطلوب: استخدم عجلة الماوس حتى تصل إلى زر النجمة واضغط عليه.",
    requiredSuccess: 3,
  },
  {
    id: "final",
    title: "التحدي النهائي العملي",
    description: "تطبيق عملي يجمع أهم مهارات الماوس في موقف واحد.",
    instruction: "المطلوب: نفذ خطوات التحدي بالترتيب حتى إنهاء التدريب.",
    requiredSuccess: 1,
  },
];


const state = {
  playerName: "",
  difficulty: "beginner",
  currentStageIndex: 0,
  stageSuccess: 0,
  totalScore: 0,
  startedAt: null,
  finalStep: 0,

  // full = تدريب كامل
  // single = تدريب قسم واحد فقط
  trainingMode: "full",
  selectedStageIndex: null,
};

function getDifficultySettings() {
  const settings = {
    beginner: {
      label: "مبتدئ",
      targetSize: 120,
      successTarget: 7,
    },
    medium: {
      label: "متوسط",
      targetSize: 90,
      successTarget: 5,
    },
    advanced: {
      label: "متقدم",
      targetSize: 70,
      successTarget: 5,
    },
  };

  return settings[state.difficulty] ?? settings.beginner;
}

function getCurrentStage() {
  return stages[state.currentStageIndex];
}

function getRequiredSuccess(stage = getCurrentStage()) {
  const difficulty = getDifficultySettings();
  return stage?.requiredSuccess ?? difficulty.successTarget;
}

// بداية التطبيق
function isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();

  const isMobileUserAgent =
    /android|iphone|ipad|ipod|windows phone|mobile/i.test(userAgent);

  const isSmallScreen = window.innerWidth < 768;

  return isMobileUserAgent || isSmallScreen;
}

console.log("هل الجهاز جوال؟", isMobileDevice());
// إذا كان الجهاز جوال، نعرض تحذير أو نمنع الدخول حسب القرار
function renderMobileWarning() {
  app.innerHTML = `
    <section class="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-100">
      <div class="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center">
        
        <div class="bg-gradient-to-l from-blue-950 to-sky-700 text-white p-8">
          <div class="text-6xl mb-4">🖱️</div>
          <h1 class="text-3xl font-bold mb-3">التدريب مخصص للكمبيوتر</h1>
          <p class="leading-8 text-blue-50">
            هذه اللعبة مصممة لتعليم استخدام الماوس، لذلك تعمل بأفضل شكل على جهاز كمبيوتر أو لابتوب.
          </p>
        </div>

        <div class="p-7">
          <div class="rounded-3xl bg-amber-50 border border-amber-200 p-5 mb-5 text-amber-900 leading-8">
            يبدو أنك فتحت اللعبة من جوال أو شاشة صغيرة.  
            للحصول على تجربة تدريب صحيحة، يرجى فتح الرابط من جهاز يحتوي على ماوس.
          </div>

          <div class="grid gap-3 text-right mb-6">
            <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              ✅ تدريب تحريك مؤشر الماوس
            </div>
            <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              ✅ تدريب النقر والنقر المزدوج
            </div>
            <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              ✅ تدريب السحب والإفلات والزر الأيمن
            </div>
          </div>

          <button 
            id="copy-link"
            class="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-2xl py-4 font-bold text-lg"
          >
            نسخ رابط اللعبة
          </button>

          <p id="copy-message" class="mt-4 text-sm text-slate-500"></p>
        </div>
      </div>
    </section>
  `;

  document.getElementById("copy-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      document.getElementById("copy-message").textContent = "تم نسخ الرابط. افتحه من الكمبيوتر أو اللابتوب.";
      document.getElementById("copy-message").className = "mt-4 text-sm text-emerald-700 font-bold";
    } catch {
      document.getElementById("copy-message").textContent = "لم يتم النسخ تلقائيا. انسخ الرابط من شريط المتصفح.";
      document.getElementById("copy-message").className = "mt-4 text-sm text-red-600 font-bold";
    }
  });
}









function showMobileAlert() {
  alert(
    "تنبيه مهم:\n\n" +
    "     المستخدم :  [ ايمن عبد الله ]   لا يمكن فتح اللعبة من الجوال.\n" 
  );
}

// function showMobileAlert() {
//   alert(
//     "تنبيه مهم:\n\n" +
//     "هذه اللعبة مصممة لتعليم استخدام الماوس.\n" +
//     "للحصول على أفضل تجربة تدريبية، يرجى فتحها من جهاز كمبيوتر أو لابتوب.\n\n" +
//     "يمكنك المتابعة من الجوال، لكن التدريب لن يكون دقيقا."
//   );
// }
// عرض الصفحة الرئيسية لاختيار اسم المتدرب والمستوى وبدء التدريب



function renderHome() {
  app.innerHTML = `
    <section class="min-h-screen px-4 py-8">
      <div class="w-full max-w-7xl mx-auto">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">

          <div class="bg-gradient-to-l from-blue-950 via-blue-900 to-sky-700 text-white p-8 md:p-10">
            <p class="text-sm md:text-base opacity-90 mb-3">لعبة تعليمية  </p>
            <h1 class="text-3xl md:text-5xl font-bold mb-4">أتقن استخدام الماوس</h1>
            <p class="text-lg md:text-xl leading-9 max-w-4xl">
              تدريب عملي للكبار يساعد المتدرب على تعلم مهارات الماوس الأساسية خطوة بخطوة، مع إمكانية التدريب الكامل أو اختيار مهارة محددة.
            </p>
          </div>

          <div class="p-6 md:p-10">
            <div class="grid lg:grid-cols-3 gap-6 mb-8">
              
              <div class="lg:col-span-1">
                <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6 sticky top-6">
                  <h2 class="text-2xl font-bold mb-5 text-slate-900">بيانات التدريب</h2>

                  <form id="start-form" class="space-y-5">
                    <div>
                      <label class="block mb-2 font-semibold">اسم المتدرب</label>
                      <input 
                        id="player-name"
                        type="text"
                        placeholder="مثال: أحمد"
                        class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-lg outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-600 bg-white" required
                      />
                    </div>

                    <div>
                      <label class="block mb-2 font-semibold">مستوى التدريب</label>
                      <select 
                        id="difficulty"
                        class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-lg outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-600 bg-white"
                      >
                        <option value="beginner">مبتدئ - أهداف كبيرة وتدريب مريح</option>
                        <option value="medium">متوسط - أهداف متوسطة</option>
                        <option value="advanced">متقدم - أهداف أصغر وتحتاج دقة أعلى</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      class="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-2xl py-4 text-xl font-bold transition"
                    >
                      بدء التدريب الكامل
                    </button>
                  </form>

                  <div class="mt-5 rounded-2xl bg-white border border-slate-200 p-4 text-slate-700 leading-7">
                    <p class="font-bold text-slate-900 mb-1">ملاحظة للمدرب</p>
                    <p>
                      يمكن تشغيل التدريب الكامل أو اختيار قسم واحد فقط حسب مستوى المتدرب.
                    </p>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-2">
                <div class="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 class="text-2xl font-bold text-slate-900">اختر قسم التدريب</h2>
                    <p class="text-slate-500 mt-1">يمكنك تدريب المتدرب على مهارة محددة فقط.</p>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  ${stages
                    .map(
                      (stage, index) => `
                    <button
                    
                      type="button"
                      data-stage-index="${index}"
                      class="stage-card text-right rounded-3xl border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 p-5 transition shadow-sm hover:shadow-md" disabled
                    >
                      <div class="flex items-start gap-4">
                        <div class="w-12 h-12 shrink-0 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl">
                          ${index + 1}
                        </div>
                        <div>
                          <h3 class="font-bold text-lg text-slate-900">${
                            stage.title
                          }</h3>
                          <p class="text-slate-600 mt-2 leading-7">${
                            stage.description
                          }</p>
                          <p class="mt-3 text-sky-700 font-bold">ابدأ هذا القسم فقط ←</p>
                        </div>
                      </div>
                    </button>
                  `
                    )
                    .join("")}
                </div>

                <div class="mt-8 rounded-3xl bg-blue-50 border border-blue-100 p-6">
                  <h3 class="font-bold text-xl text-blue-950 mb-3">كيف يستفيد المتدرب؟</h3>
                  <div class="grid md:grid-cols-2 gap-3 text-blue-900 leading-7">
                    <p>✅ يتعلم بدون ضغط أو إحراج.</p>
                    <p>✅ يكرر المهارة التي يضعف فيها.</p>
                    <p>✅ ينتقل من السهل إلى الأصعب.</p>
                    <p>✅ يكتسب ثقة قبل استخدام الحاسوب فعليا.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  `;

  document
    .getElementById("start-form")
    .addEventListener("submit", startFullGame);

  document.querySelectorAll(".stage-card").forEach((button) => {
    button.addEventListener("click", () => {
      const stageIndex = Number(button.dataset.stageIndex);
      startSingleStage(stageIndex);
    });
  });
}

function prepareTrainingSession() {
  const nameInput = document.getElementById("player-name");
  const difficultyInput = document.getElementById("difficulty");

  state.playerName = nameInput?.value.trim() || "متدرب";
  state.difficulty = difficultyInput?.value || "beginner";
  state.stageSuccess = 0;
  state.totalScore = 0;
  state.startedAt = new Date();
  state.finalStep = 0;
}

function startFullGame(event) {
  event.preventDefault();

  prepareTrainingSession();

  state.trainingMode = "full";
  state.selectedStageIndex = null;
  state.currentStageIndex = 0;

  renderStage();
}

function startSingleStage(stageIndex) {
  prepareTrainingSession();

  state.trainingMode = "single";
  state.selectedStageIndex = stageIndex;
  state.currentStageIndex = stageIndex;

  renderStage();
}

function startGame(event) {
  event.preventDefault();

  const nameInput = document.getElementById("player-name");
  const difficultyInput = document.getElementById("difficulty");

  state.playerName = nameInput.value.trim() || "متدرب";
  state.difficulty = difficultyInput.value;
  state.currentStageIndex = 0;
  state.stageSuccess = 0;
  state.totalScore = 0;
  state.startedAt = new Date();
  state.finalStep = 0;

  renderStage();
}

function renderStage() {
  const stage = getCurrentStage();

  if (!stage) {
    renderResult();
    return;
  }

  if (stage.id === "move") renderMoveStage(stage);
  if (stage.id === "click") renderClickStage(stage);
  if (stage.id === "double") renderDoubleClickStage(stage);
  if (stage.id === "drag") renderDragStage(stage);
  if (stage.id === "right") renderRightClickStage(stage);
  if (stage.id === "scroll") renderScrollStage(stage);
  if (stage.id === "final") renderFinalChallenge(stage);
}

function renderStageShell(stage, contentHtml) {
  const difficulty = getDifficultySettings();
  const stageNumber = state.currentStageIndex + 1;
  const totalStages = stages.length;
  const requiredSuccess = getRequiredSuccess(stage);

  app.innerHTML = `
    <section class="min-h-screen px-4 py-6">
      <div class="max-w-6xl mx-auto">
        <header class="bg-white rounded-3xl shadow border border-slate-200 p-5 mb-5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p class="text-slate-500 mb-1">المتدرب: <span class="font-bold text-slate-900">${
                state.playerName
              }</span></p>
              <h1 class="text-2xl md:text-3xl font-bold text-slate-900">${
                stage.title
              }</h1>
              <p class="text-slate-600 mt-2">${stage.instruction}</p>
            </div>

            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-slate-100 rounded-2xl px-4 py-3">
                <p class="text-sm text-slate-500">المرحلة</p>
                <p class="font-bold text-lg">${stageNumber} / ${totalStages}</p>
              </div>
              <div class="bg-slate-100 rounded-2xl px-4 py-3">
                <p class="text-sm text-slate-500">المستوى</p>
                <p class="font-bold text-lg">${difficulty.label}</p>
              </div>
              <div class="bg-slate-100 rounded-2xl px-4 py-3">
                <p class="text-sm text-slate-500">النقاط</p>
                <p id="score-text" class="font-bold text-lg">${
                  state.totalScore
                }</p>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <div class="flex justify-between mb-2 text-sm text-slate-500">
              <span>تقدم المرحلة</span>
              <span id="progress-text">${
                state.stageSuccess
              } / ${requiredSuccess}</span>
            </div>
            <div class="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div id="progress-bar" class="h-full bg-sky-600 rounded-full transition-all duration-300" style="width: ${getStageProgress(
                stage
              )}%"></div>
            </div>
          </div>
        </header>

        <div class="bg-white rounded-3xl shadow border border-slate-200 p-5">
          ${contentHtml}
        </div>

        <div class="mt-5 flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
          <button id="back-home" class="px-5 py-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50">
            الرجوع للبداية
          </button>

          <p class="text-slate-500 text-sm">
            نصيحة: اجعل يدك ثابتة على الطاولة وحرك الماوس بهدوء.
          </p>
        </div>
      </div>
    </section>
  `;

  document.getElementById("back-home").addEventListener("click", renderHome);
}

function getStageProgress(stage = getCurrentStage()) {
  const requiredSuccess = getRequiredSuccess(stage);
  return Math.min((state.stageSuccess / requiredSuccess) * 100, 100);
}

function updateProgress() {
  const stage = getCurrentStage();
  const requiredSuccess = getRequiredSuccess(stage);

  document.getElementById("score-text").textContent = state.totalScore;
  document.getElementById(
    "progress-text"
  ).textContent = `${state.stageSuccess} / ${requiredSuccess}`;
  document.getElementById("progress-bar").style.width = `${getStageProgress(
    stage
  )}%`;
}

function registerSuccess(points = 10) {
  const stage = getCurrentStage();
  const requiredSuccess = getRequiredSuccess(stage);

  state.stageSuccess += 1;
  state.totalScore += points;

  updateProgress();

  if (state.stageSuccess >= requiredSuccess) {
    setTimeout(() => {
      if (state.trainingMode === "single") {
        renderSingleStageResult();
        return;
      }

      state.currentStageIndex += 1;
      state.stageSuccess = 0;
      renderStage();
    }, 700);
  }
}

function getRandomPosition(container, elementSize) {
  const padding = 24;
  const maxX = container.clientWidth - elementSize - padding;
  const maxY = container.clientHeight - elementSize - padding;

  const x = Math.floor(Math.random() * Math.max(maxX, 1)) + padding / 2;
  const y = Math.floor(Math.random() * Math.max(maxY, 1)) + padding / 2;

  return { x, y };
}

function renderMoveStage(stage) {
  const difficulty = getDifficultySettings();

  renderStageShell(
    stage,
    `
    <div class="mb-4 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-blue-900 leading-7">
      حرّك الماوس بهدوء حتى يلامس المؤشر الدائرة. لا تضغط أي زر في هذه المرحلة.
    </div>

    <div id="play-area" class="relative h-[430px] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden">
      <div 
        id="move-target"
        class="absolute rounded-full bg-sky-600 shadow-xl flex items-center justify-center text-white font-bold select-none transition-all duration-300"
        style="width: ${difficulty.targetSize}px; height: ${difficulty.targetSize}px;"
      >
        المسني
      </div>
    </div>
  `
  );

  const playArea = document.getElementById("play-area");
  const target = document.getElementById("move-target");
  let locked = false;

  function placeTarget() {
    const position = getRandomPosition(playArea, difficulty.targetSize);
    target.style.left = `${position.x}px`;
    target.style.top = `${position.y}px`;
  }

  target.addEventListener("mouseenter", () => {
    if (locked) return;
    locked = true;

    target.textContent = "ممتاز";
    target.classList.remove("bg-sky-600");
    target.classList.add("bg-emerald-600");

    registerSuccess(10);

    setTimeout(() => {
      if (getCurrentStage()?.id !== "move") return;

      target.textContent = "المسني";
      target.classList.remove("bg-emerald-600");
      target.classList.add("bg-sky-600");
      placeTarget();
      locked = false;
    }, 500);
  });

  requestAnimationFrame(placeTarget);
}

function renderClickStage(stage) {
  const difficulty = getDifficultySettings();

  renderStageShell(
    stage,
    `
    <div class="mb-4 rounded-2xl bg-amber-50 border border-amber-100 p-4 text-amber-900 leading-7">
      اضغط على الدائرة بزر الماوس الأيسر. بعد كل نقرة صحيحة ستظهر في مكان جديد.
    </div>

    <div id="play-area" class="relative h-[430px] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden">
      <button 
        id="click-target"
        class="absolute rounded-full bg-orange-500 shadow-xl flex items-center justify-center text-white font-bold select-none hover:bg-orange-600 transition-all duration-300"
        style="width: ${difficulty.targetSize}px; height: ${difficulty.targetSize}px;"
      >
        اضغط
      </button>
    </div>
  `
  );

  const playArea = document.getElementById("play-area");
  const target = document.getElementById("click-target");
  let locked = false;

  function placeTarget() {
    const position = getRandomPosition(playArea, difficulty.targetSize);
    target.style.left = `${position.x}px`;
    target.style.top = `${position.y}px`;
  }

  target.addEventListener("click", (event) => {
    event.stopPropagation();
    if (locked) return;
    locked = true;

    target.textContent = "صحيح";
    registerSuccess(10);

    setTimeout(() => {
      if (getCurrentStage()?.id !== "click") return;

      target.textContent = "اضغط";
      placeTarget();
      locked = false;
    }, 400);
  });

  requestAnimationFrame(placeTarget);
}

function renderDoubleClickStage(stage) {
  const difficulty = getDifficultySettings();
  const iconSize = Math.max(difficulty.targetSize + 25, 110);

  renderStageShell(
    stage,
    `
    <div class="mb-4 rounded-2xl bg-violet-50 border border-violet-100 p-4 text-violet-900 leading-7">
      هذه المرحلة تحاكي فتح ملف في الكمبيوتر. انقر نقرتين متتاليتين بسرعة على الأيقونة.
    </div>

    <div id="play-area" class="relative h-[430px] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden">
      <button 
        id="double-target"
        class="absolute rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col items-center justify-center gap-2 text-slate-800 font-bold select-none hover:bg-violet-50 transition-all duration-300"
        style="width: ${iconSize}px; height: ${iconSize}px;"
      >
        <span class="text-5xl">📄</span>
        <span>ملف</span>
      </button>
    </div>
  `
  );

  const playArea = document.getElementById("play-area");
  const target = document.getElementById("double-target");
  let locked = false;

  function placeTarget() {
    const position = getRandomPosition(playArea, iconSize);
    target.style.left = `${position.x}px`;
    target.style.top = `${position.y}px`;
  }

  target.addEventListener("click", () => {
    if (locked) return;
    target.querySelector("span:last-child").textContent = "انقر مرة ثانية";
  });

  target.addEventListener("dblclick", (event) => {
    event.preventDefault();
    if (locked) return;
    locked = true;

    target.innerHTML = `<span class="text-5xl">✅</span><span>تم الفتح</span>`;
    target.classList.add("bg-emerald-50", "border-emerald-300");

    registerSuccess(12);

    setTimeout(() => {
      if (getCurrentStage()?.id !== "double") return;

      target.innerHTML = `<span class="text-5xl">📄</span><span>ملف</span>`;
      target.classList.remove("bg-emerald-50", "border-emerald-300");
      placeTarget();
      locked = false;
    }, 550);
  });

  requestAnimationFrame(placeTarget);
}

function renderDragStage(stage) {
  renderStageShell(
    stage,
    `
    <div class="mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-900 leading-7">
      اضغط على البطاقة مع الاستمرار، ثم اسحبها إلى داخل الصندوق، ثم اترك زر الماوس.
    </div>

    <div class="grid md:grid-cols-2 gap-5">
      <div class="h-[430px] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
        <div 
          id="drag-card"
          draggable="true"
          class="w-52 h-36 rounded-3xl bg-blue-900 text-white shadow-xl flex flex-col gap-2 items-center justify-center text-xl font-bold cursor-grab active:cursor-grabbing select-none"
        >
          <span class="text-4xl">🪪</span>
          <span>اسحبني</span>
        </div>
      </div>

      <div 
        id="drop-zone"
        class="h-[430px] rounded-3xl border-2 border-dashed border-emerald-400 bg-emerald-50 flex items-center justify-center"
      >
        <div class="text-center">
          <div class="text-6xl mb-4">📦</div>
          <p class="text-2xl font-bold text-emerald-800">ضع البطاقة هنا</p>
        </div>
      </div>
    </div>
  `
  );

  const dragCard = document.getElementById("drag-card");
  const dropZone = document.getElementById("drop-zone");
  let locked = false;

  dragCard.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "mouse-training-card");
    dragCard.classList.add("opacity-50");
  });

  dragCard.addEventListener("dragend", () => {
    dragCard.classList.remove("opacity-50");
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("bg-emerald-100");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("bg-emerald-100");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    if (locked) return;

    const data = event.dataTransfer.getData("text/plain");
    if (data !== "mouse-training-card") return;

    locked = true;
    dropZone.classList.remove("bg-emerald-100");
    dragCard.innerHTML = `<span class="text-4xl">✅</span><span>ممتاز</span>`;
    dragCard.classList.remove("bg-blue-900");
    dragCard.classList.add("bg-emerald-600");

    registerSuccess(15);

    setTimeout(() => {
      if (getCurrentStage()?.id !== "drag") return;

      dragCard.innerHTML = `<span class="text-4xl">🪪</span><span>اسحبني</span>`;
      dragCard.classList.remove("bg-emerald-600");
      dragCard.classList.add("bg-blue-900");
      locked = false;
    }, 550);
  });
}

function renderRightClickStage(stage) {
  const difficulty = getDifficultySettings();
  const iconSize = Math.max(difficulty.targetSize + 30, 120);

  renderStageShell(
    stage,
    `
    <div class="mb-4 rounded-2xl bg-slate-100 border border-slate-200 p-4 text-slate-800 leading-7">
      اضغط بالزر الأيمن على البطاقة لفتح القائمة، ثم اختر الأمر <strong>فتح</strong>. هذه المهارة مهمة للتعامل مع الملفات والقوائم المختصرة.
    </div>

    <div id="play-area" class="relative h-[430px] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden">
      <div 
        id="right-target"
        class="absolute rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col items-center justify-center gap-2 text-slate-800 font-bold select-none transition-all duration-300"
        style="width: ${iconSize}px; height: ${iconSize}px;"
      >
        <span class="text-5xl">🖼️</span>
        <span>صورة</span>
      </div>

      <div id="context-menu" class="hidden absolute z-20 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <button id="menu-open" class="block w-full text-right px-4 py-3 hover:bg-sky-50 font-bold">فتح</button>
        <button class="block w-full text-right px-4 py-3 hover:bg-slate-50 text-slate-500">نسخ</button>
        <button class="block w-full text-right px-4 py-3 hover:bg-slate-50 text-slate-500">خصائص</button>
      </div>
    </div>
  `
  );

  const playArea = document.getElementById("play-area");
  const target = document.getElementById("right-target");
  const menu = document.getElementById("context-menu");
  const openButton = document.getElementById("menu-open");
  let locked = false;

  function placeTarget() {
    const position = getRandomPosition(playArea, iconSize);
    target.style.left = `${position.x}px`;
    target.style.top = `${position.y}px`;
  }

  function hideMenu() {
    menu.classList.add("hidden");
  }

  target.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (locked) return;

    const areaRect = playArea.getBoundingClientRect();
    const menuX = event.clientX - areaRect.left;
    const menuY = event.clientY - areaRect.top;

    menu.style.left = `${Math.min(menuX, playArea.clientWidth - 180)}px`;
    menu.style.top = `${Math.min(menuY, playArea.clientHeight - 150)}px`;
    menu.classList.remove("hidden");
  });

  target.addEventListener("click", () => {
    target.querySelector("span:last-child").textContent = "استخدم الزر الأيمن";
  });

  playArea.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) hideMenu();
  });

  openButton.addEventListener("click", () => {
    if (locked) return;
    locked = true;
    hideMenu();

    target.innerHTML = `<span class="text-5xl">✅</span><span>تم الاختيار</span>`;
    target.classList.add("bg-emerald-50", "border-emerald-300");

    registerSuccess(12);

    setTimeout(() => {
      if (getCurrentStage()?.id !== "right") return;

      target.innerHTML = `<span class="text-5xl">🖼️</span><span>صورة</span>`;
      target.classList.remove("bg-emerald-50", "border-emerald-300");
      placeTarget();
      locked = false;
    }, 550);
  });

  requestAnimationFrame(placeTarget);
}

function renderScrollStage(stage) {
  renderStageShell(
    stage,
    `
    <div class="mb-4 rounded-2xl bg-cyan-50 border border-cyan-100 p-4 text-cyan-900 leading-7">
      ضع المؤشر داخل الصندوق، ثم استخدم عجلة الماوس للنزول حتى تصل إلى زر النجمة في الأسفل.
    </div>

    <div id="scroll-box" class="h-[430px] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-y-auto p-5 scroll-smooth">
      <div class="space-y-4">
        ${Array.from({ length: 14 })
          .map(
            (_, index) => `
          <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <h3 class="font-bold text-lg mb-2">عنصر تدريبي ${index + 1}</h3>
            <p class="text-slate-600 leading-7">
              استمر في التمرير للأسفل. الهدف من هذه المرحلة هو تدريب اليد على التحكم بعجلة الماوس والوصول إلى عناصر بعيدة داخل الصفحة.
            </p>
          </div>
        `
          )
          .join("")}

        <div class="rounded-3xl bg-amber-50 border border-amber-200 p-8 text-center">
          <div class="text-6xl mb-4">⭐</div>
          <h3 class="text-2xl font-bold text-amber-900 mb-3">وجدت النجمة</h3>
          <p class="text-amber-800 mb-5">اضغط على الزر لتسجيل نجاح التمرير.</p>
          <button id="found-star" class="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-8 py-4 font-bold text-lg">
            اضغط هنا
          </button>
        </div>
      </div>
    </div>
  `
  );

  const scrollBox = document.getElementById("scroll-box");
  const foundStar = document.getElementById("found-star");
  let locked = false;

  foundStar.addEventListener("click", () => {
    if (locked) return;
    locked = true;

    foundStar.textContent = "ممتاز";
    foundStar.classList.remove("bg-amber-500", "hover:bg-amber-600");
    foundStar.classList.add("bg-emerald-600");

    registerSuccess(12);

    setTimeout(() => {
      if (getCurrentStage()?.id !== "scroll") return;

      scrollBox.scrollTop = 0;
      foundStar.textContent = "اضغط هنا";
      foundStar.classList.remove("bg-emerald-600");
      foundStar.classList.add("bg-amber-500", "hover:bg-amber-600");
      locked = false;
    }, 600);
  });
}

function renderFinalChallenge(stage) {
  state.finalStep = 0;

  renderStageShell(
    stage,
    `
    <div class="mb-5 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-blue-900 leading-7">
      هذا التحدي يحاكي موقفا قريبا من الواقع: فتح ملف، نقل بطاقة، استخدام الزر الأيمن، ثم التمرير للوصول إلى زر الإنهاء.
    </div>

    <div class="grid lg:grid-cols-4 gap-5 mb-5">
      ${[
        "افتح ملف التدريب بالنقر المزدوج",
        "اسحب بطاقة السلامة إلى صندوق الأدوات",
        "اضغط بالزر الأيمن واختر فتح",
        "مرر للأسفل واضغط إنهاء التدريب",
      ]
        .map(
          (text, index) => `
        <div id="final-step-${index}" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div class="w-10 h-10 rounded-2xl bg-slate-300 text-white flex items-center justify-center font-bold mb-3">${
            index + 1
          }</div>
          <p class="font-bold leading-7">${text}</p>
        </div>
      `
        )
        .join("")}
    </div>

    <div id="final-area" class="relative rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 min-h-[520px]">
      <div class="grid lg:grid-cols-2 gap-5">
        <div class="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <h3 class="font-bold text-xl mb-4">سطح مكتب تدريبي</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <button id="final-folder" class="rounded-3xl border border-slate-200 bg-slate-50 hover:bg-violet-50 p-6 text-center transition">
              <div class="text-6xl mb-3">📁</div>
              <p class="font-bold">ملف التدريب</p>
              <p class="text-sm text-slate-500 mt-1">انقر مرتين</p>
            </button>

            <div id="final-drag-card" draggable="true" class="rounded-3xl border border-blue-200 bg-blue-900 text-white p-6 text-center shadow cursor-grab select-none">
              <div class="text-6xl mb-3">🦺</div>
              <p class="font-bold">بطاقة السلامة</p>
              <p class="text-sm text-blue-100 mt-1">اسحبها</p>
            </div>

            <div id="final-drop-zone" class="sm:col-span-2 rounded-3xl border-2 border-dashed border-emerald-400 bg-emerald-50 p-8 text-center">
              <div class="text-6xl mb-3">🧰</div>
              <p class="font-bold text-emerald-800 text-xl">صندوق أدوات السلامة</p>
            </div>
          </div>
        </div>

        <div class="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm relative">
          <h3 class="font-bold text-xl mb-4">لوحة إجراءات</h3>

          <div id="final-report" class="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center select-none">
            <div class="text-6xl mb-3">📋</div>
            <p class="font-bold text-xl">تقرير التدريب</p>
            <p class="text-sm text-slate-500 mt-1">اضغط بالزر الأيمن</p>
          </div>

          <div id="final-menu" class="hidden absolute z-30 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <button id="final-menu-open" class="block w-full text-right px-4 py-3 hover:bg-sky-50 font-bold">فتح</button>
            <button class="block w-full text-right px-4 py-3 hover:bg-slate-50 text-slate-500">نسخ</button>
          </div>

          <div id="final-scroll" class="mt-5 h-56 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
            ${Array.from({ length: 7 })
              .map(
                (_, index) => `
              <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-3">
                <p class="font-bold">تعليمات ${index + 1}</p>
                <p class="text-slate-500 text-sm mt-1">استمر بالتمرير داخل هذا الصندوق.</p>
              </div>
            `
              )
              .join("")}

            <div class="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 text-center">
              <div class="text-5xl mb-3">🏁</div>
              <p class="font-bold text-emerald-900 text-xl mb-4">وصلت إلى النهاية</p>
              <button id="final-finish" class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-3 font-bold">
                إنهاء التدريب
              </button>
            </div>
          </div>
        </div>
      </div>

      <p id="final-message" class="mt-5 rounded-2xl bg-white border border-slate-200 p-4 text-slate-700 font-bold">
        ابدأ بالخطوة الأولى: انقر نقرتين على ملف التدريب.
      </p>
    </div>
  `
  );

  const folder = document.getElementById("final-folder");
  const dragCard = document.getElementById("final-drag-card");
  const dropZone = document.getElementById("final-drop-zone");
  const report = document.getElementById("final-report");
  const menu = document.getElementById("final-menu");
  const menuOpen = document.getElementById("final-menu-open");
  const scrollBox = document.getElementById("final-scroll");
  const finishButton = document.getElementById("final-finish");
  const message = document.getElementById("final-message");

  function setFinalStep(step) {
    state.finalStep = step;
    updateFinalStepsUi();
  }

  function updateFinalStepsUi() {
    for (let i = 0; i < 4; i++) {
      const stepElement = document.getElementById(`final-step-${i}`);
      const badge = stepElement.querySelector("div");

      stepElement.classList.remove(
        "bg-slate-50",
        "bg-blue-50",
        "bg-emerald-50",
        "border-blue-200",
        "border-emerald-200"
      );
      badge.classList.remove("bg-slate-300", "bg-blue-700", "bg-emerald-600");

      if (i < state.finalStep) {
        stepElement.classList.add("bg-emerald-50", "border-emerald-200");
        badge.classList.add("bg-emerald-600");
        badge.textContent = "✓";
      } else if (i === state.finalStep) {
        stepElement.classList.add("bg-blue-50", "border-blue-200");
        badge.classList.add("bg-blue-700");
        badge.textContent = i + 1;
      } else {
        stepElement.classList.add("bg-slate-50");
        badge.classList.add("bg-slate-300");
        badge.textContent = i + 1;
      }
    }
  }

  folder.addEventListener("dblclick", () => {
    if (state.finalStep !== 0) return;

    folder.classList.add("bg-emerald-50", "border-emerald-300");
    folder.querySelector("p").textContent = "تم فتح الملف";
    message.textContent =
      "ممتاز. الآن اسحب بطاقة السلامة إلى صندوق أدوات السلامة.";
    setFinalStep(1);
  });

  dragCard.addEventListener("dragstart", (event) => {
    if (state.finalStep !== 1) {
      event.preventDefault();
      message.textContent =
        "نفذ الخطوات بالترتيب. افتح الملف أولا بالنقر المزدوج.";
      return;
    }

    event.dataTransfer.setData("text/plain", "final-safety-card");
    dragCard.classList.add("opacity-50");
  });

  dragCard.addEventListener("dragend", () => {
    dragCard.classList.remove("opacity-50");
  });

  dropZone.addEventListener("dragover", (event) => {
    if (state.finalStep !== 1) return;
    event.preventDefault();
    dropZone.classList.add("bg-emerald-100");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("bg-emerald-100");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    if (state.finalStep !== 1) return;

    const data = event.dataTransfer.getData("text/plain");
    if (data !== "final-safety-card") return;

    dropZone.classList.remove("bg-emerald-100");
    dragCard.classList.remove("bg-blue-900");
    dragCard.classList.add("bg-emerald-600");
    dragCard.querySelector("p").textContent = "تم النقل";
    message.textContent =
      "رائع. الآن اضغط بالزر الأيمن على تقرير التدريب واختر فتح.";
    setFinalStep(2);
  });

  report.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    if (state.finalStep !== 2) {
      message.textContent = "ليس الآن. اتبع الخطوات بالترتيب.";
      return;
    }

    const rect = report.parentElement.getBoundingClientRect();
    menu.style.left = `${event.clientX - rect.left}px`;
    menu.style.top = `${event.clientY - rect.top}px`;
    menu.classList.remove("hidden");
  });

  menuOpen.addEventListener("click", () => {
    if (state.finalStep !== 2) return;

    menu.classList.add("hidden");
    report.classList.add("bg-emerald-50", "border-emerald-300");
    report.querySelector("p").textContent = "تم فتح التقرير";
    message.textContent =
      "ممتاز. الآن استخدم عجلة الماوس داخل صندوق التعليمات حتى تصل إلى زر إنهاء التدريب.";
    setFinalStep(3);
  });

  scrollBox.addEventListener("click", (event) => {
    if (event.target !== finishButton) return;

    if (state.finalStep !== 3) {
      message.textContent =
        "لم تصل إلى هذه الخطوة بعد. أكمل الخطوات السابقة أولا.";
      return;
    }

    finishButton.textContent = "تم الإنجاز";
    finishButton.classList.remove("bg-emerald-600", "hover:bg-emerald-700");
    finishButton.classList.add("bg-blue-900");
    message.textContent = "أحسنت. تم إنهاء التحدي النهائي بنجاح.";
    registerSuccess(40);
  });

  updateFinalStepsUi();
}

function renderSingleStageResult() {
  const endedAt = new Date();
  const totalSeconds = Math.round((endedAt - state.startedAt) / 1000);
  const stage = getCurrentStage();

  app.innerHTML = `
    <section class="min-h-screen flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
        
        <div class="text-6xl mb-5">✅</div>

        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          تم إكمال القسم
        </h1>

        <p class="text-slate-600 text-lg mb-8 leading-8">
          أحسنت. تم إكمال تدريب: <span class="font-bold text-slate-900">${stage.title}</span>
        </p>

        <div class="grid md:grid-cols-3 gap-4 mb-8">
          <div class="bg-slate-100 rounded-3xl p-5">
            <p class="text-slate-500 mb-2">اسم المتدرب</p>
            <p class="text-xl font-bold">${state.playerName}</p>
          </div>

          <div class="bg-slate-100 rounded-3xl p-5">
            <p class="text-slate-500 mb-2">النقاط</p>
            <p class="text-xl font-bold">${state.totalScore}</p>
          </div>

          <div class="bg-slate-100 rounded-3xl p-5">
            <p class="text-slate-500 mb-2">المدة</p>
            <p class="text-xl font-bold">${totalSeconds} ثانية</p>
          </div>
        </div>

        <div class="rounded-3xl bg-blue-50 border border-blue-100 p-5 text-right mb-8">
          <h2 class="font-bold text-blue-950 text-xl mb-2">ماذا تعني هذه النتيجة؟</h2>
          <p class="text-blue-900 leading-8">
            المتدرب أتم هذه المهارة بنجاح. يمكنه الآن إعادة نفس القسم لزيادة الثقة، أو الانتقال إلى قسم آخر، أو بدء التدريب الكامل.
          </p>
        </div>

        <div class="flex flex-col md:flex-row gap-3 justify-center">
          <button id="repeat-stage" class="bg-blue-900 hover:bg-blue-800 text-white rounded-2xl px-8 py-4 font-bold">
            إعادة نفس القسم
          </button>

          <button id="choose-another-stage" class="bg-white border border-slate-300 hover:bg-slate-50 rounded-2xl px-8 py-4 font-bold">
            اختيار قسم آخر
          </button>

          <button id="start-full-from-result" class="bg-sky-600 hover:bg-sky-700 text-white rounded-2xl px-8 py-4 font-bold">
            بدء التدريب الكامل
          </button>
        </div>

      </div>
    </section>
  `;

  document.getElementById("repeat-stage").addEventListener("click", () => {
    state.stageSuccess = 0;
    state.totalScore = 0;
    state.startedAt = new Date();
    state.currentStageIndex = state.selectedStageIndex;
    state.finalStep = 0;
    renderStage();
  });

  document
    .getElementById("choose-another-stage")
    .addEventListener("click", renderHome);

  document
    .getElementById("start-full-from-result")
    .addEventListener("click", () => {
      state.trainingMode = "full";
      state.selectedStageIndex = null;
      state.currentStageIndex = 0;
      state.stageSuccess = 0;
      state.totalScore = 0;
      state.startedAt = new Date();
      state.finalStep = 0;
      renderStage();
    });
}

function renderResult() {
  const endedAt = new Date();
  const totalSeconds = Math.round((endedAt - state.startedAt) / 1000);

  let level = "ممتاز";
  let message =
    "أداء رائع. المتدرب أصبح أكثر قدرة على استخدام الماوس في مهام الكمبيوتر الأساسية.";

  if (state.totalScore < 120) {
    level = "جيد";
    message = "الأداء جيد، ويُنصح بتكرار التدريب مرة أخرى لزيادة الثقة والدقة.";
  }

  app.innerHTML = `
    <section class="min-h-screen flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
        <div class="text-6xl mb-5">🎉</div>

        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">انتهى التدريب</h1>
        <p class="text-slate-600 text-lg mb-8 leading-8">${message}</p>

        <div class="grid md:grid-cols-4 gap-4 mb-8">
          <div class="bg-slate-100 rounded-3xl p-5">
            <p class="text-slate-500 mb-2">اسم المتدرب</p>
            <p class="text-xl font-bold">${state.playerName}</p>
          </div>

          <div class="bg-slate-100 rounded-3xl p-5">
            <p class="text-slate-500 mb-2">النقاط</p>
            <p class="text-xl font-bold">${state.totalScore}</p>
          </div>

          <div class="bg-slate-100 rounded-3xl p-5">
            <p class="text-slate-500 mb-2">التقييم</p>
            <p class="text-xl font-bold">${level}</p>
          </div>

          <div class="bg-slate-100 rounded-3xl p-5">
            <p class="text-slate-500 mb-2">المدة</p>
            <p class="text-xl font-bold">${totalSeconds} ثانية</p>
          </div>
        </div>

        <div class="rounded-3xl bg-blue-50 border border-blue-100 p-5 text-right mb-8">
          <h2 class="font-bold text-blue-950 text-xl mb-3">المهارات التي تدرب عليها المتدرب</h2>
          <div class="grid md:grid-cols-2 gap-3 text-blue-900">
            <p>✅ التحكم بالمؤشر</p>
            <p>✅ النقر بالزر الأيسر</p>
            <p>✅ النقر المزدوج</p>
            <p>✅ السحب والإفلات</p>
            <p>✅ استخدام الزر الأيمن</p>
            <p>✅ استخدام عجلة التمرير</p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-3 justify-center">
          <button id="restart-game" class="bg-blue-900 hover:bg-blue-800 text-white rounded-2xl px-8 py-4 font-bold">
            إعادة التدريب
          </button>

          <button id="go-home" class="bg-white border border-slate-300 hover:bg-slate-50 rounded-2xl px-8 py-4 font-bold">
            العودة للبداية
          </button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("restart-game").addEventListener("click", () => {
    state.currentStageIndex = 0;
    state.stageSuccess = 0;
    state.totalScore = 0;
    state.startedAt = new Date();
    state.finalStep = 0;
    renderStage();
  });

  document.getElementById("go-home").addEventListener("click", renderHome);
}

//renderHome();
if (isMobileDevice()) {
  renderMobileWarning();
   showMobileAlert();
} else {
  renderHome();
}
