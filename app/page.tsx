import { ArrowRight, BookOpen, Gift, Map, Sparkles, Star, Trophy, UsersRound } from "lucide-react";
import { PandiHero } from "@/components/PandiHero";

const features = [
  { icon: BookOpen, title: "Kuiz Interaktif", text: "Soalan pendek, pilihan jawapan besar dan sesuai untuk telefon." },
  { icon: Trophy, title: "XP & Badge", text: "Anak rasa seronok bila setiap usaha diberi ganjaran." },
  { icon: Map, title: "Peta Pengembaraan", text: "Topik pembelajaran disusun seperti dunia permainan." },
  { icon: UsersRound, title: "Pantauan Ibu Bapa", text: "Lihat perkembangan anak secara mudah dan ringkas." },
];

const friends = [
  { name: "Pandi", tone: "pandi", text: "Mentor utama yang membimbing anak belajar." },
  { name: "Amani", tone: "amani", text: "Berani mencuba semasa latihan Matematik." },
  { name: "Auliyaa", tone: "auliyaa", text: "Suka bertanya dan meneroka ilmu baru." },
  { name: "Aisyah", tone: "aisyah", text: "Lembut, penyayang dan suka memberi semangat." },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="skyDecor cloudOne"/><div className="skyDecor cloudTwo"/><div className="skyDecor sun"/>
        <div className="brand"><div className="brandMark">🐼</div><span>PandaiKids</span></div>
        <div className="heroContent">
          <div className="heroCopy">
            <div className="badge"><Sparkles size={16}/> Alpha 0.2 sedang dibina</div>
            <h1>Belajar jadi seronok bersama Pandi.</h1>
            <p>Aplikasi pembelajaran kanak-kanak yang menggabungkan kuiz, ganjaran, peta pengembaraan dan sahabat comel supaya anak rasa teruja untuk belajar.</p>
            <div className="heroButtons"><a className="primaryBtn" href="#preview">Lihat Preview <ArrowRight size={18}/></a><a className="secondaryBtn" href="#parents">Untuk Ibu Bapa</a></div>
          </div>
          <PandiHero />
        </div>
      </section>

      <section className="section intro" id="preview">
        <div className="sectionLabel">Apa itu PandaiKids?</div>
        <h2>Dunia kecil untuk anak belajar seperti bermain.</h2>
        <p>PandaiKids dibina untuk membantu anak belajar sedikit demi sedikit melalui pengalaman yang ceria, mudah difahami dan tidak menakutkan.</p>
        <div className="featureGrid">
          {features.map((item) => <div className="featureCard" key={item.title}><div className="featureIcon"><item.icon size={24}/></div><h3>{item.title}</h3><p>{item.text}</p></div>)}
        </div>
      </section>

      <section className="section friends">
        <div className="sectionLabel">Sahabat Pandai</div>
        <h2>Pandi di homepage. Sahabat kecil muncul semasa latihan.</h2>
        <div className="friendGrid">
          {friends.map((friend) => <div className={`friendCard ${friend.tone}`} key={friend.name}><div className="friendFace">🐼</div><h3>{friend.name}</h3><p>{friend.text}</p></div>)}
        </div>
      </section>

      <section className="section quizPreview">
        <div className="previewCard"><div className="quizTop"><span>Soalan 4/10</span><span>❤️❤️❤️</span><span>⭐ 120 XP</span></div><h2>8 + 6 = ?</h2><div className="answers"><button>12</button><button>13</button><button className="correct">14 ✅</button><button>15</button></div></div>
        <div className="previewText"><div className="sectionLabel">Preview Kuiz</div><h2>Soalan ringkas, mesra telefon dan penuh ganjaran.</h2><p>Setiap jawapan betul akan beri XP, bintang dan peluang membuka hadiah daripada Pip.</p><div className="rewardRow"><span><Star size={18}/> XP</span><span><Gift size={18}/> Hadiah</span><span><Trophy size={18}/> Badge</span></div></div>
      </section>

      <section className="section parents" id="parents">
        <div><div className="sectionLabel">Untuk Ibu Bapa</div><h2>Pantau perkembangan anak tanpa pening.</h2><p>Sasaran seterusnya ialah dashboard ibu bapa untuk melihat masa belajar, ketepatan jawapan, topik lemah dan kemajuan anak.</p></div>
        <div className="parentPanel"><div><strong>25m</strong><span>Belajar hari ini</span></div><div><strong>92%</strong><span>Ketepatan</span></div><div><strong>4</strong><span>Kuiz selesai</span></div><div><strong>3</strong><span>Hari streak</span></div></div>
      </section>

      <footer><div className="footerBrand">🐼 PandaiKids</div><p>Belajar dengan gembira. Dibina sedikit demi sedikit dengan kasih sayang.</p><div className="footerLinks"><span>Tentang</span><span>Privasi</span><span>Hubungi</span></div></footer>
    </main>
  );
}
