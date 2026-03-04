export function getTodayJST(): string {
  const now = new Date();
  const jstOffset = 9 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const jst = new Date(utc + jstOffset * 60000);
  return jst.toISOString().split("T")[0];
}
