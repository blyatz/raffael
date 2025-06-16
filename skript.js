// ❄️ 1. Efek Salju (Tetap Seperti Sebelumnya)
function createSnowflake() {
    if (!document.body.classList.contains("snowy")) return; 

    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.innerHTML = "❄";
    document.body.appendChild(snowflake);

    const startPos = Math.random() * window.innerWidth;
    const fallDuration = Math.random() * 5 + 5;
    const size = Math.random() * 10 + 10;

    snowflake.style.left = `${startPos}px`;
    snowflake.style.fontSize = `${size}px`;
    snowflake.style.animationDuration = `${fallDuration}s`;

    setTimeout(() => {
        snowflake.remove();
    }, fallDuration * 1000);
}

if (document.body.classList.contains("snowy")) {
    setInterval(createSnowflake, 150);
}

// 🔍 2. Fitur Pencarian Produk
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const productCards = document.querySelectorAll(".product-card");

    function searchProducts() {
        const query = searchInput.value.toLowerCase();
        let found = false;

        productCards.forEach((card) => {
            const title = card.querySelector("h2").textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = "block";
                found = true;
            } else {
                card.style.display = "none";
            }
        });

        if (!found) {
            document.getElementById("no-results")?.remove();
            const noResults = document.createElement("p");
            noResults.id = "no-results";
            noResults.textContent = "No products found.";
            noResults.style.textAlign = "center";
            noResults.style.color = "red";
            document.querySelector(".products-container").appendChild(noResults);
        } else {
            document.getElementById("no-results")?.remove();
        }
    }

    searchBtn.addEventListener("click", searchProducts);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchProducts();
        }
    });
});

// 🚀 3. Preloader (Loading Page)
window.addEventListener("load", function () {
    const preloaderWrapper = document.getElementById("preloader-wrapper");
    const mainContent = document.getElementById("main-content");

    const loadingDuration = 1500; 

    setTimeout(() => {
        preloaderWrapper.classList.add("hidden");
        setTimeout(() => {
            preloaderWrapper.style.display = "none";
            mainContent.style.display = "block";
        }, 500);
    }, loadingDuration);

    const errorDuration = 5000;

    setTimeout(() => {
        const errorMsg = document.querySelector(".preloader__msg--last");
        if (errorMsg && !preloaderWrapper.classList.contains("hidden")) {
            errorMsg.style.display = "block";
        }
    }, errorDuration);
});

// 🗝️ 4. Sistem Akun & User Balance
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
    const userNameDisplay = document.getElementById("user-name");
    const userBalanceDisplay = document.getElementById("user-balance");
    const logoutBtn = document.getElementById("logout-btn");

    const googleLoginBtn = document.getElementById("google-login");
    const phoneLoginBtn = document.getElementById("phone-login");

    // ✅ Database Akun Simulasi
    const users = [
        { username: "tuan", password: "1234", balance: 50000 },
        { username: "admin", password: "admin123", balance: 1000 },
        { username: "bitch", password: "bitch", balance: 20 },
        { username: "guest", password: "guest123", balance: 200 }
    ];

    // ✅ Fungsi Menyimpan Data User ke localStorage
    function saveUserSession(user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
    }

    // ✅ Login dengan Username & Password
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const user = users.find((u) => u.username === username && u.password === password);

            if (user) {
                saveUserSession(user);
            } else {
                loginError.textContent = "Invalid username or password!";
                loginError.style.color = "red";
                loginError.style.display = "block";
            }
        });
    }

    // ✅ Login dengan Google (Simulasi)
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            alert("Redirecting to Google login...");
            const googleUser = {
                username: "google_user",
                balance: 1000
            };
            saveUserSession(googleUser);
        });
    }

    // ✅ Login dengan Nomor HP (Simulasi)
    if (phoneLoginBtn) {
        phoneLoginBtn.addEventListener("click", () => {
            alert("Redirecting to phone login...");
            const phoneUser = {
                username: "phone_user",
                balance: 800
            };
            saveUserSession(phoneUser);
        });
    }

    // ✅ Tampilkan User & Saldo di Dashboard
    if (userNameDisplay && userBalanceDisplay) {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (loggedInUser) {
            userNameDisplay.textContent = loggedInUser.username;
            userBalanceDisplay.textContent = `$${loggedInUser.balance.toFixed(2)}`;
        } else {
            window.location.href = "index.html"; 
        }
    }

    // ✅ Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });
    }
});

// ✅ Menampilkan Saldo User Secara Real-Time
document.addEventListener("DOMContentLoaded", () => {
    const userBalanceElement = document.getElementById("user-balance");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser && userBalanceElement) {
        userBalanceElement.textContent = `$${loggedInUser.balance.toFixed(2)}`;
    }
});
