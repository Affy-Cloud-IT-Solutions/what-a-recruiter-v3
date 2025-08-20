import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TopBar from "../dashboard-header";
import toast from "react-hot-toast";
import { token } from "../../../lib/utils";

const ApplicantProfile = () => {
  const navigate = useNavigate();
  const [progressCount, setProgressCount] = useState(0);
  const [status, setStatus] = useState("");

  const userInfo = token && jwtDecode(token);

  const handleProgress = (status) => {
    const statusProgress = {
      NEW: 10,
      IN_REVIEW: 25,
      INTERVIEW: 50,
      OFFERED: 75,
      HIRED: 100,
    };
    setProgressCount(statusProgress[status] || 10);
  };

  const { jobId, applicantId } = useParams();
  const [applicantData, setApplicantData] = useState("");
  const [profile, setProfile] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`job-applications/${applicantId}`);
        if (!response.data.error) {
          setApplicantData(response.data.meta);
          handleProgress(response.data.meta.status);
          setStatus(() => response?.data?.meta.status);
        } else if (response.data.error) {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching job applicant data:", error);
      }
    };

    if (applicantId) {
      fetchData();
    }
  }, [jobId, applicantId]);

  const onMoveForward = async () => {
    try {
      const payloadStatus =
        status == "PENDING"
          ? "IN_REVIEW"
          : status == "IN_REVIEW"
          ? "INTERVIEW"
          : status == "INTERVIEW"
          ? "OFFERED"
          : status == "OFFERED"
          ? "HIRED"
          : "";
      const response = await axios.put("/job-applications/status", {
        applicationId: applicantId,
        status: payloadStatus,
        updatedBy: userInfo?.claims?.id,
      });
      if (!response.data.error) {
        handleProgress(response?.data?.status);
        setStatus(response?.data?.status);
      } else if (response.data.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error moving forward", error);
    }
  };

  const [file, setFile] = useState(null);

  const handleFetchAndUpload = async () => {
    console.log(applicantData?.resumeUrl);
    try {
      const response = await fetch(applicantData?.resumeUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const fileName = applicantData?.resumeUrl.split("/").pop();
      const file = new File([blob], fileName, { type: blob.type });
      setFile(file); // Sets the file to state for further processing
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  return (
    <Container fluid className="p-3">
      <TopBar title={"Job Applicants"} />
      <Row>
        <Col xs={12} className="p-4">
          <Row className="d-flex" style={{ height: "100%" }}>
            <Col md={8} className="h-md-100 m-0 p-0 mb-4">
              <Card className="border-0">
                <Card.Body
                  className="border-black rounded-2 shadow-main"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #B9C0FF, #fff)",
                  }}
                >
                  <ArrowLeft
                    onClick={() => navigate(-1)}
                    className="position-absolute cursor-pointer "
                  />
                  <Row className="jusitfy-content-center mt-2">
                    <Col
                      xs={2}
                      sm={2}
                      className="d-flex align-items-center justify-content-center rounded-2 "
                    >
                      <div
                        className="text-light text-center p-3 d-flex align-items-center justify-content-center fs-3 bg-blue-950 text-capitalize"
                        style={{
                          height: "65px",
                          width: "65px",
                          borderRadius: 999,
                        }}
                      >
                        {applicantData?.candidateName &&
                          applicantData?.candidateName[0]}
                      </div>
                    </Col>
                    <Col xs={4} className="fw-bold ">
                      <div className="fs-3 fw-bold">
                        {applicantData?.candidateName}
                      </div>
                      <div className="d-flex flex-column justify-content-between w-100 fs-6">
                        <div className="d-flex align-items-center gap-2">
                          <Mail size={16} />
                          {applicantData?.email || "-"}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Phone size={16} />
                          {applicantData?.phone || "-"}
                        </div>
                      </div>
                    </Col>

                    <Col xs={5}>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <label>
                          <b>Applied On:</b>
                        </label>
                        {applicantData?.appliedAt
                          ? new Date(applicantData?.appliedAt).toLocaleString({
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <MapPin size={16} />
                        {applicantData?.location || "-"}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>

                <Card className="shadow-main h-100 mt-4">
                  <Card.Header className="bg-light" style={{ border: "none" }}>
                    <Nav variant="tabs" defaultActiveKey="profile">
                      <Nav.Item onClick={() => setProfile(true)}>
                        <Nav.Link eventKey="profile">Profile</Nav.Link>
                      </Nav.Item>
                      <Nav.Item onClick={() => setProfile(false)}>
                        <Nav.Link eventKey="resume">Resume</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  <Card.Body style={{ border: "none" }}>
                    {profile ? (
                      <>
                        <h6>Experience</h6>
                        <p>No experience details for this candidate yet.</p>
                        <a href="#" className="text-decoration-none text-blue">
                          ADD EXPERIENCE
                        </a>

                        <h6 className="mt-4">Education</h6>
                        <p>No education details for this candidate yet.</p>
                        <a href="#" className="text-decoration-none text-blue">
                          ADD EDUCATION
                        </a>
                      </>
                    ) : (
                      <>
                        <h6>Resume</h6>
                        {/* <div>
                          <button onClick={handleFetchAndUpload}>
                            Upload Resume
                          </button>
                          {file && <p>File ready: {file.name}</p>}
                        </div> */}
                        {applicantData?.resumeUrl ? (
                          <iframe
                            src={applicantData?.resumeUrl}
                            width="100%"
                            height="300px"
                            title="Applicant Resume"
                          />
                        ) : (
                          <>
                            <p>No Resume found for this candidate yet.</p>
                            <a
                              href="#"
                              className="text-decoration-none text-blue"
                            >
                              ADD RESUME
                            </a>
                          </>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Card>
            </Col>

            <Col md={4} className="">
              <Card className="mb-4 mb-md-0 shadow-main  ms-md-2">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div className="fs-6 bg-warning fw-bold p-1 px-3 rounded-3 w-50">
                    Applicant Profile
                  </div>
                  <div className="my-2 fs-1 fw-bold text-capitalize">
                    {" "}
                    {applicantData?.jobTitle || "-"}
                  </div>
                  {/* <div>Bangalore, Karnataka</div> */}
                  {/* <div>{status == "PENDING" ? "NEW" : status || "-"}</div> */}

                  {/* <div className="mb-1 fs-4">Rating: ★★★☆☆</div> */}
                  <div className="d-flex align-content-center flex-column ">
                    <ProgressBar
                      now={progressCount}
                      label={
                        (progressCount == 10 && "New") ||
                        (progressCount == 25 && "In-Review") ||
                        (progressCount == 50 && "Interview") ||
                        (progressCount == 75 && "Offered") ||
                        (progressCount == 100 && "Hired")
                      }
                      variant="primary"
                      className="mb-2"
                    />
                    <div className="d-flex w-100 justify-content-between mb-3 align-items-center">
                      <span>New</span>
                      <span>In-Review</span>
                      <span>Interview</span>
                      <span>Offered</span>
                      <span>Hired</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-auto align-items-center">
                    <div className="d-flex justify-content-start gap-3">
                      <div className="position-relative d-flex align-items-center justify-content-center gap-2">
                        <button
                          style={{ background: "#444B8C" }}
                          className="btn text-white d-flex justify-content-between gap-2 align-items-center "
                          onClick={onMoveForward}
                          disabled={status === "HIRED"}
                        >
                          Move Forward
                        </button>

                        {/* <div
                          onClick={toggleStatusBar}
                          className="cursor-pointer btn text-white"
                          style={{ background: "#29b447" }}
                        >
                          {isStatusPanel ? <IoChevronDown /> : <IoChevronUp />}
                        </div>
                        {isStatusPanel && (
                          <div
                            className="position-absolute"
                            style={{
                              top: "-500%",

                              minWidth: "200px",
                              height: "100%",
                            }}
                          >
                            <StatusPanel />
                          </div>
                        )} */}
                        <div className="btn-group dropup text-white">
                          <button
                            type="button"
                            style={{ background: "#444B8C" }}
                            className="btn  dropdown-toggle text-white"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          ></button>
                          <ul className="dropdown-menu">
                            <StatusPanel
                              setApplicantData={setApplicantData}
                              handleProgress={handleProgress}
                              setStatus={setStatus}
                            />
                          </ul>
                        </div>
                      </div>

                      <Button variant="outline-danger">Reject</Button>
                    </div>
                    <div className="position-relative">
                      <div className="btn-group dropup">
                        <div
                          type="button"
                          className=""
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <HiOutlineDotsVertical />
                        </div>
                        <ul className="dropdown-menu">
                          <ActionPanel />
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export function StatusPanel({ setApplicantData, handleProgress, setStatus }) {
  const { applicantId } = useParams();
  const userInfo = token && jwtDecode(token);

  const updateApplicationStatus = async (newStatus) => {
    try {
      const response = await axios.put("/job-applications/status", {
        applicationId: applicantId,
        status: newStatus,
        updatedBy: userInfo.claims.id,
      });

      if (!response.data.error) {
        setApplicantData((prev) => ({ ...prev, status: newStatus }));
        setStatus(newStatus);
        handleProgress(newStatus);
      } else if (response.data.error) {
        toast("error", { description: response.data.message });
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
  return (
    <ul className="list-unstyled">
      <li
        className="p-2 cursor-pointer status-list-item"
        onClick={() => updateApplicationStatus("PENDING")}
      >
        New
      </li>
      <li
        className="p-2 cursor-pointer status-list-item"
        onClick={() => updateApplicationStatus("IN_REVIEW")}
      >
        In-Review
      </li>
      <li
        className="p-2 cursor-pointer status-list-item"
        onClick={() => updateApplicationStatus("INTERVIEW")}
      >
        Interview
      </li>
      <li
        className="p-2 cursor-pointer status-list-item"
        onClick={() => updateApplicationStatus("OFFERED")}
      >
        Offered
      </li>
      <li
        className="p-2 cursor-pointer status-list-item"
        onClick={() => updateApplicationStatus("HIRED")}
      >
        Hired
      </li>
    </ul>
  );
}

export function ActionPanel() {
  return (
    <ul className="list-unstyled">
      <li className="cursor-pointer p-2 status-list-item ">
        Mark as withdrawn
      </li>
      <li className="cursor-pointer p-2 status-list-item ">Add to job</li>
      <li className="cursor-pointer p-2 status-list-item ">Add to community</li>
      <li className="cursor-pointer p-2 status-list-item ">
        Remove from this job
      </li>
      <li className="cursor-pointer p-2 status-list-item ">Defer</li>
      <li className="cursor-pointer p-2 status-list-item ">
        Add employee badge
      </li>
      <li className="text-danger p-2 cursor-pointer status-list-item">
        Delete candidate
      </li>
      <li className="text-danger p-2 cursor-pointer status-list-item">
        Delete job application
      </li>
    </ul>
  );
}

export default ApplicantProfile;
