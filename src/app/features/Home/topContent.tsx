"use client";

import { Button } from "@/app/components/ui/button/button";

export default function TopContent() {
    return (
        <section className="relative w-full flex flex-col items-center justify-center text-center py-20 px-6 font-poppins">
            <div className="relative z-10 max-w-3xl">
                <h1 className="my-1 text-5xl md:text-7xl font-extrabold text-[#302E81]">
                    Take Control
                </h1>
                <h1 className="my-1 mt-3 text-5xl md:text-7xl font-extrabold text-[#302E81]">
                    of Your Debt Today.
                </h1>
                <p className="mt-6 text-lg md:text-xl text-[#302E81]">
                    “Our smart debt calculator helps you see your finances clearly and <br />
                    take control toward freedom”
                </p>

                <div className="mt-12">
                    <div className="p-[3px] rounded-full bg-gradient-to-r from-[#353170FF] to-[#C1CDD3FF] inline-block">
                        <Button
                            className="px-12 py-10 rounded-full text-white font-semibold text-2xl shadow-lg bg-[#302e81] hover:opacity-90 transition">
                            Start Calculating
                        </Button>
                    </div>
                </div>


                <p className="mt-10 text-xl font-semibold text-red-500 tracking-wide">
                    Trusted by 100+ Clients
                </p>
            </div>
        </section>
    );
}
