import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { Settings2 } from "lucide-react";

export default function ManageStepsModal({
  sections,
  setTempSteps,
  savedSteps,
  setSavedSteps,
  tempSteps,
}) {
  // Actual saved steps

  const [open, setOpen] = useState(false);

  const toggleStep = (step) => {
    setTempSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      // When opening, copy saved steps into temp
      setTempSteps(savedSteps);
    }
    setOpen(isOpen);
  };

  const handleSave = () => {
    setSavedSteps(tempSteps);
    setOpen(false);
  };

  useEffect(() => {
    console.log(sections);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline" className="flex gap-2 items-center ">
          <Settings2 className="w-4 h-4" />
          Manage steps
        </Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Manage steps</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <div className="space-y-6 py-2">
            {/* {sections?.map((section) => (
              <div key={section.title}>
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {section.title}
                </p>
                <div className="space-y-2">
                  {section.steps.map((step) => (
                    <div key={step} className="flex items-center space-x-2">
                      <Checkbox
                        id={step}
                        checked={tempSteps.includes(step)}
                        onCheckedChange={() => toggleStep(step)}
                      />
                      <label
                        htmlFor={step}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
                      >
                        {step}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))} */}
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleSave}>Save</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
