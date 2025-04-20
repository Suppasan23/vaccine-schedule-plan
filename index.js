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
      { label: "2 เดือน", months: 2, vaccine: "วัคซีน 1" },
      { label: "4 เดือน", months: 4, vaccine: "วัคซีน 2" },
      { label: "6 เดือน", months: 6, vaccine: "วัคซีน 3" },
      { label: "9 เดือน", months: 9, vaccine: "วัคซีน 4" },
      { label: "1 ปี", months: 12, vaccine: "วัคซีน 5" },
      { label: "1 ปี 6 เดือน", months: 18, vaccine: "วัคซีน 6" },
      { label: "2 ปี 6 เดือน", months: 30, vaccine: "วัคซีน 7" },
      { label: "4 ปี", months: 48, vaccine: "วัคซีน 8" },
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
          `;
  });
