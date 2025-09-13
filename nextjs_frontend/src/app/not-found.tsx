import React from "react";

export default function NotFound() {
  return (
    <main className="container py-10">
      <section className="card" role="alert" aria-live="assertive">
        <header>
          <h1 className="title">404 – Page Not Found</h1>
          <p className="subtitle mt-1">The page you’re looking for doesn’t exist.</p>
        </header>
      </section>
    </main>
  );
}
