import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";

const conversation = [
  {
    id: "missed",
    type: "missed-call",
    time: "2:14 PM",
  },
  {
    id: "b1",
    type: "outgoing",
    text: "Hey Sarah! This is Mike @ Cool Breeze HVAC 👋 Sorry I missed your call — I'm on a job right now. What can I help you with?",
    time: "2:14 PM",
    label: "Sent automatically",
  },
  {
    id: "b2",
    type: "incoming",
    text: "Hi! My AC stopped working this morning and it's supposed to be 94° tomorrow 😰 Do you have any openings?",
    time: "2:15 PM",
  },
  {
    id: "b3",
    type: "outgoing",
    text: "Absolutely — we have same-day and next-morning slots in your area. Can you confirm your zip code so I can check availability?",
    time: "2:15 PM",
    label: "Sent automatically",
  },
  {
    id: "b4",
    type: "incoming",
    text: "21210 — Federal Hill area",
    time: "2:16 PM",
  },
  {
    id: "b5",
    type: "outgoing",
    text: "Perfect — we're in your area tomorrow at 8AM or 11AM. Which works better? I'll confirm the tech right now 🔧",
    time: "2:16 PM",
    label: "Sent automatically",
  },
  {
    id: "b6",
    type: "incoming",
    text: "8AM works!! You just saved my summer 😅",
    time: "2:17 PM",
  },
];

const STEP_DELAYS = [600, 2400, 4600, 7000, 9000, 11200, 13400];

export default function MissedCallDemoSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const bodyRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const runDemo = () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisibleCount(0);
    setShowTyping(false);

    conversation.forEach((item, i) => {
      const t = setTimeout(() => {
        if (item.type === "outgoing") {
          setShowTyping(true);
          const t2 = setTimeout(() => {
            setShowTyping(false);
            setVisibleCount(i + 1);
          }, 700);
          timersRef.current.push(t2);
        } else {
          setVisibleCount(i + 1);
        }
      }, STEP_DELAYS[i]);
      timersRef.current.push(t);
    });

    const done = setTimeout(() => setIsRunning(false), STEP_DELAYS[conversation.length - 1] + 1500);
    timersRef.current.push(done);
  };

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [visibleCount, showTyping]);

  useEffect(() => () => clearTimers(), []);

  return (
    <section
      id="demo"
      data-testid="demo-section"
      className="section-spacing bg-neutral-offWhite border-t border-neutral-200"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-orange font-heading font-bold uppercase tracking-wider mb-3">
            See It Live
          </p>
          <h2 className="heading-lg text-navy mb-4">
            The Missed Call That Becomes a Booked Job
          </h2>
          <p className="text-neutral-800/70 font-body text-lg max-w-2xl mx-auto">
            You're on a roof. Your phone rings. You can't answer. Here's what happens next — automatically.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start justify-center max-w-5xl mx-auto">

          {/* Phone Mockup */}
          <div className="mx-auto lg:mx-0 flex-shrink-0">
            {/* Trigger button above phone */}
            <div className="flex justify-center mb-4">
              <Button
                onClick={runDemo}
                disabled={isRunning}
                className="bg-orange hover:bg-orange-hover text-white font-bold uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all px-6 py-3 rounded-sm text-sm"
                data-testid="demo-trigger-btn"
              >
                {isRunning ? "▶ Playing..." : "▶ Trigger Demo"}
              </Button>
            </div>

            {/* Phone shell */}
            <div
              className="relative bg-[#1c1c1e] rounded-[2.5rem] p-3 shadow-2xl"
              style={{ width: 272 }}
              data-testid="phone-mockup"
            >
              {/* Notch */}
              <div className="w-24 h-5 bg-[#1c1c1e] rounded-b-2xl mx-auto relative z-10 -mb-1" />

              {/* Screen */}
              <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col" style={{ minHeight: 500 }}>
                {/* SMS header */}
                <div className="bg-[#f2f2f7] px-4 py-3 text-center border-b border-[#e0e0e5]">
                  <div className="font-heading font-bold text-sm text-[#1c1c1e]">
                    🏠 Sarah M. — Baltimore, MD
                  </div>
                  <div className="font-body text-xs text-[#8e8e93]">
                    Homeowner · AC not working
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={bodyRef}
                  className="flex-1 px-3 py-3 flex flex-col gap-2 overflow-y-auto"
                  style={{ maxHeight: 400 }}
                >
                  {conversation.map((item, i) => {
                    if (i >= visibleCount) return null;

                    if (item.type === "missed-call") {
                      return (
                        <div key={item.id} className="text-center my-1">
                          <span className="inline-block bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full font-body">
                            📵 Missed Call — {item.time}
                          </span>
                        </div>
                      );
                    }

                    if (item.type === "outgoing") {
                      return (
                        <div key={item.id} className="flex justify-end">
                          <div className="max-w-[78%]">
                            <div className="bg-[#007aff] text-white text-xs leading-relaxed px-3 py-2 rounded-[18px] rounded-br-[4px] font-body">
                              {item.text}
                            </div>
                            {item.label && (
                              <div className="text-[10px] text-[#8e8e93] text-right mt-0.5 font-body">
                                {item.time} · {item.label}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (item.type === "incoming") {
                      return (
                        <div key={item.id} className="flex justify-start">
                          <div className="max-w-[78%]">
                            <div className="bg-[#e9e9eb] text-[#1c1c1e] text-xs leading-relaxed px-3 py-2 rounded-[18px] rounded-bl-[4px] font-body">
                              {item.text}
                            </div>
                            <div className="text-[10px] text-[#8e8e93] mt-0.5 font-body">
                              {item.time}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}

                  {/* Typing indicator */}
                  {showTyping && (
                    <div className="flex justify-end">
                      <div className="bg-[#007aff] px-3 py-2 rounded-[18px] rounded-br-[4px] flex gap-1 items-center">
                        {[0, 1, 2].map((dot) => (
                          <span
                            key={dot}
                            className="block w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce"
                            style={{ animationDelay: `${dot * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Idle prompt */}
                  {visibleCount === 0 && !isRunning && (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-[#8e8e93] text-xs text-center font-body px-4">
                        Press "Trigger Demo" to watch the automation play out live
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Explainer */}
          <div className="flex-1 min-w-0 max-w-lg">
            <h3 className="font-heading font-bold text-2xl text-navy mb-6">
              How It Works — In Under 90 Seconds
            </h3>

            <div className="space-y-5">
              {[
                {
                  n: "1",
                  title: "Homeowner calls. You miss it.",
                  desc: "You're on a job, on the roof, or just slammed. It happens every day.",
                },
                {
                  n: "2",
                  title: "System detects the missed call instantly.",
                  desc: "No app. No action needed from you. Fully automatic.",
                },
                {
                  n: "3",
                  title: "Branded SMS fires in under 90 seconds.",
                  desc: "Sounds like you, not a bot. Keeps the lead warm before they call your competitor.",
                },
                {
                  n: "4",
                  title: "Full conversation lands in your inbox.",
                  desc: "When you're free, you see the thread, follow up, and close the job.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 items-start">
                  <div className="w-9 h-9 bg-navy rounded-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-heading font-bold text-base">{step.n}</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-navy text-base">{step.title}</p>
                    <p className="font-body text-neutral-800/70 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stat callout */}
            <div className="mt-8 bg-navy rounded-sm p-6">
              <div className="font-heading font-extrabold text-4xl text-orange mb-1">9×</div>
              <p className="font-body text-white/80 text-sm leading-relaxed">
                Leads contacted within 5 minutes are <span className="text-white font-bold">9× more likely to convert</span> than those followed up an hour later. Our system responds in under 90 seconds — every single time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
