// Turns form input data in to an object with names and values.
const getFormData = (e) => {
  const form = e.target;
  const data = {
    referenceId: form.referenceId.value,
    lotId: form.lotId.value,
    processStep: form.processStep.value,
    tool: form.tool.value,
    entries: [],
  };

  const waferSections = document.querySelectorAll(".wafer-section");
  waferSections.forEach((waferSection) => {
    const waferId = waferSection.querySelector("input[name='wafer-id']").value;

    const fieldSections = waferSection.querySelectorAll(".field-section");
    fieldSections.forEach((fieldSection) => {
      const fieldId = fieldSection.querySelector(
        "input[name='field-id']"
      ).value;

      const subfieldSections =
        fieldSection.querySelectorAll(".subfield-section");
      subfieldSections.forEach((subfieldSection) => {
        const subfieldId = subfieldSection.querySelector(
          "input.sufield-input"
        ).value;
        const siteCount = parseInt(
          subfieldSection.querySelector("input[type='number']").value
        );

        for (let i = 1; i <= siteCount; i++) {
          data.entries.push({
            waferId,
            fieldId,
            subfieldId,
            site: `S#${i}`,
            status: "open",
            fib: false,
            sem: false,
            eds: false,
            stem: false,
            episcope: false,
          });
        }
      });
    });
  });
  return data;
};

const receiveData = () => {
  fetch("/view-orders")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Something went wrong: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched:", data); // See incoming Data
      const tbody = document.getElementById("tbody");
      tbody.innerHTML = ""; // Clear table
      data.forEach((row) => {
        const referenceId = row["referenceId"];
        const lotId = row["lotId"];
        const processStep = row["processStep"];
        const tool = row["tool"];
        const totalSites = row["entries"].length;
        const tr = document.createElement("tr");

        [referenceId, lotId, processStep, tool, totalSites].forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value;
          tr.appendChild(td);

          tbody.appendChild(tr);
        });
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
};

// send form data to backend
const sendData = (data) => {
  fetch("/add-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      return res.json();
    })
    .then((res) => {
      console.log(res["message"]);
      receiveData();
    })
    .catch((error) => {
      console.log("Error:", error);
      document.getElementById("result").textContent =
        "Something went wrong. Please try again.";
    });
};
