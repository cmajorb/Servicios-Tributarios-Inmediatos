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
    document.getElementById("query").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("centerButton").style.display = "flex";

    if(json.result == "found") {
      document.getElementById("result1").innerHTML = json.message[0];
      document.getElementById("result2").innerHTML = json.message[1];
      document.getElementById("info").style.display = "block";

    } else {
      document.getElementById("result1").innerHTML = data.ruc;
      document.getElementById("warning").style.display = "block";

    }

  });

};
