function getUserData() {
  displayMainPage()
  displayProfile()
  displayXps()
  displayGrades()
}

async function makeQuery(query) {
  try {
  const response = await fetch(
    "https://01.kood.tech/api/graphql-engine/v1/graphql",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({query: query}),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error fetching user data");
  }
  const data = await response.json();
  return data

} catch (error) {
  console.error("Error fetching user data:", error.message);
}

}

async function displayProfile() {
  try {
  let query = `{
    user{
      auditRatio
      login
      attrs
    }
  }`

  const data = await makeQuery(query)
  const userData = data.data.user[0]
  const auditRatio = userData.auditRatio.toFixed(2)
  const attrs = userData.attrs;
  const login = userData.login

  const {
    tel,
    email,
    lastName,
    firstName,
    addressCity,
    addressStreet,
    addressCountry,
    personalIdentificationCode,
  } = attrs;

  document.getElementById("auditRatio").innerHTML = `<div class="boxData">Audit Ratio: ${auditRatio}</div>`;
  document.getElementById("topBarUserName").innerHTML = `01 ${login}`

  document.getElementById("profile").innerHTML = `
  <div class="boxData">${firstName} ${lastName}</div>
  <div class="boxData">${personalIdentificationCode}</div>
  <div class="boxData">${email}</div>
  <div class="boxData">${tel}</div>
  <div class="boxData">${addressStreet}, ${addressCity}, ${addressCountry}</div>
`;
} catch (error) {
  console.error("Error fetching user data:", error.message);
}
}

async function displayXps() {
try {
  let query = `{
    transaction(where: { type: {_eq:"xp"}, object: { type: {_eq: "project"} } }) {
      amount
      object {
        name
      }
    }
  }`

  const data = await makeQuery(query)
  const xpData = [];
  const xp = data.data.transaction
  let totalXpAmount = 0;

  xp.forEach(item => {
    xpData.push({
      name: item.object.name,
      amount: (item.amount / 1000).toFixed(0)
    });
    totalXpAmount += item.amount / 1000
  });


  const dataContainer = document.getElementById('xp');
  dataContainer.innerHTML = '';

  document.getElementById("totalXp").innerHTML = `<div class="boxData">Total Experience Points: ${totalXpAmount} Kb</div>`;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', (dataContainer.clientWidth - 50) + 'px'); 

  const barsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Calculate the total height based on the number of items
  const barHeight = 20;
  const totalHeight = xpData.length * barHeight;
  svg.setAttribute('height', totalHeight);

  const maxAmount = Math.max(...xpData.map(item => item.amount));

  xpData.forEach((item, index) => {
    const barWidth = (item.amount / maxAmount) * 100; // Scale based on max amount

    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bar.setAttribute('x', 0);
    bar.setAttribute('y', index * barHeight);
    bar.setAttribute('width', barWidth + '%');
    bar.setAttribute('height', barHeight);
    bar.style.fill = 'darkviolet';

    const amountText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    amountText.setAttribute('x', 0); // Adjust text position as needed
    amountText.setAttribute('y', index * barHeight + barHeight / 2); // Center text vertically
    amountText.setAttribute('dominant-baseline', 'middle');
    amountText.style.fill = 'gainsboro'; 
    amountText.textContent = `${item.amount} Kb`;

    const taskText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    taskText.setAttribute('x', 150); // Adjust text position relative to bar width
    taskText.setAttribute('y', index * barHeight + barHeight / 2); // Center text vertically
    taskText.setAttribute('dominant-baseline', 'middle');
    taskText.style.fill = 'gainsboro'; 
    taskText.textContent = `${item.name}`;

    barsGroup.appendChild(bar);
    barsGroup.appendChild(amountText);
    barsGroup.appendChild(taskText);
  });

  svg.appendChild(barsGroup);
  dataContainer.appendChild(svg);

} catch (error) {
  console.error("Error fetching xps:", error.message);
}
}

async function displayGrades() {
  try {
    let query = `{
      result (where: {type: {_eq: "user_audit"}}) {
        grade
        object {
          name
        }
      }
    }`

    const data = await makeQuery(query)
    const gradeData = []
    const grades = data.data.result

    grades.forEach(item => {
      gradeData.push({
        name: item.object.name,
        grade: item.grade.toFixed(2)
      })
    })

  const dataContainer = document.getElementById('grades');
  dataContainer.innerHTML = '';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', (dataContainer.clientWidth - 50) + 'px');

  const barsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const barHeight = 20; 
  const totalHeight = gradeData.length * barHeight;
  svg.setAttribute('height', totalHeight);

  const maxAmount = Math.max(...gradeData.map(item => item.grade));

  gradeData.forEach((item, index) => {
    const barWidth = (item.grade / maxAmount) * 100; // Scale based on max amount

    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bar.setAttribute('x', 0);
    bar.setAttribute('y', index * barHeight);
    bar.setAttribute('width', barWidth + '100');
    bar.setAttribute('height', barHeight);
    bar.style.fill = 'darkviolet';

    const amountText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    amountText.setAttribute('x', 0); 
    amountText.setAttribute('y', index * barHeight + barHeight / 2); // Center text vertically
    amountText.setAttribute('dominant-baseline', 'middle');
    amountText.style.fill = 'gainsboro'; 
    amountText.textContent = `Grade: ${item.grade} `;

    const taskText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    taskText.setAttribute('x', 150); 
    taskText.setAttribute('y', index * barHeight + barHeight / 2); // Center text vertically
    taskText.setAttribute('dominant-baseline', 'middle');
    taskText.style.fill = 'gainsboro'; 
    taskText.textContent = `${item.name}`;

    barsGroup.appendChild(bar);
    barsGroup.appendChild(amountText);
    barsGroup.appendChild(taskText); 
  });

  svg.appendChild(barsGroup);
  dataContainer.appendChild(svg);

} catch (error) {
  console.error("Error fetching grades:", error.message);
}
}
