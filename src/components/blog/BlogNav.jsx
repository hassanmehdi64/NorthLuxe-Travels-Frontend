import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const BlogNav = ({ prev, next }) => {
  return (
    <div className="flex justify-between items-center border-t pt-10 mt-16 gap-6">
      {prev ? (
        <Link
          to={`/blog/${prev.slug}`}
          className="flex items-center gap-2 text-sm font-semibold hover:text-secondary transition"
        >
          <ArrowLeft size={16} />
          {prev.title}
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link
          to={`/blog/${next.slug}`}
          className="flex items-center gap-2 text-sm font-semibold hover:text-secondary transition"
        >
          {next.title}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};

export default BlogNav;
