const test = require("node:test");
const assert = require("node:assert/strict");

const {
  slugify,
  parseSubjectMap,
  sanitizeFolderName,
  buildSubjectFilename
} = require("./background.js");

test("slugify converts URLs to underscore keys", () => {
  assert.equal(
    slugify("https://myetl.snu.ac.kr/courses/294556"),
    "https_myetl_snu_ac_kr_courses_294556"
  );
});

test("slugify ignores query strings and hashes for course page keys", () => {
  assert.equal(
    slugify("https://myetl.snu.ac.kr/courses/294556?week=1#files"),
    "https_myetl_snu_ac_kr_courses_294556"
  );
});

test("parseSubjectMap falls back to an empty object for invalid JSON", () => {
  assert.deepEqual(parseSubjectMap("{bad json"), {});
});

test("sanitizeFolderName replaces path separators and reserved filename characters", () => {
  assert.equal(sanitizeFolderName("자료/구조:*?"), "자료_구조_");
});

test("buildSubjectFilename routes a matching download into the subject folder", () => {
  const subjectMap = {
    https_myetl_snu_ac_kr_courses_294556: { name: "자료구조" }
  };

  const filename = buildSubjectFilename(
    {
      referrer: "https://myetl.snu.ac.kr/courses/294556",
      filename: "lecture01.pdf"
    },
    subjectMap
  );

  assert.equal(filename, "자료구조/lecture01.pdf");
});

test("buildSubjectFilename returns null when the URL is unmapped", () => {
  const filename = buildSubjectFilename(
    {
      referrer: "https://myetl.snu.ac.kr/courses/000000",
      filename: "lecture01.pdf"
    },
    {}
  );

  assert.equal(filename, null);
});
