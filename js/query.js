async function getUserData() {
  try {
    const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          user {
            auditRatio
            attrs
          }
        }`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching user data');
    }

    const data = await response.json();
    const auditRatio = data.user[0].auditRatio;
    const attrs = data.user[0].attrs;

    console.log('Audit Ratio:', auditRatio);
    console.log('Attributes:', attrs);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
  }
}

// Call the function
