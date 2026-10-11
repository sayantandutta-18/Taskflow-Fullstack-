function Features() {
  const features = [
    {
      title: "Smart Task Management",
      description: "Create, organize and manage your daily tasks efficiently.",
      icon: "📋",
    },
    {
      title: "AI Suggestions",
      description: "Get AI-powered recommendations to improve productivity.",
      icon: "🤖",
    },
    {
      title: "Analytics Dashboard",
      description: "Track your work progress with beautiful analytics.",
      icon: "📊",
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team in one workspace.",
      icon: "👥",
    },
  ];

  return (
    <section
      id="features"
      className="bg-slate-900 text-white py-20 px-8"
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose TaskFlow AI?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-xl p-6 hover:scale-105 transition duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>

              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;