export const FormatDate = (
  date: Date | string | null,
  withTime: boolean = true
): string => {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  // Selalu pakai WIB
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime && {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  };

  // Hasil default Intl misalnya: 25/08/2025 03.08.39
  const parts = new Intl.DateTimeFormat("id-ID", options).formatToParts(d);

  // Ambil tiap komponen
  const get = (type: string) => parts.find(p => p.type === type)?.value || "";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  return withTime
    ? `${year}-${month}-${day}, ${hour}:${minute}:${second}` // YYYY-MM-DD, HH:mm:ss
    : `${year}-${month}-${day}`; // YYYY-MM-DD
};
