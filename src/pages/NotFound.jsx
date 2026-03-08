const NotFound = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-gray-600 mb-6">
          The page you’re looking for doesn’t exist.
        </p>
        <a
          href="/"
          className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-light transition"
        >
          Back to Home
        </a>
      </div>
    </section>
  );
};

export default NotFound;
