<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="queries.css">
    <title>Vaccine-Schedule-Plan</title>
  </head>

  <body>
    <div class="Main_Container">
      <div class="logo">
        <img src="image/vaccine_logo.png" width="60" height="60" />
      </div>

      <div class="header">
          <span>ระบบคำนวณการรับวัคซีน</span>
          <span>โรงพยาบาลส่งเสริมสุขภาพตำบล</span>
      </div>

      <form class="content" id="kid-form">
        <div class="content-top"><label>Program</label></div>

        <div class="kid-birth-date"><label>วันเกิดเด็ก </label></div>
        <input class="kid-birth-date-input" type="date" name="kid-birth-date" required/>


        <div class="hospital-service-date"><label>วันให้บริการ </label></div>
          <select class="hospital-service-date-input" name="hospital-service-date" required>
            <option value="monday">จันทร์</option>
            <option value="tuesday">อังคาร</option>
            <option value="wednesday">พุธ</option>
            <option value="thursday">พฤหัสบดี</option>
            <option value="friday">ศุกร์</option>
          </select>


        <button class="button-submit" type="submit">Submit</button>

        <div class="show-result-kid-age" id="kid-age-result" style="margin-top: 10px; font-weight: bold;"></div>
        <div class="show-result-kid-schedule" id="future-dates" style="margin-top: 10px;"></div>
      </form>

        <div class="footer">
          <div class="footer-header">
            สถานที่ตั้ง : <br/>
            เบอร์โทรติดต่อ :
          </div>
        </div>
      </div>

      <script>
        
        document.getElementById('kid-form').addEventListener('submit', function(event) {
        
        event.preventDefault();

        const birthDate = new Date(document.querySelector('.kid-birth-date-input').value);
        const selectedServiceDay = document.querySelector('.hospital-service-date-input').value;
        const today = new Date();

        // แปลงชื่อวันเป็นตัวเลข (0 = Sunday, ..., 6 = Saturday)
        const dayMap = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6
        };

        const dayNameTH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
        const serviceDayIndex = dayMap[selectedServiceDay];

        // คำนวณอายุเด็ก
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

        document.getElementById('kid-age-result').textContent =
          `ปัจจุบันเด็กอายุ: ${ageYears} ปี ${ageMonths} เดือน ${ageDays} วัน`;

        // วัคซีนแต่ละช่วงเวลา
        const intervals = [
          { label: "2 เดือน", months: 2 , vaccine: "วัคซีน 1" },
          { label: "4 เดือน", months: 4 , vaccine: "วัคซีน 2" },
          { label: "6 เดือน", months: 6 , vaccine: "วัคซีน 3" },
          { label: "9 เดือน", months: 9 , vaccine: "วัคซีน 4" },
          { label: "1 ปี", months: 12 , vaccine: "วัคซีน 5" },
          { label: "1 ปี 6 เดือน", months: 18 , vaccine: "วัคซีน 6" },
          { label: "2 ปี 6 เดือน", months: 30 , vaccine: "วัคซีน 7" },
          { label: "4 ปี", months: 48 , vaccine: "วัคซีน 8" }
        ];

        // แปลงวันที่ให้มีวันในสัปดาห์
        const formatDateWithDay = date => {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear() + 543;
          const weekday = dayNameTH[date.getDay()];
          return `${day}/${month}/${year} (${weekday})`;
        };

        // สร้างตาราง
        const rows = intervals.map(interval => {
        const dueDate = new Date(birthDate);
        dueDate.setMonth(dueDate.getMonth() + interval.months);

        const scheduledDate = new Date(dueDate);
        const dayDiff = (serviceDayIndex + 7 - scheduledDate.getDay()) % 7;
        scheduledDate.setDate(scheduledDate.getDate() + dayDiff);

          return `
            <tr>
              <td>${interval.label}</td>
              <td>${interval.vaccine}</td>
              <td>${formatDateWithDay(dueDate)}</td>
              <td>${formatDateWithDay(scheduledDate)}</td>
            </tr>
          `;
          }).join('');

          document.getElementById('future-dates').innerHTML = `
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
      </script>

  </body>
</html>
