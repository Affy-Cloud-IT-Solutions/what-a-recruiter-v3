// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const JobsPipeline = () => {
//   const jobPipelineData = [
//     {
//       job: "UI/UX Designer",
//       new: "3 Candidates",
//       inReview: "3 Candidates",
//       interview: "3 Candidates",
//       offered: "3 Candidates",
//       hired: "3 Candidates",
//     },
//     {
//       job: "Front End Developer",
//       new: "3 Candidates",
//       inReview: "3 Candidates",
//       interview: "3 Candidates",
//       offered: "3 Candidates",
//       hired: "3 Candidates",
//     },
//     {
//       job: "Backend Developer",
//       new: "3 Candidates",
//       inReview: "3 Candidates",
//       interview: "3 Candidates",
//       offered: "3 Candidates",
//       hired: "3 Candidates",
//     },
//     {
//       job: "SAP Consultant",
//       new: "3 Candidates",
//       inReview: "2 Candidates",
//       interview: null,
//       offered: null,
//       hired: null,
//     },
//     {
//       job: "Product Manager",
//       new: "3 Candidates",
//       inReview: null,
//       interview: null,
//       offered: null,
//       hired: null,
//     },
//     {
//       job: "CSA",
//       new: "3 Candidates",
//       inReview: null,
//       interview: null,
//       offered: null,
//       hired: null,
//     },
//     {
//       job: "Designer",
//       new: "3 Candidates",
//       inReview: "3 Candidates",
//       interview: null,
//       offered: "3 Candidates",
//       hired: null,
//     },
//   ];

//   return (
//     <div className="py-2">
//       <div className="">
//         <h3 className=" mb-4">Jobs Pipeline</h3>
//         <Table responsive className=" w-full border">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="p-3">Jobs</TableHead>
//               <TableHead className="p-3">New</TableHead>
//               <TableHead className="p-3">In-Review</TableHead>
//               <TableHead className="p-3">Interview</TableHead>
//               <TableHead className="p-3">Offered</TableHead>
//               <TableHead className="p-3">Hired</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {jobPipelineData?.map((job, index) => (
//               <TableRow key={index} className="m-2">
//                 <TableCell className=" p-2 px-3 bullet-div font-medium  ">
//                   {job.job}
//                 </TableCell>
//                 <TableCell className=" p-1">
//                   <div
//                     className=" px-2 p-2 m-1 bullet-div bg-blue-300  text-white"
//                     style={{ fontSize: ".8rem" }}
//                   >
//                     {job.new || "-"}
//                   </div>
//                 </TableCell>
//                 <TableCell className=" p-1">
//                   <div
//                     className=" px-2 p-2 m-1 bullet-div  bg-blue-400  text-white"
//                     style={{ fontSize: ".8rem" }}
//                   >
//                     {job.inReview || "-"}
//                   </div>
//                 </TableCell>
//                 <TableCell className=" p-1">
//                   <div
//                     className=" px-2 p-2 m-1 bullet-div  bg-blue-500 text-white"
//                     style={{ fontSize: ".8rem" }}
//                   >
//                     {job.interview || " -"}
//                   </div>
//                 </TableCell>
//                 <TableCell className="  p-1">
//                   <div
//                     className=" px-2 p-2 m-1 bullet-div   bg-blue-900 text-white"
//                     style={{ fontSize: ".8rem" }}
//                   >
//                     {job.offered || "- "}
//                   </div>
//                 </TableCell>
//                 <TableCell className=" p-1">
//                   <div
//                     className=" px-2 p-2 m-1 bullet-div text-white bg-blue-950 "
//                     style={{ fontSize: ".8rem" }}
//                   >
//                     {job.hired || " -"}
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default JobsPipeline;


const JobsPipeline = () => {
  const jobPipelineData = [
    {
      job: "UI/UX Designer",
      new: "3",
      inReview: "3",
      interview: "3",
      offered: "3",
      hired: "3",
    },
    {
      job: "Front End Developer",
      new: "3",
      inReview: "3",
      interview: "3",
      offered: "3",
      hired: "3",
    },
    {
      job: "Backend Developer",
      new: "3",
      inReview: "3",
      interview: "3",
      offered: "3",
      hired: "3",
    },
    {
      job: "SAP Consultant",
      new: "3",
      inReview: "2",
      interview: null,
      offered: null,
      hired: null,
    },
    {
      job: "Product Manager",
      new: "3",
      inReview: null,
      interview: null,
      offered: null,
      hired: null,
    },
  ];

  const statusLabels = [
    { key: "new", label: "New", color: "bg-blue-100 text-blue-800" },
    { key: "inReview", label: "In Review", color: "bg-yellow-100 text-yellow-800" },
    { key: "interview", label: "Interview", color: "bg-purple-100 text-purple-800" },
    { key: "offered", label: "Offered", color: "bg-green-100 text-green-800" },
    { key: "hired", label: "Hired", color: "bg-gray-100 text-gray-800" },
  ];

  return (
    <div className="pt-6">
      <div className="grid grid-cols-6 gap-4 mb-4 px-2 font-semibold text-xs text-gray-700">
        <div className="col-span-1">Job Title</div>
        {statusLabels.map(({ label }, idx) => (
          <div key={idx} className="text-center">
            {label}
          </div>
        ))}
      </div>

      {/* Job cards */}
      <div className="space-y-4">
        {jobPipelineData.map((job, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
          >
            <div className="font-medium text-xs text-gray-900 flex items-center">
              {job.job}
            </div>
            {statusLabels.map(({ key, color }) => (
              <div key={key} className="flex items-center justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job[key] ? color : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {job[key] || "-"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPipeline;
;
