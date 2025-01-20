window.addEventListener("load", function () {
  const form = document.getElementById("signin-form");
  form.reset();
});

const hash = (text) => {
  const hashObj = new jsSHA("SHA-512", "TEXT", { numRounds: 1 });
  hashObj.update(text);
  return hashObj.getHash("HEX");
};

const data = {
  users: [
    {
      username: "testUser",
      password:
        "01614db03175ba0cfd755480730f95e0fc97543bc264272147d7be9a13110709e83c52ede1bd5a700546bcb4dae3fa4e6ec995a3d7ee26aed048009c391456da",
    },
    {
      username: "edinamaljevac",
      password:
        "ce68c83c6b4f3ecc7313979f27f4d44d120270b608dab37d057564ae22565e36cf809233bd58ceeb6628a3e41457af384735fae4165f28742e3afe9589340df7",
    },
  ],
};

const checkCredentials = async (username, password) => {
  try {
    const user = data.users.find((u) => u.username === username);

    if (!user) {
      throw new Error("User does not exist");
    }
    if (user.password === hash(password)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error", error);
    return false;
  }
};

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const signInButton = document.querySelector(".btn");

const usernameRegex = /^[a-zA-Z0-9]{3,16}$/;

let currentLanguage = localStorage.getItem("language") || "en";

const errorMessages = {
  username: {
    en: "Username must be 3-16 alphanumeric characters.",
    sr: "Korisničko ime mora imati 3-16 alfanumeričkih karaktera.",
  },
  password: {
    en: "Password must be at least 10 characters long.",
    sr: "Lozinka mora imati najmanje 10 karaktera.",
  },
};

const validateForm = () => {
  let isValid = true;
  usernameError.textContent = "";
  passwordError.textContent = "";

  if (!usernameRegex.test(usernameInput.value)) {
    usernameError.textContent = errorMessages.username[currentLanguage];
    usernameError.style.color = "red";
    isValid = false;
  }
  if (passwordInput.value.length < 10) {
    passwordError.textContent = errorMessages.password[currentLanguage];
    passwordError.style.color = "red";
    isValid = false;
  }
  return isValid;
};

const handleSignIn = async (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const username = usernameInput.value;
  const password = passwordInput.value;

  const result = await checkCredentials(username, password);
  if (result) {
    const loginData = {
      username: username,
      isLoggedIn: true,
    };
    localStorage.setItem("loginData", JSON.stringify(loginData));
    window.location.href = "../home/index.html";
  } else {
    alert("Invalid login credentials");
  }
};

signInButton.addEventListener("click", handleSignIn);

const en = document.getElementById("english");
const sr = document.getElementById("serbian");

const enMobile = document.getElementById("english-mobile");
const srMobile = document.getElementById("serbian-mobile");

function switchLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("language", lang);

  // Ažuriraj tekstove za greške ako su prikazani
  if (usernameError.textContent) {
    usernameError.textContent = errorMessages.username[currentLanguage];
  }
  if (passwordError.textContent) {
    passwordError.textContent = errorMessages.password[currentLanguage];
  }
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
  switchLanguage("en");
  updateActiveLanguage("en");
});

sr.addEventListener("click", () => {
  switchLanguage("sr");
  updateActiveLanguage("sr");
});

if (enMobile && srMobile) {
  enMobile.addEventListener("click", () => {
    switchLanguage("en");
    updateActiveLanguage("en");
  });

  srMobile.addEventListener("click", () => {
    switchLanguage("sr");
    updateActiveLanguage("sr");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  currentLanguage = localStorage.getItem("language") || "en";
  switchLanguage(currentLanguage);
  updateActiveLanguage(currentLanguage);
});
