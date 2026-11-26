"use client";

export default function TombolCetak() {
  return (
    <button type="button" className="btn btn-sekunder" onClick={() => window.print()}>
      Cetak / Simpan PDF
    </button>
  );
}
