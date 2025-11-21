import React, { useState } from "react";
import {
  useChangeTaskStatusMutation,
  useGetAllStaffQuery,
  useAddTaskMutation,
  useGetTaskQuery,
} from "../redux/Api/StaffAPI";
import toast from "react-hot-toast";

const HouseKeeping = () => {
  // Fetch staff & tasks automatically via RTK Query
  const { data: staffData, isLoading: isLoadingStaff } = useGetAllStaffQuery();
  const { data: tasksData, isLoading: isLoadingTasks } = useGetTaskQuery();

  // Mutations
  const [addTaskAPI, { isLoading: isLoadingAddTask }] = useAddTaskMutation();
  const [changeTaskStatus] = useChangeTaskStatusMutation();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", staff: "" });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.name || !newTask.staff) return toast.error("Fill all fields!");
    try {
      await addTaskAPI({
        name: newTask.name,
        staffName: newTask.staff,
      }).unwrap();
      toast.success("Task added successfully!");
      setNewTask({ name: "", staff: "" });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    }
  };

  // Change task status
  const handleStatusChange = async (task) => {
    const newStatus = task.status === "done" ? "undone" : "done";
    if (!window.confirm(`Are you sure to mark task as ${newStatus}?`)) return;

    try {
      await changeTaskStatus({ id: task._id, status: newStatus }).unwrap();
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to change status");
    }
  };

  // Show loader if tasks are loading
  if (isLoadingTasks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="bg-white rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Today's Task</h2>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Task
          </button>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Staff</th>
              </tr>
            </thead>
            <tbody>
              {tasksData?.task?.map((task, index) => (
                <tr
                  key={task._id}
                  className="border-b last:border-none text-gray-800"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4">{task.name}</td>
                  <td className="py-3 px-4 flex items-center gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={task.status === "done"}
                        onChange={() => handleStatusChange(task)}
                      />
                      Done
                    </label>
                    {/* <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={task.status === "undone"}
                        readOnly
                      />
                      Undone
                    </label> */}
                  </td>
                  <td className="py-3 px-4">{task.staff.slice(-6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Task</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Task Name"
                value={newTask.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
              <select
                name="staff"
                value={newTask.staff}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">Select Staff</option>
                {isLoadingStaff ? (
                  <option>Loading...</option>
                ) : (
                  staffData?.staff?.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleAddTask}
              >
                {isLoadingAddTask ? "Adding..." : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseKeeping;
