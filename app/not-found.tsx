import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container-raiz grid min-h-[70vh] place-items-center pt-28 text-center">
      <div>
        <img src="/img/char-lector.svg" alt="" className="mx-auto w-40" />
        <h1 className="h-display mt-6 text-4xl">Este camino no existe</h1>
        <p className="mt-3 text-tinta/70">Pero siempre se puede volver a empezar.</p>
        <Link href="/" className="btn-primary mt-8">Volver al inicio</Link>
      </div>
    </div>
  );
}
