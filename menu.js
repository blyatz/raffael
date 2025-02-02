document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  // Fungsi untuk menampilkan/menyembunyikan menu
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation(); // Cegah event bubble
    menu.classList.toggle("active"); // Toggle menu aktif/non-aktif
  });

  // Tutup menu jika klik di luar area menu
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && event.target !== menuToggle) {
      menu.classList.remove("active");
    }
  });
});
