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
const ocrImageInput = document.querySelector("#ocr-image");
const readImageButton = document.querySelector("#read-image");
const useDetectedTextButton = document.querySelector("#use-detected-text");
const ocrStatus = document.querySelector("#ocr-status");
const ocrText = document.querySelector("#ocr-text");
const buildSalaryMonthsButton = document.querySelector("#build-salary-months");
const salaryMonths = document.querySelector("#salary-months");
const salaryTotalPay = document.querySelector("#salary-total-pay");
const salaryNote = document.querySelector("#salary-note");
const salaryBreakdown = document.querySelector("#salary-breakdown");
const whatsappShare = document.querySelector("#whatsapp-share");
const forwardedList = document.querySelector("#forwarded-list");
const clearForwardedButton = document.querySelector("#clear-forwarded");
const settingsList = document.querySelector("#settings-list");
const contractorForm = document.querySelector("#contractor-form");
const contractorSelect = document.querySelector("#contractor-select");
const contractorPayMonthInput = document.querySelector("#contractor-pay-month");
const contractorNameInput = document.querySelector("#contractor-name");
const contractorHolderInput = document.querySelector("#contractor-holder");
const contractorBankInput = document.querySelector("#contractor-bank");
const contractorBranchInput = document.querySelector("#contractor-branch");
const contractorAccountInput = document.querySelector("#contractor-account");
const contractorIfscInput = document.querySelector("#contractor-ifsc");
const contractorBaseSalaryInput = document.querySelector("#contractor-base-salary");
const contractorPercentInput = document.querySelector("#contractor-percent");
const saveContractorButton = document.querySelector("#save-contractor");
const contractorTotalPay = document.querySelector("#contractor-total-pay");
const contractorNote = document.querySelector("#contractor-note");
const contractorSummaryText = document.querySelector("#contractor-summary-text");
const contractorWhatsAppShare = document.querySelector("#contractor-whatsapp-share");
const cleanContractorSummaryButton = document.querySelector("#clean-contractor-summary");
const contractorList = document.querySelector("#contractor-list");
const mainTabs = document.querySelectorAll(".main-tab");
const mainPanels = document.querySelectorAll(".main-panel");
const sidTabs = document.querySelectorAll(".sid-tab");
const sidPanels = document.querySelectorAll(".sid-panel");
const tinkyTabs = document.querySelectorAll(".tinky-tab");
const tinkyPanels = document.querySelectorAll(".tinky-subpanel");

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const salesmanStorageKey = "travelDaysSalesmen";
const forwardedMessagesStorageKey = "salaryForwardedMessages";
const salesmanSettingsStorageKey = "salesmanBaseSettings";
const salaryDraftStorageKey = "salaryCalculatorDraft";
const contractorStorageKey = "tinkyContractors";
const contractorSummaryStorageKey = "tinkyContractorSummaries";

let salesmen = loadFromStorage(salesmanStorageKey, []);
let forwardedMessages = loadFromStorage(forwardedMessagesStorageKey, []);
let salesmanSettings = loadFromStorage(salesmanSettingsStorageKey, {});
let contractors = loadFromStorage(contractorStorageKey, getDefaultContractors());
let contractorSummaryEntries = loadFromStorage(contractorSummaryStorageKey, []);
let currentSummaryMessage = "";
let currentSummaryKey = "";
let isRestoringDraft = false;

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

function getDefaultContractors() {
  return [
    {
      id: "surya-prasanna",
      name: "Surya Prasanna",
      holder: "Surya Prasanna",
      bank: "State Bank of India",
      branch: "",
      account: "40067197127",
      ifsc: "SBIN0021044",
      baseSalary: 35000,
      percent: 100
    },
    {
      id: "muskan-vishwakarma",
      name: "Muskan Vishwakarma",
      holder: "Muskan Vishwakarma",
      bank: "Kotak Mahindra Bank",
      branch: "Chappru Nagar Square, Nagpur",
      account: "9246034930",
      ifsc: "KKBK0001829",
      baseSalary: 25000,
      percent: 100
    },
    {
      id: "anam-ajaz-shaikh",
      name: "Anam Ajaz Shaikh",
      holder: "Anam Ajaz Shaikh",
      bank: "Union Bank",
      branch: "Saubhagya nagar - Deolali Camp",
      account: "502002010096694",
      ifsc: "UBIN0550205",
      baseSalary: 31500,
      percent: 90
    },
    {
      id: "manmeet-bindra",
      name: "Manmeet Bindra",
      holder: "Manmeet Bindra",
      bank: "Union Bank Of India",
      branch: "Janakpuri, New Delhi - 110058",
      account: "026812010001346",
      ifsc: "UBIN0802689",
      baseSalary: 38500,
      percent: 100
    },
    {
      id: "kamlesh-kumari",
      name: "Kamlesh Kumari",
      holder: "Kamlesh Kumari",
      bank: "Canara Bank",
      branch: "Delhi Nangal Raya Branch",
      account: "90192010194488",
      ifsc: "CNRB0019019",
      baseSalary: 29000,
      percent: 100
    },
    {
      id: "aastha-jaiswal",
      name: "Aastha Jaiswal",
      holder: "AASTHA JAISWAL U/G SHIKHA JAISWAL",
      bank: "UCO BANK",
      branch: "GRAM PIPLIA HANA-INDORE",
      account: "05250110017593",
      ifsc: "UCBA0000525",
      baseSalary: 38000,
      percent: 100
    },
    {
      id: "janvi-lalwani",
      name: "Janvi Lalwani",
      holder: "Janvi Lalwani",
      bank: "Bank of Baroda",
      branch: "Manik Bagh Road, Indore (M.P) - 452001",
      account: "49920100007185",
      ifsc: "BARB0MANBAG",
      baseSalary: 27000,
      percent: 50
    },
    {
      id: "karishma-patro",
      name: "Karishma Patro",
      holder: "Baratu Karishma Patro",
      bank: "IDBI BANK",
      branch: "CRP Square Branch",
      account: "2142104000019831",
      ifsc: "IBKL0002142",
      baseSalary: 25000,
      percent: 100
    },
    {
      id: "swati-barua",
      name: "Swati Barua",
      holder: "Swati Barua",
      bank: "Union Bank of India",
      branch: "Uttam Nagar",
      account: "254512010000069",
      ifsc: "UBIN0825450",
      baseSalary: 32500,
      percent: 100
    },
    {
      id: "ashmita-anand",
      name: "Ashmita Anand",
      holder: "Ashmita Anand",
      bank: "Union Bank of India",
      branch: "Katni",
      account: "325802010684527",
      ifsc: "UBIN0532584",
      baseSalary: 29000,
      percent: 100
    },
    {
      id: "manikandan-raja",
      name: "Manikandan, Raja",
      holder: "R. Manikandan",
      bank: "Standard Chartered Bank",
      branch: "Jubilee Hills, Hyderabad",
      account: "44411811218",
      ifsc: "SCBL0036090",
      baseSalary: 28000,
      percent: 100
    },
    {
      id: "mow-mukherjee",
      name: "Mow Mukherjee",
      holder: "MOW MUKHERJEE",
      bank: "ICICI BANK",
      branch: "",
      account: "029201519329",
      ifsc: "ICIC0000292",
      baseSalary: 25000,
      percent: 96
    },
    {
      id: "palwinder-kaur",
      name: "Palwinder Kaur",
      holder: "Palwinder Kaur",
      bank: "Kotak Mahindra Bank",
      branch: "Saharanpur",
      account: "6348504385",
      ifsc: "KKBK00053053",
      baseSalary: 25000,
      percent: 96
    }
  ];
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

function formatMonthYear(value) {
  if (!value) {
    return new Date().toLocaleDateString(undefined, {
      month: "long",
      year: "numeric"
    });
  }

  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
}

function formatCurrency(value) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD"
  });
}

function formatINR(value) {
  return Number(value).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR"
  });
}

function formatRate(value) {
  return `${Number(value).toLocaleString()}%`;
}

function ratePercentToDecimal(value) {
  return Number(value) / 100;
}

function normalizeRatePercent(value) {
  const rate = Number(value);
  return rate > 0 && rate < 1 ? rate * 100 : rate;
}

function normalizeInactiveSales(value) {
  return Number(value) === 0 ? "" : value;
}

function normalizeExtractedNumber(value) {
  return Number(String(value).replace(/[$,\s]/g, ""));
}

function parseImageDate(value) {
  const parts = value.match(/\d{1,4}/g);

  if (!parts || parts.length < 2) {
    return "";
  }

  let month;
  let day;
  let year;

  if (parts[0].length === 4) {
    year = Number(parts[0]);
    month = Number(parts[1]);
    day = Number(parts[2]);
  } else {
    month = Number(parts[0]);
    day = Number(parts[1]);
    year = parts[2] ? Number(parts[2]) : new Date().getFullYear();
  }

  if (!month || !day || month > 12 || day > 31) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function findExistingSalesmanInText(text) {
  const lowerText = text.toLowerCase();
  return salesmen.find((name) => lowerText.includes(name.toLowerCase())) || "";
}

function extractNumbersFromText(text) {
  return Array.from(text.matchAll(/\$?\d[\d,]*(?:\.\d+)?/g))
    .map((match) => normalizeExtractedNumber(match[0]))
    .filter((number) => Number.isFinite(number));
}

function extractDatesFromText(text) {
  return Array.from(text.matchAll(/\b(?:\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/g))
    .map((match) => parseImageDate(match[0]))
    .filter(Boolean);
}

function extractValueAfterLabel(text, labels) {
  const escapedLabels = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const pattern = new RegExp(`(?:${escapedLabels})\\s*[:\\-]?\\s*\\$?([\\d,]+(?:\\.\\d+)?)`, "i");
  const match = text.match(pattern);

  return match ? normalizeExtractedNumber(match[1]) : null;
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
  saveSalaryDraft();
}

function getCurrentBaseSettings() {
  return {
    baseSalary: baseSalaryInput.value,
    inactiveSales: normalizeInactiveSales(inactiveSalesInput.value),
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
    saveSalaryDraft();
    return;
  }

  baseSalaryInput.value = settings.baseSalary;
  inactiveSalesInput.value = normalizeInactiveSales(settings.inactiveSales);
  commissionStartInput.value = settings.commissionStart;
  tierOneAmountInput.value = settings.tierOneAmount;
  tierOneRateInput.value = normalizeRatePercent(settings.tierOneRate);
  tierTwoAmountInput.value = settings.tierTwoAmount;
  tierTwoRateInput.value = normalizeRatePercent(settings.tierTwoRate);
  remainingRateInput.value = normalizeRatePercent(settings.remainingRate);
  saveSalaryDraft();
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

  renderSalaryMonthRows(getMonthSegments(salaryStartDateInput.value, salaryEndDateInput.value));
  saveSalaryDraft();
}

function renderSalaryMonthRows(segments, savedRows = []) {
  salaryMonths.innerHTML = segments
    .map((segment, index) => `
      <article class="salary-month" data-start-date="${segment.startDate}" data-end-date="${segment.endDate}">
        <strong>${escapeHtml(formatMonthHeading(segment.startDate, segment.endDate))}</strong>
        <div class="field-grid">
          <label>
            Sales amount
            <input class="month-sales" type="number" min="0" step="0.01" placeholder="0.00" value="${escapeHtml(getSavedMonthSales(segment, savedRows))}" required>
          </label>
        </div>
        <small>Month ${index + 1}</small>
      </article>
    `)
    .join("");
}

function fillMonthlySalesFromNumbers(numbers) {
  const rows = getSalaryMonthRows();
  const salesNumbers = numbers
    .filter((number) => number >= 100)
    .sort((first, second) => second - first);

  rows.forEach((row, index) => {
    const salesInput = row.querySelector(".month-sales");

    if (salesInput && salesNumbers[index] !== undefined) {
      salesInput.value = salesNumbers[index];
    }
  });

  saveSalaryDraft();
}

function getSavedMonthSales(segment, savedRows) {
  const savedRow = savedRows.find((row) => {
    return row.startDate === segment.startDate && row.endDate === segment.endDate;
  });

  return savedRow ? savedRow.sales : "";
}

function getSalaryMonthRows() {
  return Array.from(document.querySelectorAll(".salary-month"));
}

function getCurrentSalaryDraft() {
  return {
    salesman: salarySalesmanInput.value,
    tripNumber: salaryTripNumberInput.value,
    startDate: salaryStartDateInput.value,
    endDate: salaryEndDateInput.value,
    baseSalary: baseSalaryInput.value,
    inactiveSales: inactiveSalesInput.value,
    commissionStart: commissionStartInput.value,
    tierOneAmount: tierOneAmountInput.value,
    tierOneRate: tierOneRateInput.value,
    tierTwoAmount: tierTwoAmountInput.value,
    tierTwoRate: tierTwoRateInput.value,
    remainingRate: remainingRateInput.value,
    monthRows: getSalaryMonthRows().map((row) => ({
      startDate: row.dataset.startDate,
      endDate: row.dataset.endDate,
      sales: row.querySelector(".month-sales").value
    }))
  };
}

function saveSalaryDraft() {
  if (isRestoringDraft) {
    return;
  }

  saveToStorage(salaryDraftStorageKey, getCurrentSalaryDraft());
}

function restoreSalaryDraft() {
  const draft = loadFromStorage(salaryDraftStorageKey, null);

  if (!draft) {
    return;
  }

  isRestoringDraft = true;

  if (salesmen.includes(draft.salesman)) {
    salarySalesmanInput.value = draft.salesman;
  }

  salaryTripNumberInput.value = draft.tripNumber || "";
  salaryStartDateInput.value = draft.startDate || "";
  salaryEndDateInput.value = draft.endDate || "";
  baseSalaryInput.value = draft.baseSalary || baseSalaryInput.value;
  inactiveSalesInput.value = normalizeInactiveSales(draft.inactiveSales);
  commissionStartInput.value = draft.commissionStart || commissionStartInput.value;
  tierOneAmountInput.value = draft.tierOneAmount || tierOneAmountInput.value;
  tierOneRateInput.value = draft.tierOneRate ? normalizeRatePercent(draft.tierOneRate) : tierOneRateInput.value;
  tierTwoAmountInput.value = draft.tierTwoAmount || tierTwoAmountInput.value;
  tierTwoRateInput.value = draft.tierTwoRate ? normalizeRatePercent(draft.tierTwoRate) : tierTwoRateInput.value;
  remainingRateInput.value = draft.remainingRate ? normalizeRatePercent(draft.remainingRate) : remainingRateInput.value;

  if (draft.startDate && draft.endDate && draft.monthRows && draft.monthRows.length) {
    renderSalaryMonthRows(getMonthSegments(draft.startDate, draft.endDate), draft.monthRows);
  }

  isRestoringDraft = false;
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
        <span>${formatCurrency(tier.sales)} at ${formatRate(tier.ratePercent)} = ${formatCurrency(tier.commission)}</span>
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
      .map((tier) => `${formatCurrency(tier.sales)} at ${formatRate(tier.ratePercent)} = ${formatCurrency(tier.commission)}`)
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
  saveSalaryDraft();

  const baseSalary = Number(baseSalaryInput.value);
  const inactiveSales = Number(inactiveSalesInput.value || 0);
  const commissionStart = Number(commissionStartInput.value);
  const tiers = [
    { amount: Number(tierOneAmountInput.value), rate: ratePercentToDecimal(tierOneRateInput.value), ratePercent: Number(tierOneRateInput.value) },
    { amount: Number(tierTwoAmountInput.value), rate: ratePercentToDecimal(tierTwoRateInput.value), ratePercent: Number(tierTwoRateInput.value) },
    { amount: Infinity, rate: ratePercentToDecimal(remainingRateInput.value), ratePercent: Number(remainingRateInput.value) }
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
  localStorage.removeItem(salaryDraftStorageKey);
}

async function readImageText() {
  const file = ocrImageInput.files && ocrImageInput.files[0];

  if (!file) {
    ocrStatus.textContent = "Choose an image first.";
    return;
  }

  if (!window.Tesseract) {
    ocrStatus.textContent = "OCR library did not load. Check your internet connection and try again.";
    return;
  }

  readImageButton.disabled = true;
  ocrStatus.textContent = "Reading image...";

  try {
    const result = await Tesseract.recognize(file, "eng", {
      logger(progress) {
        if (progress.status === "recognizing text") {
          ocrStatus.textContent = `Reading image ${Math.round(progress.progress * 100)}%`;
        }
      }
    });

    ocrText.value = result.data.text.trim();
    ocrStatus.textContent = "Review the detected text, then load values.";
  } catch {
    ocrStatus.textContent = "Could not read this image. Try a clearer screenshot or photo.";
  } finally {
    readImageButton.disabled = false;
  }
}

function useDetectedText() {
  const text = ocrText.value.trim();

  if (!text) {
    ocrStatus.textContent = "No detected text to use yet.";
    return;
  }

  const detectedSalesman = findExistingSalesmanInText(text);
  const dates = extractDatesFromText(text);
  const inactiveSales = extractValueAfterLabel(text, ["inactive sales", "inactive sale", "before trip"]);
  const tripNumber = extractValueAfterLabel(text, ["trip", "trip number"]);
  const allNumbers = extractNumbersFromText(text);

  if (detectedSalesman) {
    salarySalesmanInput.value = detectedSalesman;
    loadBaseSettingsForSelectedSalesman();
  }

  if (tripNumber !== null) {
    salaryTripNumberInput.value = tripNumber;
  }

  if (dates[0]) {
    salaryStartDateInput.value = dates[0];
  }

  if (dates[1]) {
    salaryEndDateInput.value = dates[1];
  }

  if (inactiveSales !== null) {
    inactiveSalesInput.value = inactiveSales;
  }

  if (salaryStartDateInput.value && salaryEndDateInput.value) {
    renderSalaryMonthRows(getMonthSegments(salaryStartDateInput.value, salaryEndDateInput.value));
  }

  fillMonthlySalesFromNumbers(allNumbers);
  ocrStatus.textContent = "Loaded likely values. Please review before calculating.";
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
          <span>Tier 1: ${formatCurrency(Number(settings.tierOneAmount))} at ${formatRate(normalizeRatePercent(settings.tierOneRate))}</span>
          <span>Tier 2: ${formatCurrency(Number(settings.tierTwoAmount))} at ${formatRate(normalizeRatePercent(settings.tierTwoRate))}</span>
          <span>Remaining rate: ${formatRate(normalizeRatePercent(settings.remainingRate))}</span>
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

function setDefaultContractorPayMonth() {
  const today = new Date();
  contractorPayMonthInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
}

function maskAccountNumber(account) {
  const cleanAccount = String(account || "").trim();

  if (cleanAccount.length <= 4) {
    return cleanAccount || "Not entered";
  }

  return `ending ${cleanAccount.slice(-4)}`;
}

function renderContractorOptions() {
  const selectedContractor = contractorSelect.value;

  contractorSelect.innerHTML = '<option value="" selected disabled>Select a contractor</option>';
  contractors
    .slice()
    .sort((first, second) => first.name.localeCompare(second.name))
    .forEach((contractor) => {
      contractorSelect.add(new Option(contractor.name, contractor.id));
    });

  if (contractors.some((contractor) => contractor.id === selectedContractor)) {
    contractorSelect.value = selectedContractor;
  }
}

function getContractorPay(contractor) {
  return Number(contractor.baseSalary || 0) * (Number(contractor.percent || 0) / 100);
}

function renderContractorList() {
  if (!contractors.length) {
    contractorList.innerHTML = '<p class="empty-state">No contractors saved yet.</p>';
    return;
  }

  contractorList.innerHTML = contractors
    .slice()
    .sort((first, second) => first.name.localeCompare(second.name))
    .map((contractor) => `
      <article class="settings-record">
        <strong>${escapeHtml(contractor.name)}</strong>
        <div class="settings-grid">
          <span>Base salary: ${formatINR(Number(contractor.baseSalary || 0))}</span>
          <span>Bank: ${escapeHtml(contractor.bank || "Not entered")}</span>
          <span>Account: ${escapeHtml(maskAccountNumber(contractor.account))}</span>
          <span>Holder: ${escapeHtml(contractor.holder || "Not entered")}</span>
          <span>IFSC: ${escapeHtml(contractor.ifsc || "Not entered")}</span>
        </div>
        <div class="record-actions">
          <button class="small-button secondary contractor-edit" type="button" data-contractor-id="${escapeHtml(contractor.id)}">Edit</button>
          <button class="small-button secondary contractor-remove" type="button" data-contractor-id="${escapeHtml(contractor.id)}">Remove</button>
        </div>
      </article>
    `)
    .join("");
}

function loadContractor(contractorId) {
  const contractor = contractors.find((entry) => entry.id === contractorId);

  if (!contractor) {
    return;
  }

  contractorNameInput.value = contractor.name || "";
  contractorHolderInput.value = contractor.holder || "";
  contractorBankInput.value = contractor.bank || "";
  contractorBranchInput.value = contractor.branch || "";
  contractorAccountInput.value = contractor.account || "";
  contractorIfscInput.value = contractor.ifsc || "";
  contractorBaseSalaryInput.value = contractor.baseSalary ?? "";
  contractorPercentInput.value = contractor.percent ?? "";
  updateContractorResult(contractor);
}

function makeContractorId(name) {
  const baseId = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "contractor";
  let id = baseId;
  let index = 2;

  while (contractors.some((contractor) => contractor.id === id && contractor.id !== contractorSelect.value)) {
    id = `${baseId}-${index}`;
    index += 1;
  }

  return id;
}

function getContractorFormData() {
  const name = contractorNameInput.value.trim();

  return {
    id: contractorSelect.value || makeContractorId(name),
    payMonth: contractorPayMonthInput.value,
    name,
    holder: contractorHolderInput.value.trim(),
    bank: contractorBankInput.value.trim(),
    branch: contractorBranchInput.value.trim(),
    account: contractorAccountInput.value.trim(),
    ifsc: contractorIfscInput.value.trim(),
    baseSalary: Number(contractorBaseSalaryInput.value || 0),
    percent: Number(contractorPercentInput.value || 0)
  };
}

function updateContractorResult(contractor) {
  const payableSalary = getContractorPay(contractor);

  contractorTotalPay.textContent = formatINR(payableSalary);
  contractorNote.textContent = contractor.name
    ? `${contractor.name}: ${formatINR(Number(contractor.baseSalary || 0))} x ${formatRate(contractor.percent || 0)} = ${formatINR(payableSalary)}`
    : "Enter contractor details to calculate salary.";
}

function calculateContractorSalary(event) {
  event.preventDefault();
  const contractor = getContractorFormData();

  updateContractorResult(contractor);
  addContractorSummary(contractor);
}

function buildContractorSummaryMessage(contractor) {
  const payableSalary = getContractorPay(contractor);

  return [
    formatMonthYear(contractor.payMonth),
    "",
    "Contractor salary details",
    `Name: ${contractor.name || ""}`,
    `Account holder: ${contractor.holder || ""}`,
    `Bank: ${contractor.bank || ""}`,
    `Branch: ${contractor.branch || ""}`,
    `Account number: ${contractor.account || ""}`,
    `IFSC: ${contractor.ifsc || ""}`,
    "",
    `Salary: ${formatINR(Number(contractor.baseSalary || 0))} x ${formatRate(contractor.percent || 0)} = ${formatINR(payableSalary)}`
  ].join("\n");
}

function getContractorSummaryKey(contractor) {
  return contractor.id || contractor.name.toLowerCase().trim();
}

function addContractorSummary(contractor) {
  if (!contractor.name) {
    return;
  }

  const key = getContractorSummaryKey(contractor);
  const summaryEntry = {
    key,
    contractor,
    updatedAt: new Date().toISOString()
  };
  const existingIndex = contractorSummaryEntries.findIndex((entry) => entry.key === key);

  if (existingIndex >= 0) {
    contractorSummaryEntries[existingIndex] = summaryEntry;
  } else {
    contractorSummaryEntries.push(summaryEntry);
  }

  saveToStorage(contractorSummaryStorageKey, contractorSummaryEntries);
  renderContractorSummary();
}

function buildAllContractorSummaryMessage() {
  return contractorSummaryEntries
    .map((entry) => buildContractorSummaryMessage(entry.contractor))
    .join("\n\n--------------------\n\n");
}

function renderContractorSummary() {
  if (!contractorSummaryEntries.length) {
    contractorSummaryText.textContent = "Click Calculate contractor salary to add a contractor to this summary.";
    updateContractorWhatsAppLink("");
    return;
  }

  const summaryMessage = buildAllContractorSummaryMessage();
  contractorSummaryText.textContent = summaryMessage;
  updateContractorWhatsAppLink(summaryMessage);
}

function updateContractorWhatsAppLink(summaryMessage) {
  if (!summaryMessage) {
    contractorWhatsAppShare.href = "#";
    contractorWhatsAppShare.classList.add("is-disabled");
    contractorWhatsAppShare.setAttribute("aria-disabled", "true");
    return;
  }

  contractorWhatsAppShare.href = `https://wa.me/?text=${encodeURIComponent(summaryMessage)}`;
  contractorWhatsAppShare.classList.remove("is-disabled");
  contractorWhatsAppShare.removeAttribute("aria-disabled");
}

function cleanContractorSummary() {
  contractorSummaryEntries = [];
  saveToStorage(contractorSummaryStorageKey, contractorSummaryEntries);
  renderContractorSummary();
}

function saveContractor() {
  const contractor = getContractorFormData();
  const { payMonth, ...contractorToSave } = contractor;

  if (!contractor.name) {
    contractorNote.textContent = "Enter a contractor name before saving.";
    return;
  }

  const existingIndex = contractors.findIndex((entry) => entry.id === contractorToSave.id);

  if (existingIndex >= 0) {
    contractors[existingIndex] = contractorToSave;
  } else {
    contractors.push(contractorToSave);
  }

  contractors.sort((first, second) => first.name.localeCompare(second.name));
  saveToStorage(contractorStorageKey, contractors);
  renderContractorOptions();
  contractorSelect.value = contractorToSave.id;
  renderContractorList();
  updateContractorResult({ ...contractorToSave, payMonth });
}

function editContractor(contractorId) {
  const contractor = contractors.find((entry) => entry.id === contractorId);

  if (!contractor) {
    return;
  }

  contractorSelect.value = contractor.id;
  loadContractor(contractor.id);
  switchTab(document.querySelector("#tab-contractor-salary"), tinkyTabs, tinkyPanels);
}

function removeContractor(contractorId) {
  const contractor = contractors.find((entry) => entry.id === contractorId);

  if (!contractor) {
    return;
  }

  const shouldRemove = window.confirm(`Remove ${contractor.name} from base numbers?`);

  if (!shouldRemove) {
    return;
  }

  contractors = contractors.filter((entry) => entry.id !== contractorId);
  contractorSummaryEntries = contractorSummaryEntries.filter((entry) => entry.key !== contractorId);
  saveToStorage(contractorStorageKey, contractors);
  saveToStorage(contractorSummaryStorageKey, contractorSummaryEntries);
  renderContractorOptions();
  renderContractorList();
  renderContractorSummary();

  if (contractorSelect.value === contractorId) {
    contractorForm.reset();
    setDefaultContractorPayMonth();
    updateContractorResult({ name: "" });
  }
}

function handleContractorListClick(event) {
  const editButton = event.target.closest(".contractor-edit");
  const removeButton = event.target.closest(".contractor-remove");

  if (editButton) {
    editContractor(editButton.dataset.contractorId);
    return;
  }

  if (removeButton) {
    removeContractor(removeButton.dataset.contractorId);
  }
}

function switchTab(tab, tabGroup, panelGroup) {
  tabGroup.forEach((button) => {
    const isActive = button === tab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  panelGroup.forEach((panel) => {
    const isActive = panel.id === tab.getAttribute("aria-controls");
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

salesmanForm.addEventListener("submit", addSalesman);
salarySalesmanInput.addEventListener("change", loadBaseSettingsForSelectedSalesman);
salaryForm.addEventListener("input", saveSalaryDraft);
salaryForm.addEventListener("change", saveSalaryDraft);
salaryForm.addEventListener("submit", calculateSalary);
salaryForm.addEventListener("reset", clearSalaryResult);
readImageButton.addEventListener("click", readImageText);
useDetectedTextButton.addEventListener("click", useDetectedText);
buildSalaryMonthsButton.addEventListener("click", buildSalaryMonthRows);
whatsappShare.addEventListener("click", saveForwardedMessage);
clearForwardedButton.addEventListener("click", clearForwardedMessages);
contractorSelect.addEventListener("change", () => loadContractor(contractorSelect.value));
contractorForm.addEventListener("submit", calculateContractorSalary);
saveContractorButton.addEventListener("click", saveContractor);
cleanContractorSummaryButton.addEventListener("click", cleanContractorSummary);
contractorList.addEventListener("click", handleContractorListClick);
mainTabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab, mainTabs, mainPanels)));
sidTabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab, sidTabs, sidPanels)));
tinkyTabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab, tinkyTabs, tinkyPanels)));

renderSalesmanOptions();
restoreSalaryDraft();
updateSalaryResult();
renderForwardedMessages();
renderSalesmanSettings();
setDefaultContractorPayMonth();
renderContractorOptions();
renderContractorList();
renderContractorSummary();
