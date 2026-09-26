const sendTabEl = document.querySelector(".send-tab");
const receiveTabEl = document.querySelector(".receive-tab");
const sendTabBtnEl = document.querySelector(".send-tab-btn");
const receiveTabBtnEl = document.querySelector(".receive-tab-btn");

function showSendTab() {
  sendTabEl.style.display = "flex";
  receiveTabEl.style.display = "none";

  sendTabBtnEl.style.borderBottom = "5px solid black";
  receiveTabBtnEl.style.borderBottom = "none";
}

function showReceiveTab() {
  receiveTabEl.style.display = "flex";
  sendTabEl.style.display = "none";

  receiveTabBtnEl.style.borderBottom = "5px solid black";
  sendTabBtnEl.style.borderBottom = "none";
}
