export default function CallButton({ text, onCall }) {
  const callPatient = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID"; 
    speechSynthesis.speak(utterance);
    if (onCall) onCall();
  };

  return (
    <button 
      onClick={callPatient} 
      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Panggil
    </button>
  );
}
