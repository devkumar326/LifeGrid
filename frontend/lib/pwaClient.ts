const offlineEvent = "lifegrid:api-offline";
const onlineEvent = "lifegrid:api-online";

export function signalApiFailure() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(offlineEvent));
}

export function signalApiSuccess() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(onlineEvent));
}

