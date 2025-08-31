import React, { useState } from "react";
import api from "../axios/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [isRegister, setRegister] = useState(false);
  const [skill, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();
  const disPatch = useDispatch();

  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: "",
    password: "",
  });

  // Errors
  const [errors, setErrors] = useState({});

  // ========== Validation Logic ==========
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) error = `${name} is required`;
        else if (value.trim().length < 3)
          error = `${name} must be at least 3 characters`;
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;

      case "gender":
        if (!["male", "female", "other"].includes(value))
          error = "Select a valid gender";
        break;

      case "dob":
        if (!value) {
          error = "Date of birth is required";
        } else {
          const date = new Date(value);
          if (isNaN(date.getTime())) error = "Invalid date format";
          else {
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            if (
              age < 18 ||
              (age === 18 &&
                (today.getMonth() < date.getMonth() ||
                  (today.getMonth() === date.getMonth() &&
                    today.getDate() < date.getDate())))
            ) {
              error = "You must be at least 18 years old";
            }
          }
        }
        break;

      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8)
          error = "Password must be at least 8 characters";
        else if (!/[a-z]/.test(value))
          error = "Password must include a lowercase letter";
        else if (!/[A-Z]/.test(value))
          error = "Password must include an uppercase letter";
        else if (!/[0-9]/.test(value)) error = "Password must include a number";
        else if (!/[!@#$%^&*]/.test(value))
          error = "Password must include a special character";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Skill functions
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

  const handleRemoveSkill = (skill) => {
    setSkills(skill.filter((s) => s !== skill));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (isRegister) {
      // validate all fields
      Object.keys(formData).forEach((field) => {
        const err = validateField(field, formData[field]);
        if (err) newErrors[field] = err;
      });

      if (skill.length === 0) {
        newErrors.skills = "At least one skill is required";
      }
    } else {
      // only check email + password
      ["email", "password"].forEach((field) => {
        const err = validateField(field, formData[field]);
        if (err) newErrors[field] = err;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      if (isRegister) {
        const result = await api.post(
          "/auth/signup",
          { ...formData, skill },
          { withCredentials: true }
        );
        alert("✅ Signup successful!");
        console.log("result", result.data);
      } else {
        const result = await api.post(
          "/auth/login",
          { email: formData.email, password: formData.password },
          { withCredentials: true }
        );
        disPatch(addUser(result.data.result));

        navigate("/");
      }
    } catch (error) {
      const backendError =
        error.response?.data?.message || "Something went wrong";

      // ✅ Save error to state
      setErrors((prev) => ({
        ...prev,
        backend: backendError,
      }));

      setTimeout(() => {
        setErrors((prev) => ({
          ...prev,
          backend: null,
        }));
      }, 3000);
    }
  };

  return (
    <>
      {errors.backend && (
        <div className="alert alert-error mb-4 text-sm text-white">
          {errors.backend}
        </div>
      )}

      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="card w-[450px] bg-base-300 shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="card-body space-y-4 max-h-[500px] overflow-y-auto"
          >
            <h2 className="card-title text-2xl font-bold text-center bg-base-300 py-2">
              {isRegister ? "Sign Up" : "Sign In"}
            </h2>

            {isRegister && (
              <>
                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="label">Gender</label>
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
                    <p className="text-red-500 text-sm">{errors.gender}</p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="label">Skills</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {skill.map((skill, i) => (
                      <span
                        key={i}
                        className="badge badge-primary gap-2 py-3 px-2 text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-white hover:text-red-400"
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
                    <button
                      onClick={handleAddSkill}
                      className="btn btn-sm btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-sm">{errors.skills}</p>
                  )}
                </div>

                {/* DOB */}
                <div>
                  <label className="label">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm">{errors.dob}</p>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {isRegister ? "Sign Up" : "Sign In"}
            </button>

            <p className="text-sm text-gray-400 text-center">
              {isRegister ? "Already have an account? " : "New here? "}
              <button
                type="button"
                className="text-white hover:underline"
                onClick={() => setRegister(!isRegister)}
              >
                Sign {isRegister ? "In" : "Up"} now
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
