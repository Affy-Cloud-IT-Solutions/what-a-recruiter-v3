import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles

export const MyEditor = ({ value, onChange }) => {
  // const [focused, setFocused] = useState(false);
  const quillRef = useRef(null);

  // const modules = {
  //   toolbar: focused
  //     ? [
  //         [{ header: [1, 2, false] }],
  //         ["bold", "italic", "underline", "strike"],
  //         [{ list: "ordered" }, { list: "bullet" }],
  //         ["link"],
  //       ]
  //     : false,
  // };

  // useEffect(() => {
  //   const editor = quillRef.current?.getEditor();
  //   const editorContainer = editor?.root;

  //   if (!editorContainer) return;

  //   const handleFocus = () => setFocused(true);
  //   const handleBlur = (e) => {
  //     // Delay to allow toolbar interactions before hiding
  //     setTimeout(() => {
  //       const active = document.activeElement;
  //       const editorEl = quillRef.current?.editor?.container;
  //       if (!editorEl?.contains(active)) {
  //         setFocused(false);
  //       }
  //     }, 100);
  //   };

  //   editorContainer.addEventListener("focus", handleFocus);
  //   editorContainer.addEventListener("blur", handleBlur);

  //   return () => {
  //     editorContainer.removeEventListener("focus", handleFocus);
  //     editorContainer.removeEventListener("blur", handleBlur);
  //   };
  // }, []);
  return (
    <div
      // onFocus={() => setFocused(true)}
      // onBlur={() => setFocused(false)}
      className="border rounded p-2"
    >
      <ReactQuill
        value={value}
        onChange={onChange}
        ref={quillRef}
        placeholder="Job Description's"
        // modules={modules}
        className="!focus:outline-none !focus:ring-0 !focus:border-transparent"
      />
    </div>
  );
};
