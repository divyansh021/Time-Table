import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function RoomPage() {
  // 📌 Get room ID from URL
  const { id } = useParams();

  // 🌍 Get logged-in user from context
  const { user } = useContext(AuthContext);

  // 🔐 Get JWT token
  const token = localStorage.getItem("token");

  // 📅 Days and time slots
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const timeSlots = [
    "8-9", "9-10", "10-11", "11-12",
    "12-1", "1-2", "2-3", "3-4", "4-5",
  ];

  // 📊 Main timetable data
  const [timetable, setTimetable] = useState([]);

  // 📝 Form states (modal inputs)
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");

  // 🎯 Selected cell
  const [selectedCell, setSelectedCell] = useState(null);

  // 🖱️ Cell click handler
  const handleCellClick = (day, time) => {
    // ❌ Students cannot edit
    if (user.role === "student") return;

    const existing = timetable.find(
      (item) => item.day === day && item.time === time
    );

    setSelectedCell({ day, time });

    if (existing) {
      setSubject(existing.subject);
      setDepartment(existing.department);
    } else {
      setSubject("");
      setDepartment("");
    }
  };

  // 💾 Save timetable (SECURE VERSION)
  const handleSave = async () => {
    if (!selectedCell) return;

    try {
      const res = await fetch("http://localhost:5000/api/timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 TOKEN ADDED
        },
        body: JSON.stringify({
          roomId: id,
          day: selectedCell.day,
          time: selectedCell.time,
          subject,
          department,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Save failed");
        return;
      }

      fetchTimetable(); // 🔄 Refresh data
      setSelectedCell(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // 📥 Fetch timetable (SECURE)
  const fetchTimetable = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/timetable/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 TOKEN ADDED
          },
        }
      );

      const data = await res.json();
      setTimetable(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 Load data when page loads
  useEffect(() => {
    fetchTimetable();
  }, [id]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Room {id} Timetable</h1>

      {/* 📊 Grid */}
      <div style={styles.grid}>
        {/* Header */}
        <div style={styles.header}>Time</div>
        {days.map((day) => (
          <div key={day} style={styles.header}>
            {day}
          </div>
        ))}

        {/* Body */}
        {timeSlots.map((time) => (
          <div key={time} style={{ display: "contents" }}>
            <div style={styles.timeCell}>{time}</div>

            {days.map((day) => {
              const entry = timetable.find(
                (item) => item.day === day && item.time === time
              );

              return (
                <div
                  key={day + time}
                  style={styles.cell}
                  onClick={() => handleCellClick(day, time)}
                >
                  {entry && (
                    <>
                      <div style={styles.subject}>{entry.subject}</div>
                      <div style={styles.dept}>{entry.department}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 🪟 Modal */}
      {selectedCell && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Edit Slot</h2>

            <p><b>Day:</b> {selectedCell?.day}</p>
            <p><b>Time:</b> {selectedCell?.time}</p>

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={styles.input}
            />

            <button onClick={handleSave} style={styles.saveButton}>
              Save
            </button>

            <button onClick={() => setSelectedCell(null)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 Improved UI Styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "100px repeat(5, 1fr)",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  header: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  timeCell: {
    padding: "10px",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
    border: "1px solid #ddd",
  },
  cell: {
    height: "70px",
    border: "1px solid #ddd",
    padding: "5px",
    cursor: "pointer",
    transition: "0.2s",
  },
  subject: {
    fontWeight: "bold",
  },
  dept: {
    fontSize: "12px",
    color: "gray",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  saveButton: {
    padding: "8px",
    margin: "5px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  closeButton: {
    padding: "8px",
    margin: "5px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default RoomPage;