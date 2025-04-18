// Dummy session (no backend, just for this demo)
let currentUser = sessionStorage.getItem("currentUser") || null;
let assignments = JSON.parse(sessionStorage.getItem("assignments")) || [];

// Save assignment
function saveAssignment(subject, description, deadline) {
  if (!currentUser) return;
  
  const assignment = {
    id: Date.now(),
    subject,
    description,
    deadline,
    user: currentUser,
    done: false
  };
  
  assignments.push(assignment);
  sessionStorage.setItem("assignments", JSON.stringify(assignments));
}

// Display assignments
function showAssignments() {
  const list = document.getElementById("assignmentList");
  if (!list || !currentUser) return;
  
  list.innerHTML = "";
  
  const userAssignments = assignments.filter(
    a => a.user === currentUser && !a.done
  );
  
  if (userAssignments.length === 0) {
    list.innerHTML = "<p>No pending assignments found.</p>";
    return;
  }
  
  userAssignments.forEach(a => {
    const div = document.createElement("div");
    div.className = "assignment";
    
    div.innerHTML = `
      <h3>${a.subject}</h3>
      <p>${a.description}</p>
      <p>Set Deadline: ${a.deadline}</p>
      <button onclick="editAssignment(${a.id})">Edit</button>
      <button onclick="markAsDone(${a.id})">Mark as Done</button>
      <button onclick="deleteAssignment(${a.id})">Delete</button>
    `;
    
    list.appendChild(div);
    
    // Notification 3 days before deadline
    const deadlineDate = new Date(a.deadline);
    const today = new Date();
    const timeDiff = deadlineDate - today;
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysLeft === 3) {
      alert(`Reminder: Assignment "${a.subject}" is due in 3 days!`);
    }
  });
}

// Mark as done
function markAsDone(id) {
  const index = assignments.findIndex(a => a.id === id);
  if (index !== -1) {
    assignments[index].done = true;
    sessionStorage.setItem("assignments", JSON.stringify(assignments));
    location.reload();
  }
}

// Delete
function deleteAssignment(id) {
  assignments = assignments.filter(a => a.id !== id);
  sessionStorage.setItem("assignments", JSON.stringify(assignments));
  location.reload();
}

// Edit (redirect to add page with data)
function editAssignment(id) {
  sessionStorage.setItem("editId", id);
  window.location.href = "add-assignment.html";
}

// On view page load
window.addEventListener("load", () => {
  if (window.location.pathname.includes("view-assignments.html")) {
    showAssignments();
  }
});