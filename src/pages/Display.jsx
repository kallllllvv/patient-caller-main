import { useEffect, useState } from "react";

export default function Display() {
  const [queues, setQueues] = useState({
    poli1: "A0",
    poli2: "A0",
    poli3: "B0",
    apotik: "A0",
    kasir: "A0",
  });

  const fetchQueues = () => {
    const saved = localStorage.getItem("queues");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      const safe = {
        poli1: parsed.poli1 ?? "A0",
        poli2: parsed.poli2 ?? "A0",
        poli3: parsed.poli3 ?? "B0",

        apotik: parsed.apotik ?? "A0",
        kasir: parsed.kasir ?? "A0",
      };

      setQueues(safe);
    } catch (e) {
      console.error("Gagal parse queues:", e);
    }
  };

  useEffect(() => {
    fetchQueues();
    window.addEventListener("storage", fetchQueues);
    return () => window.removeEventListener("storage", fetchQueues);
  }, []);

  useEffect(() => {
    const id = setInterval(fetchQueues, 300);
    return () => clearInterval(id);
  }, []);

  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatDateTime = () =>
    dateTime.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const poliNames = {
    poli1: "Poli Umum 1",
    poli2: "Poli Umum 2",
    poli3: "Poli Gigi",
  };

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-green-700 mb-8">
        Nomor Antrian
      </h1>

      {/* POLI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {["poli1", "poli2", "poli3"].map((p) => (
          <div
            key={p}
            className="bg-green-600 text-white rounded-2xl p-6 shadow-xl text-center"
          >
            <h2 className="text-3xl font-bold">{poliNames[p]}</h2>
            <p className="text-8xl font-extrabold mt-4">{queues[p]}</p>
          </div>
        ))}
      </div>

      {/* APOTIK & KASIR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-10">
        {["apotik", "kasir"].map((unit) => (
          <div
            key={unit}
            className="bg-green-500 text-white rounded-2xl p-6 shadow-xl text-center"
          >
            <h2 className="text-3xl font-bold capitalize">{unit}</h2>
            <p className="text-8xl font-extrabold mt-4">{queues[unit]}</p>
          </div>
        ))}
      </div>

      <p className="text-xl text-green-700 font-semibold mt-10">
        {formatDateTime()}
      </p>
    </div>
  );
}
