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

    try {
      const parsed = JSON.parse(rawValue);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (_error) {
      return {};
    }
  }

  function getStoredSubjectMap() {
    return parseSubjectMap(localStorage.getItem(SUBJECT_MAP_KEY));
  }

  function mirrorToChromeStorage(subjectMap) {
    if (!globalThis.chrome?.storage?.local) {
      return Promise.resolve();
    }

    return chrome.storage.local.set({ [SUBJECT_MAP_KEY]: subjectMap });
  }

  function getActiveTabUrl() {
    if (!globalThis.chrome?.tabs?.query) {
      return Promise.reject(new Error("현재 탭 URL을 가져올 수 없습니다."));
    }

    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const runtimeError = chrome.runtime?.lastError;
        if (runtimeError) {
          reject(new Error(runtimeError.message));
          return;
        }

        const activeUrl = tabs && tabs[0] && tabs[0].url;
        if (!activeUrl) {
          reject(new Error("현재 탭 URL을 찾을 수 없습니다."));
          return;
        }

        resolve(activeUrl);
      });
    });
  }

  async function saveSubjectMapping(subjectName, subjectUrl) {
    const cleanName = String(subjectName || "").trim();
    if (!cleanName) {
      throw new Error("과목명을 입력해 주세요.");
    }

    const cleanUrl = String(subjectUrl || "").trim() || (await getActiveTabUrl());
    const key = slugify(cleanUrl);
    if (!key) {
      throw new Error("과목 URL을 확인해 주세요.");
    }

    const subjectMap = getStoredSubjectMap();
    subjectMap[key] = { name: cleanName };

    localStorage.setItem(SUBJECT_MAP_KEY, JSON.stringify(subjectMap));
    await mirrorToChromeStorage(subjectMap);

    return { key, name: cleanName, url: cleanUrl };
  }

  function setStatus(message, isError) {
    const status = document.getElementById("status");
    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function bindPopup() {
    const subjectNameInput = document.getElementById("subjectName");
    const subjectUrlInput = document.getElementById("subjectUrl");
    const saveButton = document.getElementById("saveButton");

    if (!subjectNameInput || !subjectUrlInput || !saveButton) {
      return;
    }

    saveButton.addEventListener("click", async () => {
      saveButton.disabled = true;
      setStatus("", false);

      try {
        const saved = await saveSubjectMapping(subjectNameInput.value, subjectUrlInput.value);
        setStatus(`저장됨: ${saved.name}`, false);
        subjectNameInput.value = "";
        subjectUrlInput.value = "";
      } catch (error) {
        setStatus(error.message || "저장하지 못했습니다.", true);
      } finally {
        saveButton.disabled = false;
      }
    });
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", bindPopup);
  }

  if (typeof module !== "undefined") {
    module.exports = {
      SUBJECT_MAP_KEY,
      normalizeUrlForKey,
      slugify,
      parseSubjectMap,
      saveSubjectMapping
    };
  }
})();
