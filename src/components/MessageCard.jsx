export default function MessageCard() {
  return (
    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-3">A Note from me</h3>
      <div>
        <p className="text-gray-600 leading-relaxed">
          I'm reaching out with a humble request for support. As an anonymous initiative,
          I value your trust and privacy above all. Every contribution, whether big or small,
          will bring me closer to my goal of ₹10,69,879 which is almost 11 lakh.
        </p>
        <p className="text-gray-600 leading-relaxed mt-4">
          Your name will be listed below as a token of our gratitude.
          Thank you for considering being part of this journey.
        </p>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">— Mr Zero</p>
      </div>
    </div>
  )
}