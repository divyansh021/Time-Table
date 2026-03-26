import { useParams } from "react-router-dom";
import { useState } from "react";

function RoomPage() {
  const { id } = useParams();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const timeSlots = [
    "8-9",
    "9-10",
    "10-11",
    "11-12",
    "12-1",
    "1-2",
    "2-3",
    "3-4",
    "4-5",
  ];

  const timetableData = [
  { day: "Mon", time: "8-9", subject: "DSA", department: "IT" },
  { day: "Tue", time: "9-10", subject: "Math", department: "CS" },
  { day: "Wed", time: "10-11", subject: "OS", department: "IT" },
  ];

  const [selectedCell, setSelectedCell] = useState(null);
  const handleCellClick = (day, time) => {
    setSelectedCell({ day, time });
  };

  return (
  <div style={styles.container}>
    <h1>Room {id} Timetable</h1>

    <div style={styles.grid}>
      {/* Header Row */}
      <div style={styles.header}>Time</div>
      {days.map((day) => (
        <div key={day} style={styles.header}>
          {day}
        </div>
      ))}

      {/* Table Body */}
      {timeSlots.map((time) => (
        <>
          <div key={time} style={styles.timeCell}>
            {time}
          </div>

          {days.map((day) => {
            const entry = timetableData.find(
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
        </>
      ))}
    </div>
    {selectedCell && (
    <div style={styles.modalOverlay}>
        <div style={styles.modal}>
        <h2>Edit Slot</h2>
        <p>Day: {selectedCell.day}</p>
        <p>Time: {selectedCell.time}</p>

        <button onClick={() => setSelectedCell(null)}>
            Close
        </button>
        </div>
    </div>
    )}
  </div>
);
}

const styles = {
  container: {
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "100px repeat(5, 1fr)",
    border: "1px solid #ccc",
  },
  header: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "center",
    border: "1px solid #ccc",
  },
  timeCell: {
    padding: "10px",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    border: "1px solid #ccc",
  },
  cell: {
    height: "60px",
    border: "1px solid #ccc",
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
};

export default RoomPage;