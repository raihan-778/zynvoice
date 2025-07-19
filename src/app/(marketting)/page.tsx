// src/app/(marketing)/page.tsx  <-- ONLY this file was edited
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Mail,
  Palette,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ---------- HERO ---------- */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-[90vh] items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* Animated mesh gradient — dark only */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.5),rgba(25,25,25,0))]"
      />
      <div className="container z-10 mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold tracking-tight text-slate-100 sm:text-6xl md:text-7xl"
        >
          InvoiceGen{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600">
            Pro
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-slate-300"
        >
          From start-ups to Fortune 500s: create, export, and deliver invoices
          that close deals faster.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10"
        >
          <Button
            size="lg"
            className="rounded-full bg-cyan-500 px-10 py-4 text-lg font-semibold text-slate-950 hover:bg-cyan-400"
            asChild
          >
            <Link href="/invoices/new" className="flex items-center gap-2">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- STATS TICKER ---------- */
const StatsTicker = () => {
  const [values, setValues] = useState([0, 0, 0]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const targets = [12470, 4.9, 50];
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      setValues(targets.map((t) => Math.round((t * frame) / steps)));
      if (frame === steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [inView]);

  const stats = [
    { value: values[0], suffix: "+", label: "Invoices sent" },
    { value: values[1], suffix: "/5 ⭐", label: "User rating" },
    { value: values[2], suffix: "ms", label: "API latency" },
  ];

  return (
    <section ref={ref} className="bg-slate-900 py-16">
      <div className="container mx-auto flex justify-around gap-8 px-4 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              {s.value}
              {s.suffix}
            </p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ---------- FEATURE CARDS 3D ---------- */
const FeatureCards = () => {
  const features = [
    {
      icon: Palette,
      title: "Designer Templates",
      desc: "Pixel-perfect themes for every brand.",
    },
    {
      icon: Download,
      title: "Instant Export",
      desc: "PDF & PNG in 4K resolution.",
    },
    {
      icon: Mail,
      title: "One-Click Email",
      desc: "Integrated SMTP + tracking.",
    },
    {
      icon: ShieldCheck,
      title: "SOC-2 Compliant",
      desc: "End-to-end encryption & audit logs.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-24 bg-slate-950">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center mb-16 text-slate-100"
      >
        Built for <span className="text-cyan-400">scale & beauty</span>
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, delay: i * 0.1 }}
            whileHover={{ rotateY: 5, rotateX: 5 }}
            className="perspective"
          >
            <Card className="rounded-2xl border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-xl shadow-purple-900/30 hover:shadow-cyan-500/40 transition-shadow">
              <CardHeader>
                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600">
                  <Icon className="h-7 w-7 text-slate-950" />
                </div>
                <CardTitle className="text-slate-100">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">{desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ---------- PRICING ---------- */
const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      desc: "Up to 5 invoices / mo",
      features: ["3 Templates", "PDF Export", "Email Support"],
    },
    {
      name: "Pro",
      price: "$19",
      desc: "/ month",
      features: [
        "Unlimited invoices",
        "All Templates",
        "Custom branding",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "",
      features: ["SOC-2", "SSO", "Dedicated CSM", "SLA"],
    },
  ];

  return (
    <section className="container mx-auto px-4 py-24 bg-slate-950">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-100">
        Transparent Pricing
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card
              className={cn(
                "relative rounded-2xl border-slate-800 bg-slate-900/50 backdrop-blur-md",
                i === 1 && "border-cyan-400 shadow-lg shadow-cyan-500/30"
              )}
            >
              {i === 1 && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl text-slate-100">
                  {p.name}
                </CardTitle>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                  {p.price}
                </p>
                <p className="text-sm text-slate-400">{p.desc}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={i === 1 ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ---------- FAQ ---------- */
const FAQ = () => {
  const faqs = [
    {
      q: "Is my data secure?",
      a: "Yes. We are SOC-2 Type II certified and all traffic is TLS 1.3 encrypted.",
    },
    {
      q: "Can I white-label invoices?",
      a: "Absolutely—custom domains, logos, and color palettes are available on Pro & Enterprise.",
    },
    {
      q: "Do you offer API access?",
      a: "Yes, REST & GraphQL endpoints with token-based auth are included in Enterprise.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-24 bg-slate-950">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-100">
        FAQ
      </h2>
      <Accordion type="single" collapsible className="max-w-2xl mx-auto">
        {faqs.map(({ q, a }, i) => (
          <AccordionItem key={i} value={q}>
            <AccordionTrigger className="text-slate-200">{q}</AccordionTrigger>
            <AccordionContent className="text-slate-300">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};



/* ---------- FINAL EXPORT ---------- */
export default function Home() {
  return (
    <>
      <Hero />
      <StatsTicker />
      <FeatureCards />
      <Pricing />
      <FAQ />
  
    </>
  );
}
