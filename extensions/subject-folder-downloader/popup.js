(function () {
  const SUBJECT_MAP_KEY = "subjectMap";
  const NATIVE_HOST_NAME = "com.subject_folder_downloader.host";

  async function isNativeHostInstalled() {
    if (!globalThis.chrome?.runtime?.sendNativeMessage) {
      return false;
    }

    return new Promise((resolve) => {
      chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { action: "ping" }, (response) => {
        const runtimeError = chrome.runtime?.lastError;
        if (runtimeError) {
          resolve(false);
          return;
        }

        resolve(Boolean(response));
      });
    });
  }

  function normalizeUrlForKey(url) {
    const value = String(url || "").trim();
    try {
      const parsed = new URL(value);
      const courseMatch = parsed.pathname.match(/^\/courses\/(\d+)(?:\/|$)/);
      if (parsed.hostname === "myetl.snu.ac.kr" && courseMatch) {
        return `${parsed.origin}/courses/${courseMatch[1]}`;
      }

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

  function getSubjectEntries(subjectMap) {
    return Object.entries(subjectMap || {})
      .map(([key, value]) => ({
        key,
        name: String((value && value.name) || "").trim(),
        targetDir: String((value && value.targetDir) || "").trim()
      }))
      .filter((entry) => entry.key && entry.name)
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  function removeSubjectFromMap(subjectMap, keyToRemove) {
    const nextSubjectMap = { ...(subjectMap || {}) };
    delete nextSubjectMap[keyToRemove];
    return nextSubjectMap;
  }

  async function storeSubjectMap(subjectMap) {
    localStorage.setItem(SUBJECT_MAP_KEY, JSON.stringify(subjectMap));
    await mirrorToChromeStorage(subjectMap);
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

  async function saveSubjectMapping(subjectName, subjectUrl, targetDir) {
    const cleanName = String(subjectName || "").trim();
    const cleanTargetDir = String(targetDir || "").trim();
    if (!cleanName) {
      throw new Error("과목명을 입력해 주세요.");
    }

    const cleanUrl = String(subjectUrl || "").trim() || (await getActiveTabUrl());
    const key = slugify(cleanUrl);
    if (!key) {
      throw new Error("과목 URL을 확인해 주세요.");
    }

    const subjectMap = getStoredSubjectMap();
    subjectMap[key] = {
      name: cleanName,
      targetDir: cleanTargetDir
    };

    await storeSubjectMap(subjectMap);

    return { key, name: cleanName, targetDir: cleanTargetDir, url: cleanUrl };
  }

  async function deleteSubjectMapping(keyToRemove) {
    const cleanKey = String(keyToRemove || "").trim();
    if (!cleanKey) {
      return null;
    }

    const subjectMap = getStoredSubjectMap();
    const removedSubject = subjectMap[cleanKey];
    const nextSubjectMap = removeSubjectFromMap(subjectMap, cleanKey);

    await storeSubjectMap(nextSubjectMap);
    return removedSubject || null;
  }

  function setStatus(message, isError) {
    const status = document.getElementById("status");
    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function setNativeHostNoticeVisible(isVisible) {
    const nativeHostNotice = document.getElementById("nativeHostNotice");
    const mainContent = document.getElementById("mainContent");
    if (!nativeHostNotice) {
      return;
    }

    nativeHostNotice.hidden = !isVisible;
    if (mainContent) {
      mainContent.hidden = isVisible;
    }
  }

  async function refreshNativeHostNotice() {
    const installed = await isNativeHostInstalled();
    setNativeHostNoticeVisible(!installed);
    return installed;
  }

  async function selectTargetDirectory(targetDirInput) {
    if (!globalThis.chrome?.runtime?.sendNativeMessage) {
      setStatus("로컬 폴더 선택 도우미를 사용할 수 없습니다. Native host 설치가 필요합니다.", true);
      return null;
    }

    return new Promise((resolve) => {
      chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, { action: "selectDirectory" }, (response) => {
        const runtimeError = chrome.runtime?.lastError;
        if (runtimeError) {
          setStatus(`로컬 폴더 선택 도우미 연결 실패: ${runtimeError.message}`, true);
          resolve(null);
          return;
        }

        if (!response || !response.ok || !response.path) {
          setStatus("폴더 선택이 취소되었습니다.", false);
          resolve(null);
          return;
        }

        targetDirInput.value = response.path;
        setStatus(`선택됨: ${response.path}`, false);
        resolve(response.path);
      });
    });
  }

  function renderSubjectList() {
    const subjectList = document.getElementById("subjectList");
    const emptyState = document.getElementById("emptyState");
    if (!subjectList || !emptyState) {
      return;
    }

    const entries = getSubjectEntries(getStoredSubjectMap());
    subjectList.replaceChildren();

    for (const entry of entries) {
      const item = document.createElement("li");
      const name = document.createElement("span");
      const key = document.createElement("span");
      const targetDir = document.createElement("span");
      const deleteButton = document.createElement("button");

      name.className = "subject-name";
      key.className = "subject-key";
      targetDir.className = "target-dir";
      deleteButton.className = "delete-subject";
      deleteButton.type = "button";
      name.textContent = entry.name;
      key.textContent = entry.key;
      targetDir.textContent = entry.targetDir ? `지정할 폴더: ${entry.targetDir}` : "지정할 폴더 미지정";
      deleteButton.textContent = "삭제";
      deleteButton.setAttribute("aria-label", `${entry.name} 삭제`);
      deleteButton.addEventListener("click", async () => {
        deleteButton.disabled = true;
        const removedSubject = await deleteSubjectMapping(entry.key);
        renderSubjectList();
        if (removedSubject && removedSubject.name) {
          setStatus(`삭제됨: ${removedSubject.name}`, false);
        }
      });

      item.append(name, deleteButton, targetDir, key);
      subjectList.append(item);
    }

    emptyState.hidden = entries.length > 0;
  }

  function bindPopup() {
    const subjectNameInput = document.getElementById("subjectName");
    const subjectUrlInput = document.getElementById("subjectUrl");
    const targetDirInput = document.getElementById("targetDir");
    const selectFolderButton = document.getElementById("selectFolderButton");
    const saveButton = document.getElementById("saveButton");
    const supportCopyLink = document.getElementById("supportCopyLink");

    if (!subjectNameInput || !subjectUrlInput || !targetDirInput || !selectFolderButton || !saveButton) {
      return;
    }

    selectFolderButton.addEventListener("click", async () => {
      selectFolderButton.disabled = true;
      await selectTargetDirectory(targetDirInput);
      selectFolderButton.disabled = false;
    });

    saveButton.addEventListener("click", async () => {
      saveButton.disabled = true;
      setStatus("", false);

      try {
        const saved = await saveSubjectMapping(subjectNameInput.value, subjectUrlInput.value, targetDirInput.value);
        setStatus(`저장됨: ${saved.name}`, false);
        subjectNameInput.value = "";
        subjectUrlInput.value = "";
        targetDirInput.value = "";
        renderSubjectList();
      } catch (error) {
        setStatus(error.message || "저장하지 못했습니다.", true);
      } finally {
        saveButton.disabled = false;
      }
    });

    if (supportCopyLink) {
      supportCopyLink.addEventListener("click", async (event) => {
        event.preventDefault();
        const copyText = String(supportCopyLink.dataset.copyText || "").trim();
        if (!copyText) {
          return;
        }

        try {
          await navigator.clipboard.writeText(copyText);
          setStatus("토스뱅크 계좌가 복사되었습니다.", false);
        } catch (_error) {
          setStatus("복사하지 못했습니다. 계좌번호를 직접 확인해 주세요.", true);
        }
      });
    }
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      bindPopup();
      renderSubjectList();
      refreshNativeHostNotice();
    });
  }

  if (typeof module !== "undefined") {
    module.exports = {
      SUBJECT_MAP_KEY,
      NATIVE_HOST_NAME,
      normalizeUrlForKey,
      slugify,
      parseSubjectMap,
      getSubjectEntries,
      removeSubjectFromMap,
      isNativeHostInstalled,
      refreshNativeHostNotice,
      selectTargetDirectory,
      deleteSubjectMapping,
      saveSubjectMapping
    };
  }
})();
