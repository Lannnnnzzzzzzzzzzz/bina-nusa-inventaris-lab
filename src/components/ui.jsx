export function Badge({ tone = "abu", children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function PageHead({ judul, sub, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{judul}</h1>
        {sub ? <p>{sub}</p> : null}
      </div>
      {children ? <div className="page-head-aksi">{children}</div> : null}
    </div>
  );
}

export function StatCard({ angka, label, terisi = false, ikon }) {
  return (
    <div className={`stat-card${terisi ? " stat-card-isi" : ""}`}>
      <div className="stat-angka">{angka}</div>
      <div className="stat-label">{label}</div>
      {ikon ? <div className="stat-ikon">{ikon}</div> : null}
    </div>
  );
}

export function EmptyState({ ikon, judul, teks, children }) {
  return (
    <div className="empty">
      {ikon ? <div className="empty-ikon">{ikon}</div> : null}
      <h3>{judul}</h3>
      {teks ? <p>{teks}</p> : null}
      {children}
    </div>
  );
}

export function Avatar({ user, size = 38 }) {
  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.nama}
        className="avatar-img"
        style={{ width: size, height: size }}
      />
    );
  }
  const inisial = (user?.nama || "?")
    .split(" ")
    .slice(0, 2)
    .map((k) => k[0])
    .join("")
    .toUpperCase();
  return (
    <span className="avatar-inisial" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {inisial}
    </span>
  );
}
