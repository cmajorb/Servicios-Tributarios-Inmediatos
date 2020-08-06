let myForm = document.getElementById('registerForm');

myForm.onsubmit = async (e) => {
  e.preventDefault();
}
function registerUser(){
  const data = { username: document.getElementById("username").value,
                  password: document.getElementById("password").value,
                  name: document.getElementById("name").value,
                  email: document.getElementById("email").value,
                  ruc: document.getElementById("ruc").value,
                };
    fetch('/register', {
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
    if(json.result == "valid") {
      document.cookie = "token="+json.token;
      window.location.replace("/");
    } else {
      let element = document.getElementById("warning");
      element.classList.remove("collapse");
    }

  });

};
