const nameInput = document.querySelector("#name-input");
const greetButton = document.querySelector("#greet-button");
const countButton = document.querySelector("#count-button");
const greetingText = document.querySelector("#greeting-text");
const clickCountText = document.querySelector("#click-count-text");
let clickCount = 0;

greetButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const displayName = name ? name : "friend";
  greetingText.textContent = `Hello, ${displayName}! Welcome to the simple web app.`;
});

countButton.addEventListener("click", () => {
  clickCount += 1;
  clickCountText.textContent = `Button clicked ${clickCount} time${clickCount === 1 ? "" : "s"}.`;
});

function loadBaseSettingsForSelectedSalesman() {
  const settings = salesmanSettings[salarySalesmanInput.value];

  if (!settings) {
    return;
  }

  baseSalaryInput.value = settings.baseSalary;
  inactiveSalesInput.value = settings.inactiveSales;
  commissionStartInput.value = settings.commissionStart;
  tierOneAmountInput.value = settings.tierOneAmount;
  tierOneRateInput.value = settings.tierOneRate;
  tierTwoAmountInput.value = settings.tierTwoAmount;
  tierTwoRateInput.value = settings.tierTwoRate;
  remainingRateInput.value = settings.remainingRate;
}

function calculateTieredCommission(eligibleSales, tiers) {
  let remainingSales = eligibleSales;
  let totalCommission = 0;
  const tierResults = [];

  tiers.forEach((tier) => {
    const tierSales = tier.amount === Infinity
      ? remainingSales
      : Math.min(remainingSales, tier.amount);
    const tierCommission = Math.max(0, tierSales) * tier.rate;

    if (tierSales > 0) {
      tierResults.push({
        sales: tierSales,
        rate: tier.rate,
        commission: tierCommission
      });
    }

    totalCommission += tierCommission;
    remainingSales = Math.max(0, remainingSales - tierSales);
  });

  return { totalCommission, tierResults };
}

function buildSalaryMonthRows() {
  if (!salaryStartDateInput.value || !salaryEndDateInput.value) {
    salaryMonths.innerHTML = '<p class="empty-state">Enter trip dates, then build monthly rows.</p>';
    return;
  }

  salaryMonths.innerHTML = getMonthSegments(salaryStartDateInput.value, salaryEndDateInput.value)
    .map((segment, index) => `
      <article class="salary-month" data-start-date="${segment.startDate}" data-end-date="${segment.endDate}">
        <strong>${escapeHtml(formatMonthHeading(segment.startDate, segment.endDate))}</strong>
        <div class="field-grid">
          <label>
            Sales amount
            <input class="month-sales" type="number" min="0" step="0.01" placeholder="0.00" required>
          </label>
        </div>
        <small>Month ${index + 1}</small>
      </article>
    `)
    .join("");
}

function getSalaryMonthRows() {
  return Array.from(document.querySelectorAll(".salary-month"));
}

function updateSalaryResult(total = 0, salesman = "", tripNumber = "", period = "", breakdown = []) {
  salaryTotalPay.textContent = formatCurrency(total);
  salaryNote.textContent = salesman && period
    ? `${salesman} trip ${tripNumber} salary for ${period}`
    : "Select a salesman and enter salary details.";
  currentSummaryMessage = breakdown.length
    ? buildSummaryMessage(total, salesman, tripNumber, period, breakdown)
    : "";
  currentSummaryKey = breakdown.length
    ? `${salesman.toLowerCase()}|${period}`
    : "";
  updateWhatsAppLink();
  salaryBreakdown.innerHTML = breakdown.length
    ? breakdown.map((month) => `
      <article class="salary-breakdown-row">
        <strong>${escapeHtml(month.heading)}</strong>
        <span>Days worked: ${month.daysWorked} of ${month.fullPeriodDays}</span>
        <span>Sales: ${formatCurrency(month.sales)} + inactive share ${formatCurrency(month.inactiveSales)} = ${formatCurrency(month.totalSales)}</span>
        <span>Base: ${formatCurrency(month.baseSalary)}</span>
        <span>Prorated commission starts after: ${formatCurrency(month.commissionStart)}</span>
        <span>Eligible sales: ${formatCurrency(month.eligibleSales)}</span>
        ${month.tierResults.map((tier) => `
          <span>${formatCurrency(tier.sales)} at ${tier.rate} = ${formatCurrency(tier.commission)}</span>
        `).join("")}
        <span>Commission: ${formatCurrency(month.commission)}</span>
        <span>Total: ${formatCurrency(month.total)}</span>
      </article>
    `).join("")
    : "";
}

function buildSummaryMessage(total, salesman, tripNumber, period, breakdown) {
  const monthLines = breakdown.map((month) => {
    const tierLines = month.tierResults
      .map((tier) => `${formatCurrency(tier.sales)} at ${tier.rate} = ${formatCurrency(tier.commission)}`)
      .join("; ");

    return [
      `${month.heading}`,
      `Days worked: ${month.daysWorked} of ${month.fullPeriodDays}`,
      `Sales: ${formatCurrency(month.sales)} + inactive share ${formatCurrency(month.inactiveSales)} = ${formatCurrency(month.totalSales)}`,
      `Base: ${formatCurrency(month.baseSalary)}`,
      `Commission starts after: ${formatCurrency(month.commissionStart)}`,
      `Eligible sales: ${formatCurrency(month.eligibleSales)}`,
      tierLines ? `Commission tiers: ${tierLines}` : "Commission tiers: none",
      `Month total: ${formatCurrency(month.total)}`
    ].join("\n");
  });

  return [
    `Salary summary`,
    `Salesman: ${salesman}`,
    `Trip: ${tripNumber}`,
    `Period: ${period}`,
    "",
    ...monthLines,
    "",
    `Total salary: ${formatCurrency(total)}`
  ].join("\n");
}

function updateWhatsAppLink() {
  if (!currentSummaryMessage) {
    whatsappShare.href = "#";
    whatsappShare.classList.add("is-disabled");
    whatsappShare.setAttribute("aria-disabled", "true");
    return;
  }

  whatsappShare.href = `https://wa.me/?text=${encodeURIComponent(currentSummaryMessage)}`;
  whatsappShare.classList.remove("is-disabled");
  whatsappShare.removeAttribute("aria-disabled");
}

function calculateSalary(event) {
  event.preventDefault();
  saveCurrentBaseSettings();

  const baseSalary = Number(baseSalaryInput.value);
  const inactiveSales = Number(inactiveSalesInput.value);
  const commissionStart = Number(commissionStartInput.value);
  const tiers = [
    { amount: Number(tierOneAmountInput.value), rate: Number(tierOneRateInput.value) },
    { amount: Number(tierTwoAmountInput.value), rate: Number(tierTwoRateInput.value) },
    { amount: Infinity, rate: Number(remainingRateInput.value) }
  ];
  const rows = getSalaryMonthRows();
  const period = `${formatDisplayDate(salaryStartDateInput.value)} to ${formatDisplayDate(salaryEndDateInput.value)}`;

  if (!rows.length) {
    buildSalaryMonthRows();
    return;
  }

  const totalActiveDays = rows.reduce((total, row) => {
    return total + getInclusiveDays(row.dataset.startDate, row.dataset.endDate);
  }, 0);

  const breakdown = rows.map((row) => {
    const startDate = row.dataset.startDate;
    const endDate = row.dataset.endDate;
    const sales = Number(row.querySelector(".month-sales").value);
    const daysWorked = getInclusiveDays(startDate, endDate);
    const fullPeriodDays = getDaysInMonth(startDate);
    const prorateFactor = daysWorked / fullPeriodDays;
    const periodBaseSalary = baseSalary * prorateFactor;
    const periodCommissionStart = commissionStart * prorateFactor;
    const inactiveSalesShare = totalActiveDays ? inactiveSales * (daysWorked / totalActiveDays) : 0;
    const totalSales = sales + inactiveSalesShare;
    const eligibleSales = Math.max(0, totalSales - periodCommissionStart);
    const commissionResult = calculateTieredCommission(eligibleSales, tiers);
    const total = periodBaseSalary + commissionResult.totalCommission;

    return {
      heading: formatMonthHeading(startDate, endDate),
      sales,
      inactiveSales: inactiveSalesShare,
      totalSales,
      daysWorked,
      fullPeriodDays,
      baseSalary: periodBaseSalary,
      commissionStart: periodCommissionStart,
      eligibleSales,
      commission: commissionResult.totalCommission,
      tierResults: commissionResult.tierResults,
      total
    };
  });
  const totalSalary = breakdown.reduce((total, month) => total + month.total, 0);

  updateSalaryResult(totalSalary, salarySalesmanInput.value, salaryTripNumberInput.value, period, breakdown);
}

function clearSalaryResult() {
  updateSalaryResult();
  salaryMonths.innerHTML = '<p class="empty-state">Enter trip dates, then build monthly rows.</p>';
}

function saveForwardedMessage(event) {
  if (!currentSummaryMessage) {
    event.preventDefault();
    return;
  }

  const existingIndex = forwardedMessages.findIndex((entry) => entry.key === currentSummaryKey);
  const messageEntry = {
    id: existingIndex >= 0 ? forwardedMessages[existingIndex].id : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    key: currentSummaryKey,
    message: currentSummaryMessage,
    sentAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    forwardedMessages.splice(existingIndex, 1);
  }

  forwardedMessages.unshift(messageEntry);
  saveToStorage(forwardedMessagesStorageKey, forwardedMessages);
  renderForwardedMessages();
}

function renderForwardedMessages() {
  if (!forwardedMessages.length) {
    forwardedList.innerHTML = '<p class="empty-state">No forwarded messages saved yet.</p>';
    return;
  }

  forwardedList.innerHTML = forwardedMessages
    .map((entry) => `
      <article class="forwarded-message">
        <strong>${escapeHtml(new Date(entry.sentAt).toLocaleString())}</strong>
        <pre>${escapeHtml(entry.message)}</pre>
      </article>
    `)
    .join("");
}

function renderSalesmanSettings() {
  const entries = salesmen
    .filter((name) => salesmanSettings[name])
    .map((name) => ({ name, settings: salesmanSettings[name] }));

  if (!entries.length) {
    settingsList.innerHTML = '<p class="empty-state">Calculate a salary to save base numbers for a salesman.</p>';
    return;
  }

  settingsList.innerHTML = entries
    .map(({ name, settings }) => `
      <article class="settings-record">
        <strong>${escapeHtml(name)}</strong>
        <div class="settings-grid">
          <span>Monthly base salary: ${formatCurrency(Number(settings.baseSalary))}</span>
          <span>Inactive sales before trip: ${formatCurrency(Number(settings.inactiveSales))}</span>
          <span>Commission starts after: ${formatCurrency(Number(settings.commissionStart))}</span>
          <span>Tier 1: ${formatCurrency(Number(settings.tierOneAmount))} at ${escapeHtml(settings.tierOneRate)}</span>
          <span>Tier 2: ${formatCurrency(Number(settings.tierTwoAmount))} at ${escapeHtml(settings.tierTwoRate)}</span>
          <span>Remaining rate: ${escapeHtml(settings.remainingRate)}</span>
        </div>
        <small>Updated ${escapeHtml(new Date(settings.updatedAt).toLocaleString())}</small>
      </article>
    `)
    .join("");
}

function clearForwardedMessages() {
  forwardedMessages = [];
  saveToStorage(forwardedMessagesStorageKey, forwardedMessages);
  renderForwardedMessages();
}

function switchTab(tab) {
  tabs.forEach((button) => {
    const isActive = button === tab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.id === tab.getAttribute("aria-controls");
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

salesmanForm.addEventListener("submit", addSalesman);
salarySalesmanInput.addEventListener("change", loadBaseSettingsForSelectedSalesman);
salaryForm.addEventListener("submit", calculateSalary);
salaryForm.addEventListener("reset", clearSalaryResult);
buildSalaryMonthsButton.addEventListener("click", buildSalaryMonthRows);
whatsappShare.addEventListener("click", saveForwardedMessage);
clearForwardedButton.addEventListener("click", clearForwardedMessages);
tabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab)));

renderSalesmanOptions();
updateSalaryResult();
renderForwardedMessages();
renderSalesmanSettings();
