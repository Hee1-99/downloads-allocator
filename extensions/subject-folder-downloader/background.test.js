const test = require("node:test");
const assert = require("node:assert/strict");

const {
  slugify,
  parseSubjectMap,
  sanitizeFolderName,
  resolveDownloadPageUrl,
  buildTabUrlPattern,
  queryTabsByUrl,
  resolvePromptTabId,
  buildSubjectFilename,
  buildDownloadSuggestion,
  buildMoveRequest,
  buildMoveConfirmMessage,
  promptMoveInTab
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

test("slugify normalizes myetl course subpages to the course root key", () => {
  assert.equal(
    slugify("https://myetl.snu.ac.kr/courses/294444/files/8075921?module_item_id=1494606"),
    "https_myetl_snu_ac_kr_courses_294444"
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

  assert.equal(filename, "_강의자료/자료구조/lecture01.pdf");
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

test("buildSubjectFilename matches myetl file links to the registered course root", () => {
  const subjectMap = {
    https_myetl_snu_ac_kr_courses_294444: { name: "subject" }
  };

  const filename = buildSubjectFilename(
    {
      referrer: "https://myetl.snu.ac.kr/courses/294444/files/8075921?module_item_id=1494606",
      filename: "lecture02.pdf"
    },
    subjectMap
  );

  assert.equal(filename, "_강의자료/subject/lecture02.pdf");
});

test("buildDownloadSuggestion keeps Chrome supplied filename when the URL is unmapped", () => {
  const suggestion = buildDownloadSuggestion(
    {
      referrer: "https://myetl.snu.ac.kr/courses/000000",
      filename: "lecture01.pdf"
    },
    {},
    "https://myetl.snu.ac.kr/courses/000000"
  );

  assert.deepEqual(suggestion, {
    filename: "lecture01.pdf",
    conflictAction: "uniquify"
  });
});

test("buildDownloadSuggestion returns a non-empty filename when the URL is mapped", () => {
  const suggestion = buildDownloadSuggestion(
    {
      referrer: "https://myetl.snu.ac.kr/courses/294556",
      filename: ""
    },
    {
      https_myetl_snu_ac_kr_courses_294556: { name: "자료구조" }
    },
    "https://myetl.snu.ac.kr/courses/294556"
  );

  assert.deepEqual(suggestion, {
    filename: "_강의자료/자료구조/download",
    conflictAction: "uniquify"
  });
});

test("buildDownloadSuggestion places mapped downloads under the lecture root folder", () => {
  const suggestion = buildDownloadSuggestion(
    {
      referrer: "https://myetl.snu.ac.kr/courses/294444",
      filename: "lecture03.pdf"
    },
    {
      https_myetl_snu_ac_kr_courses_294444: { name: "marketing" }
    },
    "https://myetl.snu.ac.kr/courses/294444"
  );

  assert.deepEqual(suggestion, {
    filename: "_강의자료/marketing/lecture03.pdf",
    conflictAction: "uniquify"
  });
});

test("resolveDownloadPageUrl uses the tab URL when referrer is missing", async () => {
  global.chrome = {
    tabs: {
      get(tabId, callback) {
        assert.equal(tabId, 7);
        callback({ url: "https://myetl.snu.ac.kr/courses/294556" });
      }
    },
    runtime: {}
  };

  try {
    const pageUrl = await resolveDownloadPageUrl({ tabId: 7 });
    assert.equal(pageUrl, "https://myetl.snu.ac.kr/courses/294556");
  } finally {
    delete global.chrome;
  }
});

test("buildTabUrlPattern converts a page URL to a tabs query pattern", () => {
  assert.equal(
    buildTabUrlPattern("https://myetl.snu.ac.kr/courses/294556"),
    "https://myetl.snu.ac.kr/courses/294556*"
  );
});

test("resolvePromptTabId falls back to a matching tab query when download tabId is missing", async () => {
  global.chrome = {
    tabs: {
      query(queryInfo, callback) {
        if (queryInfo.url === "https://myetl.snu.ac.kr/courses/294556*") {
          callback([{ id: 91 }]);
          return;
        }

        callback([]);
      }
    },
    runtime: {}
  };

  try {
    const tabId = await resolvePromptTabId({ tabId: -1 }, "https://myetl.snu.ac.kr/courses/294556");
    assert.equal(tabId, 91);
  } finally {
    delete global.chrome;
  }
});

test("buildMoveRequest maps completed lecture downloads to the configured target directory", () => {
  const moveRequest = buildMoveRequest(
    {
      filename: "C:\\Users\\me\\Downloads\\_강의자료\\marketing\\lecture03.pdf"
    },
    {
      https_myetl_snu_ac_kr_courses_294444: {
        name: "marketing",
        targetDir: "D:\\SNU\\2026-1\\Marketing"
      }
    }
  );

  assert.deepEqual(moveRequest, {
    action: "moveFile",
    sourcePath: "C:\\Users\\me\\Downloads\\_강의자료\\marketing\\lecture03.pdf",
    targetDir: "D:\\SNU\\2026-1\\Marketing"
  });
});

test("buildMoveRequest returns null when the subject has no target directory", () => {
  const moveRequest = buildMoveRequest(
    {
      filename: "C:\\Users\\me\\Downloads\\_강의자료\\marketing\\lecture03.pdf"
    },
    {
      https_myetl_snu_ac_kr_courses_294444: {
        name: "marketing"
      }
    }
  );

  assert.equal(moveRequest, null);
});

test("buildMoveConfirmMessage explains confirm and cancel actions", () => {
  const message = buildMoveConfirmMessage(
    "D:\\SNU\\Marketing\\lecture.pdf",
    "D:\\SNU\\Marketing"
  );

  assert.match(message, /D:\\SNU\\Marketing\\lecture\.pdf/);
  assert.doesNotMatch(message, /확인: 다운로드 확인/);
  assert.doesNotMatch(message, /취소: 계속하기/);
});

test("promptMoveInTab resolves false when tabs messaging is unavailable", async () => {
  assert.equal(await promptMoveInTab(-1, "path", "dir"), false);
});

test("promptMoveInTab injects a confirm dialog into the original tab", async () => {
  const calls = [];
  global.chrome = {
    scripting: {
      executeScript(options, callback) {
        calls.push(options);
        callback([{ result: true }]);
      }
    },
    runtime: {}
  };

  try {
    const confirmed = await promptMoveInTab(
      12,
      "D:\\SNU\\Marketing\\lecture.pdf",
      "D:\\SNU\\Marketing"
    );

    assert.equal(confirmed, true);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].target, { tabId: 12 });
    assert.equal(typeof calls[0].func, "function");
    assert.deepEqual(calls[0].args, ["D:\\SNU\\Marketing\\lecture.pdf"]);
    assert.doesNotMatch(calls[0].func.toString(), /backdrop\.addEventListener/);
  } finally {
    delete global.chrome;
  }
});
