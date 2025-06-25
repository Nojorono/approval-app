import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

type CheckerOption = {
  label: string;
  value: string;
};

interface FormData {
  inbound_plan_id: string;
  checker_leader_id: string;
  checkers: CheckerOption[];
  assign_date_start: string;
  assign_date_finish: string;
  status: string;
}

// Dummy data (replace with actual API)
const checkerOptions: CheckerOption[] = [
  { value: "u123", label: "Andi" },
  { value: "u124", label: "Budi" },
  { value: "u125", label: "Citra" },
  { value: "u126", label: "Dewi" },
];

const AssignChecker: React.FC = () => {
  const [selectedCheckers, setSelectedCheckers] = useState<CheckerOption[]>([]);
  const [selectedLeader, setSelectedLeader] = useState<CheckerOption | null>(
    null
  );
  const [dateStart, setDateStart] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [dateFinish, setDateFinish] = useState("");
  const [timeFinish, setTimeFinish] = useState("");

  const handleSubmit = () => {
    const payload: FormData = {
      inbound_plan_id: "CWH-1-23-0005", // Replace dynamically
      checker_leader_id: selectedLeader?.value || "",
      checkers: selectedCheckers,
      assign_date_start: new Date(`${dateStart}T${timeStart}`).toISOString(),
      assign_date_finish: new Date(`${dateFinish}T${timeFinish}`).toISOString(),
      status: "ASSIGNED",
    };

    console.log("🚀 Payload to submit:", payload);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Select Leader from Selected Checkers */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Checker Lead</label>
        <Select
          isClearable
          options={checkerOptions}
          value={selectedLeader}
          onChange={(value) => setSelectedLeader(value)}
          placeholder="Select main checker"
        />
      </div>

      {/* Select Checkers */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Checkers</label>
        <Select
          isMulti
          options={checkerOptions}
          components={animatedComponents}
          value={selectedCheckers}
          onChange={(value) => setSelectedCheckers(value as CheckerOption[])}
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-medium">Date Start</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">Time Start</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">Date Finish</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={dateFinish}
            onChange={(e) => setDateFinish(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">Time Finish</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={timeFinish}
            onChange={(e) => setTimeFinish(e.target.value)}
          />
        </div>
      </div>

    <div className="flex justify-end">
      <button
        onClick={handleSubmit}
        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-6 rounded shadow"
      >
        Save
      </button>
    </div>
    </div>
  );
};

export default AssignChecker;
