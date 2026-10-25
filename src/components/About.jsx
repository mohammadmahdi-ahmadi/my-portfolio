import { useSite } from "../context/SiteContext.jsx";

function About() {
  const { profile } = useSite();

  // متن‌ها از پروفایل (که در پنل ادمین ویرایش می‌شود) می‌آیند
  const cards = [
    { title: "Who I am", text: profile.bio },
    { title: "My learning journey", text: profile.journey },
    { title: "My goals", text: profile.goals },
  ];

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">About me</h2>
      <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border-t-4 border-indigo-500 bg-white p-6 shadow-md"
          >
            <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
            <p className="mt-3 leading-relaxed text-slate-600">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default About;
