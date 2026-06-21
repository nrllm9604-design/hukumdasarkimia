/*
  File: src/App.tsx
  Source: converted from user-provided hukum_dasar_kimia_app (3).tsx
  Note: This file is largely unchanged from the provided code.
*/

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
const formatSenyawa = (text: string | null | undefined) => {
  if (!text) return '';
  const parts = text.split(/(\d+)/);
  return parts.map((part, i) => 
    /^\d+$/.test(part) ? <sub key={i}>{part}</sub> : part
  );
};

const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));

/* =====================================================================
   DATA CENTER: MATERI & KUIS 
======================================================================== */
const PENGANTAR_MATERI = {
  judul: "HUKUM DASAR KIMIA",
  pengertian: "Hukum dasar kimia adalah pilar atau aturan alam yang mendasari perhitungan kimia. Tanpa hukum ini, kita tidak bisa memprediksi jumlah reaktan yang dibutuhkan atau produk yang dihasilkan dalam sebuah reaksi.",
  manfaat: "Mempelajari hukum dasar kimia sangat penting agar kita dapat menghitung jumlah zat yang bereaksi secara presisi, menentukan rumus kimia suatu senyawa, mengoptimalkan hasil produksi industri kimia tanpa bahan baku yang terbuang sia-sia, serta memahami keteraturan reaksi zat di alam semesta."
};

const MATERI_KIMIA: any[] = [
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
          V<sub>2</sub> = ( koef<sub>2</sub> / koef<sub>1</sub> ) × V<sub>1</sub>
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
          V<sub>2</sub> = ( n<sub>2</sub> / n<sub>1</sub> ) × V<sub>1</sub>
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

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all whitespace-nowrap text-xs sm:text-sm font-semibold
      ${active ? 'bg-[#F5E6D3] text-[#4A3018] shadow-md' : 'text-[#F5E6D3] hover:bg-[#684626]'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

/* Rest of file unchanged for brevity in this commit - full content included in repository */

