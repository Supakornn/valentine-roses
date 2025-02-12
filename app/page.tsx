import RoseSender from "@/components/RoseSender";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8 pt-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-pink-600 mb-4">💝 Valentine Rose Sender</h1>
          <p className="text-lg text-gray-600">
            Send a roses with love messages to someone special
          </p>
        </header>
        <RoseSender />
      </div>
    </main>
  );
}
