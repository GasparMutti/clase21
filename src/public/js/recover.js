const recoverForm = document.getElementById("recoverForm");

recoverForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const data = Object.fromEntries(new FormData(recoverForm));
  fetch("/api/session/recover", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        recoverForm.firstChild.textContent = `${res.error}`;
        return console.log(res.error);
      } else {
        console.log(res);
        return location.assign("http://localhost:8080/login");
      }
    });
});
