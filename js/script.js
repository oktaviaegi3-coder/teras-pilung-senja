// ===== NAVBAR =====
const navbarNav = document.querySelector(".navbar-nav");
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

const shoppingCart = document.querySelector(".shopping-cart");
document.querySelector("#shopping-cart-button").onclick = (e) => {
  shoppingCart.classList.toggle("active");
  e.preventDefault();
};

// klik di luar
const hm = document.querySelector("#hamburger-menu");
const sb = document.querySelector("#search-button");
const sc = document.querySelector("#shopping-cart-button");

document.addEventListener("click", function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.querySelector(".cart-items");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  let cart = [];

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); // Mencegah reload halaman
      // Cari elemen parent (bisa menu-card atau product-card)
      const card = btn.closest(".menu-card, .product-card");

      // Ambil judul (support berbagai class atau tag h3)
      const title = card.querySelector(
        ".menu-title, .menu-card-title, h3"
      ).innerText;

      // Ambil teks harga
      const priceText = card.querySelector(
        ".menu-card-price, .product-price"
      ).innerText;

      // Parsing Harga: Ubah text "15K" atau "Rp 15.000" jadi angka murni
      let price = 0;
      let cleanPrice = priceText.replace(/[^0-9,kK]/g, ""); // Hapus huruf kecuali k/K

      if (cleanPrice.toLowerCase().includes("k")) {
        price = parseFloat(cleanPrice.toLowerCase().replace("k", "")) * 1000;
      } else {
        price = parseFloat(cleanPrice.replace(/\./g, "")); // Hapus titik ribuan
      }

      addToCart(title, price);
    });
  });

  function addToCart(title, price) {
    const existingItem = cart.find((item) => item.title === title);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ title, price, qty: 1 });
    }

    renderCart();
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        "<p style='padding:1rem'>Keranjang masih kosong ☕</p>";
      return;
    }

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.qty;
      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <h4>${item.title}</h4>
          <p>
            ${item.qty} x Rp ${item.price.toLocaleString("id-ID")}
          </p>
          <strong>
            Rp ${(item.qty * item.price).toLocaleString("id-ID")}
          </strong>
          <span class="remove-item" data-index="${index}">❌</span>
        </div>
      `;
    });

    // Tambahkan Total dan Tombol Checkout
    cartItemsContainer.innerHTML += `
      <div class="cart-total">
        Total: <span>Rp ${total.toLocaleString("id-ID")}</span>
      </div>
      <button class="checkout-btn">Checkout via WhatsApp</button>
    `;

    // Event Listener untuk Tombol Checkout
    const checkoutBtn = cartItemsContainer.querySelector(".checkout-btn");
    checkoutBtn.addEventListener("click", function () {
      const phoneNumber = "628123456789"; // GANTI DENGAN NOMOR WA ADMIN (Format: 628...)

      // Format Pesan WhatsApp
      const cartData = cart
        .map((item) => {
          return `${item.title} (${item.qty} x ${item.price.toLocaleString(
            "id-ID"
          )}) = Rp ${(item.qty * item.price).toLocaleString("id-ID")}`;
        })
        .join("\n");

      const message = `Halo Admin, saya mau pesan:\n\n${cartData}\n\nTotal: Rp ${total.toLocaleString(
        "id-ID"
      )}\n\nMohon diproses, Terima kasih!`;

      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
        "_blank"
      );
    });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        renderCart();
      });
    });
  }
});

// Modal Box
const itemDetailModal = document.querySelector("#item-detail-modal");
const itemDetailModalImg = itemDetailModal.querySelector(".modal-content img");
const itemDetailModalTitle = itemDetailModal.querySelector(".modal-content h3");
const itemDetailModalPrice = itemDetailModal.querySelector(".modal-content p");

const menuImages = document.querySelectorAll(".menu-card img");

menuImages.forEach((img) => {
  img.addEventListener("click", (e) => {
    const card = img.closest(".menu-card");
    const title = card.querySelector(".menu-title").innerText;
    const price = card.querySelector(".menu-card-price").innerText;
    const imgSrc = img.src;

    itemDetailModalImg.src = imgSrc;
    itemDetailModalTitle.innerText = title;
    itemDetailModalPrice.innerText = price;

    itemDetailModal.style.display = "flex";
    e.preventDefault();
  });
});

document.querySelector(".modal .close-icon").onclick = (e) => {
  itemDetailModal.style.display = "none";
  e.preventDefault();
};

window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = "none";
  }
};
