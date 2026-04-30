import json
import os
import shutil
import subprocess
import struct
import sys
import traceback


def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        return None
    if len(raw_length) != 4:
        raise ValueError("Invalid native messaging length header")

    message_length = struct.unpack("<I", raw_length)[0]
    message = sys.stdin.buffer.read(message_length)
    if len(message) != message_length:
        raise ValueError("Invalid native messaging payload")

    return json.loads(message.decode("utf-8"))


def send_message(message):
    encoded = json.dumps(message, ensure_ascii=False).encode("utf-8")
    sys.stdout.buffer.write(struct.pack("<I", len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()


def select_directory():
    import tkinter as tk
    from tkinter import filedialog

    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)
    selected_path = filedialog.askdirectory(title="과목 자료를 옮길 폴더를 선택하세요")
    root.destroy()

    if not selected_path:
        return {"ok": False, "cancelled": True}

    return {"ok": True, "path": selected_path}


def uniquify_path(path):
    if not os.path.exists(path):
        return path

    directory, filename = os.path.split(path)
    stem, extension = os.path.splitext(filename)
    counter = 1

    while True:
        candidate = os.path.join(directory, f"{stem} ({counter}){extension}")
        if not os.path.exists(candidate):
            return candidate
        counter += 1


def move_file(source_path, target_dir):
    if not source_path or not target_dir:
        return {"ok": False, "error": "sourcePath and targetDir are required"}

    if not os.path.isfile(source_path):
        return {"ok": False, "error": f"Source file not found: {source_path}"}

    os.makedirs(target_dir, exist_ok=True)
    target_path = uniquify_path(os.path.join(target_dir, os.path.basename(source_path)))
    shutil.move(source_path, target_path)

    return {"ok": True, "path": target_path}


def open_directory(target_dir):
    if not target_dir:
        return {"ok": False, "error": "targetDir is required"}

    if not os.path.isdir(target_dir):
        return {"ok": False, "error": f"Directory not found: {target_dir}"}

    os.startfile(target_dir)
    return {"ok": True}


def handle_message(message):
    action = message.get("action")
    if action == "selectDirectory":
        return select_directory()
    if action == "moveFile":
        return move_file(message.get("sourcePath"), message.get("targetDir"))
    if action == "openDirectory":
        return open_directory(message.get("targetDir"))

    return {"ok": False, "error": f"Unknown action: {action}"}


def main():
    try:
      message = read_message()
      if message is None:
          return
      send_message(handle_message(message))
    except Exception as error:
      print(traceback.format_exc(), file=sys.stderr)
      send_message({"ok": False, "error": str(error)})


if __name__ == "__main__":
    main()
