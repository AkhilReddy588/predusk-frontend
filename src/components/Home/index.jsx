import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Cookies from "js-cookie";
import './index.css'

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSkill, setNewSkill] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    links: "",
    skillsUsed: "",
  });

  const navigate = useNavigate();
  const token = Cookies.get("token");

  // 🔹 Fetch Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api("/profile", "GET", null, token);
      setProfile(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Skills
  const fetchSkills = async () => {
    try {
      const data = await api("/profile/skills", "GET", null, token);
      setSkills(data.topSkills || []);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Fetch Projects
  const fetchProjects = async () => {
    try {
      const data = await api("/profile/projects", "GET", null, token);
      setProjects(data || []);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Search Projects by Skill
  const searchProjects = async () => {
    if (!searchSkill.trim()) return fetchProjects();
    try {
      const data = await api(
        `/profile/projects?skill=${searchSkill}`,
        "GET",
        null,
        token
      );
      setProjects(data || []);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Add Skill
  const addSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const data = await api(
        "/profile/skills",
        "PATCH",
        { skill: newSkill },
        token
      );
      setSkills(data || []);
      setNewSkill("");
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Add Project
  const addProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      alert("Title and description are required");
      return;
    }
    try {
      const payload = {
        ...newProject,
        links: newProject.links
          ? newProject.links.split(",").map((l) => l.trim())
          : [],
        skillsUsed: newProject.skillsUsed
          ? newProject.skillsUsed.split(",").map((s) => s.trim())
          : [],
      };
      const data = await api("/profile/projects", "PATCH", payload, token);
      setProjects(data || []);
      setNewProject({ title: "", description: "", links: "", skillsUsed: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Logout
  const logout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  // 🔹 Initial Load
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchSkills();
    fetchProjects();
  }, []);

  if (loading) return <p className="p-6 text-lg">Loading...</p>;

  if (!profile) return <p className="p-6 text-lg">No profile found.</p>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Profile */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p>
          <b>Name:</b> {profile.name}
        </p>
        <p>
          <b>Email:</b> {profile.email}
        </p>
      </div>

      {/* Skills */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <ul className="list-disc ml-6 mb-2">
          {skills.length > 0 ? (
            skills.map((s, i) => <li key={i}>{s}</li>)
          ) : (
            <li>No skills added</li>
          )}
        </ul>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={addSkill}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-2">Projects</h2>

        {/* Search */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search by skill..."
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            className="border px-2 py-1 rounded w-full mr-2"
          />
          <button
            onClick={searchProjects}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
          >
            Search
          </button>
          <button
            onClick={fetchProjects}
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded ml-2"
          >
            Reset
          </button>
        </div>

        {/* List */}
        <ul className="space-y-2 mb-4">
          {projects.length > 0 ? (
            projects.map((proj, idx) => (
              <li key={idx} className="border p-2 rounded">
                <h3 className="font-bold">{proj.title}</h3>
                <p>{proj.description}</p>
                {proj.links?.length > 0 && (
                  <p>
                    <b>Links:</b>{" "}
                    {proj.links.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline mr-2"
                      >
                        {link}
                      </a>
                    ))}
                  </p>
                )}
                {proj.skillsUsed?.length > 0 && (
                  <p>
                    <b>Skills Used:</b> {proj.skillsUsed.join(", ")}
                  </p>
                )}
              </li>
            ))
          ) : (
            <li>No projects found</li>
          )}
        </ul>

        {/* Add Project */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="Links (comma separated)"
            value={newProject.links}
            onChange={(e) =>
              setNewProject({ ...newProject, links: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="Skills Used (comma separated)"
            value={newProject.skillsUsed}
            onChange={(e) =>
              setNewProject({ ...newProject, skillsUsed: e.target.value })
            }
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={addProject}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
