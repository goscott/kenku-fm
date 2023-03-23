import { contextBridge, ipcRenderer } from "electron";

type Channel =
  | "AUDIO_CAPTURE_START_BROWSER_VIEW_STREAM"
  | "AUDIO_CAPTURE_STOP_BROWSER_VIEW_STREAM"
  | "AUDIO_CAPTURE_BROWSER_VIEW_MUTED"
  | "AUDIO_CAPTURE_SET_LOOPBACK"
  | "AUDIO_CAPTURE_START_EXTERNAL_AUDIO_CAPTURE"
  | "AUDIO_CAPTURE_STOP_EXTERNAL_AUDIO_CAPTURE"
  | "AUDIO_CAPTURE_START";

const validChannels: Channel[] = [
  "AUDIO_CAPTURE_START_BROWSER_VIEW_STREAM",
  "AUDIO_CAPTURE_STOP_BROWSER_VIEW_STREAM",
  "AUDIO_CAPTURE_BROWSER_VIEW_MUTED",
  "AUDIO_CAPTURE_SET_LOOPBACK",
  "AUDIO_CAPTURE_START_EXTERNAL_AUDIO_CAPTURE",
  "AUDIO_CAPTURE_STOP_EXTERNAL_AUDIO_CAPTURE",
  "AUDIO_CAPTURE_START",
];

const api = {
  on: (channel: Channel, callback: (...args: any[]) => any) => {
    if (validChannels.includes(channel)) {
      const newCallback = (_: any, ...args: any[]) => callback(args);
      ipcRenderer.on(channel, newCallback);
    }
  },
  error: (message: string) => {
    ipcRenderer.emit("ERROR", null, message);
  },
  signal: (offer: string): Promise<string> => {
    return ipcRenderer.invoke("AUDIO_CAPTURE_SIGNAL", offer);
  },
  stream: (): Promise<void> => {
    return ipcRenderer.invoke("AUDIO_CAPTURE_STREAM");
  },
};

declare global {
  interface Window {
    capture: typeof api;
  }
}

contextBridge.exposeInMainWorld("capture", api);
