/* Google Apps Script: pegar en Extensiones > Apps Script de tu hoja de cálculo.
   Hoja "Respuestas" con encabezados en la fila 1: Fecha | Nombre | Asistencia */
const HOJA = 'Respuestas';
const HOJA_LISTA = 'Invitados';   // opcional: nombres en la columna A
const VALIDAR_LISTA = false;       // true = solo acepta nombres que estén en la hoja "Invitados"
const MULTI = /(,|;|&|\/|\+|\by\b|\bfamilia\b|\bacompa|\bpareja\b|\bhij[oa]s?\b|\besposa?\b|\bnovi[oa]\b)/i;

const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/\s+/g, ' ').trim();

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter || {};
    const nombre = String(p.nombre || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    const asistencia = p.asistencia === 'si' ? 'Asistirá' : 'No asistirá';
    if (nombre.length < 3 || nombre.split(' ').length < 2 || MULTI.test(nombre))
      return salida({ ok: false, error: 'nombre' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (VALIDAR_LISTA) {
      const l = ss.getSheetByName(HOJA_LISTA);
      const lista = l ? l.getRange(1, 1, Math.max(l.getLastRow(), 1), 1).getValues().flat().map(norm) : [];
      if (!lista.includes(norm(nombre))) return salida({ ok: false, error: 'no_lista' });
    }

    const hoja = ss.getSheetByName(HOJA);
    const last = hoja.getLastRow();
    if (last > 1) {                       // un nombre = una fila: si ya existe, se actualiza
      const nombres = hoja.getRange(2, 2, last - 1, 1).getValues().flat().map(norm);
      const i = nombres.indexOf(norm(nombre));
      if (i >= 0) {
        hoja.getRange(i + 2, 1, 1, 3).setValues([[new Date(), nombre, asistencia]]);
        return salida({ ok: true, actualizado: true });
      }
    }
    hoja.appendRow([new Date(), nombre, asistencia]);
    return salida({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return salida({ ok: true, mensaje: 'activo' }); }

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
