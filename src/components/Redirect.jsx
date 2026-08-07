import { Navigate } from "react-router-dom";
import { Head } from "vite-react-ssg";

// Client redirect from the old (typo'd) paths. Marked noindex so the redirect
// stubs don't compete as duplicate content — the real pages stay canonical.
export default function Redirect({ to }) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <Navigate to={to} replace />
    </>
  );
}
