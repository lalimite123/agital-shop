"use client"

import Image from "next/image"

export function Hero() {
  return (
    <section className="relative h-64 w-full">
      <Image src="/image-landing.jpg" alt="Banner" fill className="object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold">Agital Soft Shop</h1>
          <p className="mt-2 text-sm">Ausgewählte Software und Angebote für Sie</p>
        </div>
      </div>
    </section>
  )
}