import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-stone-warm flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-forest-700 flex items-center justify-center mb-8">
        <svg className="w-8 h-8 text-stone-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="section-subtitle mb-4">Booking Confirmed</p>
      <h1 className="section-title mb-6">See you at Bouda Krista!</h1>
      <p className="font-sans text-forest-600 max-w-md mb-10 leading-relaxed">
        A confirmation email is on its way. Access instructions for the lockbox will arrive 24 hours before your check-in.
      </p>
      <Link href="/" className="btn-outline">
        Back to Home
      </Link>
    </div>
  );
}
