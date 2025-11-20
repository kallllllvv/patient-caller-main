import { useEffect, useState } from "react";

export default function Display() {
  const [queues, setQueues] = useState({
    poli1: 0,
    poli2: 0,
    poli3: 0,
    apotik: 0,
    kasir: 0,
  });

  useEffect(() => {
    const updateQueues = () => {
      const saved = localStorage.getItem("queues");
      if (saved) setQueues(JSON.parse(saved));
    };

    updateQueues();
    window.addEventListener("storage", updateQueues);
    return () => window.removeEventListener("storage", updateQueues);
  }, []);

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("queues");
      if (saved) setQueues(JSON.parse(saved));
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDateTime = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return dateTime.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col items-center p-4">

      <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-8">
        Nomor Antrian
      </h1>

      {/* === BAGIAN 1 : 3 KOTAK POLI === */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {["poli1", "poli2", "poli3"].map((poli, index) => (
          <div
            key={index}
            className="bg-green-600 text-white rounded-2xl shadow-xl p-6 h-64 
                       flex flex-col justify-center items-center"
          >
            <span className="text-3xl font-bold">
              {poli.replace("poli", "Poli ")}
            </span>
            <span className="text-8xl font-extrabold">
              {queues[poli]}
            </span>
          </div>
        ))}
      </div>

      {/* === BAGIAN 2 : 2 KOTAK APOTIK & KASIR === */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {["apotik", "kasir"].map((unit, index) => (
          <div
            key={index}
            className="bg-green-500 text-white rounded-2xl shadow-xl p-6 h-56
                       flex flex-col justify-center items-center"
          >
            <span className="text-3xl font-bold capitalize">{unit}</span>
            <span className="text-8xl font-extrabold">{queues[unit]}</span>
          </div>
        ))}
      </div>

      {/* === FOOTER JAM === */}
      <p className="text-green-700 text-xl font-semibold mt-10">
        {formatDateTime()}
      </p>
    </div>
  );
}
