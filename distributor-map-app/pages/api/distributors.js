export default async function handler(req, res) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const range = process.env.GOOGLE_SHEETS_RANGE || "Sheet1!A1:Z1000";

    if (!spreadsheetId || !apiKey) {
      res.status(500).json({
        error:
          "Missing GOOGLE_SHEETS_SPREADSHEET_ID or GOOGLE_SHEETS_API_KEY in environment.",
      });
      return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      res
        .status(response.status)
        .json({ error: `Sheets API error: ${text || response.statusText}` });
      return;
    }

    const data = await response.json();
    const values = Array.isArray(data.values) ? data.values : [];
    if (values.length === 0) {
      res.status(200).json([]);
      return;
    }

    const [headerRow, ...rows] = values;
    const headers = headerRow.map((h) => String(h || "").trim().toLowerCase());

    const normalized = rows
      .map((row) => {
        const record = {};
        headers.forEach((key, index) => {
          record[key] = row[index] ?? "";
        });

        const latitude = parseFloat(record.latitude);
        const longitude = parseFloat(record.longitude);

        return {
          latitude,
          longitude,
          company_name: record.company_name || record.company || record.name || "",
          greeting_message: record.greeting_message || record.message || "",
          logo_url: record.logo_url || record.logo || "",
          continent: String(record.continent || "").toLowerCase(),
        };
      })
      .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json(normalized);
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}


