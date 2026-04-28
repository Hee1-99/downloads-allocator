(function () {
  const SUBJECT_MAP_KEY = "subjectMap";

  function normalizeUrlForKey(url) {
    const value = String(url || "").trim();
    try {
      const parsed = new URL(value);
      return `${parsed.origin}${parsed.pathname}`;
    } catch (_error) {
      return value.split("#")[0].split("?")[0];
    }
  }

  function slugify(url) {
    return normalizeUrlForKey(url)
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function parseSubjectMap(rawValue) {
    if (!rawValue) {
      return {};
    }

    if (typeof rawValue === "object" && !Array.isArray(rawValue)) {
      return rawValue;
    }

    try {
      const parsed = JSON.parse(rawValue);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (_error) {
      return {};
    }
  }

  function loadSubjectMap() {
    if (globalThis.chrome?.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(SUBJECT_MAP_KEY, (items) => {
          resolve(parseSubjectMap(items && items[SUBJECT_MAP_KEY]));
        });
      });
    }

    if (globalThis.localStorage) {
      return Promise.resolve(parseSubjectMap(localStorage.getItem(SUBJECT_MAP_KEY)));
    }

    return Promise.resolve({});
  }

  function sanitizeFolderName(folderName) {
    return String(folderName || "")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "_")
      .replace(/\.+$/g, "")
      .slice(0, 120);
  }

  function getBaseFilename(filename) {
    const parts = String(filename || "").split(/[\\/]+/);
    return parts[parts.length - 1] || "download";
  }

  function getSourceUrl(downloadItem) {
    return (
      downloadItem?.referrer ||
      ""
    );
  }

  function getActiveTabUrl() {
    if (!globalThis.chrome?.tabs?.query) {
      return Promise.resolve("");
    }

    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve((tabs && tabs[0] && tabs[0].url) || "");
      });
    });
  }

  async function resolveDownloadPageUrl(downloadItem) {
    return getSourceUrl(downloadItem) || (await getActiveTabUrl());
  }

  function buildSubjectFilename(downloadItem, subjectMap, pageUrl) {
    const sourceKey = slugify(pageUrl || getSourceUrl(downloadItem));
    const subject = subjectMap[sourceKey];
    const subjectFolder = sanitizeFolderName(subject && subject.name);

    if (!subjectFolder) {
      return null;
    }

    return `${subjectFolder}/${getBaseFilename(downloadItem.filename)}`;
  }

  function registerDownloadsListener() {
    if (!globalThis.chrome?.downloads?.onDeterminingFilename) {
      return;
    }

    chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
      Promise.all([loadSubjectMap(), resolveDownloadPageUrl(downloadItem)]).then(([subjectMap, pageUrl]) => {
        const filename = buildSubjectFilename(downloadItem, subjectMap, pageUrl);
        if (!filename) {
          suggest({ conflictAction: "uniquify" });
          return;
        }

        suggest({
          filename,
          conflictAction: "uniquify"
        });
      });

      return true;
    });
  }

  registerDownloadsListener();

  if (typeof module !== "undefined") {
    module.exports = {
      SUBJECT_MAP_KEY,
      normalizeUrlForKey,
      slugify,
      parseSubjectMap,
      sanitizeFolderName,
      getBaseFilename,
      getSourceUrl,
      getActiveTabUrl,
      resolveDownloadPageUrl,
      buildSubjectFilename
    };
  }
})();
