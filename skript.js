function createSnowflake() {
    if (!document.body.classList.contains("snowy")) return; // Hanya aktif jika ada class "snowy"

    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.innerHTML = "🖕";
    document.body.appendChild(snowflake);

    // Random posisi awal dan ukuran
    const startPos = Math.random() * window.innerWidth;
    const fallDuration = Math.random() * 5 + 5;
    const size = Math.random() * 10 + 10;

    snowflake.style.left = `${startPos}px`;
    snowflake.style.fontSize = `${size}px`;
    snowflake.style.animationDuration = `${fallDuration}s`;

    // Hapus elemen setelah jatuh ke bawah
    setTimeout(() => {
        snowflake.remove();
    }, fallDuration * 1000);
}

// Jalankan hanya jika body memiliki class "snowy"
if (document.body.classList.contains("snowy")) {
    setInterval(createSnowflake, 200);
}
