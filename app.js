/* ==========================================================================
   2026 AI Summer Camp Landing Page JS Logic
   Handles: Countdown Timer, Tabs, Card Accoridon, Session Autocompletes, 
   Dynamic Select, Form Validations, & Interactive Clipboard-to-LINE Flow.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initLocationTabs();
    initSessionDropdown();
});

// ==========================================================================
// 1. Dynamic Early Bird Countdown (4 Days from Current Session or Target Date)
// ==========================================================================
function initCountdown() {
    // Current date from metadata: 2026-05-28
    // We set the target to 4 days from May 28 (i.e., June 1, 2026, 23:59:59)
    const targetDate = new Date("2026-06-01T23:59:59+08:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Timer expired, show 0s or custom message
            clearInterval(timerInterval);
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        // Calculations
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        // Format with leading zeros
        if (daysEl) daysEl.innerText = d.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = h.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = m.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = s.toString().padStart(2, '0');
    }

    updateTimer(); // Initial call
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

            // Update button states
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Update panels
            panels.forEach(panel => {
                panel.classList.remove("active");
                if (panel.id === `panel-${target}`) {
                    panel.classList.add("active");
                }
            });
        });
    });
}

// ==========================================================================
// 3. Course Cards Accordion (Expandable details)
// ==========================================================================
function toggleCourseDetail(cardElement) {
    // Check if clicked card is already expanded
    const isExpanded = cardElement.classList.contains("expanded");
    
    // Collapse all other cards first
    document.querySelectorAll(".course-card").forEach(card => {
        card.classList.remove("expanded");
    });

    // Toggle active card
    if (!isExpanded) {
        cardElement.classList.add("expanded");
    }
}

// ==========================================================================
// 4. Dynamic Form Sessions Populating Based on Selected Location
// ==========================================================================
const sessionOptionsMap = {
    "南京復興教室": [
        "7/13 - 7/17：AI 守護者：拯救未來城市 (Minecraft • SPM • SPIKE)",
        "7/20 - 7/24：AI 星際任務：發光工程師創作營 (3D • SPM • SPIKE)"
    ],
    "台北車站教室": [
        "8/3 - 8/7：AI 森林任務：救援工程師創作營 (3D • SPM • SPIKE)",
        "8/10 - 8/14：AI 機關任務：設計工程師營 (雷切 • SPM • SPIKE)",
        "8/17 - 8/21：AI 程式機器人工程師 (Minecraft • SPM • SPIKE)"
    ]
};

function initSessionDropdown() {
    const locationSelect = document.getElementById("targetLocation");
    if (locationSelect) {
        locationSelect.addEventListener("change", updateFormSessionOptions);
    }
}

function updateFormSessionOptions(selectedSessionVal = "") {
    const locationSelect = document.getElementById("targetLocation");
    const sessionSelect = document.getElementById("targetSession");
    
    if (!locationSelect || !sessionSelect) return;

    const selectedLoc = locationSelect.value;
    
    // Clear old options
    sessionSelect.innerHTML = "";

    if (!selectedLoc || !sessionOptionsMap[selectedLoc]) {
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.innerText = "請先選擇教室位置";
        sessionSelect.appendChild(placeholder);
        return;
    }

    // Populate options
    const sessions = sessionOptionsMap[selectedLoc];
    
    // Add placeholder
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = !selectedSessionVal;
    placeholder.innerText = "請選擇希望諮詢的梯次";
    sessionSelect.appendChild(placeholder);

    sessions.forEach(sessionText => {
        const option = document.createElement("option");
        option.value = sessionText;
        option.innerText = sessionText;
        if (selectedSessionVal && sessionText.includes(selectedSessionVal.split("：")[0])) {
            option.selected = true;
        }
        sessionSelect.appendChild(option);
    });
}

// ==========================================================================
// 5. Quick Select Session from Card & Autocomplete Form
// ==========================================================================
function quickSelectSession(locationName, sessionFullName) {
    const locationSelect = document.getElementById("targetLocation");
    const sessionSelect = document.getElementById("targetSession");
    const formSection = document.getElementById("booking");

    if (!locationSelect || !sessionSelect || !formSection) return;

    // Set classroom location
    locationSelect.value = locationName;
    
    // Populate session options & select appropriate session
    updateFormSessionOptions(sessionFullName);

    // Smooth scroll to form section
    formSection.scrollIntoView({ behavior: "smooth" });

    // Visual highlights on form card to guide the parent
    const formCard = document.querySelector(".form-card");
    if (formCard) {
        formCard.style.borderColor = "var(--primary)";
        formCard.style.boxShadow = "0 0 25px rgba(37, 99, 235, 0.25)";
        
        setTimeout(() => {
            formCard.style.borderColor = "rgba(15, 23, 42, 0.06)";
            formCard.style.boxShadow = "var(--shadow-lg)";
        }, 1500);
    }
}

// ==========================================================================
// 6. Form Submission, Validation, Clipboard and LINE Direct Link
// ==========================================================================
function handleFormSubmit(event) {
    event.preventDefault();

    // Get field values
    const parentName = document.getElementById("parentName").value.trim();
    const parentPhone = document.getElementById("parentPhone").value.trim();
    const childName = document.getElementById("childName").value.trim();
    const childGrade = document.getElementById("childGrade").value;
    const targetLocation = document.getElementById("targetLocation").value;
    const targetSession = document.getElementById("targetSession").value;
    const userMessage = document.getElementById("userMessage").value.trim();

    // Perform phone regex validation (starts with 09 and is 10 digits)
    const phoneRegex = /^09\d{8}$|^09\d{2}-\d{3}-\d{3}$/;
    if (!phoneRegex.test(parentPhone.replace(/-/g, ""))) {
        alert("請輸入正確的台灣手機格式 (例如: 0912345678)");
        return;
    }

    // Formulate a beautiful messaging payload for LINE
    const messagePayload = 
`🏆【2026 AI 科技夏令營 預約登記】🏆
--------------------------------
👤 家長姓名：${parentName}
📞 聯絡電話：${parentPhone}
👦 孩子姓名：${childName}
🏫 孩子年級：${childGrade}
📍 諮詢教室：${targetLocation}
📅 預約梯次：${targetSession}
💬 備註事項：${userMessage || "無"}
--------------------------------
💡 我要報名！請協助保留早鳥席次與名額確認！`;

    // Attempt to copy to clipboard for absolute ease of pasting
    navigator.clipboard.writeText(messagePayload).then(() => {
        showSuccessModal(messagePayload);
    }).catch(err => {
        // Fallback if clipboard API fails
        console.error("Clipboard copy failed: ", err);
        showSuccessModal(messagePayload);
    });
}

// Create and show a beautiful modal on successful submission
function showSuccessModal(formattedText) {
    // Remove existing modal if any
    const existingModal = document.getElementById("successModal");
    if (existingModal) existingModal.remove();

    // Create Modal Elements
    const modal = document.createElement("div");
    modal.id = "successModal";
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 24px;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const card = document.createElement("div");
    card.style.cssText = `
        background-color: #ffffff;
        border-radius: 24px;
        width: 100%;
        max-width: 500px;
        padding: 32px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        transform: translateY(20px);
        transition: transform 0.3s ease;
        text-align: center;
    `;

    card.innerHTML = `
        <div style="width: 64px; height: 64px; background-color: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
            <svg style="width: 32px; height: 32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <h3 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 12px;">預約登記已為您複製！</h3>
        <p style="font-size: 0.95rem; color: #475569; margin-bottom: 24px; line-height: 1.6;">
            資料已自動複製至您的剪貼簿！<br>
            接下來我們將為您跳轉至 <strong>LINE 官方帳號</strong>，請直接<strong>貼上訊息</strong>並傳送給營隊顧問，即可完成名額保留諮詢！
        </p>
        <div style="background-color: #f8fafc; border: 1px solid rgba(15,23,42,0.06); border-radius: 12px; padding: 16px; font-size: 0.82rem; text-align: left; color: #475569; margin-bottom: 28px; white-space: pre-wrap; font-family: monospace; max-height: 180px; overflow-y: auto;">${formattedText}</div>
        
        <a href="https://lin.ee/UTc0L3k" target="_blank" id="modalLineBtn" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #ffffff; padding: 16px; border-radius: 50px; font-size: 1.05rem; font-weight: 900; box-shadow: 0 10px 20px rgba(16,185,129,0.3); text-decoration: none; transition: transform 0.2s;">
            💬 開啟 LINE 貼上並傳送
        </a>
    `;

    modal.appendChild(card);
    document.body.appendChild(modal);

    // Trigger transitions
    setTimeout(() => {
        modal.style.opacity = "1";
        card.style.transform = "translateY(0)";
    }, 10);

    // Setup action redirection & auto modal close
    const modalLineBtn = document.getElementById("modalLineBtn");
    modalLineBtn.addEventListener("click", () => {
        setTimeout(() => {
            modal.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => modal.remove(), 300);
        }, 1000);
    });

    // Close modal when clicking background
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => modal.remove(), 300);
        }
    });
}
