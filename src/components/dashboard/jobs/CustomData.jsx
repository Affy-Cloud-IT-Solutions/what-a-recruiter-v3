import React, { useEffect, useState } from "react";
import axios from "axios";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Autocomplete, TextField } from "@mui/material";

const API_URL = "/custom-fields/child-fields-and-values";

const CustomData = ({ onCustomFieldsChange }) => {
  const [customFieldTrees, setCustomFieldTrees] = useState({});
  const [dropdownCache, setDropdownCache] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  useEffect(() => {
    const fetchRootFields = async () => {
      try {
        const res = await axios.get(API_URL);
        const rootFields = res.data.meta.rootFields || [];
        const fieldTreeObj = {};

        for (let field of rootFields) {
          fieldTreeObj[field.id] = [field];
        }

        setCustomFieldTrees(fieldTreeObj);
      } catch (err) {
        console.error("Error fetching root fields:", err);
      }
    };

    fetchRootFields();
  }, []);

  const fetchFieldData = async (fieldId, valueId = null) => {
    try {
      const url = valueId
        ? `${API_URL}?customFieldId=${fieldId}&valueId=${valueId}`
        : `${API_URL}?customFieldId=${fieldId}`;

      const res = await axios.get(url);
      const data = res.data.meta;

      if (valueId) {
        const { childFields = [], childValues = [] } = data;

        const newOptions = {};
        childFields.forEach((field) => {
          newOptions[`root_${field.id}`] = childValues
            .filter((val) => val.customFieldId === field.id)
            .map((v) => ({
              id: v.id,
              label: v.value,
              value: v.id,
            }));
        });

        setDropdownCache((prev) => ({
          ...prev,
          [fieldId + "_" + valueId]: {
            childFields,
            childValues,
          },
          ...newOptions,
        }));

        return { childFields };
      } else {
        const options = data.values.map((v) => ({
          id: v.id,
          label: v.value,
          value: v.id,
        }));

        setDropdownCache((prev) => ({
          ...prev,
          [`root_${fieldId}`]: options,
        }));

        return {};
      }
    } catch (err) {
      console.error("Error fetching child fields:", err);
      return {};
    }
  };

  const handleSelectionChange = async (fieldId, valueObj) => {
    const updatedSelections = {
      ...selectedValues,
      [fieldId]: valueObj,
    };
    setSelectedValues(updatedSelections);

    const { childFields } = await fetchFieldData(fieldId, valueObj.id);

    setCustomFieldTrees((prevTrees) => {
      const rootKey = findRootFieldFor(fieldId, prevTrees);
      if (!rootKey) return prevTrees;

      const existingTree = prevTrees[rootKey] || [];

      // Remove existing childFields that have the same IDs as the new ones
      const cleanedTree = existingTree.filter(
        (f) => !childFields?.some((cf) => cf.id === f.id)
      );

      const updatedTree = [...cleanedTree, ...(childFields || [])];

      return {
        ...prevTrees,
        [rootKey]: updatedTree,
      };
    });
  };

  const findRootFieldFor = (fieldId, trees) => {
    for (let rootId in trees) {
      if (trees[rootId].some((f) => f.id === fieldId)) return rootId;
    }
    return null;
  };

  const handleComboboxOpen = async (fieldId) => {
    const cacheKey = `root_${fieldId}`;
    if (!dropdownCache[cacheKey]) {
      await fetchFieldData(fieldId);
    }
  };

  useEffect(() => {
    const customFields = Object.entries(selectedValues).map(
      ([customFieldId, valObj]) => ({
        customFieldId,
        valueId: valObj.id,
      })
    );
    onCustomFieldsChange(customFields);
  }, [selectedValues]);

  return (
    <div className="space-y-8">
      {/* {Object.entries(customFieldTrees).map(([rootId, tree]) =>
        tree.map((field, index) => {
          const options = dropdownCache[`root_${field.id}`] || [];
          return (
            <div key={field.id} className="mb-4">
              <Label className="block mb-2">{field.label}</Label>
              <Combobox
                options={options}
                selected={selectedValues[field.id]?.value || null}
                onChange={(val) => handleSelectionChange(field.id, val)}
                placeholder={`Select ${field.label}`}
                onOpen={() => handleComboboxOpen(field.id)}
              />
            </div>
          );
        })
      )} */}
      {Object.entries(customFieldTrees).map(([rootId, tree]) => {
        const rows = [];

        for (let i = 0; i < tree.length; i += 3) {
          rows.push(
            <div key={`row-${i}`} className="flex gap-4">
              {[tree[i], tree[i + 1], tree[i + 2]].map((field, idx) => (
                <div
                  key={field?.id || `placeholder-${i + idx}`}
                  className="w-1/3"
                >
                  {field ? (
                    <Autocomplete
                      disableClearable
                      options={dropdownCache[`root_${field.id}`] || []}
                      getOptionLabel={(option) => option.label || ""}
                      value={selectedValues[field.id] || null}
                      onChange={(event, newValue) =>
                        handleSelectionChange(field.id, newValue)
                      }
                      onOpen={() => handleComboboxOpen(field.id)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={field.label}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          );
        }

        return rows;
      })}
    </div>
  );
};

export default CustomData;
