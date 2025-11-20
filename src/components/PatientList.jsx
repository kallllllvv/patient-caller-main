import CallButton from "./CallButton";

export default function PatientList({ patients, onCall }) {
  return (
    <div className="mt-4">
      {patients.map((p) => (
        <div key={p.id} className="flex items-center justify-between border-b py-2">
          <span>
            {p.id}. {p.name} - Poli {p.poli}
          </span>
          <CallButton 
            text={`Pasien nomor ${p.id}, atas nama ${p.name}, silakan masuk ke poli ${p.poli}`} 
            onCall={() => onCall(p)} 
          />
        </div>
      ))}
    </div>
  );
}
