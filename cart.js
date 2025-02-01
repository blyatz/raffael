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

  let voucherDiscount = 0; // Diskon dari voucher
  let userBalance = parseFloat(localStorage.getItem("userBalance")) || 500; // Saldo awal $500

  // Update tampilan saldo
  function updateBalanceDisplay() {
    if (userBalanceEl) userBalanceEl.textContent = userBalance.toFixed(2);
    if (userBalanceCartEl) userBalanceCartEl.textContent = userBalance.toFixed(2);
  }
  updateBalanceDisplay(); 

  // Menampilkan jumlah item di keranjang saat halaman dimuat
  updateCartCount();

  // Fungsi untuk menambahkan produk ke keranjang
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

  // Fungsi untuk menghitung total item di keranjang
  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    if (cartCountEl) {
      cartCountEl.textContent = totalCount;
    }
  }

  // Menampilkan isi keranjang di cart.html
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

    // Event Listener untuk menghapus item
    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        const itemId = e.target.dataset.id;
        if (confirm("Are you sure you want to remove this item?")) {
          removeItem(itemId);
        }
      });
    });

    // Event Listener untuk mengubah jumlah produk
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

  // Fungsi untuk menghapus item dari keranjang
  function removeItem(id) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.location.reload();
  }

  // Tombol Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const selectedPayment = document.querySelector('input[name="payment"]:checked');
      const total = parseFloat(totalAmountEl.textContent.replace("$", ""));

      if (!selectedPayment) {
        alert("Please select a payment method first!");
        return;
      }

      if (userBalance < total) {
        alert("Insufficient balance to complete the purchase.");
        return;
      }

      userBalance -= total;
      localStorage.setItem("userBalance", userBalance.toFixed(2));
      updateBalanceDisplay();

      if (processingMessage) {
        processingMessage.style.display = "block";
        processingMessage.textContent = "🚀 Processing your order...";

        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          processingMessage.textContent = `🚀 Processing... ${progress}%`;

          if (progress >= 100) {
            clearInterval(interval);
            processingMessage.textContent = "✅ Order successfully processed!";
            processingMessage.style.backgroundColor = "green";

            setTimeout(() => {
              localStorage.removeItem("cartItems");
              window.location.href = "index.html";
            }, 2000);
          }
        }, 500);
      }
    });
  }

  // Fungsi untuk menerapkan voucher
  if (applyVoucherBtn) {
    applyVoucherBtn.addEventListener("click", () => {
      const voucherCode = voucherCodeInput.value.trim();
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      let total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const validVouchers = {
        "DISKON10": 10,
        "DISKON20": 20,
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
});
