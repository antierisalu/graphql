async function getUserData() {
  try {
    const response = await fetch(
      "https://01.kood.tech/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{
            user{
              auditRatio
              login
              attrs
              xps (where: { event: { id: { _eq: 148  } } } ){
                path
                amount
                event {
                  id
                }
              }
            }
            
            result (where: {type: {_eq: "user_audit"}}) {
                      grade
                      path

                    }
          }`,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching user data");
    }

    const data = await response.json();
    console.log(data);
    

    const auditRatio = data.data.user[0].auditRatio.toFixed(2)
    const attrs = data.data.user[0].attrs;
    const login = data.data.user[0].login

    const xp = data.data.user[0].xps
    const xpData = [];

    xp.forEach(item => {
      xpData.push({
        path: item.path,
        amount: (item.amount / 1000).toFixed(0)
      });
    });

    console.log(xp)

    let {
      tel,
      email,
      lastName,
      firstName,
      addressCity,
      addressStreet,
      addressCountry,
      personalIdentificationCode,
    } = attrs;

    populateProfile(firstName, lastName, email, tel, personalIdentificationCode, addressStreet, addressCity, addressCountry)
    populateAuditRatio(auditRatio)
    displayData(xpData)

    document.getElementById("topBarUserName").innerHTML = login

  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
}

function populateProfile(firstName, lastName, email, tel, personalIdentificationCode, addressStreet, addressCity, addressCountry) {

  document.getElementById("profile").innerHTML = `
  <div class="boxData">${firstName} ${lastName}</div>
  <div class="boxData">${email}</div>
  <div class="boxData">${tel}</div>
  <div class="boxData">${personalIdentificationCode}</div>
  <div class="boxData">${addressStreet}, ${addressCity}, ${addressCountry}</div>
`;
}

function populateAuditRatio(auditRatio) {

  document.getElementById("auditRatio").innerHTML = `
  <div class="boxData">Audit Ratio: ${auditRatio}</div>
  `;
}

function displayData(xpData) {
  const dataContainer = document.getElementById('xp');

  // Clear any existing content in the container
  dataContainer.innerHTML = '';

  // Loop through the xpData array and create div elements for each item
  xpData.forEach(item => {
    // Create a new div for each item
    const itemDiv = document.createElement('div');

    // Create elements for path and amount and set their content
    const pathElement = document.createElement('p');
    pathElement.textContent = `Path: ${item.path}`;

    const amountElement = document.createElement('p');
    amountElement.textContent = `Experience Points: ${item.amount} Kb`;

    // Append path and amount elements to the item div
    itemDiv.appendChild(pathElement);
    itemDiv.appendChild(amountElement);

    // Append the item div to the data container
    dataContainer.appendChild(itemDiv);
  });
}