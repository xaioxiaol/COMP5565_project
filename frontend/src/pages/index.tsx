import { useWeb3 } from "@/context/Web3Context";
import Link from "next/link";

export default function HomePage() {
  const { isConnected } = useWeb3();

  return (
    <div className="min-h-screen bg-[#0c0c1d] bg-opacity-95 relative overflow-hidden">
      {/* 动态背景效果 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* 装饰性光晕效果 */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center">
          <h1 className="text-5xl font-bold sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 animate-gradient-x">
            Diamond Certificate System
          </h1>
          <p className="mt-6 text-lg text-gray-300 sm:text-xl md:text-2xl max-w-3xl mx-auto">
            Blockchain-powered diamond authenticity verification and
            traceability system
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 
                  border border-gray-700/50 hover:border-purple-500/50
                  transform transition-all duration-500 hover:scale-[1.02]
                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                  before:via-purple-500/10 before:to-transparent before:translate-x-[-200%] 
                  before:animate-[shimmer_3s_infinite] before:rounded-2xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-3">{card.icon}</span>
                    <div className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                      {card.title}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-6">{card.description}</p>
                  <Link
                    href={card.href}
                    className={`inline-flex items-center px-6 py-3 rounded-xl font-medium
                      transition-all duration-300 ${
                        !card.requiresConnection || isConnected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50"
                          : "bg-gray-800 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {card.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 特性卡片数据
const featureCards = [
  {
    icon: "📜",
    title: "Certificate Verification",
    description:
      "Easily verify the authenticity of your diamond certificate and view your complete certification history.",
    buttonText: "Verify Certificate",
    href: "/verify",
    requiresConnection: false,
  },
  {
    icon: "💎",
    title: "Certificate Management",
    description: "Manage your certificates with ease.",
    buttonText: "Manage Certificates",
    href: "/certificate",
    requiresConnection: false,
  },
  {
    icon: "📋",
    title: "Full traceability",
    description: "Full traceability of your diamonds from mine to retail.",
    buttonText: "View Traceability",
    href: "/auditTrails",
    requiresConnection: false,
  },
  {
    icon: "🔄",
    title: "Transfer Ownership",
    description: "Transfer ownership of your certificates to another party.",
    buttonText: "Transfer Ownership",
    href: "/ownership",
    requiresConnection: false,
  },
];
