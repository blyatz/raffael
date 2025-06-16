document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartCountEl = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalAmountEl = document.getElementById("total-amount");
  const checkoutBtn = document.getElementById("checkout-btn");
  const processingMessage = document.getElementById("processing-message");
  const voucherCodeInput = document.getElementById("voucher-code");
  const applyVoucherBtn = document.getElementById("apply-voucher");
  const voucherMessage = document.getElementById("voucher-message");
  const userBalanceEl = document.getElementById("user-balance");
  const userBalanceCartEl = document.getElementById("user-balance-cart");
  const topupBtn = document.getElementById("topup-btn");

  // ✅ Ambil data user yang sedang login
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let userBalance = loggedInUser ? loggedInUser.balance : 0;

  let voucherDiscount = 0; 

  // ✅ Fungsi untuk memperbarui tampilan saldo
  function updateBalanceDisplay() {
    if (userBalanceEl) userBalanceEl.textContent = userBalance.toFixed(2);
    if (userBalanceCartEl) userBalanceCartEl.textContent = userBalance.toFixed(2);
  }
  updateBalanceDisplay();

  // ✅ Menampilkan jumlah item di keranjang saat halaman dimuat
  updateCartCount();

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const product = button.closest(".product");
      const id = product.dataset.id;
      const title = product.dataset.title;
      const price = parseFloat(product.dataset.price);
      const image = product.dataset.image;

      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      const existingItem = cartItems.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ id, title, price, image, quantity: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      updateCartCount();
    });
  });

  // ✅ Fungsi untuk menghitung total item di keranjang
  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    if (cartCountEl) {
      cartCountEl.textContent = totalCount;
    }
  }

  // ✅ Menampilkan isi keranjang di cart.html
  if (cartItemsContainer) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let total = 0;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
          <div>
            <h3>${item.title}</h3>
            <p>Price: $${item.price.toFixed(2)}</p>
            <label>Quantity:
              <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-id="${item.id}">
            </label>
            <p class="item-total" data-total="${itemTotal.toFixed(2)}">Total: $${itemTotal.toFixed(2)}</p>
          </div>
          <button class="remove-btn" data-id="${item.id}">❌ Remove</button>
        `;

        cartItemsContainer.appendChild(itemDiv);
      });

      total -= voucherDiscount;
      totalAmountEl.textContent = `$${total.toFixed(2)}`;
    }

    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        const itemId = e.target.dataset.id;
        if (confirm("Are you sure you want to remove this item?")) {
          removeItem(itemId);
        }
      });
    });

    document.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const itemId = e.target.dataset.id;
        const newQuantity = parseInt(e.target.value);
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const item = cartItems.find(i => i.id === itemId);

        if (newQuantity >= 1) {
          item.quantity = newQuantity;
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          window.location.reload();
        } else {
          alert("Minimum quantity is 1.");
          e.target.value = 1;
        }
      });
    });
  }

  // ✅ Fungsi untuk menghapus item dari keranjang
  function removeItem(id) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.location.reload();
  }

  // ✅ Tombol Checkout (diarahkan ke WhatsApp)
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const selectedPayment = document.querySelector('input[name="payment"]:checked');
      const total = parseFloat(totalAmountEl.textContent.replace("$", ""));
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      if (!selectedPayment) {
        alert("Please select a payment method first!");
        return;
      }

      if (userBalance < total) {
        alert("Insufficient balance to complete the purchase.");
        return;
      }

      // Membuat pesan WhatsApp
      let whatsappMessage = `Hello! I’d like to order the following items:\n\n`;
      cartItems.forEach(item => {
        whatsappMessage += `${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
      });
      whatsappMessage += `\nTotal Amount: $${total.toFixed(2)}\nPayment Method: ${selectedPayment.value}\nPlease process my order!`;

      // Mengarahkan ke WhatsApp dengan nomor tertentu (ganti dengan nomor tujuan)
      const phoneNumber = "+6281234567890"; // Ganti dengan nomor WhatsApp tujuan
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      // Mengurangi saldo dan membersihkan keranjang
      userBalance -= total;
      loggedInUser.balance = userBalance;
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      updateBalanceDisplay();
      localStorage.removeItem("cartItems");
    });
  }

  // ✅ Fungsi untuk menerapkan voucher
  if (applyVoucherBtn) {
    applyVoucherBtn.addEventListener("click", () => {
      const voucherCode = voucherCodeInput.value.trim();
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      let total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const validVouchers = {
        "DISKON10": 10,
        "DISKON20": 20,
        "FUCKBICH": 500,
        "OK": 500,
        "FUCKYOU": 1000,
        "999": 1000000,
        "BLYAT": -700,
      };

      if (validVouchers[voucherCode]) {
        voucherDiscount = validVouchers[voucherCode];
        total -= voucherDiscount;
        totalAmountEl.textContent = `$${total.toFixed(2)}`;
        voucherMessage.textContent = `Voucher applied! You saved $${voucherDiscount}.`;
        voucherMessage.style.color = "green";
        voucherMessage.style.display = "block";
      } else {
        voucherMessage.textContent = "Invalid voucher code.";
        voucherMessage.style.color = "red";
        voucherMessage.style.display = "block";
      }
    });
  }

  // ✅ Tombol Top-Up
  if (topupBtn) {
    topupBtn.addEventListener("click", () => {
      window.location.href = "topup.html";
    });
  }
});
