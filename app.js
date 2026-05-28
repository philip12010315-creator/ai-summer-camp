/* ==========================================================================
   2026 AI Summer Camp Landing Page JS Logic
   Handles: Countdown Timer & Location Tabs Switcher.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initLocationTabs();
});

// ==========================================================================
// 1. Dynamic Early Bird Countdown (Target Date: June 1, 2026, 23:59:59)
// ==========================================================================
function initCountdown() {
    const targetDate = new Date("2026-06-01T23:59:59+08:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(timerInterval);
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = d.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = h.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = m.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = s.toString().padStart(2, '0');
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

// ==========================================================================
// 2. Interactive Location Tabs Switcher (Nanjing vs Taipei)
// ==========================================================================
function initLocationTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".sessions-panel");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");

            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            panels.forEach(panel => {
                panel.classList.remove("active");
                if (panel.id === `panel-${target}`) {
                    panel.classList.add("active");
                }
            });
        });
    });
}
