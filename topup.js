document.addEventListener("DOMContentLoaded", () => {
  const amountButtons = document.querySelectorAll(".amount-btn");
  const confirmTopupBtn = document.getElementById("confirm-topup");
  const topupMessage = document.getElementById("topup-message");

  let selectedAmount = 0;
  let userBalance = parseFloat(localStorage.getItem("userBalance")) || 1000;

  // Periksa jika user kembali dari WhatsApp
  if (localStorage.getItem("pendingTopUp")) {
    startProcessing();
  }

  // Event Listener untuk tombol nominal
  amountButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Highlight tombol yang dipilih
      amountButtons.forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");

      // Simpan nominal yang dipilih
      selectedAmount = parseInt(button.dataset.amount);
      confirmTopupBtn.disabled = false; // Aktifkan tombol konfirmasi
    });
  });

  // Event Listener untuk Confirm Top Up
  confirmTopupBtn.addEventListener("click", () => {
    if (selectedAmount <= 0) return;

    // Simpan data sementara di localStorage sebelum diarahkan ke WhatsApp
    localStorage.setItem("pendingTopUp", selectedAmount);

    // Arahkan ke WhatsApp
    const phoneNumber = "6283156992096"; // Ganti dengan nomor WhatsApp tujuan
    const message = `Hello, I want to top up $${selectedAmount}. Please confirm.`;
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.location.href = whatsappLink;
  });

  // Proses top-up setelah kembali dari WhatsApp
  function startProcessing() {
    const pendingAmount = parseFloat(localStorage.getItem("pendingTopUp"));

    if (isNaN(pendingAmount)) return;

    topupMessage.textContent = "⏳ Processing your top-up...";
    topupMessage.style.color = "blue";
    topupMessage.style.display = "block";

    setTimeout(() => {
      userBalance += pendingAmount;
      localStorage.setItem("userBalance", userBalance.toFixed(2));
      localStorage.removeItem("pendingTopUp");

      topupMessage.textContent = `✅ Successfully topped up $${pendingAmount}!`;
      topupMessage.style.color = "green";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    }, 3000);
  }
});
