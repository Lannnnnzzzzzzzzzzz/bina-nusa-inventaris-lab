"use client";

import { useRef, useState } from "react";
import { IconKamera } from "../icons";

export default function FotoUpload({ name = "foto", label = "Foto", awal = null, wajib = false }) {
  const [preview, setPreview] = useState(awal);
  const [namaFile, setNamaFile] = useState("");
  const inputRef = useRef(null);

  function pilih(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setNamaFile(f.name);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  return (
    <div className="field field-penuh">
      <label htmlFor={`up-${name}`}>
        {label}
        {wajib ? " *" : ""}
      </label>
      <div className="upload-box" onClick={() => inputRef.current?.click()}>
        {preview ? (
          <img src={preview} alt="Pratinjau foto" className="upload-preview" />
        ) : (
          <span className="upload-ikon">
            <IconKamera size={22} />
          </span>
        )}
        <span className="upload-teks">
          <strong>{namaFile || (awal ? "Ganti foto" : "Pilih foto")}</strong>
          <small>JPG, PNG, atau WebP. Maksimal 5 MB.</small>
        </span>
      </div>
      <input
        ref={inputRef}
        id={`up-${name}`}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={pilih}
      />
    </div>
  );
}
