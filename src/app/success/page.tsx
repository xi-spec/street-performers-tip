export default function SuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-3xl font-semibold tracking-tight">Thank you!</h1>
        <p className="text-zinc-600">
          Your support helps keep Limona Li&apos;s music journey moving forward.
        </p>
      </div>

      <section className="mt-6 space-y-2 rounded-2xl border border-dashed border-zinc-300 p-6">
        <h2 className="text-xl font-semibold">Know me</h2>
        <p className="text-sm text-zinc-500">
          Social links and deeper artist story will be added here.
        </p>
      </section>
    </main>
  );
}
