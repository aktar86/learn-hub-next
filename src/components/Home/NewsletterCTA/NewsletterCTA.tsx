"use client";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={12} />
          Stay Ahead
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get Free Learning Resources
          <br />
          Delivered to Your Inbox
        </h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
          Join 50,000+ learners who receive weekly course recommendations, tips,
          and exclusive discounts.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-medium">
            <span className="text-2xl">🎉</span>
            You&apos;re in! Check your inbox soon.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-7 py-4 rounded-2xl hover:bg-blue-50 transition-colors text-sm shrink-0"
            >
              Subscribe <Send size={15} />
            </button>
          </form>
        )}

        <p className="text-blue-200 text-xs mt-5">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsletterCTA;
