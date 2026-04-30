const test = require("node:test");
const assert = require("node:assert/strict");

const { slugify, parseSubjectMap, getSubjectEntries, removeSubjectFromMap } = require("./popup.js");

test("popup slugify matches the shared URL key format", () => {
  assert.equal(
    slugify("https://moodle.snu.ac.kr/course/101234"),
    "https_moodle_snu_ac_kr_course_101234"
  );
});

test("popup slugify ignores query strings and hashes", () => {
  assert.equal(
    slugify("https://moodle.snu.ac.kr/course/101234?download=1#section-2"),
    "https_moodle_snu_ac_kr_course_101234"
  );
});

test("popup slugify normalizes myetl course subpages to the course root key", () => {
  assert.equal(
    slugify("https://myetl.snu.ac.kr/courses/294444/files/8075921?module_item_id=1494606"),
    "https_myetl_snu_ac_kr_courses_294444"
  );
});

test("popup parseSubjectMap accepts valid subject maps", () => {
  assert.deepEqual(
    parseSubjectMap('{"https_example_com_course_1":{"name":"알고리즘"}}'),
    {
      https_example_com_course_1: { name: "알고리즘" }
    }
  );
});

test("getSubjectEntries returns displayable saved subjects sorted by name", () => {
  assert.deepEqual(
    getSubjectEntries({
      https_example_com_b: { name: "자료구조" },
      https_example_com_a: { name: "알고리즘" },
      empty: { name: " " }
    }),
    [
      { key: "https_example_com_a", name: "알고리즘", targetDir: "" },
      { key: "https_example_com_b", name: "자료구조", targetDir: "" }
    ]
  );
});

test("removeSubjectFromMap removes only the selected subject key", () => {
  assert.deepEqual(
    removeSubjectFromMap(
      {
        https_example_com_a: { name: "알고리즘" },
        https_example_com_b: { name: "자료구조" }
      },
      "https_example_com_a"
    ),
    {
      https_example_com_b: { name: "자료구조" }
    }
  );
});

test("getSubjectEntries includes configured target directories", () => {
  assert.deepEqual(
    getSubjectEntries({
      https_example_com_a: {
        name: "Algorithms",
        targetDir: "D:\\SNU\\2026-1\\Algorithms"
      },
      https_example_com_b: {
        name: "Data Structures"
      }
    }),
    [
      {
        key: "https_example_com_a",
        name: "Algorithms",
        targetDir: "D:\\SNU\\2026-1\\Algorithms"
      },
      {
        key: "https_example_com_b",
        name: "Data Structures",
        targetDir: ""
      }
    ]
  );
});
