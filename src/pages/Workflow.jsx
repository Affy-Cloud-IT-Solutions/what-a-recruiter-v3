// // Workflow.jsx
// import { PlayIcon,ArrowBigDown, FileText, Code, WorkflowIcon, } from "lucide-react";
// import React, { useCallback, useState } from "react";
// import ReactFlow, {
//   addEdge,
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   Handle,
//   Position,
// } from "reactflow";
// import "reactflow/dist/style.css";

// const initialNodes = [];
// const initialEdges = [];

// const CustomNode = ({ data }) => {
//   const handleSubmit = () => {
//     if (data.type === "Chat Input") {
//       const sampleResponse = [
//         "Step 1: Analyze user input",
//         "Step 2: Fetch data from API",
//         "Step 3: Transform response",
//         "Step 4: Send reply to user",
//       ];
//       data.onSubmit && data.onSubmit(sampleResponse, data.id);
//     }
//   };

//   const handleUrlChange = (e) => {
//     data.onChangeUrl && data.onChangeUrl(e.target.value, data.id);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     data.onChangeFile && data.onChangeFile(file, data.id);
//   };

//   return (
//     <div className="bg-[#1E1E1E] text-white rounded-xl shadow-xl p-4 w-80 border border-gray-700 relative">
//       <div className="flex justify-between items-center mb-3">
//         <div className="flex items-center space-x-2">
//           <div className="bg-gray-800 p-2 rounded-lg text-xl">
//             {data.type === "Chat Input" ? "💬" : "🔤"}
//           </div>
//           <h3 className="font-semibold text-lg">{data.type}</h3>
//         </div>
//         <div className="text-green-500 bg-green-900 rounded-full p-1">
//           <PlayIcon size={18} />
//         </div>
//       </div>

//       <p className="text-sm text-gray-400 mb-4">
//         {data.type === "Chat Input"
//           ? "Enter Prompt to make the Workflow"
//           : "Enter Prompt to make the Workflow."}
//       </p>

//       <input
//         type="text"
//         value={data.value}
//         onChange={(e) => data.onChange(e.target.value, data.id)}
//         placeholder="Enter Prompt…"
//         className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-gray-600 outline-none mb-3"
//       />

//       {data.type === "Chat Input" && (
//         <>
//           <label className="text-sm text-gray-300 mb-1 block">Attach URL</label>
//           <input
//             type="url"
//             value={data.url || ""}
//             onChange={handleUrlChange}
//             placeholder="https://example.com"
//             className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-gray-600 outline-none mb-3"
//           />
//           <label className="text-sm text-gray-300 mb-1 block">
//             Attach File
//           </label>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="mb-3 text-white"
//           />
//         </>
//       )}

//       {data.type === "Chat Input" && (
//         <button
//           onClick={handleSubmit}
//           className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-sm font-semibold"
//         >
//           Submit
//         </button>
//       )}

//       <Handle
//         type="target"
//         position={Position.Left}
//         style={{ background: "#555" }}
//       />
//       <Handle
//         type="source"
//         position={Position.Right}
//         style={{ background: "#555" }}
//       />
//     </div>
//   );
// };

// const ResponseNode = ({ data }) => (
//   <div className="bg-white border border-gray-300 text-black rounded-md px-4 py-3 w-72 shadow">
//     <div className="font-medium mb-1">🔁 Response Step</div>
//     <div className="text-sm">{data.label}</div>
//     <Handle
//       type="target"
//       position={Position.Left}
//       style={{ background: "#555" }}
//     />
//     <Handle
//       type="source"
//       position={Position.Right}
//       style={{ background: "#555" }}
//     />
//   </div>
// );

// const nodeTypes = {
//   default: CustomNode,
//   response: ResponseNode,
// };

// export default function Workflow() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const [output, setOutput] = useState([]);
//   const [selectedTab, setSelectedTab] = useState("Flow");

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     []
//   );

//   const handleInputChange = (value, id) => {
//     setNodes((nds) =>
//       nds.map((node) =>
//         node.id === id ? { ...node, data: { ...node.data, value } } : node
//       )
//     );
//   };

//   const handleUrlChange = (url, id) => {
//     setNodes((nds) =>
//       nds.map((node) =>
//         node.id === id ? { ...node, data: { ...node.data, url } } : node
//       )
//     );
//   };

//   const handleFileChange = (file, id) => {
//     setNodes((nds) =>
//       nds.map((node) =>
//         node.id === id ? { ...node, data: { ...node.data, file } } : node
//       )
//     );
//   };

//   const handleResponseSubmit = (responseArray, fromNodeId) => {
//     let lastNodeId = fromNodeId;
//     let yOffset = 100;

//     const newNodes = responseArray.map((label, index) => {
//       const newId = `response-${Date.now()}-${index}`;
//       const position = {
//         x: 400,
//         y: 200 + index * yOffset,
//       };
//       const node = {
//         id: newId,
//         type: "response",
//         position,
//         data: { label },
//       };

//       const edge = {
//         id: `edge-${lastNodeId}-${newId}`,
//         source: lastNodeId,
//         target: newId,
//       };

//       lastNodeId = newId;
//       setEdges((eds) => [...eds, edge]);
//       return node;
//     });

//     setNodes((nds) => [...nds, ...newNodes]);
//     setOutput(responseArray);
//   };

//   const handleAddNode = (type) => {
//     const id = `${+new Date()}`;
//     const position = {
//       x: Math.random() * 600,
//       y: Math.random() * 400,
//     };
//     const newNode = {
//       id,
//       position,
//       type: "default",
//       data: {
//         type,
//         value: "",
//         url: "",
//         file: null,
//         id,
//         onChange: handleInputChange,
//         onChangeUrl: handleUrlChange,
//         onChangeFile: handleFileChange,
//         onSubmit: handleResponseSubmit,
//       },
//     };

//     setNodes((nds) => [...nds, newNode]);
//     setOutput([]);
//   };

//   return (
//     <div className="flex h-screen w-full">
//       {/* Sidebar */}
//       <div className="w-64 bg-white text-black p-6 space-y-4 border-r border-gray-300">
//         <h2 className="text-2xl font-bold mb-6">📦 Workflow</h2>
//         {["Chat Input", "Text Input"].map((item) => (
//           <button
//             key={item}
//             onClick={() => handleAddNode(item)}
//             className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200"
//           >
//             ➕ {item}
//           </button>
//         ))}
//       </div>

//       {/* Canvas */}
//       <div className="flex-1 relative bg-gray-100">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           // fitView
//           nodeTypes={nodeTypes}
//         >
//           <MiniMap />
//           <Controls />
//           <Background variant="dots" gap={12} size={1} />
//         </ReactFlow>
//       </div>

//       {/* Output Panel with Tabs */}
//       <div className="bg-white text-black p-6 border-l border-gray-300 flex flex-col rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
//           <span>🧾</span>
//           <span>Output</span>
//         </h2>

//         <div className="flex space-x-4 mb-4">
//           {["Flow", "Text", "Code"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setSelectedTab(tab)}
//               className={`px-5 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all duration-300 ${
//                 selectedTab === tab
//                   ? "bg-blue-600 text-white shadow-lg"
//                   : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//               }`}
//             >
//               {tab === "Flow" && <WorkflowIcon  size={18} />}
//               {tab === "Text" && <FileText size={18} />}
//               {tab === "Code" && <Code size={18} />}
//               <span>{tab}</span>
//             </button>
//           ))}
//         </div>

//         <div className="bg-gray-50 p-5 rounded-lg h-full overflow-auto text-sm shadow-inner">
//           {selectedTab === "Flow" && (
//             <div className="text-gray-600">
//               {output.length ? "Flow steps connected." : "No output yet."}
//             </div>
//           )}
//           {selectedTab === "Text" && (
//             <ul className="list-disc list-inside space-y-1 text-gray-700">
//               {output.map((item, idx) => (
//                 <li key={idx}>{item}</li>
//               ))}
//             </ul>
//           )}
//           {selectedTab === "Code" && (
//             <pre className="text-xs whitespace-pre-wrap bg-gray-800 text-white p-4 rounded-md">
//               {JSON.stringify(output, null, 2)}
//             </pre>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquareText,
  Workflow as WorkflowIcon,
  Calendar,
  File,
  Link2,
  Plus,
  FileText,
  Code,
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function Workflow() {
  const [activeMiddleView, setActiveMiddleView] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [selectedTab, setSelectedTab] = useState("Flow");
  const [output, setOutput] = useState([]);

  const [dragging, setDragging] = useState(false);
  const [leftWidth, setLeftWidth] = useState(260);

  const resizerRef = useRef(null);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (dragging) {
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 400) {
        setLeftWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const handlePromptSubmit = () => {
    if (prompt.trim()) {
      setInstructions([...instructions, prompt]);
      setOutput([...output, `Output for: ${prompt}`]);
      setPrompt("");
      setActiveMiddleView(null);
    }
  };

  const showChatPrompt = activeMiddleView === "ChatInput";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Sidebar */}
      <div
        className="bg-white text-black p-6 space-y-4 border-r border-gray-300"
        style={{ width: `${leftWidth}px` }}
      >
        <h2 className="text-2xl font-bold mb-6">📦 Workflow</h2>
        {!showChatPrompt && (
          <Button
            onClick={() => setActiveMiddleView("ChatInput")}
            className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <MessageSquareText size={18} /> Chat Input
          </Button>
        )}
        <Button
          onClick={() => alert("Text Input Clicked")}
          className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
        >
          <FileText size={18} /> Text Input
        </Button>
        <Button
          onClick={() => alert("Scheduler Clicked")}
          className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
        >
          <Calendar size={18} /> Scheduler
        </Button>
      </div>

      {/* Resizer */}
      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="w-2 cursor-col-resize bg-gray-200 hover:bg-gray-300"
      ></div>

      {/* Middle Content */}
      <div className="flex-1 relative flex flex-col justify-between p-6 overflow-hidden">
        {/* Instructions Scrollable Slider */}
        {instructions.length > 0 && (
          <div className="mb-4 overflow-x-auto whitespace-nowrap flex gap-4 justify-center">
            {instructions.map((inst, index) => (
              <div
                key={index}
                className="relative bg-white border border-gray-300 rounded-lg p-4 min-w-[250px] max-w-[300px] h-64 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="font-medium text-gray-800 mb-2">
                    Instruction {index + 1}
                  </div>
                  <p className="text-sm text-gray-600 overflow-auto max-h-40">
                    {inst}
                  </p>
                </div>

                {index === instructions.length - 1 && (
                  <button
                    onClick={() => setActiveMiddleView("ChatInput")}
                    className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Chat Prompt Input */}
        {showChatPrompt && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md py-4 px-6">
            <div className="max-w-3xl mx-auto w-full">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Send a message..."
                className="w-full resize-none border border-gray-300 rounded-xl p-4 min-h-[100px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                    <File size={16} /> Attach File
                  </button>
                  <button className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                    <Link2 size={16} /> Attach URL
                  </button>
                </div>
                <button
                  onClick={handlePromptSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar (Output Section) */}
      <div className="w-[380px] bg-white text-black p-6 border-l border-gray-300 flex flex-col rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
          <span>🧾</span>
          <span>Output</span>
        </h2>

        <div className="flex space-x-4 mb-4">
          {["Flow", "Text", "Code"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-5 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all duration-300 ${
                selectedTab === tab
                  ? "bg-blue-900 text-white shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {tab === "Flow" && <WorkflowIcon size={18} />}
              {tab === "Text" && <FileText size={18} />}
              {tab === "Code" && <Code size={18} />}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        <div className="bg-gray-50 p-5 rounded-lg h-full overflow-auto text-sm shadow-inner">
          {selectedTab === "Flow" && (
            <div className="text-gray-600">
              {output.length ? "Flow steps connected." : "No output yet."}
            </div>
          )}
          {selectedTab === "Text" && (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {output.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
          {selectedTab === "Code" && (
            <pre className="text-xs whitespace-pre-wrap bg-gray-800 text-white p-4 rounded-md">
              {JSON.stringify(output, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
