let myForm = document.getElementById('searchForm');

myForm.onsubmit = async (e) => {
  e.preventDefault();
}
function searchRuc(){
  const data = { ruc: document.getElementById("ruc").value};
    fetch('/consulte-microimpresas', {
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
    if(json.result == "found") {
      let element1 = document.getElementById("result1");
      element1.innerHTML = json.message[0];
      let element2 = document.getElementById("result2");
      element2.innerHTML = json.message[1];
      document.getElementById("query").style.display = "none";
      document.getElementById("results").style.display = "block";

    } else {
      console.log("error");
    }

  });

};
