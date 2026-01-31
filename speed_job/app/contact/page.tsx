export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-gray-800">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-4">Contact Us</h1>
      <p className="text-center text-lg text-gray-600 mb-12">
        For inquiries about job applications,please reach out using the details below.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info Section */}
        <div className="space-y-8">
         

          <div className="bg-gray-100 rounded-2xl p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📧 Email</h2>
            <p className="text-gray-600">privacy@Vaco.com</p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📞 Phone</h2>
            <p className="text-gray-600">715-751-9749</p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🕒 Support Hours</h2>
            <p className="text-gray-600">
              Monday – Friday: 9:00 AM – 6:00 PM CST<br />
              Saturday – Sunday: Closed
            </p>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="rounded-2xl overflow-hidden shadow-md h-96">
          <iframe
            title="Vaco Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.147941235896!2d-86.7816!3d36.1627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8864665cf3a52a8f%3A0x6c64be05b191b2b6!2sNashville%2C%20TN!5e0!3m2!1sen!2sus!4v1710000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
