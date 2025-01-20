const language = localStorage.getItem("language") || "en";

const en = document.getElementById("english");
const sr = document.getElementById("serbian");

const enMobile = document.getElementById("english-mobile");
const srMobile = document.getElementById("serbian-mobile");

function switchLanguage(lang) {
  document.querySelectorAll("[data-lang-en]").forEach((el) => {
    if (el.placeholder) {
      el.placeholder = el.getAttribute(`data-lang-${lang}`);
    } else {
      el.textContent = el.getAttribute(`data-lang-${lang}`);
    }
  });

  updateLocalDaysOfWeek();

  renderMenu();
}

function updateActiveLanguage(lang) {
  if (lang === "en") {
    en.style.color = "lightgreen";
    sr.style.color = "white";
  } else if (lang === "sr") {
    sr.style.color = "lightgreen";
    en.style.color = "white";
  }
}

en.addEventListener("click", () => {
  localStorage.setItem("language", "en");
  switchLanguage("en");
  updateActiveLanguage("en");
  fetchAndTranslateMenu();
});

sr.addEventListener("click", () => {
  localStorage.setItem("language", "sr");
  switchLanguage("sr");
  updateActiveLanguage("sr");
  fetchAndTranslateMenu();
});

if (enMobile && srMobile) {
  enMobile.addEventListener("click", () => {
    console.log("radi eng");
    localStorage.setItem("language", "en");
    switchLanguage("en");
    updateActiveLanguage("en");
    fetchAndTranslateMenu();
  });

  srMobile.addEventListener("click", () => {
    console.log("radi srp");
    localStorage.setItem("language", "sr");
    switchLanguage("sr");
    updateActiveLanguage("sr");
    fetchAndTranslateMenu();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("language") || "en";
  console.log(savedLanguage);
  switchLanguage(savedLanguage);
  updateActiveLanguage(savedLanguage);
});

const handleSignout = () => {
  localStorage.removeItem("loginData");

  window.location.href = "../signIn/index.html";
};

const signoutButtons = document.querySelectorAll(".signout");
signoutButtons.forEach((el) => el.addEventListener("click", handleSignout));

const menuGrid = document.querySelector(".menu-grid");
let finalData = [];
let activeDay = null;

const localDaysOfWeek = {
  en: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  sr: [
    "Ponedeljak",
    "Utorak",
    "Sreda",
    "Četvrtak",
    "Petak",
    "Subota",
    "Nedelja",
  ],
};

function getActiveLanguage() {
  return localStorage.getItem("language") || "en";
}

function updateLocalDaysOfWeek() {
  const lang = getActiveLanguage();
  const dayHeaders = document.querySelectorAll(".day-header");
  const days = localDaysOfWeek[lang];

  dayHeaders.forEach((header, index) => {
    header.textContent = days[index];
  });
}

async function translateText(text, originalLang, targetLang) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${originalLang}|${targetLang}`
    );
    const data = await response.json();
    if (data.responseStatus !== 200) {
      throw new Error("Translation service error");
    }
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return null;
  }
}

async function fetchAndTranslateMenu() {
  try {
    const response = await fetch(
      "https://vebdizajn-4.onrender.com/api/vebdizajn/plan-ishrane"
    );
    const data = await response.json();

    const currentLang = getActiveLanguage();

    if (currentLang === "en") {
      const translatedData = await Promise.all(
        data.map((text) => translateText(text, "sr", "en"))
      );

      if (translatedData.every((item) => item !== null)) {
        localStorage.setItem("weeklyMenuData", JSON.stringify(translatedData));
        finalData = translatedData;
      } else {
        throw new Error("Translation failed for some items.");
      }
    } else {
      finalData = data;
    }

    renderMenu();
  } catch (error) {
    console.error("Error fetching or translating menu:", error);
    const storedData = localStorage.getItem("weeklyMenuData");
    if (storedData) {
      finalData = JSON.parse(storedData);
      renderMenu();
    } else {
      menuGrid.innerHTML =
        "<p>Failed to load the weekly menu. Please try again later.</p>";
    }
  }
}

function renderMenu() {
  menuGrid.innerHTML = "";
  const lang = getActiveLanguage();
  const days = localDaysOfWeek[lang];
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  days.forEach((day, dayIndex) => {
    const dayColumn = document.createElement("div");
    dayColumn.classList.add("day-column");

    const dayHeader = document.createElement("div");
    dayHeader.classList.add("day-header");
    dayHeader.textContent = day;

    if (isMobile) {
      dayHeader.addEventListener("click", () => {
        if (activeDay && activeDay !== dayColumn) {
          const activeMeals = activeDay.querySelectorAll(".meal-box");
          activeMeals.forEach((meal) => meal.classList.remove("visible"));
        }

        const meals = dayColumn.querySelectorAll(".meal-box");
        const isActive = activeDay === dayColumn;
        meals.forEach((meal) => {
          meal.classList.toggle("visible", !isActive);
        });

        activeDay = isActive ? null : dayColumn;
      });
    }

    dayColumn.appendChild(dayHeader);

    finalData.slice(dayIndex * 3, dayIndex * 3 + 3).forEach((mealText) => {
      const mealBox = document.createElement("div");
      mealBox.classList.add("meal-box");

      if (isMobile) mealBox.classList.add("hidden");

      const [mealType, mealContent] = mealText.split(": ");

      const mealTypeDiv = document.createElement("div");
      mealTypeDiv.classList.add("meal-type");
      mealTypeDiv.textContent = mealType;

      const mealContentDiv = document.createElement("div");
      mealContentDiv.classList.add("meal-content");
      mealContentDiv.textContent = mealContent;

      mealBox.appendChild(mealTypeDiv);
      mealBox.appendChild(mealContentDiv);

      dayColumn.appendChild(mealBox);
    });

    menuGrid.appendChild(dayColumn);
  });
}

window.addEventListener("storage", (event) => {
  if (event.key === "language") {
    const lang = event.newValue || "en";
    updateLocalDaysOfWeek();
    renderMenu();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchAndTranslateMenu();
});
