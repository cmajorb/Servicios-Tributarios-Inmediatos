let myForm = document.getElementById('loginForm');

myForm.onsubmit = async (e) => {
  e.preventDefault();
}
function getUser(){
  const data = { username: document.getElementById("username").value,
                  password: document.getElementById("password").value};
    fetch('/login', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify(data)
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    localStorage.setItem('token', json);
    window.location.replace("/?token="+json);
    console.log(json);
  });

};
