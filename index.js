document
  .getElementById("kid-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const birthDate = new Date(
      document.querySelector(".kid-birth-date-input").value
    );

    const today = new Date();

    const dayNameTH = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];

    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();

    if (ageDays < 0) {
      ageMonths--;
      ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    document.getElementById(
      "kid-age-result"
    ).textContent = `ปัจจุบันเด็กอายุ: ${ageYears} ปี ${ageMonths} เดือน ${ageDays} วัน`;

    const intervals = [
      { label: "2 เดือน", months: 2, vaccine: "DTP-HB-Hib1, IPV1, Rota rix 1" },
      { label: "4 เดือน", months: 4, vaccine: "DTP-HB-Hib2, IPV2, Rota rix 2" },
      { label: "6 เดือน", months: 6, vaccine: "DTP-HB-Hib3,OPV1" },
      { label: "9 เดือน", months: 9, vaccine: "MMR1" },
      { label: "1 ปี", months: 12, vaccine: "JE1" },
      { label: "1 ปี 6 เดือน", months: 18, vaccine: "DTP4 OPV2, MMR2" },
      { label: "2 ปี 6 เดือน", months: 30, vaccine: "JE2" },
      { label: "4 ปี", months: 48, vaccine: "DTP5,OPV3" },
    ];

    const formatDateWithDay = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear() + 543;
      const weekday = dayNameTH[date.getDay()];
      return `${day}/${month}/${year} (${weekday})`;
    };

    const rows = intervals
      .map((interval) => {
        // Step 1: Calculate dueDate
        const dueDate = new Date(birthDate);
        dueDate.setMonth(dueDate.getMonth() + interval.months);

        // Step 2: Function to get second Wednesday of a month
        function getSecondWednesday(year, month) {
          const firstDay = new Date(year, month, 1);
          const firstWednesdayOffset = (3 - firstDay.getDay() + 7) % 7; // 3 = Wednesday
          const secondWednesdayDate = 1 + firstWednesdayOffset + 7;
          return new Date(year, month, secondWednesdayDate);
        }

        // Step 3: Get second Wednesday of the same month
        let scheduledDate = getSecondWednesday(
          dueDate.getFullYear(),
          dueDate.getMonth()
        );

        // Step 4: If it's before dueDate, go to next month's second Wednesday
        if (scheduledDate < dueDate) {
          const nextMonth = dueDate.getMonth() + 1;
          scheduledDate = getSecondWednesday(dueDate.getFullYear(), nextMonth);
        }

        return `
          <tr>
            <td>${interval.label}</td>
            <td>${interval.vaccine}</td>
            <td>${formatDateWithDay(dueDate)}</td>
            <td>${formatDateWithDay(scheduledDate)}</td>
          </tr>
        `;
      })
      .join("");

    document.getElementById("dates-table").innerHTML = `
            <table border="1" cellpadding="8" cellspacing="0">
              <thead>
                <tr>
                  <th>อายุ</th>
                  <th>วัคซีนที่ให้</th>
                  <th>วันที่ครบอายุ</th>
                  <th>วันนัดฉีดวัคซีน</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <p>*หมายเหตุ หากวันพุธ ที่ 2 ของเดือน ตรงกับวันหยุดราชการ จะให้บริการในวันพุธอาทิตย์ถัดไปของเดือนนั้น</p>
            <a class="print" id="print-button">Print</a>
          `;
  });

document.addEventListener("click", function (event) {
  if (event.target && event.target.id === "print-button") {
    const content = document.getElementById("dates-table").innerHTML;
    const cleanContent = content.replace(
      /<a\s+class="print"[^>]*>.*?<\/a>/,
      ""
    );

    // Generate date stamp in Thai format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear() + 543; // Thai Buddhist Era

    const thaiDateStamp = `พิมพ์เมื่อ: ${day}/${month}/${year}`;

    const printWindow = window.open("", "", "width=900,height=800");
    printWindow.document.write(`
        <html>
          <head>
            <title>&nbsp;</title>
            <style>
              .header-of-printing1 {
                font-size: 20px;
                text-align: center;
                font-weight: bold;
                margin-bottom: 18px;
              }
              .header-of-printing2 {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 6px;
              }
              .date-stamp {
                font-size: 16px;
                margin-bottom: 18px;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div class="header-of-printing1">โรงพยาบาลส่งเสริมสุขภาพตําบลเกาะแต้ว</div>
            <div class="header-of-printing2">ตารางนัดฉีดวัคซีนเด็ก</div>
            <div class="date-stamp">${thaiDateStamp}</div>
            ${cleanContent}
          </body>
        </html>
      `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
});
