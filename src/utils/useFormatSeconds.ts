function padNumber(number: number) {
  return ("0" + number).slice(-2);
}

/**
 * Converts seconds into minutes and hours.
 * @param seconds The seconds to convert
 * @param long Whether to provide the time in the long format
 */
export default function formatSeconds(
  seconds: number | undefined,
  long?: boolean
) {
  if (seconds === undefined) {
    return "00:00";
  }

  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = Math.floor((seconds % 3600) % 60);

  let _hh = padNumber(hh);
  let _mm = padNumber(mm);
  let _ss = padNumber(ss);

  if (long == true) {
    if (mm < 1 && hh < 1 && ss > 0) {
      return `${_ss} Seconds`;
    }

    _hh = `${hh} hr${hh > 1 ? "s" : ""}`;
    _mm = `${mm} minute${mm > 1 ? "s" : ""}`;

    if (hh > 0) {
      return `${_hh}, ${_mm}`;
    }

    return _mm;
  }

  if (hh > 0) {
    return `${_hh}:${_mm}:${_ss}`;
  }

  return `${_mm}:${_ss}`;
}
