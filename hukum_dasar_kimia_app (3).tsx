import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, FlaskConical, PenTool, MessageSquare, 
  CheckCircle, XCircle, Beaker, BrainCircuit,
  ArrowRight, RefreshCcw, Trophy, ArrowRightCircle,
  Lightbulb, Play, RotateCcw, Calculator, Settings2,
  Scale, TestTube2, Wind
} from 'lucide-react';

/* =====================================================================
   HELPER FORMATTER & UTILS
======================================================================== */
const formatSenyawa = (text) => {
  if (!text) return '';
  const parts = text.split(/(\d+)/);
  return parts.map((part, i) => 
    /^\d+$/.test(part) ? <sub key={i}>{part}</sub> : part
  );
};

const gcd = (a, b) => (!b ? a : gcd(b, a % b));

/* =====================================================================
   DATA CENTER: MATERI & KUIS 
======================================================================== */
const PENGANTAR_MATERI = {
  judul: "HUKUM DASAR KIMIA",
  pengertian: "Hukum dasar kimia adalah pilar atau aturan alam yang mendasari perhitungan kimia. Tanpa hukum ini, kita tidak bisa memprediksi jumlah reaktan yang dibutuhkan atau produk yang dihasilkan dalam sebuah reaksi.",
  manfaat: "Mempelajari hukum dasar kimia sangat penting agar kita dapat menghitung jumlah zat yang bereaksi secara presisi, menentukan rumus kimia suatu senyawa, mengoptimalkan hasil produksi industri kimia tanpa bahan baku yang terbuang sia-sia, serta memahami keteraturan reaksi zat di alam semesta."
};

const MATERI_KIMIA = [
  {
    id: 'lavoisier',
    nama: "Hukum Kekekalan Massa",
    tokoh: "Antoine Lavoisier",
    tahun: "1789",
    bunyi: "Massa total zat-zat sebelum reaksi akan selalu sama dengan massa total zat-zat hasil reaksi.",
    inti: "Massa tidak berubah.",
    contoh_simpel: "Kayu dibakar → jadi abu + asap. Massa sebelum dibakar = massa setelah dibakar (termasuk gas).",
    rumus: <>Persamaan Reaksi: <br/><span className="text-xl font-bold">A + B &rarr; C + D</span></>,
    contoh_soal: "Jika 4 gram Karbon dibakar sempurna dengan 32 gram Oksigen, berapa Karbon Dioksida yang dihasilkan?",
    pembahasan: "Massa Reaktan = Massa Produk. Maka: 4g + 32g = 36 gram CO₂.",
    penerapan: "Perancangan reaktor kimia industri agar efisiensi bahan baku terukur dan tidak ada massa yang hilang tanpa jejak.",
    mnemonic: { judul: "La-Ma", isi: "Lavoisier - Massa tetap. Sebelum dan sesudah reaksi massa selalu sama!" }
  },
  {
    id: 'proust',
    nama: "Hukum Perbandingan Tetap",
    tokoh: "Joseph Louis Proust",
    tahun: "1799",
    bunyi: "Perbandingan massa unsur-unsur dalam satu senyawa adalah tertentu dan tetap.",
    inti: "Perbandingan unsur selalu tetap.",
    contoh_simpel: "Air (H₂O) → H : O = 1 : 8 (selalu sama rasionya, mau sedikit atau banyak).",
    rumus: <>Perbandingan massa unsur penyusun senyawa konstan.</>,
    contoh_soal: "Perbandingan massa H dan O dalam air (H₂O) selalu 1 : 8. Jika direaksikan 2 gram Hidrogen, berapa Oksigen yang dibutuhkan?",
    pembahasan: "Karena rasio H:O = 1:8, jika H = 2 gram (dikali 2), maka Oksigen yang dibutuhkan adalah 8 × 2 = 16 gram.",
    penerapan: "Analisis kemurnian sampel air (H₂O) dari berbagai sumber; sungai, laut, maupun air suling memiliki perbandingan yang sama.",
    mnemonic: { judul: "Pro-Tep", isi: "Proust - Tetap Perbandingannya. Rasio resep senyawa mau di manapun akan 'Tep' (Tetap)!" }
  },
  {
    id: 'dalton',
    nama: "Hukum Perbandingan Berganda",
    tokoh: "John Dalton",
    tahun: "1803",
    bunyi: "Bila dua unsur dapat membentuk lebih dari satu senyawa, dan jika massa salah satu unsur dibuat tetap (sama), maka perbandingan massa unsur yang lain dalam senyawa-senyawa tersebut merupakan bilangan bulat dan sederhana.",
    inti: "Perbandingan unsur menjadi bilangan bulat sederhana.",
    contoh_simpel: "CO → O = 16, CO₂ → O = 32. Rasionya 16 : 32 = 1 : 2.",
    rumus: <>Massa Unsur B (Senyawa 1) : Massa Unsur B (Senyawa 2) = Bil. Bulat</>,
    contoh_soal: "N dan O membentuk NO dan NO₂. Jika N dibuat tetap 14g, massa O pada NO adalah 16g dan pada NO₂ adalah 32g. Bagaimana rasionya?",
    pembahasan: "Rasio Oksigen (NO : NO₂) adalah 16 : 32. Jika disederhanakan menjadi 1 : 2 (Bulat dan sederhana).",
    penerapan: "Sintesis bahan kimia kompleks dengan berbagai tingkat oksidasi unsur tertentu (seperti pembentukan NOx pada polusi kendaraan).",
    mnemonic: { judul: "Dal-Gan", isi: "Dalton - Berganda. Jika unsur 1 tetap massanya, unsur pasangannya punya perbandingan ganda yang bulat!" },
    isDalton: true
  },
  {
    id: 'gaylussac',
    nama: "Hukum Perbandingan Volume",
    tokoh: "Joseph Louis Gay-Lussac",
    tahun: "1808",
    bunyi: "Volume gas-gas yang bereaksi dan volume gas-gas hasil reaksi bila diukur pada suhu dan tekanan yang sama, berbanding sebagai bilangan bulat dan sederhana.",
    inti: "Perbandingan volume gas sederhana.",
    contoh_simpel: "2L H₂ + 1L O₂ → 2L H₂O. Perbandingan = 2 : 1 : 2.",
    rumus: (
      <div className="text-left max-w-md mx-auto space-y-3 p-2 font-sans">
        <div className="text-center font-mono font-bold text-base md:text-lg text-[#4A3018] bg-[#FAF6F0] py-2 px-4 rounded-lg shadow-inner mb-2">
          V<sub>1</sub> / koef<sub>1</sub> = V<sub>2</sub> / koef<sub>2</sub>
          <span className="block text-xs text-stone-500 font-normal my-1">atau</span>
          V<sub>2</sub> = ( koef<sub>2</sub> / koef<sub>1</sub> ) &times; V<sub>1</sub>
        </div>
        <div className="text-xs text-stone-600 border-t border-stone-200 pt-3">
          <span className="font-bold text-[#8B5A2B] block mb-1">Keterangan Simbol:</span>
          <ul className="list-disc pl-4 space-y-1">
            <li><b>V<sub>1</sub></b> = Volume gas mula-mula (diketahui)</li>
            <li><b>V<sub>2</sub></b> = Volume gas akhir (ditanyakan)</li>
            <li><b>koef<sub>1</sub></b> = Koefisien reaksi zat mula-mula (diketahui)</li>
            <li><b>koef<sub>2</sub></b> = Koefisien reaksi zat akhir (ditanyakan)</li>
          </ul>
          <p className="mt-3 text-[11px] bg-amber-50 p-2 rounded border border-amber-200 text-amber-900 leading-normal font-sans">
            <b>Kesimpulan:</b> Pada suhu dan tekanan tetap, volume gas-gas yang bereaksi dan hasil reaksi berbanding lurus dengan koefisien reaksinya masing-masing.
          </p>
        </div>
      </div>
    ),
    contoh_soal: "Reaksi: N₂ + 3H₂ → 2NH₃. Jika volume N₂ adalah 5 Liter, berapa volume NH₃?",
    pembahasan: "Koefisien NH₃ (ditanya/x) = 2. Koefisien N₂ (diketahui/y) = 1. Volume NH₃ = (2 / 1) × 5 L = 10 Liter.",
    penerapan: "Desain ruang bakar pada silinder mesin kendaraan untuk memastikan campuran udara (oksigen) dan bahan bakar gas tepat secara volume.",
    mnemonic: { judul: "Gay-Vol", isi: "Gay-Lussac - Volume bulat. Kalau gas-gasan, Volume berbanding lurus dengan Koefisien Reaksi!" }
  },
  {
    id: 'avogadro',
    nama: "Hukum Avogadro",
    tokoh: "Amedeo Avogadro",
    tahun: "1811",
    bunyi: "Pada suhu dan tekanan yang sama, semua gas yang volumenya sama akan mengandung jumlah molekul yang sama pula.",
    inti: "Volume gas sebanding dengan jumlah molekul (atau mol) gas.",
    contoh_simpel: "1 Liter gas = N molekul, maka 2 Liter gas = 2N molekul (jika suhu & tekanan sama).",
    rumus: (
      <div className="text-left max-w-md mx-auto space-y-3 p-2 font-sans">
        <div className="text-center font-mono font-bold text-base md:text-lg text-[#4A3018] bg-[#FAF6F0] py-2 px-4 rounded-lg shadow-inner mb-2">
          V<sub>1</sub> / n<sub>1</sub> = V<sub>2</sub> / n<sub>2</sub>
          <span className="block text-xs text-stone-500 font-normal my-1">atau</span>
          V<sub>2</sub> = ( n<sub>2</sub> / n<sub>1</sub> ) &times; V<sub>1</sub>
        </div>
        <div className="text-xs text-stone-600 border-t border-stone-200 pt-3">
          <span className="font-bold text-[#8B5A2B] block mb-1">Keterangan Simbol:</span>
          <ul className="list-disc pl-4 space-y-1">
            <li><b>V<sub>1</sub></b> = Volume gas mula-mula</li>
            <li><b>V<sub>2</sub></b> = Volume gas akhir</li>
            <li><b>n<sub>1</sub></b> = Jumlah mol gas mula-mula</li>
            <li><b>n<sub>2</sub></b> = Jumlah mol gas akhir</li>
          </ul>
          <p className="mt-3 text-[11px] bg-amber-50 p-2 rounded border border-amber-200 text-amber-900 leading-normal font-sans">
            <b>Kesimpulan:</b> Pada suhu dan tekanan tetap, volume gas berbanding lurus dengan jumlah mol gas. Semakin besar jumlah mol, semakin besar pula volumenya.
          </p>
        </div>
      </div>
    ),
    contoh_soal: "Pada suhu dan tekanan sama, jika 1 Liter gas H₂ memiliki 0.1 mol, berapa volume gas H₂ jika molnya ditambah menjadi 0.2 mol?",
    pembahasan: "V₂ = (n₂ / n₁) × V₁ = (0.2 / 0.1) × 1 Liter = 2 Liter.",
    penerapan: "Balon gas yang mengembang seiring bertambahnya partikel gas di dalamnya.",
    mnemonic: { judul: "Avo-Mo", isi: "Avogadro - Molekul & Mol. Volume sebanding lurus dengan mol zat!" }
  }
];

const BANK_SOAL_FLIP = [
  { id: 1, pertanyaan: "Hukum dasar kimia yang menyatakan bahwa massa zat sebelum dan sesudah reaksi dalam wadah tertutup adalah konstan dikemukakan oleh siapa?", jawaban: "Antoine Lavoisier (Hukum Kekekalan Massa, 1789).", pembahasan: "Lavoisier mereaksikan berbagai zat di wadah terisolasi dan membuktikan tidak ada pengurangan atau penambahan massa total selama reaksi." },
  { id: 2, pertanyaan: "Jika 12 gram karbon bereaksi secara sempurna dengan 32 gram oksigen, berapa gram senyawa karbon dioksida yang akan terbentuk?", jawaban: "44 gram senyawa karbon dioksida (CO₂).", pembahasan: "Menggunakan Hukum Lavoisier: Massa produk = Massa zat penyeimbang = 12 gram C + 32 gram O₂ = 44 gram CO₂." },
  { id: 3, pertanyaan: "Perbandingan massa hidrogen terhadap oksigen pada molekul H₂O selalu tetap sebesar 1 : 8. Jika direaksikan 3 gram Hidrogen dengan 30 gram Oksigen, tentukan massa air yang terbentuk dan zat sisa!", jawaban: "Terbentuk 27 gram H₂O dan menyisakan 6 gram Oksigen.", pembahasan: "H : O = 1 : 8. Untuk 3 gram H diperlukan 3 × 8 = 24 gram O. Karena tersedia 30 gram O, sisa O = 30 - 24 = 6 gram. Massa air = 3g + 24g = 27g." },
  { id: 4, pertanyaan: "Hukum Perbandingan Berganda (Hukum Dalton) berlaku apabila dua unsur membentuk lebih dari satu senyawa. Apa syarat utama perbandingannya?", jawaban: "Massa salah satu unsur dibuat tetap (sama), sehingga perbandingan unsur pasangannya merupakan bilangan bulat sederhana.", pembahasan: "Misal pada senyawa CO dan CO₂, jika massa C dibuat tetap (12g), maka rasio massa O adalah 16 : 32 = 1 : 2." },
  { id: 5, pertanyaan: "Pada reaksi pembentukan gas belerang trioksida: 2SO₂(g) + O₂(g) → 2SO₃(g). Jika volume SO₂ yang bereaksi adalah 12 Liter, berapa volume O₂ yang diperlukan?", jawaban: "6 Liter gas Oksigen.", pembahasan: "Menurut Hukum Gay-Lussac, perbandingan volume sebanding dengan koefisien: V(O₂) = (Koef O₂ / Koef SO₂) × V(SO₂) = (1/2) × 12 L = 6 Liter." },
  { id: 6, pertanyaan: "Bila diukur pada suhu dan tekanan yang sama, gas Nitrogen bervolume 5 Liter memiliki 0.2 mol. Berapa jumlah mol untuk 15 Liter gas Oksigen?", jawaban: "0.6 mol gas Oksigen.", pembahasan: "Hukum Avogadro: V₁/n₁ = V₂/n₂. Maka n₂ = (V₂ × n₁) / V₁ = (15 × 0.2) / 5 = 0.6 mol." },
  { id: 7, pertanyaan: "Siapa ilmuwan yang mengemukakan hukum yang menyatakan bahwa volume gas-gas yang bereaksi berbanding lurus sebagai bilangan bulat sederhana?", jawaban: "Joseph Louis Gay-Lussac (1808).", pembahasan: "Hukum ini berlaku khusus untuk reaksi-reaksi yang melibatkan fase gas pada temperatur dan tekanan (P, T) yang sama." },
  { id: 8, pertanyaan: "Mengapa pembakaran lilin di ruang terbuka membuat massanya berkurang? Apakah ini melanggar Hukum Lavoisier?", jawaban: "Tidak melanggar Hukum Lavoisier.", pembahasan: "Berkurang karena produk reaksi lilin (gas CO₂ dan uap air H₂O) terlepas bebas ke udara bebas. Lilin jika dibakar pada tabung kedap akan menunjukkan massa konstan." },
  { id: 9, pertanyaan: "Dua sampel air diambil dari sumber berbeda: air sumur di Indonesia dan es kutub utara. Mengapa rasio atom hidrogen ke oksigennya tetap 1 : 8?", jawaban: "Karena berlakunya Hukum Perbandingan Tetap (Hukum Proust).", pembahasan: "Asal usul pembuatan suatu senyawa murni tidak akan mengubah perbandingan komposisi massa unsur-unsur penyusun senyawa tersebut." },
  { id: 10, pertanyaan: "Gas nitrogen monoksida (NO) dan nitrogen dioksida (NO₂) mematuhi Hukum Dalton. Jika massa N disamakan, tentukan perbandingan massa Oksigennya!", jawaban: "Rasio Oksigen pada NO : NO₂ adalah 1 : 2.", pembahasan: "Massa N pada NO (14) dan NO₂ (14) sudah sama. Massa O pada NO = 16g, pada NO₂ = 32g. Rasionya 16 : 32 = 1 : 2 (bulat & sederhana)." }
];

/* =====================================================================
   KOMPONEN UTAMA (APP)
======================================================================== */
export default function App() {
  const [activeTab, setActiveTab] = useState('materi');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3018] font-sans flex flex-col overflow-x-hidden">
      
      {/* CSS Injector for Smooth Flip Cards & Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes float-bubble {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-40px) translateX(10px); opacity: 0.8; }
          100% { transform: translateY(-80px) translateX(-5px); opacity: 0; }
        }
        .animate-bubble {
          animation: float-bubble 3s infinite ease-in-out;
        }
      `}} />

      {/* HORIZONTAL NAVIGATION BAR */}
      <header className="w-full bg-[#4A3018] text-[#F5E6D3] shadow-lg z-20 sticky top-0 flex flex-col sm:flex-row items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="bg-[#D9A05B] p-2 rounded-lg text-[#4A3018]">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase leading-none">ChemSpace</h1>
            <p className="text-xs text-[#D9A05B] font-semibold">Premium Chemistry Lab</p>
          </div>
        </div>
        
        {/* Horizontal Nav Links */}
        <nav className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          <NavButton active={activeTab === 'materi'} onClick={() => setActiveTab('materi')} icon={<BookOpen size={18}/>} label="Rangkuman Materi" />
          <NavButton active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} icon={<Beaker size={18}/>} label="Virtual Lab" />
          <NavButton active={activeTab === 'kuis'} onClick={() => setActiveTab('kuis')} icon={<PenTool size={18}/>} label="Kuis Flip" />
          <NavButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={<MessageSquare size={18}/>} label="AI Tutor" />
        </nav>
      </header>

      <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto h-full z-10 w-full max-w-6xl mx-auto">
        {activeTab === 'materi' && <MateriView />}
        {activeTab === 'lab' && <VirtualLabView />}
        {activeTab === 'kuis' && <KuisView />}
        {activeTab === 'ai' && <AITutorView />}
      </main>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all whitespace-nowrap text-xs sm:text-sm font-semibold
      ${active ? 'bg-[#F5E6D3] text-[#4A3018] shadow-md' : 'text-[#F5E6D3] hover:bg-[#684626]'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

/* =====================================================================
   1. VIEW RANGKUMAN MATERI
======================================================================== */
const MateriView = () => {
  const [activeLaw, setActiveLaw] = useState(MATERI_KIMIA[0].id);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* PENGANTAR */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-[#E8DCC8]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#4A3018] mb-4 tracking-tight border-b border-[#E8DCC8] pb-3">{PENGANTAR_MATERI.judul}</h2>
        <div className="space-y-4 text-[#5A4028] leading-relaxed text-justify text-xs sm:text-sm">
          <p><span className="font-bold text-[#8B5A2B] text-sm sm:text-base block mb-1">Pengertian:</span> {PENGANTAR_MATERI.pengertian}</p>
          <p><span className="font-bold text-[#8B5A2B] text-sm sm:text-base block mb-1">Manfaat Mempelajari Hukum Dasar Kimia:</span> {PENGANTAR_MATERI.manfaat}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 flex flex-col space-y-3">
          <h3 className="font-bold text-base sm:text-lg mb-2 flex items-center text-[#4A3018]">
            <BookOpen className="mr-2 h-5 w-5 text-[#8B5A2B]"/> Daftar 5 Hukum Utama
          </h3>
          {MATERI_KIMIA.map((materi) => (
            <button
              key={materi.id}
              onClick={() => setActiveLaw(materi.id)}
              className={`p-3 sm:p-4 text-left rounded-xl transition-all border-2 ${activeLaw === materi.id ? 'border-[#8B5A2B] bg-[#F5E6D3] shadow-md transform scale-[1.01]' : 'border-transparent bg-white hover:bg-[#FAF6F0] shadow-sm'}`}
            >
              <div className="font-bold text-[#4A3018] leading-tight text-xs sm:text-sm">{materi.nama}</div>
              <div className="text-sm text-[#8B5A2B] font-medium mt-1">({materi.tokoh}, {materi.tahun})</div>
            </button>
          ))}
        </div>

        <div className="lg:w-2/3">
          {MATERI_KIMIA.map((materi) => (
            activeLaw === materi.id && (
              <div key={materi.id} className="bg-white p-5 sm:p-8 rounded-2xl shadow-md border border-[#E8DCC8] animate-slide-up text-xs sm:text-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-[#4A3018] mb-1">{materi.nama}</h2>
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#E8DCC8] text-[#8B5A2B] font-medium text-[11px] sm:text-xs">
                   <span>Tokoh: {materi.tokoh}</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-[#D9A05B]"></span>
                   <span>Tahun: {materi.tahun}</span>
                </div>
                
                <div className="space-y-6 text-[#5A4028]">
                  <div className="p-5 bg-[#FAF6F0] rounded-xl border-l-4 border-[#8B5A2B] shadow-sm">
                    <p className="font-bold text-[#4A3018] text-lg leading-snug">"{materi.bunyi}"</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                       <div className="font-bold text-[#4A3018]">Inti Materi:</div>
                       <p className="mb-1">{materi.inti}</p>
                       <div className="font-bold text-[#4A3018]">Contoh Simpel:</div>
                       <p>{materi.contoh_simpel}</p>
                    </div>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-4 sm:p-6 border border-stone-200 font-mono text-center shadow-inner">
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest block mb-2 font-sans font-bold">Rumusan / Persamaan Matematis</span>
                    <div className="text-sm sm:text-base md:text-lg font-medium text-[#4A3018] bg-white inline-block px-5 py-2.5 rounded-lg shadow-md w-full overflow-x-auto">
                      {/* Check if rumus is an object (JSX element) or normal renderable text */}
                      {React.isValidElement(materi.rumus) ? materi.rumus : <span>{materi.rumus}</span>}
                    </div>
                  </div>

                  {materi.isDalton && (
                    <div className="overflow-x-auto my-4 bg-white p-3 rounded-xl border border-[#E8DCC8] shadow-sm">
                      <h4 className="font-bold text-center text-[#4A3018] mb-2 text-xs sm:text-sm">Tabel Pembuktian Massa</h4>
                      <table className="w-full text-xs text-left border-collapse border border-stone-300">
                        <thead className="bg-[#F5E6D3] text-[#4A3018] font-bold text-center">
                          <tr>
                            <th className="p-2 border border-stone-300">Senyawa</th>
                            <th className="p-2 border border-stone-300">Massa Nitrogen (g)</th>
                            <th className="p-2 border border-stone-300">Massa Oksigen (g)</th>
                            <th className="p-2 border border-stone-300">Perbandingan</th>
                          </tr>
                        </thead>
                        <tbody className="text-center bg-white font-medium">
                          <tr><td className="p-2 border border-stone-300">N<sub>2</sub>O</td><td className="p-2 border border-stone-300 bg-yellow-50 font-bold">28</td><td className="p-3 border border-stone-300">16</td><td className="p-3 border border-stone-300 text-[#8B5A2B] font-bold">7 : 4</td></tr>
                          <tr><td className="p-2 border border-stone-300">NO</td><td className="p-2 border border-stone-300 bg-yellow-50 font-bold">14</td><td className="p-3 border border-stone-300">16</td><td className="p-3 border border-stone-300 text-[#8B5A2B] font-bold">7 : 8</td></tr>
                          <tr><td className="p-2 border border-stone-300">N<sub>2</sub>O<sub>3</sub></td><td className="p-2 border border-stone-300 bg-yellow-50 font-bold">28</td><td className="p-3 border border-stone-300">48</td><td className="p-3 border border-stone-300 text-[#8B5A2B] font-bold">7 : 12</td></tr>
                          <tr><td className="p-3 border border-stone-300">N<sub>2</sub>O<sub>4</sub></td><td className="p-3 border border-stone-300 bg-yellow-50 font-bold">28</td><td className="p-3 border border-stone-300">64</td><td className="p-3 border border-stone-300 text-[#8B5A2B] font-bold">7 : 16</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="bg-[#F0F4F8] rounded-xl p-4 border border-[#D9E2EC]">
                    <h4 className="font-bold text-[#334E68] mb-1.5 flex items-center gap-1.5 text-sm sm:text-base"><PenTool size={14}/> Contoh Soal</h4>
                    <p className="text-[#486581] font-medium mb-2">"{materi.contoh_soal}"</p>
                    <div className="border-t border-[#D9E2EC] pt-2">
                      <span className="font-bold text-[#334E68] text-xs block mb-0.5">Pembahasan:</span>
                      <p className="text-[#486581]">{materi.pembahasan}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#D9A05B] to-[#C0853D] p-[2px] rounded-xl shadow-md">
                     <div className="bg-[#FAF6F0] h-full w-full rounded-[10px] p-4 flex flex-col sm:flex-row items-center gap-3">
                        <div className="bg-[#D9A05B] text-white p-2.5 rounded-full shadow-inner">
                           <BrainCircuit size={24} />
                        </div>
                        <div className="text-center sm:text-left">
                          <h4 className="font-extrabold text-[#8B5A2B] uppercase tracking-wide text-xs mb-0.5">Jembatan Keledai: {materi.mnemonic.judul}</h4>
                          <p className="text-[#5A4028] font-medium text-xs sm:text-sm leading-relaxed">{materi.mnemonic.isi}</p>
                        </div>
                     </div>
                  </div>

                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
   2. VIEW VIRTUAL LAB DINAMIS (SANDBOX) - AUTO-SOLVER & RESPONSIF MOBILE
======================================================================== */
const VirtualLabView = () => {
  const [labType, setLabType] = useState('lavoisier');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [explanation, setExplanation] = useState('');

  // --- STATE LAVOISIER ---
  const [lavA_name, setLavA_name] = useState('Kayu');
  const [lavB_name, setLavB_name] = useState('O2');
  const [lavP_name, setLavP_name] = useState('Abu+Gas');
  const [lavA_mass, setLavA_mass] = useState('');
  const [lavB_mass, setLavB_mass] = useState('');
  const [lavP_mass, setLavP_mass] = useState('');

  // --- STATE PROUST ---
  const [proustA_name, setProustA_name] = useState('H');
  const [proustB_name, setProustB_name] = useState('O');
  const [proustP_name, setProustP_name] = useState('H2O');
  const [proustRatioA, setProustRatioA] = useState(1);
  const [proustRatioB, setProustRatioB] = useState(8);
  const [proustMassA, setProustMassA] = useState(2);
  const [proustMassB, setProustMassB] = useState(16);

  // --- STATE DALTON ---
  const [dUnsur1, setDUnsur1] = useState('N');
  const [dUnsur2, setDUnsur2] = useState('O');
  const [dSenyawa1, setDSenyawa1] = useState('NO');
  const [dSenyawa2, setDSenyawa2] = useState('NO2');
  const [dm1U1, setDm1U1] = useState(14); const [dm1U2, setDm1U2] = useState(16);
  const [dm2U1, setDm2U1] = useState(14); const [dm2U2, setDm2U2] = useState(32);

  // --- STATE GAY-LUSSAC (3 Senyawa) ---
  const [gV1, setGV1] = useState('');
  const [gKoef1, setGKoef1] = useState('');
  const [gV2, setGV2] = useState('');
  const [gKoef2, setGKoef2] = useState('');
  const [gV3, setGV3] = useState('');
  const [gKoef3, setGKoef3] = useState('');
  const [gZat1, setGZat1] = useState('Gas N2');
  const [gZat2, setGZat2] = useState('Gas H2');
  const [gZat3, setGZat3] = useState('Gas NH3');

  // --- STATE AVOGADRO (3 Senyawa) ---
  const [aV1, setAV1] = useState('');
  const [aN1, setAN1] = useState('');
  const [aV2, setAV2] = useState('');
  const [aN2, setAN2] = useState('');
  const [aV3, setAV3] = useState('');
  const [aN3, setAN3] = useState('');
  const [aName1, setAName1] = useState('Gas O2');
  const [aName2, setAName2] = useState('Gas N2');
  const [aName3, setAName3] = useState('Gas CO2');

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setExplanation('');
  };

  // --- RESET HANDLERS ---
  const resetLav = () => { setLavA_mass(''); setLavB_mass(''); setLavP_mass(''); clearMessages(); };
  const resetProust = () => { setProustRatioA(1); setProustRatioB(8); setProustMassA(2); setProustMassB(16); setProustA_name('H'); setProustB_name('O'); setProustP_name('H2O'); clearMessages(); };
  const resetDalton = () => { setDm1U1(14); setDm1U2(16); setDm2U1(14); setDm2U2(32); setDUnsur1('N'); setDUnsur2('O'); setDSenyawa1('NO'); setDSenyawa2('NO2'); clearMessages(); };
  const resetGayLussac = () => { setGV1(''); setGKoef1(''); setGV2(''); setGKoef2(''); setGV3(''); setGKoef3(''); clearMessages(); };
  const resetAvogadro = () => { setAV1(''); setAN1(''); setAV2(''); setAN2(''); setAV3(''); setAN3(''); clearMessages(); };

  // --- SOLVER LAVOISIER ---
  const solveLavoisier = () => {
    clearMessages();
    let a = parseFloat(lavA_mass), b = parseFloat(lavB_mass), p = parseFloat(lavP_mass);
    const emptyFields = [lavA_mass, lavB_mass, lavP_mass].filter(x => x === '').length;

    if (emptyFields > 1) {
      setErrorMessage('Harap isi minimal 2 kotak untuk menghitung variabel yang kosong!');
      return;
    }
    if (emptyFields === 0) {
      setErrorMessage('Semua kotak sudah terisi. Kosongkan salah satu untuk mencari nilai!');
      return;
    }

    if (lavA_mass === '') {
      const result = Math.max(0, p - b);
      setLavA_mass(result.toFixed(2));
      setSuccessMessage(`Berhasil menghitung massa ${lavA_name}!`);
      setExplanation(`Massa ${lavA_name} = Massa ${lavP_name} - Massa ${lavB_name}\nMassa ${lavA_name} = ${p}g - ${b}g = ${result.toFixed(2)}g`);
    } else if (lavB_mass === '') {
      const result = Math.max(0, p - a);
      setLavB_mass(result.toFixed(2));
      setSuccessMessage(`Berhasil menghitung massa ${lavB_name}!`);
      setExplanation(`Massa ${lavB_name} = Massa ${lavP_name} - Massa ${lavA_name}\nMassa ${lavB_name} = ${p}g - ${a}g = ${result.toFixed(2)}g`);
    } else if (lavP_mass === '') {
      const result = a + b;
      setLavP_mass(result.toFixed(2));
      setSuccessMessage(`Berhasil menghitung massa produk ${lavP_name}!`);
      setExplanation(`Massa ${lavP_name} = Massa ${lavA_name} + Massa ${lavB_name}\nMassa ${lavP_name} = ${a}g + ${b}g = ${result.toFixed(2)}g`);
    }
  };

  // --- SOLVER GAY-LUSSAC (3 Senyawa) ---
  const solve3GayLussac = () => {
    clearMessages();
    let v1 = parseFloat(gV1), k1 = parseFloat(gKoef1);
    let v2 = parseFloat(gV2), k2 = parseFloat(gKoef2);
    let v3 = parseFloat(gV3), k3 = parseFloat(gKoef3);

    // Cari pasangan referensi yang utuh
    let ratio = null;
    let refZat = '';
    if (!isNaN(v1) && !isNaN(k1) && k1 > 0) { ratio = v1 / k1; refZat = gZat1; }
    else if (!isNaN(v2) && !isNaN(k2) && k2 > 0) { ratio = v2 / k2; refZat = gZat2; }
    else if (!isNaN(v3) && !isNaN(k3) && k3 > 0) { ratio = v3 / k3; refZat = gZat3; }

    if (ratio === null) {
      setErrorMessage('Gagal menghitung! Harus ada minimal 1 pasangan volume dan koefisien dari satu senyawa yang terisi lengkap sebagai referensi perbandingan!');
      return;
    }

    // Kalkulasi nilai kosong berdasarkan rasio referensi
    let nv1 = v1, nk1 = k1, nv2 = v2, nk2 = k2, nv3 = v3, nk3 = k3;

    // Senyawa 1
    if (isNaN(v1) && !isNaN(k1)) { nv1 = ratio * k1; setGV1(nv1.toFixed(2)); }
    else if (!isNaN(v1) && isNaN(k1)) { nk1 = v1 / ratio; setGKoef1(nk1.toFixed(2)); }
    // Senyawa 2
    if (isNaN(v2) && !isNaN(k2)) { nv2 = ratio * k2; setGV2(nv2.toFixed(2)); }
    else if (!isNaN(v2) && isNaN(k2)) { nk2 = v2 / ratio; setGKoef2(nk2.toFixed(2)); }
    // Senyawa 3
    if (isNaN(v3) && !isNaN(k3)) { nv3 = ratio * k3; setGV3(nv3.toFixed(2)); }
    else if (!isNaN(v3) && isNaN(k3)) { nk3 = v3 / ratio; setGKoef3(nk3.toFixed(2)); }

    setSuccessMessage(`Berhasil melakukan perhitungan perbandingan volume berdasarkan referensi senyawa: ${refZat}!`);
    
    const resV1 = isNaN(v1) && !isNaN(k1) ? ratio * k1 : v1;
    const resK1 = !isNaN(v1) && isNaN(k1) ? v1 / ratio : k1;
    const resV2 = isNaN(v2) && !isNaN(k2) ? ratio * k2 : v2;
    const resK2 = !isNaN(v2) && isNaN(k2) ? v2 / ratio : k2;
    const resV3 = isNaN(v3) && !isNaN(k3) ? ratio * k3 : v3;
    const resK3 = !isNaN(v3) && isNaN(k3) ? v3 / ratio : k3;

    setExplanation(
      `KESIMPULAN HASIL PERHITUNGAN:\n` +
      `• Volume senyawa ${gZat1} adalah ${isNaN(resV1) ? 'Belum ditentukan' : resV1.toFixed(2) + ' L'} (Koefisien: ${isNaN(resK1) ? '?' : resK1})\n` +
      `• Volume senyawa ${gZat2} adalah ${isNaN(resV2) ? 'Belum ditentukan' : resV2.toFixed(2) + ' L'} (Koefisien: ${isNaN(resK2) ? '?' : resK2})\n` +
      `• Volume senyawa ${gZat3} adalah ${isNaN(resV3) ? 'Belum ditentukan' : resV3.toFixed(2) + ' L'} (Koefisien: ${isNaN(resK3) ? '?' : resK3})\n\n` +
      `Analisis Langkah:\nMassa & Volume gas berbanding lurus dengan koefisien reaksi. Rasio referensi V/koef dari ${refZat} adalah = ${ratio.toFixed(2)}.`
    );
  };

  // --- SOLVER 3 AVOGADRO ---
  const solve3Avogadro = () => {
    clearMessages();
    let v1 = parseFloat(aV1), n1 = parseFloat(aN1);
    let v2 = parseFloat(aV2), n2 = parseFloat(aN2);
    let v3 = parseFloat(aV3), n3 = parseFloat(aN3);

    // Cari rujukan gas yang utuh
    let ratio = null;
    let refZat = '';
    if (!isNaN(v1) && !isNaN(n1) && n1 > 0) { ratio = v1 / n1; refZat = aName1; }
    else if (!isNaN(v2) && !isNaN(n2) && n2 > 0) { ratio = v2 / n2; refZat = aName2; }
    else if (!isNaN(v3) && !isNaN(n3) && n3 > 0) { ratio = v3 / n3; refZat = aName3; }

    if (ratio === null) {
      setErrorMessage('Gagal kalkulasi! Sediakan satu gas rujukan yang memiliki volume dan jumlah mol yang terisi lengkap!');
      return;
    }

    // Hitung variabel kosong secara otomatis
    let nv1 = v1, nn1 = n1, nv2 = v2, nn2 = n2, nv3 = v3, nn3 = n3;

    // Gas 1
    if (isNaN(v1) && !isNaN(n1)) { nv1 = ratio * n1; setAV1(nv1.toFixed(2)); }
    else if (!isNaN(v1) && isNaN(n1)) { nn1 = v1 / ratio; setAN1(nn1.toFixed(2)); }
    // Gas 2
    if (isNaN(v2) && !isNaN(n2)) { nv2 = ratio * n2; setAV2(nv2.toFixed(2)); }
    else if (!isNaN(v2) && isNaN(n2)) { nn2 = v2 / ratio; setAN2(nn2.toFixed(2)); }
    // Gas 3
    if (isNaN(v3) && !isNaN(n3)) { nv3 = ratio * n3; setAV3(nv3.toFixed(2)); }
    else if (!isNaN(v3) && isNaN(n3)) { nn3 = v3 / ratio; setAN3(nn3.toFixed(2)); }

    setSuccessMessage(`Berhasil menghitung perbandingan Avogadro dengan rujukan utama: ${refZat}!`);

    const resV1 = isNaN(v1) && !isNaN(n1) ? ratio * n1 : v1;
    const resN1 = !isNaN(v1) && isNaN(n1) ? v1 / ratio : n1;
    const resV2 = isNaN(v2) && !isNaN(n2) ? ratio * n2 : v2;
    const resN2 = !isNaN(v2) && isNaN(n2) ? v2 / ratio : n2;
    const resV3 = isNaN(v3) && !isNaN(n3) ? ratio * n3 : v3;
    const resN3 = !isNaN(v3) && isNaN(n3) ? v3 / ratio : n3;

    setExplanation(
      `KESIMPULAN HASIL PERHITUNGAN AVOGADRO:\n` +
      `• Volume senyawa ${aName1} adalah ${isNaN(resV1) ? 'Belum ditentukan' : resV1.toFixed(2) + ' L'} (Jumlah mol: ${isNaN(resN1) ? '?' : resN1.toFixed(2) + ' mol'})\n` +
      `• Volume senyawa ${aName2} adalah ${isNaN(resV2) ? 'Belum ditentukan' : resV2.toFixed(2) + ' L'} (Jumlah mol: ${isNaN(resN2) ? '?' : resN2.toFixed(2) + ' mol'})\n` +
      `• Volume senyawa ${aName3} adalah ${isNaN(resV3) ? 'Belum ditentukan' : resV3.toFixed(2) + ' L'} (Jumlah mol: ${isNaN(resN3) ? '?' : resN3.toFixed(2) + ' mol'})\n\n` +
      `Analisis Langkah:\nPada P & T tetap, Volume sebanding dengan jumlah Mol. Perbandingan V/n konstan berdasarkan ${refZat} adalah = ${ratio.toFixed(2)}.`
    );
  };

  // Kalkulasi Proust Otomatis
  let pUsedA = 0, pUsedB = 0, pSisaA = 0, pSisaB = 0;
  if (proustMassA && proustMassB) {
    let pTestA = proustMassB * (proustRatioA / proustRatioB);
    if (pTestA <= proustMassA) { pUsedB = proustMassB; pUsedA = pTestA; pSisaA = proustMassA - pUsedA; pSisaB = 0; } 
    else { pUsedA = proustMassA; pUsedB = proustMassA * (proustRatioB / proustRatioA); pSisaA = 0; pSisaB = proustMassB - pUsedB; }
  }

  // Kalkulasi Dalton
  let dNormU2_calc = dm2U2 * (dm1U1 / dm2U1) || 0;
  let rawGcd_calc = gcd(Math.round(dm1U2), Math.round(dNormU2_calc)) || 1;

  // Helper Input Styling
  const inputClass = "bg-white border-2 border-[#D9A05B] rounded-lg px-2 py-2 text-center text-[#4A3018] font-bold focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] transition-all w-full text-xs sm:text-sm";
  const nameInputClass = "text-center font-bold text-[#8B5A2B] bg-transparent border-b-2 border-dashed border-[#8B5A2B] w-full focus:outline-none mb-1 text-xs sm:text-sm";

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* HEADER LAB */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-[#E8DCC8] text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#4A3018] mb-3 flex items-center justify-center sm:justify-start gap-2">
          <Settings2 className="text-[#8B5A2B] h-6 w-6"/> Sandbox Dinamis
        </h2>
        <p className="text-[#8B5A2B] text-xs sm:text-sm md:text-base mb-5">Pilih hukum kimia di bawah. Kosongkan satu variabel lalu tekan hitung untuk mendapatkan analisis dua arah instan!</p>
        
        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
          {['lavoisier', 'proust', 'dalton', 'gaylussac', 'avogadro'].map(t => (
            <button key={t} onClick={()=>{setLabType(t); clearMessages();}} 
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold transition-all text-[10px] sm:text-xs uppercase tracking-wide border-2 ${labType === t ? 'bg-[#4A3018] text-[#F5E6D3] border-[#4A3018] shadow-lg' : 'bg-white text-[#8B5A2B] border-[#D9A05B] hover:bg-[#FAF6F0]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* FEEDBACK MESSAGES */}
      {(errorMessage || successMessage) && (
        <div className="max-w-2xl mx-auto w-full animate-slide-up px-1">
          {errorMessage && (
            <div className="bg-red-50 text-red-800 p-3 sm:p-4 rounded-xl border border-red-200 flex items-center gap-3 text-xs sm:text-sm">
              <XCircle className="text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 text-green-800 p-3 sm:p-4 rounded-xl border border-green-200 flex flex-col gap-1 text-xs sm:text-sm">
              <div className="flex items-center gap-3 font-bold">
                <CheckCircle className="text-green-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
              {explanation && <p className="text-[11px] sm:text-xs text-stone-600 mt-2 font-mono whitespace-pre-line bg-white p-3 rounded-lg border border-stone-100 shadow-inner leading-relaxed">{explanation}</p>}
            </div>
          )}
        </div>
      )}

      {/* CORE LAB CONTAINER */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-md border border-[#E8DCC8] min-h-[450px] flex flex-col justify-start relative">
        
        {/* ==========================================================
            1. LAVOISIER SANDBOX (Kekekalan Massa) WITH ANIMATED SCALE
        =========================================================== */}
        {labType === 'lavoisier' && (
          <div className="w-full max-w-xl mx-auto animate-slide-up">
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-stone-100 pb-3">
               <h3 className="text-lg sm:text-xl font-bold text-[#4A3018] flex items-center gap-2"><Scale className="text-[#8B5A2B] h-5 w-5"/> Hukum Lavoisier</h3>
               <button onClick={resetLav} className="text-xs font-bold text-[#8B5A2B] flex items-center gap-1 hover:text-red-600"><RotateCcw size={14}/> Reset</button>
            </div>

            {/* ILUSTRASI EDUKATIF: TIMBANGAN DINAMIS */}
            <div className="mb-6 p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DCC8] flex flex-col items-center">
              <span className="text-[10px] font-extrabold text-[#8B5A2B] uppercase tracking-wider mb-2">Simulasi Neraca Analitik Klasik</span>
              <div className="w-48 h-20 relative flex items-end justify-center">
                {/* Tiang Neraca */}
                <div className="w-2 h-16 bg-stone-400 absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
                <div className="w-12 h-2 bg-stone-500 absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-t"></div>
                
                {/* Lengan Neraca Berputar sesuai Perbandingan Berat */}
                {(() => {
                  const leftWeight = (parseFloat(lavA_mass) || 0) + (parseFloat(lavB_mass) || 0);
                  const rightWeight = parseFloat(lavP_mass) || 0;
                  let rotateDeg = 0;
                  if (leftWeight > rightWeight) rotateDeg = -12;
                  else if (leftWeight < rightWeight) rotateDeg = 12;
                  
                  return (
                    <div 
                      className="w-44 h-1 bg-stone-600 absolute top-4 left-1/2 transform -translate-x-1/2 transition-transform duration-500 origin-center"
                      style={{ transform: `translateX(-50%) rotate(${rotateDeg}deg)` }}
                    >
                      {/* Piringan Kiri */}
                      <div className="w-8 h-8 border-2 border-stone-400 rounded-full bg-amber-50 absolute left-0 top-1 transform -translate-x-1/2 flex items-center justify-center text-[9px] font-bold shadow-inner">
                        {leftWeight.toFixed(1)}g
                      </div>
                      {/* Piringan Kanan */}
                      <div className="w-8 h-8 border-2 border-stone-400 rounded-full bg-[#FAF6F0] absolute right-0 top-1 transform translate-x-1/2 flex items-center justify-center text-[9px] font-bold shadow-inner">
                        {rightWeight.toFixed(1)}g
                      </div>
                    </div>
                  );
                })()}
              </div>
              <p className="text-[10px] text-stone-500 mt-3 text-center">Neraca akan seimbang sempurna (rata) ketika Massa Reaktan = Massa Produk.</p>
            </div>
            
            <p className="text-[11px] sm:text-xs text-[#5A4028] mb-6 p-3 bg-[#FAF6F0] rounded-lg border border-[#E8DCC8]">
              <Lightbulb className="inline text-amber-500 mr-1" size={14}/> Kosongkan salah satu kotak massa reaktan atau produk, lalu klik tombol hitung!
            </p>

            <div className="flex flex-col items-center gap-6">
              {/* REAKTAN BERSAMPINGAN (Horizontal di Mobile / Tablet) */}
              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="flex flex-col items-center">
                    <input value={lavA_name} onChange={e=>setLavA_name(e.target.value)} className={nameInputClass} />
                    <div className="relative w-full">
                      <input type="number" placeholder="?" value={lavA_mass} onChange={e=>setLavA_mass(e.target.value)} className={inputClass} />
                      <span className="absolute right-2 top-2 text-xs font-bold text-stone-400">g</span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col items-center">
                    <input value={lavB_name} onChange={e=>setLavB_name(e.target.value)} className={nameInputClass} />
                    <div className="relative w-full">
                      <input type="number" placeholder="?" value={lavB_mass} onChange={e=>setLavB_mass(e.target.value)} className={inputClass} />
                      <span className="absolute right-2 top-2 text-xs font-bold text-stone-400">g</span>
                    </div>
                 </div>
              </div>

              <div className="text-2xl font-black text-[#8B5A2B] leading-none">+</div>

              {/* PRODUK DI BAWAH (UKURAN DIPERKECIL & PAS DI TENGAH) */}
              <div className="w-36 flex flex-col items-center bg-[#FAF6F0] p-3 rounded-2xl border-2 border-[#8B5A2B] shadow-inner relative">
                 <Scale className="text-[#8B5A2B] mb-1 opacity-80" size={20} />
                 <input value={lavP_name} onChange={e=>setLavP_name(e.target.value)} className={nameInputClass} />
                 <div className="relative w-full">
                   <input type="number" placeholder="?" value={lavP_mass} onChange={e=>setLavP_mass(e.target.value)} className={`${inputClass} bg-yellow-50`} />
                   <span className="absolute right-2 top-2 text-[10px] sm:text-xs font-bold text-stone-400">g</span>
                 </div>
              </div>

              <button onClick={solveLavoisier} className="w-full max-w-[200px] bg-[#8B5A2B] hover:bg-[#684626] text-white py-2.5 rounded-xl font-bold transition-all mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md">
                <Calculator size={16}/> Hitung Otomatis
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================
            2. PROUST SANDBOX (Perbandingan Tetap)
        =========================================================== */}
        {labType === 'proust' && (
          <div className="w-full max-w-3xl mx-auto animate-slide-up">
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-stone-100 pb-3">
               <h3 className="text-lg sm:text-xl font-bold text-[#4A3018] flex items-center gap-2"><FlaskConical className="text-[#8B5A2B] h-5 w-5"/> Hukum Proust</h3>
               <button onClick={resetProust} className="text-xs font-bold text-[#8B5A2B] flex items-center gap-1 hover:text-red-600"><RotateCcw size={14}/> Reset</button>
            </div>

            {/* ILUSTRASI PROUST: MOLEKUL PRODUK & SISA */}
            <div className="mb-6 p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DCC8] flex flex-col sm:flex-row items-center justify-around gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-[#8B5A2B] uppercase tracking-wider block">Visualisasi Senyawa & Sisa Reaktan</span>
                <p className="text-[10px] text-stone-500 max-w-xs mt-1">Menggabungkan Atom {proustA_name} (Biru) & {proustB_name} (Merah) membentuk {proustP_name}.</p>
              </div>
              <div className="flex gap-4 items-center">
                {/* Produk Terbentuk */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl border-2 border-[#8B5A2B] bg-white flex items-center justify-center relative p-1 shadow-inner">
                    <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-4 left-4 border border-white"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-7 left-3 border border-white"></div>
                    <div className="w-5 h-5 bg-red-500 rounded-full absolute top-5 left-7 border border-white"></div>
                  </div>
                  <span className="text-[9px] font-bold text-stone-500 mt-1">Produk {proustP_name}</span>
                </div>
                {/* Zat Sisa */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-red-400 bg-red-50/50 flex items-center justify-center p-1">
                    {pSisaA > 0 ? (
                      <div className="w-5 h-5 bg-blue-500 rounded-full border border-white animate-bounce text-white text-[8px] flex items-center justify-center font-bold">S</div>
                    ) : pSisaB > 0 ? (
                      <div className="w-5 h-5 bg-red-500 rounded-full border border-white animate-bounce text-white text-[8px] flex items-center justify-center font-bold">S</div>
                    ) : (
                      <span className="text-[9px] text-green-600 font-bold text-center leading-none">Habis<br/>Reaksi</span>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-stone-500 mt-1">Zat Sisa</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4 bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DCC8]">
                  <h4 className="font-bold text-[#4A3018] text-xs border-b border-[#D9A05B] pb-1">1. Tentukan Rasio & Nama Zat</h4>
                  <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="text-[10px] font-bold text-[#8B5A2B] block mb-1">Zat A</label>
                        <input type="text" value={proustA_name} onChange={e=>setProustA_name(e.target.value)} className={inputClass} />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-[#8B5A2B] block mb-1">Zat B</label>
                        <input type="text" value={proustB_name} onChange={e=>setProustB_name(e.target.value)} className={inputClass} />
                     </div>
                  </div>
                  
                  <div>
                     <label className="text-[10px] font-bold text-[#8B5A2B] block mb-1">Nama Senyawa Hasil Reaksi</label>
                     <input type="text" value={proustP_name} onChange={e=>setProustP_name(e.target.value)} className="bg-white border-2 border-[#D9A05B] rounded-lg px-2 py-1.5 text-[#4A3018] font-bold focus:outline-none w-full text-xs" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="text-[10px] font-bold text-[#8B5A2B] block mb-1">Rasio Zat A</label>
                        <input type="number" value={proustRatioA} onChange={e=>setProustRatioA(Number(e.target.value))} className={inputClass} />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-[#8B5A2B] block mb-1">Rasio Zat B</label>
                        <input type="number" value={proustRatioB} onChange={e=>setProustRatioB(Number(e.target.value))} className={inputClass} />
                     </div>
                  </div>

                  <h4 className="font-bold text-[#4A3018] text-sm border-b border-[#D9A05B] pb-1 mt-4">2. Massa Eksperimen (g)</h4>
                  <div className="grid grid-cols-2 gap-2">
                     <div><label className="text-[10px] font-bold text-[#8B5A2B]">Massa {formatSenyawa(proustA_name)}</label><input type="number" value={proustMassA} onChange={e=>setProustMassA(Number(e.target.value))} className={inputClass} /></div>
                     <div><label className="text-[10px] font-bold text-[#8B5A2B]">Massa {formatSenyawa(proustB_name)}</label><input type="number" value={proustMassB} onChange={e=>setProustMassB(Number(e.target.value))} className={inputClass} /></div>
                  </div>
               </div>

               <div className="bg-[#4A3018] p-5 rounded-xl shadow-md text-[#F5E6D3] flex flex-col justify-between border-2 border-[#D9A05B] max-w-sm mx-auto w-full">
                  <div>
                    <h4 className="font-bold text-base mb-3 text-[#D9A05B] border-b border-[#684626] pb-1 flex items-center gap-1.5">
                       <FlaskConical size={16}/> Laporan Reaksi Proust
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-stone-400">Terpakai Membentuk {formatSenyawa(proustP_name)}:</span>
                        <div className="flex justify-between font-bold bg-[#382415] p-2.5 rounded border border-stone-700 mt-1">
                           <span>{formatSenyawa(proustA_name)}: <span className="text-blue-400">{pUsedA.toFixed(1)} g</span></span>
                           <span>{formatSenyawa(proustB_name)}: <span className="text-red-400">{pUsedB.toFixed(1)} g</span></span>
                        </div>
                      </div>
                      
                      <div className="bg-[#2D1D10] p-2 rounded-lg border border-[#684626] text-center">
                         <span className="block text-[10px] text-[#D9A05B] font-bold">Massa Total {formatSenyawa(proustP_name)} Terbentuk:</span>
                         <span className="text-lg sm:text-xl font-black text-[#00FF41]">{(pUsedA + pUsedB).toFixed(1)} g</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 bg-red-900/40 rounded-lg border border-red-800/50 text-center text-xs">
                    <span className="text-[10px] font-bold text-red-300 block mb-0.5">Status Sisa Zat:</span>
                    {pSisaA > 0 ? (
                      <span className="font-bold text-white">{pSisaA.toFixed(1)}g <span className="text-[10px] font-normal text-stone-300">sisa {formatSenyawa(proustA_name)}</span></span>
                    ) : pSisaB > 0 ? (
                      <span className="font-bold text-white">{pSisaB.toFixed(1)}g <span className="text-[10px] font-normal text-stone-300">sisa {formatSenyawa(proustB_name)}</span></span>
                    ) : (
                      <span className="font-bold text-[#00FF41]">Semua Zat Habis Bereaksi</span>
                    )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            3. DALTON SANDBOX (Komposisi Molekul Berganda Dinamis)
        =========================================================== */}
        {labType === 'dalton' && (
          <div className="w-full max-w-2xl mx-auto animate-slide-up">
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-stone-100 pb-3">
               <h3 className="text-lg sm:text-xl font-bold text-[#4A3018] flex items-center gap-2"><TestTube2 className="text-[#8B5A2B] h-5 w-5"/> Hukum Dalton</h3>
               <button onClick={resetDalton} className="text-xs font-bold text-[#8B5A2B] flex items-center gap-1 hover:text-red-600"><RotateCcw size={14}/> Reset</button>
            </div>

            {/* ILUSTRASI DALTON: PERBANDINGAN MOLEKUL DINAMIS */}
            <div className="mb-6 p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DCC8] flex flex-col sm:flex-row justify-around items-center gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-[#8B5A2B] uppercase tracking-wider block">Model Geometri Unsur Terbentuk</span>
                <p className="text-[10px] text-stone-500 max-w-xs mt-1">Komposisi gas {dSenyawa1} berbanding {dSenyawa2} menghasilkan kelipatan bulat sederhana untuk unsur {dUnsur2}.</p>
              </div>
              <div className="flex gap-6 items-center">
                {/* Senyawa 1 Visual */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm flex-wrap justify-center max-w-[100px]">
                    <div className="w-5 h-5 rounded-full bg-stone-700 border border-white text-[8px] font-bold text-white flex items-center justify-center" title={dUnsur1}>{dUnsur1.substring(0,2)}</div>
                    {Array.from({ length: Math.min(Math.round(dm1U2)/rawGcd_calc || 1, 6) }).map((_, i) => (
                       <div key={i} className="w-5 h-5 rounded-full bg-red-500 border border-white text-[8px] font-bold text-white flex items-center justify-center" title={dUnsur2}>{dUnsur2.substring(0,2)}</div>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-stone-500 mt-1">{dSenyawa1} ({Math.round(dm1U2)/rawGcd_calc || 1} {dUnsur2})</span>
                </div>
                {/* Senyawa 2 Visual */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm flex-wrap justify-center max-w-[100px]">
                    <div className="w-5 h-5 rounded-full bg-stone-700 border border-white text-[8px] font-bold text-white flex items-center justify-center" title={dUnsur1}>{dUnsur1.substring(0,2)}</div>
                    {Array.from({ length: Math.min(Math.round(dNormU2_calc)/rawGcd_calc || 2, 6) }).map((_, i) => (
                       <div key={i} className="w-5 h-5 rounded-full bg-red-500 border border-white text-[8px] font-bold text-white flex items-center justify-center" title={dUnsur2}>{dUnsur2.substring(0,2)}</div>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-stone-500 mt-1">{dSenyawa2} ({Math.round(dNormU2_calc)/rawGcd_calc || 2} {dUnsur2})</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
               <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DCC8] shadow-sm">
                  <div className="mb-2">
                    <label className="block text-[10px] font-bold text-[#8B5A2B] mb-1">Senyawa 1</label>
                    <input type="text" value={dSenyawa1} onChange={e=>setDSenyawa1(e.target.value)} className="w-full bg-white border-2 border-[#D9A05B] rounded-lg px-2.5 py-1 text-xs text-[#4A3018] font-bold focus:outline-none" placeholder="Misal: NO" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="text-[9px] font-bold text-[#8B5A2B]">Unsur 1</label>
                       <input type="text" value={dUnsur1} onChange={e=>setDUnsur1(e.target.value)} className={inputClass} />
                       <input type="number" value={dm1U1} onChange={e=>setDm1U1(Number(e.target.value))} className={`${inputClass} mt-1`} />
                     </div>
                     <div>
                       <label className="text-[9px] font-bold text-[#8B5A2B]">Unsur 2</label>
                       <input type="text" value={dUnsur2} onChange={e=>setDUnsur2(e.target.value)} className={inputClass} />
                       <input type="number" value={dm1U2} onChange={e=>setDm1U2(Number(e.target.value))} className={`${inputClass} mt-1`} />
                     </div>
                  </div>
               </div>

               <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DCC8] shadow-sm">
                  <div className="mb-2">
                    <label className="block text-[10px] font-bold text-[#8B5A2B] mb-1">Senyawa 2</label>
                    <input type="text" value={dSenyawa2} onChange={e=>setDSenyawa2(e.target.value)} className="w-full bg-white border-2 border-[#D9A05B] rounded-lg px-2.5 py-1 text-xs text-[#4A3018] font-bold focus:outline-none" placeholder="Misal: NO2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="text-[9px] font-bold text-[#8B5A2B] bg-[#FAF6F0] text-stone-700">Unsur 1 (Lock)</label>
                       <input type="text" value={dUnsur1} disabled className={`${inputClass} bg-stone-100 cursor-not-allowed`} />
                       <input type="number" value={dm2U1} onChange={e=>setDm2U1(Number(e.target.value))} className={`${inputClass} mt-1`} />
                     </div>
                     <div>
                       <label className="text-[9px] font-bold text-[#8B5A2B] bg-[#FAF6F0] text-stone-700">Unsur 2</label>
                       <input type="text" value={dUnsur2} disabled className={`${inputClass} bg-stone-100 cursor-not-allowed`} />
                       <input type="number" value={dm2U2} onChange={e=>setDm2U2(Number(e.target.value))} className={`${inputClass} mt-1`} />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#F5E6D3] border-2 border-[#D9A05B] p-4 rounded-xl shadow-inner text-[#4A3018] text-xs">
               <h4 className="font-bold text-xs mb-1 flex items-center gap-1.5">
                 <TestTube2 size={14} className="text-[#8B5A2B]"/> Normalisasi Dalton:
               </h4>
               <p className="text-stone-700 mb-3 text-[11px]">Jika massa {formatSenyawa(dUnsur1)} disamakan dengan Senyawa 1 ({dm1U1}g), maka massa {formatSenyawa(dUnsur2)} Senyawa 2 menjadi: <b>{dNormU2_calc.toFixed(2)}g</b></p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white p-3 rounded-lg border border-[#E8DCC8]">
                  <div className="text-center">
                    <span className="text-[9px] font-bold text-[#8B5A2B] uppercase block">Rasio {formatSenyawa(dUnsur2)}</span>
                    <div className="text-sm font-black text-[#4A3018]">{dm1U2} : {dNormU2_calc.toFixed(2)}</div>
                  </div>
                  <ArrowRight className="text-[#D9A05B] hidden sm:block" size={16} />
                  <div className="text-center">
                    <span className="text-[9px] font-bold text-[#8B5A2B] uppercase block">Banding Bulat</span>
                    <div className="text-lg font-black text-[#2D1D10] bg-yellow-100 px-3 py-0.5 rounded border border-yellow-300">
                      {Math.round(dm1U2)/rawGcd_calc} : {Math.round(dNormU2_calc)/rawGcd_calc}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            4. REVISI GAY-LUSSAC: MULTI-ARAH DENGAN 3 SENYAWA/GAS
        =========================================================== */}
        {labType === 'gaylussac' && (
          <div className="w-full max-w-2xl mx-auto animate-slide-up text-[#4A3018]">
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-stone-100 pb-3">
               <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2"><Wind className="text-[#8B5A2B] h-5 w-5"/> Hukum Gay-Lussac (3 Gas)</h3>
               <button onClick={resetGayLussac} className="text-xs font-bold text-[#8B5A2B] flex items-center gap-1 hover:text-red-600"><RotateCcw size={14}/> Reset</button>
            </div>

            {/* ILUSTRASI GAY-LUSSAC: 3 PISTON GAS DENGAN TINGGI PROPORSI */}
            <div className="mb-6 p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DCC8] flex flex-col items-center">
              <span className="text-[10px] font-extrabold text-[#8B5A2B] uppercase tracking-wider mb-2">Simulasi Volume Silinder Gas (Piston)</span>
              <div className="flex justify-center items-end gap-6 h-28 w-full max-w-sm mt-2">
                {[
                  { name: gV1 ? `${gV1}L` : '?', h: parseFloat(gV1) || 0, color: 'bg-blue-400 border-blue-600', label: gZat1 || 'Gas 1' },
                  { name: gV2 ? `${gV2}L` : '?', h: parseFloat(gV2) || 0, color: 'bg-red-400 border-red-600', label: gZat2 || 'Gas 2' },
                  { name: gV3 ? `${gV3}L` : '?', h: parseFloat(gV3) || 0, color: 'bg-green-400 border-green-600', label: gZat3 || 'Gas 3' }
                ].map((piston, idx) => {
                  const maxHeight = Math.max(parseFloat(gV1) || 1, parseFloat(gV2) || 1, parseFloat(gV3) || 1, 10);
                  const pctHeight = Math.min(100, Math.max(20, (piston.h / maxHeight) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center w-14">
                      <span className="text-[9px] font-bold text-[#4A3018] mb-1">{piston.name}</span>
                      <div className="w-10 h-16 border-2 border-stone-500 rounded bg-white relative flex items-end overflow-hidden shadow-inner">
                        {/* Piston Head */}
                        <div className="absolute left-0 w-full h-1.5 bg-stone-700 transition-all duration-500 z-10" style={{ bottom: `${pctHeight}%` }}></div>
                        {/* Gas Volume Color */}
                        <div className={`w-full transition-all duration-500 ${piston.color} border-t`} style={{ height: `${pctHeight}%` }}></div>
                      </div>
                      <span className="text-[8px] font-bold text-stone-500 mt-1 truncate w-14 text-center">{piston.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-stone-600 mb-6 bg-stone-50 p-3 rounded-lg border border-stone-100 leading-normal">
              <Lightbulb className="inline text-amber-500 mr-1" size={14} /> <b>Cara Penggunaan:</b> Isi lengkap setidaknya <b>satu pasang data</b> (Volume & Koefisien) dari salah satu senyawa untuk digunakan sebagai dasar referensi hitungan, lalu kosongkan variabel pada senyawa lain untuk menghitung nilainya!
            </p>

            {/* FORM INPUT UNTUK 3 SENYAWA BERBEDA */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Senyawa 1 */}
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
                  <input value={gZat1} onChange={e=>setGZat1(e.target.value)} className={nameInputClass} />
                  <div className="space-y-2 mt-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Volume (L)</label>
                      <input type="number" placeholder="?" value={gV1} onChange={e=>setGV1(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Koefisien</label>
                      <input type="number" placeholder="?" value={gKoef1} onChange={e=>setGKoef1(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Senyawa 2 */}
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
                  <input value={gZat2} onChange={e=>setGZat2(e.target.value)} className={nameInputClass} />
                  <div className="space-y-2 mt-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Volume (L)</label>
                      <input type="number" placeholder="?" value={gV2} onChange={e=>setGV2(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Koefisien</label>
                      <input type="number" placeholder="?" value={gKoef2} onChange={e=>setGKoef2(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Senyawa 3 */}
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
                  <input value={gZat3} onChange={e=>setGZat3(e.target.value)} className={nameInputClass} />
                  <div className="space-y-2 mt-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Volume (L)</label>
                      <input type="number" placeholder="?" value={gV3} onChange={e=>setGV3(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Koefisien</label>
                      <input type="number" placeholder="?" value={gKoef3} onChange={e=>setGKoef3(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button onClick={solve3GayLussac} className="w-full bg-[#8B5A2B] hover:bg-[#684626] text-white py-3 rounded-xl font-bold transition-all text-sm shadow-md flex items-center justify-center gap-2 mt-4">
                <Calculator size={18}/> Hitung Saling Silang (3 Gas)
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================
            5. REVISI AVOGADRO: MULTI-ARAH DENGAN 3 SENYAWA/GAS
        =========================================================== */}
        {labType === 'avogadro' && (
          <div className="w-full max-w-2xl mx-auto animate-slide-up text-[#4A3018]">
            <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-stone-100 pb-3">
               <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2"><Beaker className="text-[#8B5A2B] h-5 w-5"/> Hukum Avogadro (3 Gas)</h3>
               <button onClick={resetAvogadro} className="text-xs font-bold text-[#8B5A2B] flex items-center gap-1 hover:text-red-600"><RotateCcw size={14}/> Reset</button>
            </div>

            {/* ILUSTRASI AVOGADRO: 3 BALON GAS DENGAN JUMLAH PARTIKEL */}
            <div className="mb-6 p-4 bg-[#FAF6F0] rounded-xl border border-[#E8DCC8] flex flex-col items-center">
              <span className="text-[10px] font-extrabold text-[#8B5A2B] uppercase tracking-wider mb-2">Simulasi Volume Balon & Partikel Gas (Mol)</span>
              <div className="flex justify-center items-end gap-6 h-28 w-full max-w-sm mt-2 relative">
                {[
                  { name: aV1 ? `${aV1}L` : '?', h: parseFloat(aV1) || 0, color: 'bg-blue-400/90 border-blue-600', mol: parseFloat(aN1) || 0, label: aName1 },
                  { name: aV2 ? `${aV2}L` : '?', h: parseFloat(aV2) || 0, color: 'bg-red-400/90 border-red-600', mol: parseFloat(aN2) || 0, label: aName2 },
                  { name: aV3 ? `${aV3}L` : '?', h: parseFloat(aV3) || 0, color: 'bg-green-400/90 border-green-600', mol: parseFloat(aN3) || 0, label: aName3 }
                ].map((balon, idx) => {
                  const maxV = Math.max(parseFloat(aV1) || 1, parseFloat(aV2) || 1, parseFloat(aV3) || 1, 10);
                  const diam = Math.min(80, Math.max(35, (balon.h / maxV) * 80));
                  return (
                    <div key={idx} className="flex flex-col items-center w-20">
                      <span className="text-[9px] font-bold text-[#4A3018] mb-1">{balon.name}</span>
                      <div className="h-20 flex items-center justify-center relative w-full">
                        <div 
                          className={`rounded-full border-2 ${balon.color} flex flex-wrap items-center justify-center p-1 transition-all duration-500 shadow-lg relative overflow-hidden`}
                          style={{ width: `${diam}px`, height: `${diam}px` }}
                        >
                          {/* Floating Gas Molecules */}
                          {Array.from({ length: Math.min(Math.round(balon.mol * 10) || 1, 12) }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1.5 h-1.5 bg-white rounded-full absolute animate-bubble" 
                              style={{ 
                                left: `${Math.random() * 80}%`, 
                                top: `${Math.random() * 80}%`,
                                animationDelay: `${i * 0.3}s` 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[8px] font-bold text-stone-500 mt-1 truncate w-16 text-center">{balon.label} ({balon.mol ? balon.mol + ' mol' : '?'})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-stone-600 mb-6 bg-stone-50 p-3 rounded-lg border border-stone-100 leading-normal">
              <Lightbulb className="inline text-amber-500 mr-1" size={14} /> <b>Cara Penggunaan:</b> Tentukan satu gas lengkap (Volume & Jumlah Mol) sebagai rujukan, kosongkan isian yang ingin dicari di gas lainnya, lalu klik hitung untuk melengkapi seluruh isian secara instan!
            </p>

            {/* FORM INPUT 3 GAS BERBEDA UNTUK AVOGADRO */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Gas 1 */}
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
                  <input value={aName1} onChange={e=>setAName1(e.target.value)} className={nameInputClass} />
                  <div className="space-y-2 mt-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Volume (L)</label>
                      <input type="number" placeholder="?" value={aV1} onChange={e=>setAV1(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Jumlah Mol (n)</label>
                      <input type="number" placeholder="?" value={aN1} onChange={e=>setAN1(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Gas 2 */}
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
                  <input value={aName2} onChange={e=>setAName2(e.target.value)} className={nameInputClass} />
                  <div className="space-y-2 mt-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Volume (L)</label>
                      <input type="number" placeholder="?" value={aV2} onChange={e=>setAV2(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Jumlah Mol (n)</label>
                      <input type="number" placeholder="?" value={aN2} onChange={e=>setAN2(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Gas 3 */}
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-stone-200">
                  <input value={aName3} onChange={e=>setAName3(e.target.value)} className={nameInputClass} />
                  <div className="space-y-2 mt-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Volume (L)</label>
                      <input type="number" placeholder="?" value={aV3} onChange={e=>setAV3(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold block mb-0.5">Jumlah Mol (n)</label>
                      <input type="number" placeholder="?" value={aN3} onChange={e=>setAN3(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={solve3Avogadro} className="w-full bg-[#8B5A2B] hover:bg-[#684626] text-white py-3 rounded-xl font-bold transition-all text-sm shadow-md flex items-center justify-center gap-2 mt-4">
                <Calculator size={18}/> Hitung Avogadro (3 Gas)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* =====================================================================
   3. VIEW KUIS FLIP CARD (RESPONSIF MOBILE & ELEGAN)
======================================================================== */
const KuisView = () => {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const BLOOKET_LINK = "https://play.blooket.com/play"; 

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* GAMIFICATION BANNER */}
      <div className="bg-gradient-to-br from-[#8B5A2B] to-[#5C3C1E] rounded-2xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border-4 border-[#D9A05B]">
        <div className="space-y-2 max-w-lg text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="bg-white text-[#8B5A2B] text-[10px] sm:text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Mode Gamifikasi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">Latihan Mandiri via Blooket</h3>
          <p className="text-[#F5E6D3] text-xs sm:text-sm">Bosan dengan kuis biasa? Uji ketangkasanmu dan main bareng teman kelas melalui Blooket. Dapatkan ID Game dari gurumu dan menangkan skor tertingginya!</p>
        </div>
        <a 
          href={BLOOKET_LINK} 
          target="_blank" 
          rel="noreferrer"
          className="bg-[#D9A05B] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-extrabold hover:bg-[#C0853D] transition shadow-xl hover:-translate-y-1 transform whitespace-nowrap flex items-center gap-2 border-b-4 border-[#A3662B] text-xs sm:text-sm"
        >
          <Play size={16} fill="currentColor" /> Masuk ke Blooket
        </a>
      </div>

      {/* INTERNAL QUIZ SECTION */}
      <div className="bg-white p-5 sm:p-10 rounded-3xl shadow-md border border-[#E8DCC8]">
        <h3 className="text-xl sm:text-2xl font-bold text-[#4A3018] mb-4 border-b border-[#E8DCC8] pb-4 flex items-center gap-2">
          <PenTool className="text-[#8B5A2B]" /> 10 Kartu Kuis Interaktif (Flip Card)
        </h3>
        <p className="text-[#8B5A2B] text-xs sm:text-sm mb-8 leading-normal">
          Uji pemahamanmu secara instan! Klik kartu pertanyaan di bawah untuk membalik kartu dan melihat jawaban serta pembahasan lengkapnya secara langsung.
        </p>

        {/* RESPONSIVE FLIP CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BANK_SOAL_FLIP.map((soal) => {
            const isFlipped = flippedCards[soal.id];
            return (
              <div 
                key={soal.id} 
                onClick={() => toggleFlip(soal.id)}
                className="w-full h-64 perspective-1000 cursor-pointer"
              >
                <div 
                  className={`w-full h-full duration-500 transform-style-3d relative transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                  {/* SISI DEPAN (FRONT) - PERTANYAAN */}
                  <div className="absolute w-full h-full backface-hidden bg-white p-5 rounded-2xl border-2 border-[#D9A05B] shadow-md flex flex-col justify-between hover:border-[#8B5A2B] transition-colors">
                    <div>
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-3">
                        <span className="text-[10px] font-bold text-[#8B5A2B] uppercase">Soal #{soal.id}</span>
                        <BrainCircuit size={16} className="text-[#D9A05B]" />
                      </div>
                      <p className="text-sm font-semibold text-[#4A3018] leading-relaxed line-clamp-5">
                        {soal.pertanyaan}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold text-[#8B5A2B] uppercase flex items-center gap-1.5 self-end">
                      Klik untuk lihat jawaban <ArrowRightCircle size={12}/>
                    </div>
                  </div>

                  {/* SISI BELAKANG (BACK) - JAWABAN & PEMBAHASAN */}
                  <div className="absolute w-full h-full rotate-y-180 backface-hidden bg-[#4A3018] text-[#F5E6D3] p-5 rounded-2xl border-2 border-[#D9A05B] shadow-md flex flex-col justify-between overflow-y-auto">
                    <div>
                      <div className="flex justify-between items-center border-b border-[#684626] pb-2 mb-3 text-xs">
                        <span className="text-[10px] font-bold text-[#D9A05B] uppercase">Jawaban #{soal.id}</span>
                        <CheckCircle size={14} className="text-green-400" />
                      </div>
                      <div className="text-sm font-bold text-white mb-2 leading-relaxed">
                        {soal.jawaban}
                      </div>
                      <p className="text-xs text-stone-300 leading-normal">
                        <b className="text-[#D9A05B]">Pembahasan:</b> {soal.pembahasan}
                      </p>
                    </div>
                    <div className="text-[9px] font-semibold text-stone-400 self-end mt-2 uppercase text-[10px]">
                      Klik kembali untuk melihat pertanyaan
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
   4. VIEW AI TUTOR (LIVE GEMINI API) - DIPERBAIKI (TIDAK STUCK)
======================================================================== */
const AITutorView = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Halo bro/sis! 👋 Aku ChemBot, tutor Kimia pribadimu. Santai aja, kalau ada konsep kimia yang bikin pusing (kayak rasio Dalton atau hitungan Avogadro), tanyain aja pakai bahasamu sehari-hari. Let's study smart! 🚀" }
  ]);
  const [inputBox, setInputBox] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const callGeminiWithBackoff = async (userPrompt, retries = 5, delay = 1000) => {
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemInstruction = "Kamu adalah ChemBot, Tutor Kimia yang asyik, gaul, dan ramah. Target muridmu adalah remaja SMA. Gunakan sapaan kekinian (bro, sis, guys). Jelaskan konsep Kimia secara simpel dan memotivasi. JANGAN menggunakan markdown format LaTeX untuk rumus, gunakan HTML tag <sub> dan <sup> (contoh: H<sub>2</sub>O). Jangan kaku, beri semangat saat menjelaskan.";

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Aduh, otak AInya lagi nge-hang sebentar. Tanya lagi dong!";
      } catch (e) {
        if (i === retries - 1) return "Wah, koneksiku ke server putus nih bro. Coba refresh aplikasi ya! 🛠️";
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
    }
  };

  const handleSend = async () => {
    if (!inputBox.trim() || isTyping) return;
    const userMsg = inputBox;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputBox('');
    setIsTyping(true);

    try {
      const responseText = await callGeminiWithBackoff(userMsg);
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Maaf bro/sis, jaringanku lagi ngadat nih. Silakan coba kirim ulang ya!" }]);
    } finally {
      setIsTyping(false); // Pastikan status loading dihentikan apapun yang terjadi
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-3xl shadow-lg border border-[#E8DCC8] overflow-hidden animate-fade-in">
      <div className="bg-[#4A3018] p-4 sm:p-5 text-[#F5E6D3] flex items-center gap-4 shadow-md z-10">
        <div className="bg-[#D9A05B] p-2 rounded-full flex-shrink-0">
           <BrainCircuit className="text-white w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <div>
           <h3 className="font-bold text-lg sm:text-xl tracking-wide">ChemSpace AI Live</h3>
           <p className="text-[10px] sm:text-xs text-[#D9A05B] font-medium flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online (Powered by Gemini)
           </p>
        </div>
      </div>
      
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-[#F5F7FA] space-y-4 sm:space-y-5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
               className={`max-w-[85%] md:max-w-[70%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm md:text-base shadow-sm ${
                 msg.sender === 'user' 
                 ? 'bg-[#8B5A2B] text-white rounded-br-none' 
                 : 'bg-white text-[#334E68] rounded-bl-none border border-[#D9E2EC]'
               }`}
               dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
            />
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white text-stone-500 p-4 rounded-2xl rounded-bl-none text-xs sm:text-sm font-medium border border-stone-200 shadow-sm flex items-center gap-2">
               ChemBot sedang mengetik <span className="flex gap-1"><span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></span><span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></span></span>
             </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 sm:p-4 bg-white border-t border-[#E8DCC8] flex gap-2 sm:gap-3 items-center">
        <input 
          type="text" 
          value={inputBox} 
          onChange={e=>setInputBox(e.target.value)} 
          onKeyDown={e=>e.key==='Enter' && handleSend()} 
          placeholder="Tanya apapun soal kimia di sini..." 
          disabled={isTyping} 
          className="flex-1 bg-[#FAF6F0] border border-[#E8DCC8] rounded-full px-5 py-3 sm:py-4 text-xs sm:text-sm outline-none focus:border-[#D9A05B] focus:ring-1 focus:ring-[#D9A05B] transition-all text-[#4A3018] placeholder-stone-400"
        />
        <button 
          onClick={handleSend} 
          disabled={isTyping || !inputBox.trim()} 
          className="bg-[#4A3018] text-white p-3 sm:p-4 rounded-full flex justify-center items-center hover:bg-[#5C3C1E] disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};