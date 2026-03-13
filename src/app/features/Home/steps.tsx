"use client";

import { Button } from "@/app/components/ui/button/button";

export default function Steps() {
    return (
        <div className="relative">
            <section className="relative bg-[#fff4ed] shadow-2xl rounded-3xl w-full flex flex-col items-center p-8 justify-between text-center font-poppins z-20 max-w-7xl mx-auto mt-20">
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#302E81] leading-tight mb-4 px-4 sm:px-0">
                        Effortlessly Manage Your <br className="hidden sm:block" /> Debt Today
                    </h1>
                    <p className="max-w-2xl text-sm sm:text-base text-[#302E81] mb-8">
                        Our debt calculator simplifies your financial planning. Follow our easy steps to take control of your debt.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between shadow-lg rounded-2xl border border-[#dcd3cd] items-stretch w-full gap-6">
                    <div className="p-6 flex-1  transition flex flex-col items-start text-left">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#302E81] mb-2">
                            Step 1: Input Your<br />Debt Information
                        </h2>
                        <p className="text-sm text-[#302E81]">
                            Enter your total debt amount and interest rates.
                        </p>
                    </div>
                    <div className="p-6 flex-1    transition flex flex-col items-start text-left">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#302E81] mb-2">
                            Step 2: Choose Your<br />Payment Plan
                        </h2>
                        <p className="text-sm text-[#302E81]">
                            Select a payment plan that fits your budget.
                        </p>
                    </div>
                    <div className="p-6 flex-1    transition flex flex-col items-start text-left">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#302E81] mb-2">
                            Step 3: Review Your<br />Results
                        </h2>
                        <p className="text-sm text-[#302E81]">
                            Review repayments, choose smartly.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center sm:flex-row gap-4 mt-8">
                    <Button className="bg-[#302E81] text-white py-3 px-6 rounded-lg font-semibold transition-colors hover:bg-opacity-90">
                        Start Calculating
                    </Button>
                    <button className="bg-transparent text-black py-3 px-6 rounded-full font-semibold transition-colors hover:bg-gray-100 flex items-center gap-2">
                        Learn More
                        <i className="bi bi-chevron-right bg-black text-white rounded-r-md px-1"></i>
                    </button>
                </div>
            </section>

        </div>
    );
}
