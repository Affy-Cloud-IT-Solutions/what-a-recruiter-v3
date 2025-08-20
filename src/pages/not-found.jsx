import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found-page flex items-center justify-center min-h-screen">
      <div className="circle-div w-100 h-100 bg-blue-200 -z-20 absolute -top-1/3 rounded-full"></div>
      <div className="container text-center mt-5">
        <h1 className="error-heading  " style={{ fontSize: "100px" }}>
          500
        </h1>
        <p className="error-message " style={{ fontSize: "20px" }}>
          Sorry for the inconvenience. Please go back to the home page.
        </p>
        <Button asChild>
          <Link
            to="/"
            className="btn btn-outline-primary fw-bolder text-white border-white border-3 rounded-pill mt-3"
          >
            Go to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
