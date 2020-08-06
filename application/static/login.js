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
    if(json.result == "valid") {
      document.cookie = "token="+json.token;
      window.location.replace("/");
    } else {
      let element = document.getElementById("warning");
      element.innerHTML = json.message;
      element.classList.remove("collapse");
    }

  });

};
