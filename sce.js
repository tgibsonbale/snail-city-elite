/* Snail City Elite — Welcome box logic
   Modes: "wisdom" (default) and "daily" (Daily Snail lore)
   Persisted via localStorage under "sce.welcome.mode"
*/
(() => {
  const lineEl    = document.getElementById('welcomeLine');
  const toggleBtn = document.getElementById('welcomeToggle');
  const shuffleBtn= document.getElementById('welcomeShuffle');

  if (!lineEl || !toggleBtn || !shuffleBtn) return;

  const STORAGE_MODE_KEY = 'sce.welcome.mode';
  const STORAGE_LAST_KEY = 'sce.welcome.lastIndex';

  const wisdom = [
    "Fast is fragile. Slow is forever.",
    "Make it worth savoring.",
    "Tiny steps. Giant arcs.",
    "Speed is a setting, not a virtue.",
    "Create like no one’s rushing you.",
    "Even a shell has stories.",
    "Progress bars are just snails racing.",
    "When in doubt, decelerate.",
    "Patience is a superpower in disguise.",
    "Depth over dopamine."
  ];

  const daily = [
    "City Ordinance 004: Crosswalks move at 0.25× on Sundays.",
    "Library Rule: Two hours of silence before inspiration.",
    "The Observatory measures ideas in revolutions, not seconds.",
    "Elite cafés serve coffee that cools at narrative pace.",
    "Streetlights pulse to the rhythm of deep work.",
    "Artists’ permits renew only after a good nap.",
    "The subway plays lo-fi when delays are deliberate.",
    "Maps label alleys by the stories told there.",
    "Every bench is a checkpoint.",
    "The clocktower strikes whenever it feels like it."
  ];

  const packs = {
    wisdom: {label: "Snail Wisdom", data: wisdom},
    daily:  {label: "Daily Snail",  data: daily}
  };

  // State
  let mode = (localStorage.getItem(STORAGE_MODE_KEY) === 'daily') ? 'daily' : 'wisdom';
  let lastIndex = parseInt(localStorage.getItem(STORAGE_LAST_KEY) || '-1', 10);

  function chooseIndex(arrLen, avoid = -1) {
    if (arrLen <= 1) return 0;
    let i = Math.floor(Math.random() * arrLen);
    // avoid immediate repeat
    if (i === avoid) i = (i + 1) % arrLen;
    return i;
  }

  function renderLine() {
    const list = packs[mode].data;
    const idx  = chooseIndex(list.length, lastIndex);
    lastIndex  = idx;
    localStorage.setItem(STORAGE_LAST_KEY, String(idx));

    // Trigger a little reveal animation
    lineEl.classList.remove('reveal');
    // force reflow so animation restarts
    void lineEl.offsetWidth;
    lineEl.textContent = list[idx];
    lineEl.classList.add('reveal');
  }

  function renderToggleLabel() {
    toggleBtn.textContent = packs[mode].label;
    // pressed=true visually marks the "active" look
    toggleBtn.setAttribute('aria-pressed', mode === 'daily' ? 'true' : 'false');
  }

  // Event handlers
  toggleBtn.addEventListener('click', () => {
    mode = (mode === 'wisdom') ? 'daily' : 'wisdom';
    localStorage.setItem(STORAGE_MODE_KEY, mode);
    renderToggleLabel();
    renderLine();
  });

  shuffleBtn.addEventListener('click', renderLine);
  // Keyboard: Enter/Space on Shuffle when focused
  shuffleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      renderLine();
    }
  });

  // Init
  renderToggleLabel();
  renderLine();
})();