import React, { useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Antony",
      roll: "CSE001",
      department: "Computer Science",
      year: "IV",
      section: "A",
      phone: "9786566746",
      email: "Antonyalbert@gmail.com",
    },
    {
      id: 2,
      name: "Abishith",
      roll: "ECE015",
      department: "Electronics",
      year: "IV",
      section: "A",
      phone: "8838505437",
      email: "abishith63@gmail.com",
    },
    {
      id: 3,
      name: "Arun",
      roll: "ME020",
      department: "Mechanical",
      year: "IV",
      section: "B",
      phone: "9123456780",
      email: "arun@gmail.com",
    },
  ]);

  const [student, setStudent] = useState({
    name: "",
    roll: "",
    department: "",
    year: "",
    section: "",
    phone: "",
    email: "",
  });

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const addStudent = () => {
    if (
      !student.name ||
      !student.roll ||
      !student.department ||
      !student.year ||
      !student.section
    ) {
      alert("Fill all required fields");
      return;
    }

    setStudents([
      ...students,
      {
        id: Date.now(),
        ...student,
      },
    ]);

    setStudent({
      name: "",
      roll: "",
      department: "",
      year: "",
      section: "",
      phone: "",
      email: "",
    });
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container">
      <h1>🎓 Student Management System</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={student.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="roll"
          placeholder="Roll No"
          value={student.roll}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={student.department}
          onChange={handleChange}
        />

        <input
          type="text"
          name="year"
          placeholder="Year"
          value={student.year}
          onChange={handleChange}
        />

        <input
          type="text"
          name="section"
          placeholder="Section"
          value={student.section}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={student.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
        />

        <button onClick={addStudent}>Add Student</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Year</th>
            <th>Section</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.roll}</td>
              <td>{s.department}</td>
              <td>{s.year}</td>
              <td>{s.section}</td>
              <td>{s.phone}</td>
              <td>{s.email}</td>

              <td>
                <button className="delete" onClick={() => deleteStudent(s.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
