const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");

tilForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const dateValue = document.querySelector("#til-date").value;
  const titleValue = document.querySelector("#til-title").value;
  const contentValue = document.querySelector("#til-content").value;

  const newArticle = document.createElement("article");
  newArticle.classList.add("til-item"); // CSS 스타일 적용을 위한 클래스 추가

  newArticle.innerHTML = `
    <time>${dateValue}</time>
    <h3>${titleValue}</h3>
    <p>${contentValue.replace(/\n/g, '<br>')}</p> 
  `;

  tilList.prepend(newArticle);

  tilForm.reset();

  alert("오늘의 배움이 기록되었습니다! 🎉");
});
