async function login(usernameOrEmail, password) {
  const credentials = `${usernameOrEmail}:${password}`;
  const encodedCredentials = btoa(credentials);
  const response = await fetch('https://01.kood.tech/api/auth/signin', {
      method: 'POST',
      headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
      },
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Unknown error occurred');
  }
  
  const data = await response.json();
  console.log(data);

  const jwt = data.jwt;
  localStorage.setItem('jwt', jwt);
  return jwt;
}

  function logout() {
    // Clear JWT from local storage
    localStorage.removeItem('jwt');
  }
 