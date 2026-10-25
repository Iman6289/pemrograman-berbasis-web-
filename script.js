(function () {
  var foto = document.getElementById("foto");
  var input = document.getElementById("foto-input");
  var msg = document.getElementById("foto-msg");

  function say(text, isError) {
    msg.textContent = text;
    msg.className = isError ? "error" : "";
  }

  // Tombol cetak / simpan PDF
  document.getElementById("print-btn").addEventListener("click", function () {
    window.print();
  });

  // Tampilkan foto yang pernah diunggah
  try {
    var saved = localStorage.getItem("foto-cv");
    if (saved) { foto.src = saved; foto.hidden = false; }
  } catch (e) { }

  // Ganti foto lewat form
  input.addEventListener("change", function () {
    var file = input.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      say("File harus berupa gambar JPG, PNG, atau WebP.", true);
      input.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      say("Ukuran file terlalu besar. Maksimal 5 MB.", true);
      input.value = "";
      return;
    }
    var reader = new FileReader();
    reader.onerror = function () { say("Foto tidak bisa dibaca. Coba file lain.", true); };
    reader.onload = function () {
      var img = new Image();
      img.onerror = function () { say("File gambar rusak. Coba file lain.", true); };
      img.onload = function () {
        var max = 600, ratio = Math.min(1, max / Math.max(img.width, img.height));
        var cv = document.createElement("canvas");
        cv.width = Math.round(img.width * ratio);
        cv.height = Math.round(img.height * ratio);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        var data = cv.toDataURL("image/jpeg", 0.88);
        foto.src = data;
        foto.hidden = false;
        try {
          localStorage.setItem("foto-cv", data);
          say("Foto diganti dan disimpan di browser ini.", false);
        } catch (e) {
          say("Foto tampil, tetapi tidak bisa disimpan di browser ini.", true);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
})();
