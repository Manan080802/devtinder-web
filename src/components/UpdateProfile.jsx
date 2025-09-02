import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import useFetchUser from "../utils/useFetchUser"; // ✅ import hook
import api from "../axios/api";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useFetchUser(); // ✅ always fetch on refresh

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });

  const [skill, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  // ✅ Fill form when userData arrives
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        gender: userData.gender || "",
        dob: userData.dob
          ? new Date(userData.dob).toISOString().split("T")[0]
          : "",
      });
      setSkills(userData.skill || []);
    }
  }, [userData]);

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim().length < 2) {
      setErrors((prev) => ({
        ...prev,
        skills: "Skill must be at least 2 characters",
      }));
      return;
    }
    if (!skill.includes(skillInput.trim())) {
      setSkills([...skill, skillInput.trim()]);
      setSkillInput("");
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
  };

  const handleRemoveSkill = (s) => {
    setSkills(skill.filter((item) => item !== s));
  };

  // ✅ Validate inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else {
      const today = new Date();
      const dobDate = new Date(formData.dob);
      if (dobDate > today) {
        newErrors.dob = "Date of Birth cannot be in the future";
      }
    }

    if (skill.length === 0) {
      newErrors.skills = "Please add at least one skill";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await api.patch(
        "/user/profile",
        { ...formData, skill },
        { withCredentials: true }
      );

      dispatch(addUser(result.data.result));
      navigate("/profile");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      setBackendError(msg);
      setTimeout(() => setBackendError(""), 3000);
    }
  };

  // ⏳ Loading state
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-base-300 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Update Profile
        </h2>

        {backendError && (
          <div className="alert alert-error text-sm text-white mb-3">
            {backendError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="label text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="label text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="label text-sm">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="label text-sm">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input input-bordered w-full"
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="label text-sm">Skills</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {skill.map((s, i) => (
                <span
                  key={i}
                  className="badge badge-primary py-2 px-3 text-sm flex items-center"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="ml-2 hover:text-red-300"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter a skill"
                className="input input-bordered w-full"
              />
              <button onClick={handleAddSkill} className="btn btn-secondary">
                Add
              </button>
            </div>
            {errors.skills && (
              <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full mt-2">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
