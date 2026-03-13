"use client";

import { Button } from "@/app/components/ui/button/button";

export default function Features() {
    return (
        <section className="relative w-full py-20 px-6 font-poppins bg-gradient-to-br from-[#ffe5db] to-[#f6f0ff]">
            <div className="max-w-6xl mx-auto text-center">
                {/* Label */}
                <p className="text-red-500 font-semibold tracking-wide uppercase my-5">
                    Features
                </p>

                {/* Heading */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#302E81] my-5">
                    Our Core Features
                </h2>

                {/* Features Grid */}
                <div className="my-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 text-left">
                        <h3 className="text-xl font-bold text-[#302E81] mb-2">
                            Accurate Debt Calculation at Your Fingertips
                        </h3>
                        <p className="text-sm text-[#302E81]">
                            Calculate your total debt quickly and accurately.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[transparent] shadow-md text-left z-20">
                        <h3 className="text-xl font-bold text-[#302E81] mb-2">
                            Stay Ahead with Interest Tracking Features
                        </h3>
                        <p className="text-sm text-[#302E81]">
                            Monitor interest rates to make informed decisions.
                        </p>
                    </div>

                    <div className="p-6 text-left">
                        <h3 className="text-xl font-bold text-[#302E81] mb-2">
                            Never Miss a Payment with Friendly Reminders
                        </h3>
                        <p className="text-sm text-[#302E81]">
                            Receive alerts to keep your payments on track.
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button className="bg-[#302E81] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90">
                        See Plans
                    </Button>
                    <button className="flex items-center gap-2 text-[#302E81] font-semibold hover:underline">
                        Learn More <span>→</span>
                    </button>
                </div>
            </div>

            {/* Background pixel effect */}
            {/* <div className="absolute bottom-0 left-0 w-40 h-40 bg-[radial-gradient(circle,rgba(48,46,129,0.5)_1px,transparent_1px)] [background-size:12px_12px] opacity-30 rounded-full" />
            <div className="absolute top-0 right-0 w-60 h-60 bg-[radial-gradient(circle,rgba(211,72,147,0.4)_1px,transparent_1px)] [background-size:14px_14px] opacity-30 rounded-full" /> */}
        </section>
    );
}
