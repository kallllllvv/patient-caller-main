// Admin.jsx
import { useState, useEffect, useRef } from "react";

export default function Admin() {
  const [queues, setQueues] = useState({
    poli1: 0,
    poli2: 0,
    poli3: 0,
  });

  const [globalCounter, setGlobalCounter] = useState(0);
  const [gigiCounter, setGigiCounter] = useState(0);

  const [queuesA, setQueuesA] = useState({ apotik: 0, kasir: 0 });
  const [queuesB, setQueuesB] = useState({ apotik: 0, kasir: 0 });

  const [lastApotik, setLastApotik] = useState("A0");
  const [lastKasir, setLastKasir] = useState("A0");

  const [printUmum, setPrintUmum] = useState(0);
  const [printGigi, setPrintGigi] = useState(0);

  const [jenisStruk, setJenisStruk] = useState("umum");
  const voiceRef = useRef(null);

  // ============================
  // SAVE TO LOCALSTORAGE
  // ============================
  const saveToLocalStorage = (q, qA, qB, lastA, lastK) => {
    const stateQ = q ?? queues;
    const stateQA = qA ?? queuesA;
    const stateQB = qB ?? queuesB;
    const stateLastA = lastA ?? lastApotik;
    const stateLastK = lastK ?? lastKasir;

    const finalDisplay = {
      poli1: `A${stateQ.poli1}`,
      poli2: `A${stateQ.poli2}`,
      poli3: `B${stateQ.poli3}`,
      apotik: stateLastA,
      kasir: stateLastK,
    };

    localStorage.setItem("queues", JSON.stringify(finalDisplay));
  };

  // Save first render
  useEffect(() => {
    saveToLocalStorage(queues, queuesA, queuesB, lastApotik, lastKasir);
  }, []);

  // ============================
  // VOICE INITIALIZATION
  // ============================
  useEffect(() => {
    const loadVoices = () => {
      const all = speechSynthesis.getVoices();
      const indo = all.find((v) => v.lang?.startsWith("id"));
      if (indo) voiceRef.current = indo;
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const numberToBahasa = (num) => {
    const satuan = [
      "nol",
      "satu",
      "dua",
      "tiga",
      "empat",
      "lima",
      "enam",
      "tujuh",
      "delapan",
      "sembilan",
      "sepuluh",
      "sebelas",
    ];
    if (num < 12) return satuan[num];
    if (num < 20) return satuan[num - 10] + " belas";
    if (num < 100) {
      const pul = Math.floor(num / 10);
      const sisa = num % 10;
      return satuan[pul] + " puluh" + (sisa ? " " + satuan[sisa] : "");
    }
    return num.toString();
  };

  const speakFormattedNumber = (prefix, number) =>
    `${prefix} ${numberToBahasa(number)}`;

  const poliToBahasa = (key) => {
    switch (key) {
      case "poli1":
        return "Poli Umum 1";
      case "poli2":
        return "Poli Umum 2";
      case "poli3":
        return "Poli Gigi";
      case "apotik":
        return "Apotik";
      case "kasir":
        return "Kasir";
      default:
        return key;
    }
  };

  const announce = (prefix, key, number) => {
    if (number <= 0) return;

    const message = new SpeechSynthesisUtterance(
      `Nomor antrian ${speakFormattedNumber(
        prefix,
        number
      )}, silahkan menuju ke ${poliToBahasa(key)}`
    );

    message.lang = "id-ID";
    if (voiceRef.current) message.voice = voiceRef.current;
    speechSynthesis.cancel();
    speechSynthesis.speak(message);
  };

  // ============================
  // NEXT / PREVIOUS POLI
  // ============================
  const handleNextPoli = (key) => {
    if (key === "poli3") {
      setGigiCounter((prev) => {
        const next = prev + 1;
        setQueues((q) => {
          const updated = { ...q, [key]: next };
          saveToLocalStorage(updated, queuesA, queuesB, lastApotik, lastKasir);
          announce("B", key, next);
          return updated;
        });
        return next;
      });
    } else {
      setGlobalCounter((prev) => {
        const next = prev + 1;
        setQueues((q) => {
          const updated = { ...q, [key]: next };
          saveToLocalStorage(updated, queuesA, queuesB, lastApotik, lastKasir);
          announce("A", key, next);
          return updated;
        });
        return next;
      });
    }
  };

  const handlePrevPoli = (key) => {
    setQueues((q) => {
      const newVal = Math.max(0, q[key] - 1);
      const updated = { ...q, [key]: newVal };
      saveToLocalStorage(updated, queuesA, queuesB, lastApotik, lastKasir);

      if (newVal > 0)
        announce(key === "poli3" ? "B" : "A", key, newVal);

      return updated;
    });
  };

  // ============================
  // APOTIK & KASIR (A/B)
  // ============================
  const handleNextManual = (key, type) => {
    if (type === "A") {
      setQueuesA((prev) => {
        const next = prev[key] + 1;
        const updated = { ...prev, [key]: next };
        const newLast = key === "apotik" ? `${type}${next}` : lastApotik;
        const newLastK = key === "kasir" ? `${type}${next}` : lastKasir;
        setLastApotik(newLast);
        setLastKasir(newLastK);
        saveToLocalStorage(queues, updated, queuesB, newLast, newLastK);
        announce("A", key, next);
        return updated;
      });
    } else {
      setQueuesB((prev) => {
        const next = prev[key] + 1;
        const updated = { ...prev, [key]: next };
        const newLast = key === "apotik" ? `${type}${next}` : lastApotik;
        const newLastK = key === "kasir" ? `${type}${next}` : lastKasir;
        setLastApotik(newLast);
        setLastKasir(newLastK);
        saveToLocalStorage(queues, queuesA, updated, newLast, newLastK);
        announce("B", key, next);
        return updated;
      });
    }
  };

  const handlePrevManual = (key, type) => {
    if (type === "A") {
      setQueuesA((prev) => {
        const next = Math.max(0, prev[key] - 1);
        const updated = { ...prev, [key]: next };
        const newLast = key === "apotik" ? (next > 0 ? `${type}${next}` : "A0") : lastApotik;
        const newLastK = key === "kasir" ? (next > 0 ? `${type}${next}` : "A0") : lastKasir;
        setLastApotik(newLast);
        setLastKasir(newLastK);
        saveToLocalStorage(queues, updated, queuesB, newLast, newLastK);
        if (next > 0) announce("A", key, next);
        return updated;
      });
    } else {
      setQueuesB((prev) => {
        const next = Math.max(0, prev[key] - 1);
        const updated = { ...prev, [key]: next };
        const newLast = key === "apotik" ? (next > 0 ? `${type}${next}` : "A0") : lastApotik;
        const newLastK = key === "kasir" ? (next > 0 ? `${type}${next}` : "A0") : lastKasir;
        setLastApotik(newLast);
        setLastKasir(newLastK);
        saveToLocalStorage(queues, queuesA, updated, newLast, newLastK);
        if (next > 0) announce("B", key, next);
        return updated;
      });
    }
  };

  // ============================
  // CETAK STRUK
  // ============================
  const handlePrint = () => {
    let nomor = jenisStruk === "umum" ? printUmum + 1 : printGigi + 1;
    let prefix = jenisStruk === "umum" ? "A" : "B";

    if (jenisStruk === "umum") setPrintUmum(nomor);
    else setPrintGigi(nomor);

    const waktu = new Date().toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const w = window.open("", "_blank", "width=300,height=500");

    w.document.write(`
      <html>
        <head>
          <title>Struk Antrian</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { width: 80mm; font-family: monospace; text-align: center; margin: 0; padding: 0; }
            .wrap { padding: 8px; }
            .title { font-weight: bold; font-size: 13px; margin: 5px 0; }
            .line { border-top: 1px dashed black; margin: 5px 0; }
            .nomor { font-size: 46px; font-weight: bold; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="line"></div>
            <div class="title">KLINIK PRATAMA AS-SALAM</div>
            <div class="line"></div>

            <div>Nomor Antrian (${jenisStruk === "umum" ? "Poli Umum" : "Poli Gigi"})</div>
            <div class="nomor">${prefix}${nomor}</div>

            <div>Waktu Cetak:</div>
            <div style="font-size: 12px;">${waktu}</div>

            <div class="line"></div>
            Terima Kasih
          </div>

          <script>
            window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `);

    w.document.close();
  };

  // ============================
  // UI
  // ============================
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center py-10">
      <div className="flex items-center gap-3 mb-10">
        <img
          src="/logo.png"
          alt="Logo Klinik"
          style={{ width: "40px", height: "40px" }}
          className="rounded-lg shadow-md object-contain"
        />
        <h1 className="text-4xl font-bold text-green-700 tracking-wide">
          Admin Panel Klinik Pratama As-Salam
        </h1>
      </div>

      {/* === POLI === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-6">
        {[
          { key: "poli1", label: "Poli Umum 1", prefix: "A" },
          { key: "poli2", label: "Poli Umum 2", prefix: "A" },
          { key: "poli3", label: "Poli Gigi", prefix: "B" },
        ].map(({ key, label, prefix }) => (
          <div key={key} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-700">{label}</h2>
            <p className="text-7xl font-extrabold text-green-600 my-4 font-mono">
              {prefix}
              {queues[key]}
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handlePrevPoli(key)}
                className="px-5 py-2 bg-gray-200 rounded-lg"
              >
                ⬅️ Previous
              </button>
              <button
                onClick={() => handleNextPoli(key)}
                className="px-5 py-2 bg-green-500 text-white rounded-lg"
              >
                Next ➡️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* === APOTIK & KASIR === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-5xl px-6">
        {[
          { key: "apotik", label: "Apotik" },
          { key: "kasir", label: "Kasir" },
        ].map(({ key, label }) => (
          <div key={key} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-700">{label}</h2>

            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Poli Umum A */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-semibold text-green-700">Poli Umum</p>
                <p className="text-6xl font-extrabold text-green-600 font-mono">
                  {queuesA[key] > 0 ? `A${queuesA[key]}` : "A0"}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handlePrevManual(key, "A")}
                    className="px-5 py-2 bg-gray-200 rounded-lg"
                  >
                    ⬅️ Previous
                  </button>
                  <button
                    onClick={() => handleNextManual(key, "A")}
                    className="px-5 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Next ➡️
                  </button>
                </div>
              </div>

              {/* Poli Gigi B */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-semibold text-green-700">Poli Gigi</p>
                <p className="text-6xl font-extrabold text-green-600 font-mono">
                  {queuesB[key] > 0 ? `B${queuesB[key]}` : "B0"}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handlePrevManual(key, "B")}
                    className="px-5 py-2 bg-gray-200 rounded-lg"
                  >
                    ⬅️ Previous
                  </button>
                  <button
                    onClick={() => handleNextManual(key, "B")}
                    className="px-5 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Next ➡️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === CETAK STRUK === */}
      <div className="bg-white border border-green-300 rounded-2xl shadow-lg p-8 mt-12 w-full max-w-4xl text-center">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          🖨️ Cetak Struk Antrian
        </h2>

        <select
          className="border rounded-lg px-4 py-2 mb-4"
          value={jenisStruk}
          onChange={(e) => setJenisStruk(e.target.value)}
        >
          <option value="umum">Poli Umum (A)</option>
          <option value="gigi">Poli Gigi (B)</option>
        </select>

        <button
          onClick={handlePrint}
          className="px-10 py-4 bg-green-600 text-white rounded-xl text-lg font-semibold"
        >
          Cetak Struk
        </button>

        <p className="mt-4 text-gray-600">
          Nomor berikutnya:{" "}
          <b>{jenisStruk === "umum" ? printUmum + 1 : printGigi + 1}</b>
        </p>
      </div>
    </div>
  );
}