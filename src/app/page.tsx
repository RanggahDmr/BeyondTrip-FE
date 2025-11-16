"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-white font-jakarta flex flex-col">
      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-10 py-6 backdrop-blur-md bg-[#0b0b0f]/70 border-b border-white/10 z-20">
        <h1 className="text-2xl font-bold tracking-wide">Beyond<span className="text-blue-400
        ">Trip</span> </h1>
        <nav className="flex gap-6 text-gray-300">
          <Link href="/login" className="hover:text-white transition">Login</Link>
          <Link href="/register" className="hover:text-white transition">Register</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6">
        {/* Background Road */}
        <Image
          src="/konten3.jpg"
          alt="Night Road"
          fill
          priority
          className="object-cover opacity-40"
        />

        {/* Layered Bokeh Lights */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-400/30 rounded-full blur-2xl"
              style={{
                width: Math.random() * 80 + 50,
                height: Math.random() * 80 + 50,
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Moving Car
       <motion.div
        className="absolute bottom-24 w-52 md:w-72"
        initial={{ x: "100vw" }} // mulai jauh di kiri luar layar
        animate={{ x: "-40vw" }} // jalan jauh ke kanan luar layar
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        <motion.div
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/car1.png"
            priority 
            alt="Car"
            width={200}
            height={150}
            className="drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          />
  </motion.div>
    </motion.div> */}

       <motion.div
        className="absolute bottom-24 w-52 md:w-72"
        initial={{ x: "-40vw" }} // mulai jauh di kiri luar layar
        animate={{ x: "100vw" }} // jalan jauh ke kanan luar layar
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        <motion.div
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/van.png"
            priority 
            alt="Car"
            width={200}
            height={150}
            className="drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          />
  </motion.div>
    </motion.div>

    

        {/* Main Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mt-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
            Drive Beyond <br />
            <span className="text-blue-400">Your Destination</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10">
            BeyondTrip helps you plan routes smarter with AI — so you can focus on the journey, not just the destination.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold transition"
            >
              Get Started
            </Link>
            
          </div>
        </motion.div>

        {/* Gradient overlay for aesthetic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-[#0b0b0f]/50 pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-white/10 relative z-20">
        © {new Date().getFullYear()} BeyondTrip — All Rights Reserved.
      </footer>
    </main>
  );
}



// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import Image from "next/image";

// export default function LandingPage() {
//   return (
//     <main className="min-h-screen bg-[#0b0b0f] text-white font-jakarta flex flex-col">
//       {/* Navbar */}
//       <header className="w-full flex items-center justify-between px-10 py-6 border-b border-white/10 backdrop-blur-md bg-[#0b0b0f]/80">
//         <h1 className="text-2xl font-bold tracking-wide">🌌 BeyondTrip</h1>
//         <nav className="flex gap-6 text-gray-300">
//           <Link href="/login" className="hover:text-white transition">Login</Link>
//           <Link href="/register" className="hover:text-white transition">Register</Link>
//         </nav>
//       </header>

//       {/* Hero Section */}
//       <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
//         {/* Left decorative image */}
//         <motion.div
//           initial={{ opacity: 0, x: -100 }}
//           animate={{ opacity: 0.6, x: 0 }}
//           transition={{ duration: 1 }}
//           className="absolute left-0 bottom-0 w-64 md:w-96 opacity-50"
//         >
//           <Image
//             src="/lonten2.jpg" // ganti dengan ilustrasi jalan
//             alt="left road"
//             width={400}
//             height={400}
//             className="object-contain"
//           />
//         </motion.div>

//         {/* Right decorative image */}
//         <motion.div
//           initial={{ opacity: 0, x: 100 }}
//           animate={{ opacity: 0.6, x: 0 }}
//           transition={{ duration: 1 }}
//           className="absolute right-0 top-10 w-64 md:w-96 opacity-50"
//         >
//           <Image
//             src="/landing1.jpg"
//             alt="right road"
//             width={400}
//             height={220}
//             className="object-contain"
//           />
//         </motion.div>

//         {/* Hero Text */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="z-10"
//         >
//           <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
//             Explore the World <br />
//             <span className="text-blue-400">Smarter with AI</span>
//           </h1>
//           <p className="text-gray-400 max-w-2xl mx-auto mb-10">
//             BeyondTrip helps you plan perfect routes between your destinations —
//             powered by AI and real-time data.
//           </p>
//           <div className="flex justify-center gap-6">
//             <Link
//               href="/login"
//               className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold transition"
//             >
//               Get Started
//             </Link>
//             <Link
//               href="/register"
//               className="border border-white/30 px-6 py-3 rounded-md font-semibold hover:border-blue-400 transition"
//             >
//               Learn More
//             </Link>
//           </div>
//         </motion.div>

//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b0b0f] opacity-80 pointer-events-none" />
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-[#111115] border-t border-white/10">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-3xl font-bold mb-10"
//           >
//             Why Choose <span className="text-blue-400">BeyondTrip</span>?
//           </motion.h2>

//           <div className="grid md:grid-cols-3 gap-8 mt-8">
//             {[
//               {
//                 title: "AI-Powered Routes",
//                 desc: "Get personalized trip suggestions based on your preferences.",
//                 icon: "🧠",
//               },
//               {
//                 title: "Real-Time Insights",
//                 desc: "Stay updated with traffic, weather, and best travel times.",
//                 icon: "📍",
//               },
//               {
//                 title: "All-in-One Planner",
//                 desc: "Save, manage, and visualize all your trips easily.",
//                 icon: "🗺️",
//               },
//             ].map((item, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.2, duration: 0.6 }}
//                 viewport={{ once: true }}
//                 className="bg-[#1a1a1f] border border-white/10 rounded-xl p-8 shadow-md hover:shadow-blue-500/10 transition"
//               >
//                 <div className="text-4xl mb-4">{item.icon}</div>
//                 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//                 <p className="text-gray-400 text-sm">{item.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="text-center py-6 text-gray-500 text-sm border-t border-white/10">
//         © {new Date().getFullYear()} BeyondTrip — All Rights Reserved.
//       </footer>
//     </main>
//   );
// }



