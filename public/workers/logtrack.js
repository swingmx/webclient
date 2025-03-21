onmessage = (e) => {
  const { trackhash, duration, source, timestamp } = e.data;

  const is_dev = location.port === "5173";
  const protocol = location.protocol.replace(':', '');
  const base_url = is_dev ? `${protocol}://${location.hostname}:1980` : location.origin;
  const url = base_url + "/logger/track/log";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trackhash, duration, source, timestamp }),
    credentials: "include"
  });
};
