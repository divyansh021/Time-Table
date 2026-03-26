import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  // 🔥 Temporary room data (mock)
  const rooms = [
    { id: 1, name: "Room A101" },
    { id: 2, name: "Room A102" },
    { id: 3, name: "Lab 1" },
    { id: 4, name: "Lab 2" },
    { id: 5, name: "Room B201" },
  ];
  const handleRoomClick = (id) => {
    navigate(`/room/${id}`);
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <p>Welcome {user?.name}</p>

      <div style={styles.grid}>
        {rooms.map((room) => (
          <div
            key={room.id}
            style={styles.card}
            onClick={() => handleRoomClick(room.id)}
          >
            <h3>{room.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🔁 Handle navigation


const styles = {
  container: {
    padding: "20px",
  },
  title: {
    marginBottom: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
    cursor: "pointer",
    textAlign: "center",
  },
};

export default DashboardPage;