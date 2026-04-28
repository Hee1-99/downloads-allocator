const test = require("node:test");
const assert = require("node:assert/strict");

const { slugify, parseSubjectMap } = require("./popup.js");

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

test("popup parseSubjectMap accepts valid subject maps", () => {
  assert.deepEqual(
    parseSubjectMap('{"https_example_com_course_1":{"name":"알고리즘"}}'),
    {
      https_example_com_course_1: { name: "알고리즘" }
    }
  );
});
