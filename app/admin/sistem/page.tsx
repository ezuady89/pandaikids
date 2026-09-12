import { Badge, Empty, fmtDate, KpiGrid, PageHeader, Panel, TableWrap } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { getSystem } from "@/lib/admin-data";
import styles from "../admin.module.css";

const feedbackLabels: Record<string, string> = {
  CADANGAN: "Cadangan",
  MASALAH: "Masalah",
  PAPARAN: "Paparan",
  PENGALAMAN: "Pengalaman pertama",
  LAIN_LAIN: "Lain-lain",
};

const helpfulLabels: Record<string, string> = {
  AI: "AI jana soalan",
  KUIZ_SIAP: "Kuiz siap",
  REKOD_MURID: "Rekod murid",
};

export default async function SystemPage() {
  await requireAdmin("/admin/sistem");
  const d = await getSystem();

  return (
    <>
      <PageHeader
        eyebrow="Kesihatan & tadbir urus"
        title="Sistem"
        description="Status sambungan dan maklum balas guru dalam satu tempat."
      />
      <KpiGrid
        items={[
          { label: "Database", value: d.config.database ? "Berhubung" : "Tiada" },
          { label: "Respons DB", value: `${d.databaseMs} ms` },
          { label: "Cadangan guru", value: d.feedback.length },
          { label: "Callback berjaya", value: d.callback.success },
          { label: "Callback gagal", value: d.callback.failed },
          { label: "Versi deployment", value: d.version },
        ]}
      />

      <Panel
        title="Cadangan & Aduan Guru"
        description="50 kiriman terbaru, bersama halaman tempat guru menghantarnya."
      >
        {d.feedback.length ? (
          <TableWrap>
            <table>
              <thead>
                <tr>
                  <th>Masa</th>
                  <th>Jenis</th>
                  <th>Guru</th>
                  <th>Penilaian</th>
                  <th>Paling membantu</th>
                  <th>Maklum balas</th>
                  <th>Halaman</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {d.feedback.map((item) => (
                  <tr key={item.id}>
                    <td>{fmtDate(item.created_at)}</td>
                    <td>{feedbackLabels[item.category] ?? "Lain-lain"}</td>
                    <td>
                      {item.name ?? "Guru"}
                      <br />
                      <small>{item.email ?? "—"}</small>
                    </td>
                    <td>{item.rating ? `${item.rating}/5 ★` : "—"}</td>
                    <td>{helpfulLabels[item.helpful] ?? "—"}</td>
                    <td>{item.message}</td>
                    <td><small>{item.route}</small></td>
                    <td><Badge value={item.status === "NEW" ? "Baharu" : item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty text="Belum ada cadangan atau aduan daripada guru." />
        )}
      </Panel>

      <Panel title="Konfigurasi server">
        <div className={styles.configGrid}>
          {Object.entries({
            "Database URL": d.config.database,
            "ToyyibPay Secret Key": d.config.toyyibpaySecret,
            "ToyyibPay Category Code": d.config.toyyibpayCategory,
            "App URL": d.config.appUrl,
            "Session Secret": d.config.sessionSecret,
            "Admin allowlist": d.config.adminAllowlist,
          }).map(([label, ok]) => (
            <div key={label}>
              <b>{label}</b>
              <Badge value={ok ? "Dikonfigurasi" : "Tiada"} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Callback & API event terkini" description="Payload sensitif tidak disimpan.">
        {d.events.length ? (
          <TableWrap>
            <table>
              <thead>
                <tr>
                  <th>Masa</th>
                  <th>Jenis</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Pengguna</th>
                  <th>Mesej selamat</th>
                </tr>
              </thead>
              <tbody>
                {d.events.map((item) => (
                  <tr key={item.id}>
                    <td>{fmtDate(item.created_at)}</td>
                    <td>{item.event_type}</td>
                    <td>{item.route}</td>
                    <td><Badge value={item.status} /></td>
                    <td>{item.name ?? "—"}</td>
                    <td>{item.message ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty text="Belum ada event sejak pemantauan diaktifkan." />
        )}
      </Panel>

      <Panel title="Audit tindakan Admin" description="Rekod ini baca sahaja dalam UI.">
        {d.audits.length ? (
          <TableWrap>
            <table>
              <thead>
                <tr>
                  <th>Masa</th>
                  <th>Admin</th>
                  <th>Tindakan</th>
                  <th>Sasaran</th>
                  <th>Sebab</th>
                  <th>Sebelum</th>
                  <th>Selepas</th>
                  <th>Hasil</th>
                </tr>
              </thead>
              <tbody>
                {d.audits.map((item) => (
                  <tr key={item.id}>
                    <td>{fmtDate(item.created_at)}</td>
                    <td>{item.admin_email}</td>
                    <td>{item.action}</td>
                    <td>{item.target_type}: {item.target_id}</td>
                    <td>{item.reason}</td>
                    <td><small>{JSON.stringify(item.before_value)?.slice(0, 140)}</small></td>
                    <td><small>{JSON.stringify(item.after_value)?.slice(0, 140)}</small></td>
                    <td><Badge value={item.result} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty text="Belum ada tindakan manual admin." />
        )}
      </Panel>
    </>
  );
}
