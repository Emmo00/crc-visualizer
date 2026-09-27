async function startVisualization() {
  if (!validateInputFields()) return;

  let dataFrame = getDataFrameInputValue();
  const generator = getGeneratorInputValue();

  // show data frame
  showData(dataFrame);

  // show generator
  showGenerator(generator);

  await sleep(1000);

  // gridify the data frame
  let dataFrameCharacterWidth = gridifyDataElement(dataFrame.length);

  await sleep(1000);

  // assign same character width as the data frame to the generator
  console.log(dataFrameCharacterWidth);
  normalizeGeneratorBitsCharacterWidth(dataFrameCharacterWidth);

  await sleep(1000);

  // get padding bits
  const nbPaddingBits = generator.length - 1;
  let paddingBits = "0".repeat(nbPaddingBits);

  // append bits to data frame and get new data character element padding width
  dataFrame = dataFrame + paddingBits;
  showData(dataFrame);
  dataFrameCharacterWidth = gridifyDataElement(dataFrame.length);

  await sleep(1000);

  // normalize the generator elements to same character width\
  normalizeGeneratorBitsCharacterWidth(dataFrameCharacterWidth);

  await sleep(1000);

  // show divider line
  showDividerLine();

  // do modulo 2 division on dataframe|paddingbits and generator
  let nbShifts = 0;
  let divisor = generator;
  let remainder = dataFrame;

  await sleep(1000);

  let i = 0;
  while (true) {
    if (!shouldContinueDivision(remainder, divisor.length)) {
      console.log("breaking division");
      break;
    }

    if (remainder[nbShifts] == "1") {
      remainder = "0".repeat(nbShifts) + xor(remainder.slice(nbShifts), divisor);
      console.log("remainder", remainder);
      showRemainder(remainder);
    } else {
      console.log("else remainder", remainder);
      nbShifts++;
      shiftGeneratorElement(dataFrameCharacterWidth, nbShifts);
    }

    await sleep(500);
  }

  // - do xor division
  // - update checksum
  // - move over generator
  // - repeat
  //   shiftGeneratorElement(dataFrameCharacterWidth*3);

  // extract check sum
  showChecksum(remainder.slice(nbShifts));

  // scroll to bottom
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth", // Use 'auto' for instant scrolling
  });
}

function shouldContinueDivision(dividend, divisorLength) {
  console.log("dividend", dividend, "index of", dividend.indexOf("1"), "divisor length:", divisorLength);
  const firstOneIndex = dividend.indexOf("1");

  return dividend.slice(firstOneIndex).length >= divisorLength;
}

function xor(dividend, divisor) {
  let remainder = "";

  for (let i = 0; i < dividend.length; i++) {
    if (divisor.length - 1 < i) {
      remainder += dividend[i];
      continue;
    }

    if (dividend[i] == divisor[i]) {
      remainder += "0";
    } else {
      remainder += "1";
    }
  }

  return remainder;
}

function shiftGeneratorElement(shiftWidth, nbShifts) {
  const generatorEl = getGeneratorEl();

  generatorEl.style.paddingLeft = `${shiftWidth * nbShifts}px`;
}

function showDividerLine() {
  document.querySelector(".divider-line").classList.add("line");
}

function normalizeGeneratorBitsCharacterWidth(characterWidth) {
  const generatorEl = getGeneratorEl();

  generatorEl.style.gridTemplateColumns = `repeat(5, ${characterWidth}px)`;

  generatorEl.childNodes.forEach((bitEl) => {
    bitEl.style.transform = "scale(1.05)";
    setTimeout(() => {
      bitEl.style.transform = "scale(1)";
    }, 150);
  });

  generatorEl.style.width = `${characterWidth * generatorEl.children.length}px`;
}

function gridifyDataElement(nbOfBits) {
  const dataEl = getDataEl();

  dataEl.style.display = "grid";
  //   dataEl.style.gap = "0px";
  dataEl.style.minHeight = "0px";
  dataEl.style.gridTemplateColumns = `repeat(${nbOfBits}, 1fr)`;

  return dataEl.children[0].getBoundingClientRect().width;
}

function showChecksum(data) {
  const checksumEl = getChecksumEl();
  const checksumLabelEl = getChecksumLabelEl();

  // 1. Remove the 'hide' class to kick off the container's CSS slide-and-fade transition
  checksumEl.classList.remove("hide");
  checksumLabelEl.classList.remove("hide");

  // 2. The delay step (in seconds) between each bit appearing (e.g., 40ms)
  const staggerDelay = 0.04;

  // 3. Populate HTML and map inline custom delays to staggered bits
  checksumEl.innerHTML = data
    .split("")
    .map((bit, index) => {
      const delay = index * staggerDelay;
      return `<span class="checksum-bits" style="animation-delay: ${delay}s;">${bit}</span>`;
    })
    .join("");
}

function showRemainder(data) {
  const remainderEl = getRemainderEl();

  remainderEl.innerHTML = data
    .split("")
    .map((bit) => `<span class="remainder-bits">${bit}</span>`)
    .join("");
}

function showData(data) {
  const dataEl = getDataEl();

  const staggerDelay = 0.03;

  dataEl.innerHTML = data
    .split("")
    .map((bit, index) => {
      // Calculate a unique delay for every single letter
      const delay = index * staggerDelay;

      return `<span class="data-bits" style="animation-delay: ${delay}s;">${bit}</span>`;
    })
    .join("");
}

function showGenerator(data) {
  const generatorEl = getGeneratorEl();

  generatorEl.innerHTML = data
    .split("")
    .map((bit) => `<span class="generator-bits">${bit}</span>`)
    .join("");
}

function getChecksumEl() {
  return document.querySelector(".checksum");
}

function getChecksumLabelEl() {
  return document.querySelector(".checksum-label");
}

function getRemainderEl() {
  return document.querySelector(".remainder");
}

function getDataEl() {
  return document.querySelector(".extracted-data");
}

function getGeneratorEl() {
  return document.querySelector(".extracted-generator");
}

function getDataFrameInputValue() {
  // return "10110101";
  return document.querySelector("#data").value.trim();
}

function getGeneratorInputValue() {
  // return "11011";
  return document.querySelector("#generator").value.trim();
}

function sleep(duration) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, duration),
  );
}

function validateInputFields() {
  clearError();

  const dataFrame = getDataFrameInputValue();
  const generator = getGeneratorInputValue();

  if (!dataFrame) {
    showError("Data frame is invalid");
    return false;
  }

  if (!generator || generator == "1") {
    showError("Generator is invalid");
    return false;
  }

  if (generator.startsWith("0")) {
    showError("Begining bits of generator must be 1");
    return false;
  }

  if (dataFrame.length < generator.length) {
    showError("Data frame bits must be more than Generator bits");
    return false;
  }

  return true;
}

function clearError() {
  const errorEl = document.querySelector(".error");

  errorEl.textContent = "";
}

function showError(message) {
  const errorEl = document.querySelector(".error");

  errorEl.textContent = message;
}
