document.addEventListener("DOMContentLoaded", function () {
  // เลือกทุก grid item และสร้างฟอร์มสำหรับแต่ละ grid item
  const gridContainers = document.querySelectorAll(".grid-item");
  gridContainers.forEach((container, index) => {
    const entrepreneurName = `Entrepreneur ${index + 1}`;
    container.querySelector("h2").textContent = entrepreneurName;
  });

  // เพิ่มฟังก์ชันสำหรับปุ่ม "Add Intern"
  const addInternButtons = document.querySelectorAll(".add-intern-button");
  addInternButtons.forEach((button) => {
    button.addEventListener("click", function () {
      Swal.fire({
        title: "Add Intern",
        html: `
          <input id="intern-name" class="swal2-input" placeholder="Name" required>
          <input id="intern-phone" class="swal2-input" placeholder="Phone Number" required>
          <input id="intern-date" class="swal2-input" value="${getCurrentDateTime()}" readonly>
          <select id="intern-ability" class="swal2-select" required>
            <option value="">Select Ability</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="Programming">Programming</option>
            <option value="Management">Management</option>
          </select>
          <input type="file" id="intern-image" class="swal2-file" accept="image/*" required>
          <img id="image-preview" style="max-width: 200px; max-height: 200px;">
        `,
        focusConfirm: false,
        preConfirm: () => {
          const internName =
            Swal.getPopup().querySelector("#intern-name").value;
          const internPhone =
            Swal.getPopup().querySelector("#intern-phone").value;
          const internDateTime =
            Swal.getPopup().querySelector("#intern-date").value;
          const internAbility =
            Swal.getPopup().querySelector("#intern-ability").value;
          const internImage =
            Swal.getPopup().querySelector("#intern-image").files[0];

          if (
            !internName ||
            !internPhone ||
            !internDateTime ||
            !internAbility ||
            !internImage
          ) {
            Swal.showValidationMessage("Please fill in all fields");
          }

          const reader = new FileReader();
          reader.onload = function (e) {
            const imagePreview =
              Swal.getPopup().querySelector("#image-preview");
            imagePreview.src = e.target.result;
          };
          reader.readAsDataURL(internImage);

          return {
            internName,
            internPhone,
            internDateTime,
            internAbility,
            internImage,
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const internName = result.value.internName;
          const internPhone = result.value.internPhone;
          const internDateTime = result.value.internDateTime;
          const internAbility = result.value.internAbility;
          const internImage = result.value.internImage;

          const internItem = document.createElement("div");
          internItem.classList.add("grid-item");
          internItem.innerHTML = `
            <img src="${URL.createObjectURL(internImage)}" alt="Intern Image">
            <h3>Intern: ${internName}</h3>
            <p>Phone: ${internPhone}</p>
            <p>Date & Time: ${internDateTime}</p>
            <p>Ability: ${internAbility}</p>
          `;

          // หาคอลัมน์ที่มีชื่อเท่ากับความสามารถของฝึกงาน
          const matchingColumn = Array.from(gridContainers).find((container) =>
            container.querySelector("p").textContent.includes(internAbility)
          );

          // ถ้ามีคอลัมน์ที่มีชื่อเท่ากับความสามารถของฝึกงาน ให้เพิ่มฝึกงานลงไปในคอลัมน์นั้น
          if (matchingColumn) {
            matchingColumn.appendChild(internItem);
          } else {
            // ถ้าไม่พบคอลัมน์ที่เหมาะสม ให้เพิ่มไปที่สุดท้ายของ grid-container
            button.parentNode.parentNode.appendChild(internItem);
          }
        }
      });
    });
  });

  // Function เพื่อรับวันที่และเวลาปัจจุบัน
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});
