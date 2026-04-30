const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readPopupHtml() {
  return fs.readFileSync(path.join(__dirname, "popup.html"), "utf8");
}

test("popup explains the course download destination and root folder warning", () => {
  const html = readPopupHtml();

  assert.match(html, /지정한 폴더에 저장됩니다/);
  assert.match(html, /_강의자료/);
  assert.match(html, /삭제하지 마세요/);
});

test("popup provides target directory controls", () => {
  const html = readPopupHtml();

  assert.match(html, /지정할 폴더/);
  assert.match(html, /id="targetDir"/);
  assert.match(html, /id="selectFolderButton"/);
});

test("popup includes support and idea submission links", () => {
  const html = readPopupHtml();

  assert.match(html, /가난한 대학생 후원하기/);
  assert.match(html, /새로운 아이디어 제공 환영/);
  assert.match(html, /businessonhwa@gmail\.com/);
  assert.match(html, /id="supportCopyLink"/);
  assert.match(html, /data-copy-text="토스뱅크 1000-6901-3070"/);
});

test("popup hides the main content by default and includes a direct installer download link", () => {
  const html = readPopupHtml();

  assert.match(html, /id="nativeHostNotice"/);
  assert.match(html, /id="mainContent" hidden/);
  assert.match(html, /class="install-notice-link"/);
  assert.match(html, /github\.com\/Hee1-99\/downloads-allocator\/releases\/latest\/download\/subject-folder-downloader-setup\.exe/);
});
