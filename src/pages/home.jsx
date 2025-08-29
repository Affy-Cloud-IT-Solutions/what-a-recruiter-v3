import Faq1 from "@/components/Home";
import Navbar from "@/components/shared/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, navLinks } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Home = () => {
  const [linksToDisplay, setLinksToDisplay] = useState("/login");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded?.claims?.role;

        if (role && navLinks[role]) {
          setLinksToDisplay(navLinks[role][0]);
        } else {
          setLinksToDisplay("/login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setLinksToDisplay("/login");
      }
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80 ">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      {/* <div className="mb-3 cursor-pointer rounded-[14px] border border-black/10 bg-white text-base md:left-6">
        <SparklesIcon className=" mr-2  fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
        Component Preview
      </div> */}
      <div className="px-4 py-12 md:py-36 mx-auto">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-6xl dark:text-slate-300">
          {"Simplify Hiring, reduce Workload, and Find Top Talent with AI"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-8 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Simplify your recruitment journey with AI-poweyellow insights. From
          sourcing to selection, our platform streamlines every step to help you
          find the right talent without the hassle. up.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className=" z-10  flex flex-wrap items-center justify-center gap-4"
        >
          <NavLink
            to={linksToDisplay.path}
            className={[
              buttonVariants,
              "w-60 transform rounded-lg bg-blue-950 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200",
            ]}
          >
            {linksToDisplay.name || "Get Started"}
          </NavLink>{" "}
          <button className="w-60 transform rounded-lg border border-gray-300 bg-yellow-500 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>
        <div className="min-h-screen py-6 sm:py-14 mx-auto ">
          <div className="pointer-events-none absolute inset-0 top-0 z-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-transparent opacity-50 blur-[100px]" />
            <div className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-yellow-500/30 via-yellow-500/20 to-transparent opacity-50 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-500/10 to-transparent opacity-30 blur-[80px]" />
          </div>
          <main className="relative container mt-4 max-w-[1100px] px-2 py-4 lg:py-8">
            <div className="relative sm:overflow-hidden">
              <div className="border-primary/20 bg-background/70 shadow-primary/10 relative flex flex-col items-start justify-start rounded-xl border px-4 pt-12 shadow-xl backdrop-blur-md max-md:text-center md:px-12 md:pt-16">
                <div
                  className="animate-gradient-x absolute inset-0 top-32 z-0 hidden blur-2xl dark:block"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, transparent, white, transparent)",
                    background:
                      "repeating-linear-gradient(65deg, hsl(var(--primary)), hsl(var(--primary)/0.8) 12px, color-mix(in oklab, hsl(var(--primary)) 30%, transparent) 20px, transparent 200px)",
                    backgroundSize: "200% 100%",
                  }}
                />
                <div
                  className="animate-gradient-x absolute inset-0 top-32 z-0 text-left blur-2xl dark:hidden"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, transparent, white, transparent)",
                    background:
                      "repeating-linear-gradient(65deg, hsl(var(--primary)/0.9), hsl(var(--primary)/0.7) 12px, color-mix(in oklab, hsl(var(--primary)) 30%, transparent) 20px, transparent 200px)",
                    backgroundSize: "200% 100%",
                  }}
                />
                <h1 className="mb-4 flex flex-wrap gap-2 text-3xl leading-tight font-medium md:text-5xl">
                  Streamline{" "}
                  <span className="text-primary">Your Hiring Process</span> with
                  WAR
                </h1>
                <p className="text-muted-foreground mb-8 text-left md:max-w-[80%] md:text-xl">
                  Streamline your hiring process with WAR’s powerful recruitment
                  automation system. From posting jobs to managing candidate
                  pipelines, WAR eliminates repetitive tasks so your team can
                  focus on what matters—hiring the right talent faster.
                </p>
                <div className="mb-6 flex flex-wrap gap-4 md:flex-row">
                  <div className="flex items-center gap-2">
                    <svg
                      className="text-primary h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Streamlined Hiring Flow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="text-primary h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Role-Based Access Control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="text-primary h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Candidate Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="text-primary h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Easy Job Posting</span>
                  </div>
                </div>

                {/* <div className="z-10 mt-2 inline-flex items-center justify-start gap-3">
                  <a
                    href="#"
                    className={cn(
                      buttonVariants({
                        size: "lg",
                        className:
                          "from-primary to-primary/80 text-primary-foreground rounded-full bg-gradient-to-b",
                      })
                    )}
                  >
                    Getting Started <ArrowRight className="size-4" />
                  </a>
                  <a
                    href="https://github.com/subhadeeproy3902/mvpblocks"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      buttonVariants({
                        size: "lg",
                        variant: "outline",
                        className: "bg-background rounded-full",
                      })
                    )}
                  >
                    GitHub{" "}
                    <svg
                      className="ml-1 inline size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </a>
                </div> */}
                <div className="relative z-10 mt-16 w-full">
                  <img
                    src="image.png"
                    alt="MVPBlocks component library preview"
                    width={1000}
                    height={600}
                    className="animate-in fade-in slide-in-from-bottom-12 z-10 mx-auto -mb-60 w-full rounded-lg border-6 border-neutral-100 object-cover shadow-2xl duration-1000 select-none lg:-mb-40 dark:border-neutral-600"
                  />
                  <div className="animate-in fade-in slide-in-from-left-4 absolute -top-6 -right-6 rotate-6 transform rounded-lg bg-white p-3 shadow-lg dark:bg-neutral-900">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="font-medium">
                        streamline hiring with automation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Faq1 />
    </div>
  );
};

export default Home;
