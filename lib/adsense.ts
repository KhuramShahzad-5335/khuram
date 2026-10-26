/** Public account identifier only. Verification does not enable ad serving. */
export function adsensePublisherId(value = process.env.ADSENSE_PUBLISHER_ID) {
  const normalized = value?.trim().replace(/^ca-/, "");
  return normalized && /^pub-\d{16}$/.test(normalized) ? normalized : null;
}
