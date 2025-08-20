import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { Copy, Filter, ListFilter, ScanLine } from "lucide-react";
import CustomInput from "@/components/shared/CustomInput";

const mergeFieldGroups = [
  {
    category: "General Fields",
    fields: [
      { name: "Sign-on Bonus", type: "Currency", tag: "<SignOnBonus>" },
      { name: "Start Date", type: "Date", tag: "<StartDate>" },
      { name: "State", type: "Text", tag: "<State>" },
      {
        name: "SuccessFactors Onboarding Required",
        type: "Yes/No",
        tag: "<SuccessfactorsOnboardingRequired>",
      },
      {
        name: "Type of Contract",
        type: "Single-Select",
        tag: "<TypeOfContract>",
      },
      { name: "Type of Employment", type: "Text", tag: "<TypeOfEmployment>" },
      { name: "Visa Required", type: "Text", tag: "<VisaRequired>" },
    ],
  },
  {
    category: "Additional Data",
    fields: [
      {
        name: "Onboarding Status",
        type: "Single-Select",
        tag: "<OnboardingStatus>",
      },
    ],
  },
  {
    category: "Candidate Personal Information",
    fields: [
      { name: "City", type: "Text", tag: "<ApplicantCity>" },
      { name: "First Name", type: "Text", tag: "<ApplicantFirstName>" },
      { name: "Last Name", type: "Text", tag: "<ApplicantLastName>" },
      { name: "Zip Code", type: "Text", tag: "<ApplicantZipCode>" },
    ],
  },
  {
    category: "AdHoc Fields",
    fields: [
      {
        name: "Applicant Country Code",
        type: "Text",
        tag: "<ApplicantCountryCode>",
      },
      {
        name: "Applicant State Code",
        type: "Text",
        tag: "<ApplicantStateCode>",
      },
      { name: "Offer Letter Date", type: "Date", tag: "<OfferLetterDate>" },
    ],
  },
  {
    category: "Job Fields",
    fields: [
      { name: "Brands", type: "Single-Select", tag: "<Job_Brands>" },
      {
        name: "Budget for Immigration and Relocation",
        type: "Single-Select",
        tag: "<Job_BudgetForImmigrationAndRelocation>",
      },
      {
        name: "Business Unit",
        type: "Single-Select",
        tag: "<Job_BusinessUnit>",
      },
      { name: "Company", type: "Single-Select", tag: "<Job_Company>" },
      {
        name: "Confidential Search",
        type: "Single-Select",
        tag: "<Job_ConfidentialSearch>",
      },
      { name: "Cost Center", type: "Single-Select", tag: "<Job_CostCenter>" },
      { name: "Country", type: "Single-Select", tag: "<Job_Country>" },
      { name: "Department", type: "Single-Select", tag: "<Job_Department>" },
      { name: "Dept", type: "Single-Select", tag: "<Job_Dept>" },
      { name: "Division", type: "Single-Select", tag: "<Job_Division>" },
      {
        name: "Employment Type",
        type: "Single-Select",
        tag: "<Job_EmploymentType>",
      },
      {
        name: "Global Job Grade",
        type: "Single-Select",
        tag: "<Job_GlobalJobGrade>",
      },
    ],
  },
];

const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
  toast.success(`Copied ${text}`);
};

export function MergeFieldsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-900 px-0 mb-2">
          Merge fields and instructions
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-5xl min-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Merge Fields & Instructions</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground ">
          You can use these merge tags inside your offer templates. When
          generating offers, these will be automatically replaced with actual
          values.
        </p>

        <div className="flex items-center mb-4 justify-between gap-2">
          <CustomInput />
          <div className={buttonVariants("text-2xl text-white")}>
            <ListFilter />
          </div>
        </div>
        <ScrollArea className="h-[60vh] pr-4 space-y-6">
          {mergeFieldGroups.map((group, i) => (
            <div key={i}>
              <h3 className="font-semibold !text-sm text-gray-700 m-2">
                {group.category}
              </h3>

              <div className="border rounded-md overflow-hidden">
                {group.fields.map((field, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b last:border-b-0 px-4 py-2 hover:bg-muted"
                  >
                    <div>
                      <p className="text-xs font-medium ">{field.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {field.type} —{" "}
                        <span className="font-mono text-blue-600">
                          {field.tag}
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(field.tag)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
