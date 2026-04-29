const salesmanForm = document.querySelector("#salesman-form");
const newSalesmanInput = document.querySelector("#new-salesman");
const salaryForm = document.querySelector("#salary-form");
const salarySalesmanInput = document.querySelector("#salary-salesman");
const salaryTripNumberInput = document.querySelector("#salary-trip-number");
const salaryStartDateInput = document.querySelector("#salary-start-date");
const salaryEndDateInput = document.querySelector("#salary-end-date");
const baseSalaryInput = document.querySelector("#base-salary");
const inactiveSalesInput = document.querySelector("#inactive-sales");
const commissionStartInput = document.querySelector("#commission-start");
const tierOneAmountInput = document.querySelector("#tier-one-amount");
const tierOneRateInput = document.querySelector("#tier-one-rate");
const tierTwoAmountInput = document.querySelector("#tier-two-amount");
const tierTwoRateInput = document.querySelector("#tier-two-rate");
const remainingRateInput = document.querySelector("#remaining-rate");
const buildSalaryMonthsButton = document.querySelector("#build-salary-months");
const salaryMonths = document.querySelector("#salary-months");
const salaryTotalPay = document.querySelector("#salary-total-pay");
const salaryNote = document.querySelector("#salary-note");
const salaryBreakdown = document.querySelector("#salary-breakdown");
const whatsappShare = document.querySelector("#whatsapp-share");
const forwardedList = document.querySelector("#forwarded-list");
const clearForwardedButton = document.querySelector("#clear-forwarded");
const settingsList = document.querySelector("#settings-list");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const salesmanStorageKey = "travelDaysSalesmen";
const forwardedMessagesStorageKey = "salaryForwardedMessages";
const salesmanSettingsStorageKey = "salesmanBaseSettings";

let salesmen = loadFromStorage(salesmanStorageKey, []);
let forwardedMessages = loadFromStorage(forwardedMessagesStorageKey, []);
let salesmanSettings = loadFromStorage(salesmanSettingsStorageKey, {});
let currentSummaryMessage = "";
let currentSummaryKey = "";

function loadFromStorage(key, fallback) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return fallback;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  return parseLocalDate(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatCurrency(value) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD"
  });
}

function getInclusiveDays(startValue, endValue) {
  const startDate = parseLocalDate(startValue);
  const endDate = parseLocalDate(endValue);
  const firstDate = Math.min(startDate.getTime(), endDate.getTime());
  const secondDate = Math.max(startDate.getTime(), endDate.getTime());

  return Math.round((secondDate - firstDate) / millisecondsPerDay) + 1;
}

function getDaysInMonth(value) {
  const date = parseLocalDate(value);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function formatMonthHeading(startValue, endValue) {
  const startDate = parseLocalDate(startValue);
  const monthName = startDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  return `${monthName}: ${formatDisplayDate(startValue)} to ${formatDisplayDate(endValue)}`;
}

function getMonthSegments(startValue, endValue) {
  const startDate = parseLocalDate(startValue);
  const endDate = parseLocalDate(endValue);
  const firstDate = startDate <= endDate ? startDate : endDate;
  const lastDate = startDate <= endDate ? endDate : startDate;
  const segments = [];
  let currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());

  while (currentDate <= lastDate) {
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const segmentEnd = monthEnd < lastDate ? monthEnd : lastDate;

    segments.push({
      startDate: toDateInputValue(currentDate),
      endDate: toDateInputValue(segmentEnd)
    });

    currentDate = new Date(segmentEnd.getFullYear(), segmentEnd.getMonth(), segmentEnd.getDate() + 1);
  }

  return segments;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSalesmanOptions() {
  const selectedSalesman = salarySalesmanInput.value;

  salarySalesmanInput.innerHTML = '<option value="" selected disabled>Select a salesman</option>';
  salesmen.forEach((name) => {
    salarySalesmanInput.add(new Option(name, name));
  });

  if (salesmen.includes(selectedSalesman)) {
    salarySalesmanInput.value = selectedSalesman;
  }
}

function addSalesman(event) {
  event.preventDefault();

  const name = newSalesmanInput.value.trim();

  if (!name) {
    return;
  }

  const nameExists = salesmen.some((salesman) => salesman.toLowerCase() === name.toLowerCase());

  if (nameExists) {
    newSalesmanInput.value = "";
    return;
  }

  salesmen.push(name);
  salesmen.sort((first, second) => first.localeCompare(second));
  saveToStorage(salesmanStorageKey, salesmen);
  renderSalesmanOptions();
  salarySalesmanInput.value = name;
  newSalesmanInput.value = "";
}

function getCurrentBaseSettings() {
  return {
    baseSalary: baseSalaryInput.value,
    inactiveSales: inactiveSalesInput.value,
    commissionStart: commissionStartInput.value,
    tierOneAmount: tierOneAmountInput.value,
    tierOneRate: tierOneRateInput.value,
    tierTwoAmount: tierTwoAmountInput.value,
    tierTwoRate: tierTwoRateInput.value,
    remainingRate: remainingRateInput.value,
    updatedAt: new Date().toISOString()
  };
}

function saveCurrentBaseSettings() {
  if (!salarySalesmanInput.value) {
    return;
  }

  salesmanSettings[salarySalesmanInput.value] = getCurrentBaseSettings();
  saveToStorage(salesmanSettingsStorageKey, salesmanSettings);
  renderSalesmanSettings();
}

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
    "Salary summary",
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
