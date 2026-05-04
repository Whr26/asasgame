const app = document.getElementById("app");

const stages = [
  {
    id: "move",
    title: "تدريب تحريك الماوس",
    description: "حرّك مؤشر الماوس حتى يلمس الدائرة.",
    instruction: "المطلوب: ضع المؤشر فوق الدائرة 5 مرات."
  },
  {
    id: "click",
    title: "تدريب النقر بالزر الأيسر",
    description: "اضغط على الهدف باستخدام زر الماوس الأيسر.",
    instruction: "المطلوب: اضغط على الدائرة 5 مرات."
  },
  {
    id: "drag",
    title: "تدريب السحب والإفلات",
    description: "اسحب البطاقة وضعها داخل الصندوق.",
    instruction: "المطلوب: اسحب البطاقة إلى الصندوق 5 مرات."
  }
];

const state = {
  playerName: "",
  difficulty: "beginner",
  currentStageIndex: 0,
  stageSuccess: 0,
  totalScore: 0,
  startedAt: null
};

function getDifficultySettings() {
  const settings = {
    beginner: {
      label: "مبتدئ",
      targetSize: 120,
      successTarget: 7
    },
    medium: {
      label: "متوسط",
      targetSize: 90,
      successTarget: 5
    },
    advanced: {
      label: "متقدم",
      targetSize: 70,
      successTarget: 5
    }
  };

  return settings[state.difficulty] ?? settings.beginner;
}

function renderHome() {
  app.innerHTML = `
    <section class="min-h-screen flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-5xl">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          
          <div class="bg-gradient-to-l from-blue-900 to-sky-700 text-white p-8 md:p-10">
            <p class="text-sm md:text-base opacity-90 mb-3">لعبة تعليمية  </p>
            <h1 class="text-3xl md:text-5xl font-bold mb-4">أتقن استخدام الماوس</h1>
            <p class="text-lg md:text-xl leading-9 max-w-3xl">
              تدريب مبسط للكبار يساعد المتدرب على تعلم تحريك الماوس، النقر، والسحب والإفلات بطريقة عملية وتدريجية.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 p-6 md:p-10">
            
            <div>
              <h2 class="text-2xl font-bold mb-4 text-slate-900">ابدأ التدريب</h2>

              <form id="start-form" class="space-y-5">
                <div>
                  <label class="block mb-2 font-semibold">اسم المتدرب</label>
                  <input 
                    id="player-name"
                    type="text"
                    placeholder="مثال: أحمد"
                    class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-lg outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-600"
                  />
                </div>

                <div>
                  <label class="block mb-2 font-semibold">مستوى التدريب</label>
                  <select 
                    id="difficulty"
                    class="w-full rounded-2xl border border-slate-300 px-4 py-3 text-lg outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-600"
                  >
                    <option value="beginner">مبتدئ - أهداف كبيرة</option>
                    <option value="medium">متوسط - أهداف متوسطة</option>
                    <option value="advanced">متقدم - أهداف أصغر</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  class="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-2xl py-4 text-xl font-bold transition"
                >
                  ابدأ الآن
                </button>
              </form>
            </div>

            <div>
              <h2 class="text-2xl font-bold mb-4 text-slate-900">أقسام التدريب</h2>

              <div class="space-y-4">
                ${stages.map((stage, index) => `
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl">
                        ${index + 1}
                      </div>
                      <div>
                        <h3 class="font-bold text-lg">${stage.title}</h3>
                        <p class="text-slate-600 mt-1">${stage.description}</p>
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("start-form").addEventListener("submit", startGame);
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

  renderStage();
}

function renderStage() {
  const stage = stages[state.currentStageIndex];

  if (!stage) {
    renderResult();
    return;
  }

  if (stage.id === "move") {
    renderMoveStage(stage);
    return;
  }

  if (stage.id === "click") {
    renderClickStage(stage);
    return;
  }

  if (stage.id === "drag") {
    renderDragStage(stage);
    return;
  }
}

function renderStageShell(stage, contentHtml) {
  const difficulty = getDifficultySettings();
  const stageNumber = state.currentStageIndex + 1;
  const totalStages = stages.length;

  app.innerHTML = `
    <section class="min-h-screen px-4 py-6">
      <div class="max-w-6xl mx-auto">
        
        <header class="bg-white rounded-3xl shadow border border-slate-200 p-5 mb-5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p class="text-slate-500 mb-1">المتدرب: <span class="font-bold text-slate-900">${state.playerName}</span></p>
              <h1 class="text-2xl md:text-3xl font-bold text-slate-900">${stage.title}</h1>
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
                <p id="score-text" class="font-bold text-lg">${state.totalScore}</p>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <div class="flex justify-between mb-2 text-sm text-slate-500">
              <span>تقدم المرحلة</span>
              <span id="progress-text">${state.stageSuccess} / ${difficulty.successTarget}</span>
            </div>
            <div class="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div id="progress-bar" class="h-full bg-sky-600 rounded-full transition-all duration-300" style="width: ${getStageProgress()}%"></div>
            </div>
          </div>
        </header>

        <div class="bg-white rounded-3xl shadow border border-slate-200 p-5">
          ${contentHtml}
        </div>

        <div class="mt-5 flex justify-between items-center">
          <button id="back-home" class="px-5 py-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50">
            الرجوع للبداية
          </button>

          <p class="text-slate-500 text-sm">
            لا يوجد مؤقت في هذه النسخة حتى يكون التدريب مريحا للمتدرب.
          </p>
        </div>

      </div>
    </section>
  `;

  document.getElementById("back-home").addEventListener("click", renderHome);
}

function getStageProgress() {
  const difficulty = getDifficultySettings();
  return Math.min((state.stageSuccess / difficulty.successTarget) * 100, 100);
}

function updateProgress() {
  const difficulty = getDifficultySettings();

  document.getElementById("score-text").textContent = state.totalScore;
  document.getElementById("progress-text").textContent = `${state.stageSuccess} / ${difficulty.successTarget}`;
  document.getElementById("progress-bar").style.width = `${getStageProgress()}%`;
}

function registerSuccess(points = 10) {
  const difficulty = getDifficultySettings();

  state.stageSuccess += 1;
  state.totalScore += points;

  updateProgress();

  if (state.stageSuccess >= difficulty.successTarget) {
    setTimeout(() => {
      state.currentStageIndex += 1;
      state.stageSuccess = 0;
      renderStage();
    }, 600);
  }
}

function getRandomPosition(container, elementSize) {
  const padding = 20;
  const maxX = container.clientWidth - elementSize - padding;
  const maxY = container.clientHeight - elementSize - padding;

  const x = Math.floor(Math.random() * Math.max(maxX, 1)) + padding / 2;
  const y = Math.floor(Math.random() * Math.max(maxY, 1)) + padding / 2;

  return { x, y };
}

function renderMoveStage(stage) {
  const difficulty = getDifficultySettings();

  renderStageShell(stage, `
    <div class="mb-4 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-blue-900">
      حرّك الماوس بهدوء حتى يلمس المؤشر الدائرة. عند النجاح ستنتقل الدائرة إلى مكان جديد.
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
  `);

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
      if (state.currentStageIndex !== 0) return;

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

  renderStageShell(stage, `
    <div class="mb-4 rounded-2xl bg-amber-50 border border-amber-100 p-4 text-amber-900">
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
  `);

  const playArea = document.getElementById("play-area");
  const target = document.getElementById("click-target");

  function placeTarget() {
    const position = getRandomPosition(playArea, difficulty.targetSize);
    target.style.left = `${position.x}px`;
    target.style.top = `${position.y}px`;
  }

  target.addEventListener("click", (event) => {
    event.stopPropagation();

    target.textContent = "صحيح";
    registerSuccess(10);

    setTimeout(() => {
      if (stages[state.currentStageIndex]?.id !== "click") return;

      target.textContent = "اضغط";
      placeTarget();
    }, 400);
  });

  requestAnimationFrame(placeTarget);
}

function renderDragStage(stage) {
  renderStageShell(stage, `
    <div class="mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-900">
      اضغط على البطاقة مع الاستمرار، ثم اسحبها إلى داخل الصندوق واترك زر الماوس.
    </div>

    <div class="grid md:grid-cols-2 gap-5">
      <div class="h-[430px] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
        <div 
          id="drag-card"
          draggable="true"
          class="w-48 h-32 rounded-3xl bg-blue-900 text-white shadow-xl flex items-center justify-center text-xl font-bold cursor-grab active:cursor-grabbing select-none"
        >
          اسحبني
        </div>
      </div>

      <div 
        id="drop-zone"
        class="h-[430px] rounded-3xl border-2 border-dashed border-emerald-400 bg-emerald-50 flex items-center justify-center"
      >
        <div class="text-center">
          <div class="text-5xl mb-4">📦</div>
          <p class="text-2xl font-bold text-emerald-800">ضع البطاقة هنا</p>
        </div>
      </div>
    </div>
  `);

  const dragCard = document.getElementById("drag-card");
  const dropZone = document.getElementById("drop-zone");

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

    const data = event.dataTransfer.getData("text/plain");
    if (data !== "mouse-training-card") return;

    dropZone.classList.remove("bg-emerald-100");
    dragCard.textContent = "ممتاز";
    dragCard.classList.remove("bg-blue-900");
    dragCard.classList.add("bg-emerald-600");

    registerSuccess(15);

    setTimeout(() => {
      if (stages[state.currentStageIndex]?.id !== "drag") return;

      dragCard.textContent = "اسحبني";
      dragCard.classList.remove("bg-emerald-600");
      dragCard.classList.add("bg-blue-900");
    }, 500);
  });
}

function renderResult() {
  const endedAt = new Date();
  const totalSeconds = Math.round((endedAt - state.startedAt) / 1000);

  let level = "ممتاز";
  let message = "أداء رائع، المتدرب أصبح أكثر قدرة على استخدام الماوس.";

  if (state.totalScore < 100) {
    level = "جيد";
    message = "الأداء جيد، ويحتاج المتدرب إلى تكرار التدريب مرة أخرى.";
  }

  app.innerHTML = `
    <section class="min-h-screen flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
        
        <div class="text-6xl mb-5">🎉</div>

        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          انتهى التدريب
        </h1>

        <p class="text-slate-600 text-lg mb-8">
          ${message}
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
            <p class="text-slate-500 mb-2">التقييم</p>
            <p class="text-xl font-bold">${level}</p>
          </div>
        </div>

        <p class="text-slate-500 mb-6">
          مدة التدريب التقريبية: ${totalSeconds} ثانية
        </p>

        <div class="flex flex-col md:flex-row gap-3 justify-center">
          <button 
            id="restart-game"
            class="bg-blue-900 hover:bg-blue-800 text-white rounded-2xl px-8 py-4 font-bold"
          >
            إعادة التدريب
          </button>

          <button 
            id="go-home"
            class="bg-white border border-slate-300 hover:bg-slate-50 rounded-2xl px-8 py-4 font-bold"
          >
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
    renderStage();
  });

  document.getElementById("go-home").addEventListener("click", renderHome);
}




// عرض تحذير خاص للمستخدمين الذين فتحوا اللعبة من جوال، مع إمكانية نسخ الرابط لفتحه من كمبيوتر
function renderMobileSoftWarning() {
  app.innerHTML = `
    <section class="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-100">
      <div class="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center">

        <div class="bg-gradient-to-l from-blue-950 via-blue-900 to-sky-700 text-white p-8">
          <div class="text-6xl mb-4">🖱️</div>
          <h1 class="text-3xl font-bold mb-3">تنبيه مهم</h1>
          <p class="leading-8 text-blue-50 text-lg">
            هذه اللعبة مصممة أساسا لتعليم استخدام الماوس، لذلك ننصح بفتحها من جهاز كمبيوتر أو لابتوب.
          </p>
        </div>

        <div class="p-7">
          <div class="rounded-3xl bg-amber-50 border border-amber-200 p-5 mb-6 text-amber-900 leading-8 text-right">
            يبدو أنك تستخدم جوالا أو شاشة صغيرة.  
            يمكنك المتابعة، لكن تجربة التدريب لن تكون دقيقة لأن الهدف الأساسي هو تعلم استخدام الماوس.
          </div>

          <div class="grid md:grid-cols-3 gap-3 mb-6 text-right">
            <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p class="font-bold text-slate-900 mb-1">تحريك المؤشر</p>
              <p class="text-sm text-slate-600">يحتاج إلى ماوس حقيقي.</p>
            </div>

            <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p class="font-bold text-slate-900 mb-1">النقر المزدوج</p>
              <p class="text-sm text-slate-600">أفضل على الكمبيوتر.</p>
            </div>

            <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p class="font-bold text-slate-900 mb-1">السحب والإفلات</p>
              <p class="text-sm text-slate-600">مصمم للتدريب بالماوس.</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-3">
            <button 
              id="continue-anyway"
              class="flex-1 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl py-4 font-bold text-lg"
            >
              المتابعة رغم ذلك
            </button>

            <button 
              id="copy-link"
              class="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-2xl py-4 font-bold text-lg"
            >
              نسخ الرابط للكمبيوتر
            </button>
          </div>

          <p id="copy-message" class="mt-4 text-sm text-slate-500"></p>
        </div>

      </div>
    </section>
  `;

  document.getElementById("continue-anyway").addEventListener("click", () => {
    renderHome();
  });

  document.getElementById("copy-link").addEventListener("click", async () => {
    const message = document.getElementById("copy-message");

    try {
      await navigator.clipboard.writeText(window.location.href);
      message.textContent = "تم نسخ الرابط. افتحه من الكمبيوتر أو اللابتوب.";
      message.className = "mt-4 text-sm text-emerald-700 font-bold";
    } catch {
      message.textContent = "لم يتم النسخ تلقائيا. انسخ الرابط من شريط المتصفح.";
      message.className = "mt-4 text-sm text-red-600 font-bold";
    }
  });
}













// عرض تحذير خاص للمستخدمين الذين فتحوا اللعبة من جوال، مع إمكانية نسخ الرابط لفتحه من كمبيوتر
function renderMobileBlockedScreen() {
  app.innerHTML = `
    <section class="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-100">
      <div class="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center">

        <div class="bg-gradient-to-l from-red-900 via-red-800 to-orange-600 text-white p-8">
          <div class="text-6xl mb-4">🚫</div>
          <h1 class="text-3xl font-bold mb-3">لا يمكن تشغيل التدريب من الجوال</h1>
          <p class="leading-8 text-red-50 text-lg">
            هذا التدريب مخصص لتعلم استخدام الماوس، لذلك يجب فتحه من جهاز كمبيوتر أو لابتوب.
          </p>
        </div>

        <div class="p-7">
          <div class="rounded-3xl bg-red-50 border border-red-200 p-5 mb-6 text-red-900 leading-8 text-right">
            تم إيقاف تشغيل اللعبة على هذا الجهاز لأن الجوال لا يحتوي على ماوس حقيقي.  
            للحصول على نتيجة تدريب صحيحة، يرجى فتح الرابط من كمبيوتر أو لابتوب.
          </div>

          <div class="rounded-3xl bg-slate-50 border border-slate-200 p-5 mb-6 text-right">
            <h2 class="font-bold text-xl text-slate-900 mb-3">لماذا لا تعمل على الجوال؟</h2>
            <div class="space-y-3 text-slate-700 leading-7">
              <p>✅ لأن الهدف هو تدريب حركة مؤشر الماوس.</p>
              <p>✅ لأن النقر المزدوج بالماوس يختلف عن لمس الشاشة.</p>
              <p>✅ لأن السحب والإفلات في الكمبيوتر يختلف عن السحب باللمس.</p>
              <p>✅ لأن زر الماوس الأيمن غير موجود بنفس الطريقة في الجوال.</p>
            </div>
          </div>

          <button 
            id="copy-link"
            class="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-2xl py-4 font-bold text-lg"
          >
            نسخ رابط اللعبة وفتحه من الكمبيوتر
          </button>

          <p id="copy-message" class="mt-4 text-sm text-slate-500"></p>
        </div>

      </div>
    </section>
  `;

  document.getElementById("copy-link").addEventListener("click", async () => {
    const message = document.getElementById("copy-message");

    try {
      await navigator.clipboard.writeText(window.location.href);
      message.textContent = "تم نسخ الرابط. افتحه من الكمبيوتر أو اللابتوب.";
      message.className = "mt-4 text-sm text-emerald-700 font-bold";
    } catch {
      message.textContent = "لم يتم النسخ تلقائيا. انسخ الرابط من شريط المتصفح.";
      message.className = "mt-4 text-sm text-red-600 font-bold";
    }
  });
}








renderHome();