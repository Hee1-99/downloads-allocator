(function () {
  const SUBJECT_MAP_KEY = "subjectMap";
  const DOWNLOAD_ROOT_FOLDER = "_강의자료";
  const NATIVE_HOST_NAME = "com.subject_folder_downloader.host";

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

  function getSuggestionFilename(filename) {
    return String(filename || "").trim() || "download";
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

  function getDownloadTabUrl(downloadItem) {
    if (!globalThis.chrome?.tabs?.get || typeof downloadItem?.tabId !== "number" || downloadItem.tabId < 0) {
      return Promise.resolve("");
    }

    return new Promise((resolve) => {
      chrome.tabs.get(downloadItem.tabId, (tab) => {
        const runtimeError = chrome.runtime?.lastError;
        resolve(runtimeError ? "" : ((tab && tab.url) || ""));
      });
    });
  }

  async function resolveDownloadPageUrl(downloadItem) {
    return getSourceUrl(downloadItem) || (await getDownloadTabUrl(downloadItem)) || (await getActiveTabUrl());
  }

  function buildTabUrlPattern(pageUrl) {
    const value = String(pageUrl || "").trim();
    if (!value) {
      return "";
    }

    try {
      const parsed = new URL(value);
      return `${parsed.origin}${parsed.pathname.replace(/\/?$/, "")}*`;
    } catch (_error) {
      return value;
    }
  }

  function queryTabsByUrl(pageUrl) {
    if (!globalThis.chrome?.tabs?.query) {
      return Promise.resolve([]);
    }

    const url = buildTabUrlPattern(pageUrl);
    if (!url) {
      return Promise.resolve([]);
    }

    return new Promise((resolve) => {
      chrome.tabs.query({ url }, (tabs) => {
        resolve(Array.isArray(tabs) ? tabs : []);
      });
    });
  }

  async function resolvePromptTabId(downloadItem, pageUrl) {
    if (typeof downloadItem?.tabId === "number" && downloadItem.tabId >= 0) {
      return downloadItem.tabId;
    }

    const tabs = await queryTabsByUrl(pageUrl);
    if (tabs.length > 0 && typeof tabs[0].id === "number") {
      return tabs[0].id;
    }

    const activeTabUrl = await getActiveTabUrl();
    const activeTabs = await queryTabsByUrl(activeTabUrl);
    if (activeTabs.length > 0 && typeof activeTabs[0].id === "number") {
      return activeTabs[0].id;
    }

    return -1;
  }

  function buildSubjectFilename(downloadItem, subjectMap, pageUrl) {
    const sourceKey = slugify(pageUrl || getSourceUrl(downloadItem));
    const subject = subjectMap[sourceKey];
    const subjectFolder = sanitizeFolderName(subject && subject.name);

    if (!subjectFolder) {
      return null;
    }

    return `${DOWNLOAD_ROOT_FOLDER}/${subjectFolder}/${getBaseFilename(downloadItem.filename)}`;
  }

  function buildDownloadSuggestion(downloadItem, subjectMap, pageUrl) {
    return {
      filename: buildSubjectFilename(downloadItem, subjectMap, pageUrl) || getSuggestionFilename(downloadItem.filename),
      conflictAction: "uniquify"
    };
  }

  function getLectureSubjectFolderFromPath(filename) {
    const parts = String(filename || "").split(/[\\/]+/);
    const rootIndex = parts.lastIndexOf(DOWNLOAD_ROOT_FOLDER);
    if (rootIndex < 0 || rootIndex + 1 >= parts.length) {
      return "";
    }

    return parts[rootIndex + 1];
  }

  function findSubjectByFolder(subjectMap, subjectFolder) {
    return Object.values(subjectMap || {}).find((subject) => {
      return sanitizeFolderName(subject && subject.name) === subjectFolder;
    }) || null;
  }

  function buildMoveRequest(downloadItem, subjectMap) {
    const sourcePath = String((downloadItem && downloadItem.filename) || "").trim();
    const subjectFolder = getLectureSubjectFolderFromPath(sourcePath);
    const subject = findSubjectByFolder(subjectMap, subjectFolder);
    const targetDir = String((subject && subject.targetDir) || "").trim();

    if (!sourcePath || !subjectFolder || !targetDir) {
      return null;
    }

    return {
      action: "moveFile",
      sourcePath,
      targetDir
    };
  }

  function eraseDownloadRecord(downloadId) {
    if (!globalThis.chrome?.downloads?.erase) {
      return Promise.resolve([]);
    }

    return new Promise((resolve) => {
      chrome.downloads.erase({ id: downloadId }, (erasedIds) => {
        resolve(erasedIds || []);
      });
    });
  }

  function buildMoveConfirmMessage(movedPath, targetDir) {
    return [movedPath || targetDir].filter(Boolean).join("\n");
  }

  function promptMoveInTab(tabId, movedPath, targetDir) {
    if (!globalThis.chrome?.scripting?.executeScript || typeof tabId !== "number" || tabId < 0) {
      return Promise.resolve(false);
    }

    const message = buildMoveConfirmMessage(movedPath, targetDir);

    return new Promise((resolve) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: async (confirmMessage) => {
          const existingOverlay = document.getElementById("subject-folder-downloader-move-prompt");
          if (existingOverlay) {
            existingOverlay.remove();
          }

          const backdrop = document.createElement("div");
          backdrop.id = "subject-folder-downloader-move-prompt";
          backdrop.style.position = "fixed";
          backdrop.style.inset = "0";
          backdrop.style.zIndex = "2147483647";
          backdrop.style.display = "grid";
          backdrop.style.placeItems = "center";
          backdrop.style.background = "rgba(15, 23, 42, 0.48)";
          backdrop.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

          const panel = document.createElement("div");
          panel.style.width = "min(92vw, 420px)";
          panel.style.borderRadius = "12px";
          panel.style.padding = "18px";
          panel.style.background = "#ffffff";
          panel.style.color = "#172033";
          panel.style.boxShadow = "0 24px 80px rgba(0, 0, 0, 0.32)";
          panel.style.display = "grid";
          panel.style.gap = "14px";

          const title = document.createElement("div");
          title.textContent = "강의자료 이동 완료";
          title.style.fontSize = "18px";
          title.style.fontWeight = "700";

          const subtitle = document.createElement("div");
          subtitle.textContent = "다운로드가 완료되어 지정된 폴더로 이동했습니다.";
          subtitle.style.fontSize = "13px";
          subtitle.style.color = "#526070";

          const body = document.createElement("div");
          body.style.whiteSpace = "pre-wrap";
          body.style.lineHeight = "1.5";
          body.style.fontSize = "13px";
          body.textContent = confirmMessage;

          const actions = document.createElement("div");
          actions.style.display = "flex";
          actions.style.justifyContent = "flex-end";
          actions.style.gap = "8px";

          const confirmButton = document.createElement("button");
          confirmButton.textContent = "다운로드 확인";
          confirmButton.style.border = "0";
          confirmButton.style.borderRadius = "8px";
          confirmButton.style.padding = "10px 14px";
          confirmButton.style.font = "inherit";
          confirmButton.style.fontWeight = "700";
          confirmButton.style.color = "#ffffff";
          confirmButton.style.background = "#2764d8";
          confirmButton.style.cursor = "pointer";

          const cancelButton = document.createElement("button");
          cancelButton.textContent = "계속하기";
          cancelButton.style.border = "1px solid #cdd5e3";
          cancelButton.style.borderRadius = "8px";
          cancelButton.style.padding = "10px 14px";
          cancelButton.style.font = "inherit";
          cancelButton.style.fontWeight = "700";
          cancelButton.style.color = "#172033";
          cancelButton.style.background = "#ffffff";
          cancelButton.style.cursor = "pointer";

          let settled = false;
          const close = (value) => {
            if (settled) {
              return;
            }
            settled = true;
            backdrop.remove();
            resolvePromise(value);
          };

          let resolvePromise;
          const resultPromise = new Promise((resolve) => {
            resolvePromise = resolve;
          });

          confirmButton.addEventListener("click", () => close(true));
          cancelButton.addEventListener("click", () => close(false));
          backdrop.addEventListener("click", (event) => {
            if (event.target === backdrop) {
              close(false);
            }
          });

          actions.append(confirmButton, cancelButton);
          panel.append(title, subtitle, body, actions);
          backdrop.append(panel);
          (document.body || document.documentElement).append(backdrop);
          confirmButton.focus();

          return resultPromise;
        },
        args: [message]
      }, (results) => {
        const runtimeError = chrome.runtime?.lastError;
        if (runtimeError) {
          resolve(false);
          return;
        }

        resolve(Boolean(results && results[0] && results[0].result));
      });
    });
  }

  function sendNativeMessage(message) {
    if (!globalThis.chrome?.runtime?.sendNativeMessage) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, message, (response) => {
        resolve(response || null);
      });
    });
  }

  function getDownloadItem(downloadId) {
    if (!globalThis.chrome?.downloads?.search) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      chrome.downloads.search({ id: downloadId }, (items) => {
        resolve((items && items[0]) || null);
      });
    });
  }

  async function finalizeMovedDownload(downloadId, moveResponse, moveRequest, tabId) {
    if (!moveResponse || !moveResponse.ok) {
      return moveResponse || null;
    }

    await eraseDownloadRecord(downloadId);
    const shouldOpen = await promptMoveInTab(tabId, moveResponse.path, moveRequest.targetDir);
    if (shouldOpen) {
      await sendNativeMessage({
        action: "openDirectory",
        targetDir: moveRequest.targetDir
      });
    }

    return moveResponse;
  }

  async function moveCompletedDownload(downloadId) {
    const [downloadItem, subjectMap] = await Promise.all([
      getDownloadItem(downloadId),
      loadSubjectMap()
    ]);
    const moveRequest = buildMoveRequest(downloadItem, subjectMap);

    if (!moveRequest) {
      return null;
    }

    const moveResponse = await sendNativeMessage(moveRequest);
    const pageUrl = await resolveDownloadPageUrl(downloadItem || {});
    const promptTabId = await resolvePromptTabId(downloadItem || {}, pageUrl);
    return finalizeMovedDownload(downloadId, moveResponse, moveRequest, promptTabId);
  }

  function registerDownloadsListener() {
    if (!globalThis.chrome?.downloads?.onDeterminingFilename) {
      return;
    }

    chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
      Promise.all([loadSubjectMap(), resolveDownloadPageUrl(downloadItem)]).then(([subjectMap, pageUrl]) => {
        suggest(buildDownloadSuggestion(downloadItem, subjectMap, pageUrl));
      });

      return true;
    });

    if (globalThis.chrome?.downloads?.onChanged) {
      chrome.downloads.onChanged.addListener((downloadDelta) => {
        if (downloadDelta?.state?.current === "complete" && typeof downloadDelta.id === "number") {
          moveCompletedDownload(downloadDelta.id);
        }
      });
    }

  }

  registerDownloadsListener();

  if (typeof module !== "undefined") {
    module.exports = {
      SUBJECT_MAP_KEY,
      DOWNLOAD_ROOT_FOLDER,
      NATIVE_HOST_NAME,
      normalizeUrlForKey,
      slugify,
      parseSubjectMap,
      sanitizeFolderName,
      getBaseFilename,
      getSuggestionFilename,
      getSourceUrl,
      getActiveTabUrl,
      getDownloadTabUrl,
      resolveDownloadPageUrl,
      buildTabUrlPattern,
      queryTabsByUrl,
      resolvePromptTabId,
      buildSubjectFilename,
      buildDownloadSuggestion,
      getLectureSubjectFolderFromPath,
      findSubjectByFolder,
      buildMoveRequest,
      buildMoveConfirmMessage,
      promptMoveInTab,
      finalizeMovedDownload,
      moveCompletedDownload
    };
  }
})();
