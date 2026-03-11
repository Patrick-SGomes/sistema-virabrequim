// ═══════════════════════════════════════════════════════════════
//  CrankCat Pro — Google Apps Script (API REST para Sheets)
//  Cole este código em: script.google.com → Novo projeto
//  Depois: Implantar → Nova implantação → App da Web
//         Executar como: EU  |  Quem tem acesso: QUALQUER PESSOA
// ═══════════════════════════════════════════════════════════════

const SHEET_NAME = "eixos";

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Cabeçalho
    const headers = [
      "id","tipo","tipo_eixo","marca","modelo","motor","ano","codigo","cilindros",
      "mancal_orig","mancal_qt","mancal_025","mancal_050","mancal_075","mancal_100",
      "biela_orig","biela_qt","biela_025","biela_050","biela_075","biela_100",
      "material","tratamento","comprimento","curso","obs","updated_at"
    ];
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    // Formatação do cabeçalho
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#1a1a1a")
      .setFontColor("#d4a843")
      .setFontWeight("bold");
    sheet.setColumnWidth(1, 220); // id
  }
  return sheet;
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function rowToObj(headers, row) {
  const obj = {};
  headers.forEach((h, i) => { obj[h] = row[i] ?? ""; });
  return obj;
}

function objToRow(headers, obj) {
  return headers.map(h => obj[h] ?? "");
}

// ─── CORS helper ───
function cors(output) {
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── GET ───  ?action=getAll | ?action=get&id=xxx
function doGet(e) {
  try {
    const action = e.parameter.action || "getAll";
    const sheet  = getSheet();
    const headers = getHeaders(sheet);
    const lastRow = sheet.getLastRow();

    if (action === "getAll") {
      if (lastRow < 2) return cors({ ok: true, data: [] });
      const rows = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
      const data = rows
        .map(r => rowToObj(headers, r))
        .filter(o => o.id && o.id !== "");
      return cors({ ok: true, data });
    }

    if (action === "get") {
      const id = e.parameter.id;
      if (!id) return cors({ ok: false, error: "id required" });
      if (lastRow < 2) return cors({ ok: false, error: "not found" });
      const rows = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
      const row  = rows.find(r => r[0] === id);
      if (!row)  return cors({ ok: false, error: "not found" });
      return cors({ ok: true, data: rowToObj(headers, row) });
    }

    return cors({ ok: false, error: "unknown action" });
  } catch(err) {
    return cors({ ok: false, error: err.message });
  }
}

// ─── POST ───  body: { action, ...data }
function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const action = body.action;
    const sheet  = getSheet();
    const headers = getHeaders(sheet);
    const lastRow = sheet.getLastRow();

    // ── INSERT ──
    if (action === "insert") {
      const entry = body.data;
      if (!entry.id) entry.id = Utilities.getUuid();
      entry.updated_at = new Date().toISOString();
      sheet.appendRow(objToRow(headers, entry));
      return cors({ ok: true, id: entry.id });
    }

    // ── UPDATE ──
    if (action === "update") {
      const entry = body.data;
      if (!entry.id) return cors({ ok: false, error: "id required" });
      if (lastRow < 2) return cors({ ok: false, error: "not found" });
      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
      const idx = ids.indexOf(entry.id);
      if (idx === -1) return cors({ ok: false, error: "not found" });
      entry.updated_at = new Date().toISOString();
      sheet.getRange(idx + 2, 1, 1, headers.length).setValues([objToRow(headers, entry)]);
      return cors({ ok: true });
    }

    // ── DELETE ──
    if (action === "delete") {
      const id = body.id;
      if (!id) return cors({ ok: false, error: "id required" });
      if (lastRow < 2) return cors({ ok: false, error: "not found" });
      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
      const idx = ids.indexOf(id);
      if (idx === -1) return cors({ ok: false, error: "not found" });
      sheet.deleteRow(idx + 2);
      return cors({ ok: true });
    }

    // ── BATCH INSERT (importação) ──
    if (action === "batchInsert") {
      const entries = body.data;
      if (!Array.isArray(entries)) return cors({ ok: false, error: "data must be array" });
      // Remove existentes pelo id para evitar duplicata
      if (lastRow >= 2) {
        const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
        for (let i = ids.length - 1; i >= 0; i--) {
          if (entries.find(e => e.id === ids[i])) {
            sheet.deleteRow(i + 2);
          }
        }
      }
      entries.forEach(entry => {
        if (!entry.id) entry.id = Utilities.getUuid();
        entry.updated_at = entry.updated_at || new Date().toISOString();
        sheet.appendRow(objToRow(headers, entry));
      });
      return cors({ ok: true, count: entries.length });
    }

    return cors({ ok: false, error: "unknown action" });
  } catch(err) {
    return cors({ ok: false, error: err.message });
  }
}
