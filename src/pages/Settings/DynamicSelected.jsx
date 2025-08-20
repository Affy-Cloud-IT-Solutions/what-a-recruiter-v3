import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react"; // optional icon

import { AnimatePresence, motion } from "motion/react";

const MultiSelectWithSelectAll = ({ field, onChange }) => {
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // control dropdown
  const dropdownRef = useRef(null);
  console.log(field);
  useEffect(() => {
    const fetchValues = async () => {
      try {
        const res = await axios.get(
          `custom-fields/by-custom-field/${field.customFieldId}`
        );
        setOptions(res?.data?.meta?.values || []);
      } catch (err) {
        console.error("Failed to fetch options", err);
      } finally {
        setLoading(false);
      }
    };

    fetchValues();
  }, [field]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  const allSelected = selectedValues.length === options.length;
  const isIndeterminate =
    selectedValues.length > 0 && selectedValues.length < options.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedValues([]);
      onChange(field.customFieldId, []);
    } else {
      const allIds = options.map((opt) => opt.id);
      setSelectedValues(allIds);
      onChange(field.customFieldId, allIds);
    }
  };

  const toggleValue = (id) => {
    const newValues = selectedValues.includes(id)
      ? selectedValues.filter((val) => val !== id)
      : [...selectedValues, id];
    setSelectedValues(newValues);
    onChange(field.customFieldId, newValues);
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium mb-1">
        {field.customFieldLabel}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {loading ? (
        <p className="text-sm text-gray-500">Loading options...</p>
      ) : (
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setOpen((prev) => !prev)}
          >
            {selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : "Select values"}
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-md mt-2"
              >
                <ScrollArea className="max-h-[250px] p-3">
                  <div className="space-y-2">
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={toggleSelectAll}
                    >
                      <Checkbox
                        checked={allSelected}
                        indeterminate={isIndeterminate}
                        onCheckedChange={toggleSelectAll}
                      />
                      <span>Select All</span>
                    </div>
                    {options.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => toggleValue(opt.id)}
                      >
                        <Checkbox checked={selectedValues.includes(opt.id)} />
                        <span>{opt.value}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MultiSelectWithSelectAll;
